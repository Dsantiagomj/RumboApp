import { PrismaClient, TransactionType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Colombian categories...')

  // Default Colombian categories (system-wide, userId = null)
  const categories = [
    // Expense categories
    {
      name: 'Food',
      nameEs: 'Alimentación',
      icon: '🍔',
      color: '#f97316',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Transport',
      nameEs: 'Transporte',
      icon: '🚗',
      color: '#3b82f6',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Bills',
      nameEs: 'Servicios',
      icon: '💡',
      color: '#eab308',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Entertainment',
      nameEs: 'Entretenimiento',
      icon: '🎬',
      color: '#a855f7',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Health',
      nameEs: 'Salud',
      icon: '⚕️',
      color: '#ef4444',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Education',
      nameEs: 'Educación',
      icon: '📚',
      color: '#22c55e',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Personal',
      nameEs: 'Personal',
      icon: '👤',
      color: '#ec4899',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Debt',
      nameEs: 'Deudas',
      icon: '💳',
      color: '#374151',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Other',
      nameEs: 'Otros',
      icon: '📌',
      color: '#6b7280',
      type: TransactionType.EXPENSE,
    },

    // Income categories
    {
      name: 'Salary',
      nameEs: 'Salario',
      icon: '💰',
      color: '#10b981',
      type: TransactionType.INCOME,
    },
    {
      name: 'Freelance',
      nameEs: 'Freelance',
      icon: '💼',
      color: '#14b8a6',
      type: TransactionType.INCOME,
    },
    {
      name: 'Investment',
      nameEs: 'Inversión',
      icon: '📈',
      color: '#06b6d4',
      type: TransactionType.INCOME,
    },
    {
      name: 'Other Income',
      nameEs: 'Otros Ingresos',
      icon: '💸',
      color: '#0891b2',
      type: TransactionType.INCOME,
    },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.name.toLowerCase().replace(/\s/g, '-') },
      update: {},
      create: {
        id: category.name.toLowerCase().replace(/\s/g, '-'),
        ...category,
        userId: null, // System category
      },
    })
  }

  console.log('✅ Colombian categories seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
