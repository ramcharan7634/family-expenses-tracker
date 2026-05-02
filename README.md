# Family Expenses Tracker

A comprehensive family finance analytics dashboard to track and analyze earnings, expenses, and savings across family members with beautiful visualizations.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.10-2D3748)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

---

## ✨ Features

### Core Functionality
- **Dashboard** - Overview with summary cards and interactive charts
- **Excel Upload** - Bulk import financial data via Excel/CSV files
- **Manual Entry** - Add individual records through a form
- **Records Table** - View, search, sort, filter, and export data
- **Analytics** - Detailed insights and contribution breakdowns

### Dashboard Features
- Total earnings, expenses, net savings, and savings percentage cards
- Earnings vs Expenses trend chart (6 months)
- Individual contribution pie chart
- Monthly expense comparison bar chart
- Daily expenses trend chart

### Analytics Features
- Individual savings cards per family member
- Expense ratio visualization
- Monthly comparison table
- Savings trend analysis
- Contribution percentage breakdown

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework with App Router |
| TypeScript | Type-safe JavaScript |
| Tailwind CSS | Utility-first CSS framework |
| shadcn/ui | UI component library |
| Recharts | Data visualization |
| react-dropzone | Drag & drop file upload |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| Next.js API Routes | Serverless API endpoints |
| Prisma ORM | Database ORM |
| PostgreSQL | Primary database |
| XLSX | Excel file parsing |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- PostgreSQL database (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/family-expenses-tracker.git
   cd family-expenses-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # PostgreSQL connection string
   DATABASE_URL="postgresql://username:password@localhost:5432/family_expenses?schema=public"
   ```

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Push database schema**
   ```bash
   npx prisma db push
   ```

6. **Seed sample data (optional)**
   ```bash
   npm run db:seed
   ```

7. **Run development server**
   ```bash
   npm run dev
   ```

8. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🗄 Database Setup

### Prisma Schema

The application uses a `FinanceRecord` model:

```prisma
model FinanceRecord {
  id              Int      @id @default(autoincrement())
  date            DateTime
  jaganEarnings   Float    @default(0)
  jaganExpenses   Float    @default(0)
  sunithaEarnings Float    @default(0)
  sunithaExpenses Float    @default(0)
  saiEarnings     Float    @default(0)
  saiExpenses     Float    @default(0)
  dailyExpenses   Float    @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Database Commands

| Command | Description |
|---------|-------------|
| `npx prisma generate` | Generate Prisma client |
| `npx prisma db push` | Push schema to database |
| `npx prisma studio` | Open Prisma admin UI |
| `npm run db:seed` | Seed sample data |

---

## 📁 Project Structure

```
family-expenses-tracker/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── add/             # Add record endpoint
│   │   ├── analytics/       # Analytics endpoint
│   │   ├── records/         # Records CRUD
│   │   ├── stats/           # Statistics endpoint
│   │   └── upload/          # Excel upload endpoint
│   ├── add/                 # Manual entry page
│   ├── analytics/           # Analytics page
│   ├── dashboard/           # Dashboard page
│   ├── records/             # Records table page
│   ├── upload/              # Upload page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── charts/              # Chart components
│   ├── dashboard/           # Dashboard widgets
│   ├── data-table/          # Table components
│   ├── forms/               # Form components
│   ├── layout/              # Layout components
│   └── ui/                  # UI primitives
├── lib/                      # Utility libraries
│   ├── prisma.ts            # Prisma client
│   └── utils.ts             # Helper functions
├── prisma/                  # Database files
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Seed script
│   └── dev.db               # SQLite dev database
├── public/                   # Static assets
├── package.json             # Dependencies
├── tailwind.config.ts       # Tailwind config
├── tsconfig.json            # TypeScript config
└── next.config.js           # Next.js config
```

---

## 🔌 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/upload` | POST | Upload and parse Excel file |
| `/api/add` | POST | Add single record |
| `/api/records` | GET | Get paginated records |
| `/api/stats` | GET | Get dashboard statistics |
| `/api/analytics` | GET | Get analytics data |
| `/api/stats/months` | GET | Get monthly statistics |

### Request/Response Examples

#### POST /api/add
```json
// Request
{
  "date": "2024-01-15",
  "jaganEarnings": 5000,
  "jaganExpenses": 1500,
  "sunithaEarnings": 4500,
  "sunithaExpenses": 1200,
  "saiEarnings": 6000,
  "saiExpenses": 800,
  "dailyExpenses": 150
}

// Response
{
  "id": 1,
  "date": "2024-01-15T00:00:00.000Z",
  ...
}
```

#### GET /api/stats
```json
// Response
{
  "totalEarnings": 15500,
  "totalExpenses": 3650,
  "netSavings": 11850,
  "savingsPercentage": 76.45
}
```

---

## 🌐 Deployment

### Quick Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/family-expenses-tracker.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add `DATABASE_URL` environment variable
   - Deploy

### PostgreSQL with Neon

1. Create a project at [neon.tech](https://neon.tech)
2. Get your connection string
3. Add to Vercel environment variables

### Build Command

The project includes `postinstall` script for Prisma:
```json
"postinstall": "prisma generate"
```

---

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Home/redirect to dashboard |
| `/dashboard` | Main dashboard with stats & charts |
| `/add` | Manual entry form |
| `/upload` | Excel file upload |
| `/records` | Data table with search/filter |
| `/analytics` | Detailed analytics |

---

## 🎨 Color Scheme

The dashboard uses a dark theme with these primary colors:

- **Primary**: Indigo (#6366f1)
- **Success**: Emerald (#10b981)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)
- **Background**: Slate (#0f172a)

---

## 📝 Excel Upload Format

When uploading Excel files, use this column format:

| Date | Jagan Earnings | Jagan Expenses | Sunitha Earnings | Sunitha Expenses | Sai Earnings | Sai Expenses | Daily Expenses |
|------|----------------|----------------|-------------------|-------------------|--------------|---------------|----------------|
| 2024-01-01 | 5000 | 1500 | 4500 | 1200 | 6000 | 800 | 150 |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org)
- [Tailwind CSS](https://tailwindcss.com)

