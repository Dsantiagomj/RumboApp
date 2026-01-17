'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * File Dropzone Component
 *
 * Drag & drop file upload for bank statements
 * Supports CSV and PDF files up to 10MB
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = {
  'text/csv': ['.csv'],
  'application/pdf': ['.pdf'],
  'application/vnd.ms-excel': ['.xls'],
};

export interface FileDropzoneProps {
  onFileSelected: (file: File) => void;
  isUploading?: boolean;
}

export function FileDropzone({ onFileSelected, isUploading = false }: FileDropzoneProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: unknown[]) => {
      setError(null);

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        setError('Archivo no válido. Solo se permiten archivos CSV o PDF menores a 10MB.');
        return;
      }

      // Handle accepted files
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]!;

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          setError('El archivo es demasiado grande. El tamaño máximo es 10MB.');
          return;
        }

        setSelectedFile(file);
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    disabled: isUploading,
  });

  const rootProps = getRootProps();

  return (
    <div className="w-full">
      <div
        {...rootProps}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'} ${isUploading ? 'cursor-not-allowed opacity-50' : ''} ${error ? 'border-destructive' : ''} `}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {selectedFile && !error ? (
            <motion.div
              key="selected"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                <CheckCircle className="text-primary h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center justify-center gap-2">
                  <FileText className="text-muted-foreground h-5 w-5" />
                  <p className="text-foreground font-medium">{selectedFile.name}</p>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {!isUploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setError(null);
                  }}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Cambiar archivo
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                  error ? 'bg-destructive/10' : 'bg-primary/10'
                }`}
              >
                {error ? (
                  <AlertCircle className="text-destructive h-8 w-8" />
                ) : (
                  <Upload
                    className={`h-8 w-8 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                )}
              </div>
              <div>
                {isDragActive ? (
                  <p className="text-primary text-lg font-medium">Suelta el archivo aquí...</p>
                ) : (
                  <>
                    <p className="text-foreground text-lg font-medium">
                      Arrastra tu extracto bancario
                    </p>
                    <p className="text-muted-foreground mt-1">
                      o haz clic para seleccionar un archivo
                    </p>
                  </>
                )}
                <p className="text-muted-foreground mt-3 text-sm">CSV o PDF hasta 10MB</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div className="border-destructive/50 bg-destructive/10 flex items-start gap-3 rounded-lg border p-4">
              <AlertCircle className="text-destructive mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-destructive text-sm font-medium">Error al cargar archivo</p>
                <p className="text-destructive/80 mt-1 text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File info */}
      <div className="bg-muted/50 mt-6 rounded-lg p-4">
        <p className="text-muted-foreground text-sm font-medium">Formatos aceptados:</p>
        <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
          <li>• CSV - Exportado desde tu banco en línea</li>
          <li>• PDF - Extracto bancario descargado</li>
        </ul>
      </div>
    </div>
  );
}
