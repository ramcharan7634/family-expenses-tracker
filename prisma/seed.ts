import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.financeRecord.deleteMany()

  // Generate 6 months of sample data
  const records = []
  const now = new Date()
  
  for (let i = 180; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    records.push({
      date,
      jaganEarnings: randomBetween(3000, 8000),
      jaganExpenses: randomBetween(500, 3000),
      sunithaEarnings: randomBetween(2500, 6000),
      sunithaExpenses: randomBetween(400, 2500),
      saiEarnings: randomBetween(2000, 5000),
      saiExpenses: randomBetween(300, 2000),
      dailyExpenses: randomBetween(50, 200),
    })
  }

  await prisma.financeRecord.createMany({
    data: records,
  })

  console.log(`Created ${records.length} sample records`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
