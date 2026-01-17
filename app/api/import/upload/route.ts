import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { prisma } from '@/server/db';
import { uploadToR2, generateImportKey } from '@/server/lib/r2';
import { addImportJob } from '@/server/queue';
// TEMPORARILY DISABLED: Password detection has pdfjs worker issues in Next.js
// import { isPasswordProtected } from '@/server/lib/parsers/password-detector';
import { encryptPassword } from '@/server/lib/crypto';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'text/csv',
  'application/pdf',
  'application/vnd.ms-excel',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/heic',
  'image/heif',
];

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const manualPassword = formData.get('password') as string | null;

    // Validation
    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Archivo demasiado grande (máximo 10MB)' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no válido. Se permiten CSV, PDF e imágenes (JPG, PNG, HEIC)' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Determine file type
    const isImage = file.type.startsWith('image/');
    const fileType = isImage ? 'IMAGE' : file.type.includes('pdf') ? 'PDF' : 'CSV';

    // TEMPORARILY DISABLE password detection due to pdfjs worker issues in Node.js
    // The worker will detect password errors and handle them appropriately
    // TODO: Re-enable once pdfjs worker configuration is fixed for Next.js
    const requiresPassword = false; // !isImage && (await isPasswordProtected(buffer, fileType as 'CSV' | 'PDF'));

    if (requiresPassword) {
      // Get user's Colombian ID
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { colombianId: true },
      });

      // If no Colombian ID and no manual password provided, request it
      if (!user?.colombianId && !manualPassword) {
        return NextResponse.json(
          {
            error: 'PASSWORD_REQUIRED',
            message: 'Este archivo está protegido. Completa tu perfil o ingresa la contraseña.',
            requiresOnboarding: !user?.colombianId,
            requiresPassword: true,
          },
          { status: 403 }
        );
      }

      // Use provided password or fallback to Colombian ID
      const password = manualPassword || user?.colombianId;

      if (!password) {
        return NextResponse.json(
          {
            error: 'PASSWORD_REQUIRED',
            message: 'Se requiere contraseña para procesar este archivo',
            requiresPassword: true,
          },
          { status: 403 }
        );
      }

      // Encrypt password for temporary storage
      const encryptedPassword = encryptPassword(password);

      // Upload file to R2
      const key = generateImportKey(session.user.id, file.name);
      const fileUrl = await uploadToR2(buffer, key, file.type);

      // Create ImportJob with encrypted password
      const job = await prisma.importJob.create({
        data: {
          userId: session.user.id,
          fileName: file.name,
          fileSize: file.size,
          fileUrl,
          fileType,
          status: 'PENDING',
          requiresPassword: true,
          passwordHash: encryptedPassword,
        },
      });

      // Add job to queue
      await addImportJob({
        jobId: job.id,
        userId: session.user.id,
        fileUrl,
        fileType,
        hasPassword: true,
      });

      return NextResponse.json({
        jobId: job.id,
        status: 'success',
        message: 'Archivo subido. Procesando con contraseña...',
      });
    }

    // No password needed - standard flow
    const key = generateImportKey(session.user.id, file.name);
    const fileUrl = await uploadToR2(buffer, key, file.type);

    // Create ImportJob
    const job = await prisma.importJob.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileSize: file.size,
        fileUrl,
        fileType,
        status: 'PENDING',
      },
    });

    // Add job to queue
    await addImportJob({
      jobId: job.id,
      userId: session.user.id,
      fileUrl,
      fileType,
      hasPassword: false,
    });

    return NextResponse.json({
      jobId: job.id,
      status: 'success',
      message: 'Archivo subido exitosamente. Procesando...',
    });
  } catch (error) {
    console.error('Upload error:', error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('ENCRYPTION_KEY')) {
        return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 });
      }
      if (error.message.includes('R2')) {
        return NextResponse.json(
          { error: 'Error al subir archivo al almacenamiento' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ error: 'Error al procesar el archivo' }, { status: 500 });
  }
}
