# Family Finance Analytics Dashboard - Specification

## 1. Project Overview

**Project Name:** Family Finance Analytics Dashboard
**Type:** Full-stack Web Application (SaaS Dashboard)
**Core Functionality:** Track and analyze family members' earnings, expenses, and savings with visual analytics
**Target Users:** Families wanting to track and analyze their collective finances

---

## 2. Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts (visualizations)
- react-dropzone (file upload)
- Lucide React (icons)

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Supabase or local)
- XLSX library (Excel parsing)

---

## 3. UI/UX Specification

### Layout Structure
- **Sidebar:** Fixed left sidebar (240px) with navigation
- **Header:** Top header (64px) with theme toggle and user info
- **Main Content:** Fluid width content area with padding

### Color Palette
```
css
/* Primary Colors */
--primary: #6366f1 (Indigo-500)
--primary-dark: #4f46e5 (Indigo-600)
--primary-light: #818cf8 (Indigo-400)

/* Background Colors */
--bg-primary: #0f172a (Slate-900)
--bg-secondary: #1e293b (Slate-800)
--bg-card: #1e293b (Slate-800)
--bg-hover: #334155 (Slate-700)

/* Text Colors */
--text-primary: #f8fafc (Slate-50)
--text-secondary: #94a3b8 (Slate-400)
--text-muted: #64748b (Slate-500)

/* Accent Colors */
--success: #10b981 (Emerald-500)
--warning: #f59e0b (Amber-500)
--danger: #ef4444 (Red-500)
--info: #3b82f6 (Blue-500)

/* Chart Colors */
--chart-1: #6366f1
--chart-2: #10b981
--chart-3: #f59e0b
--chart-4: #ef4444
--chart-5: #8b5cf6
```

### Typography
- **Font Family:** "Plus Jakarta Sans" (headings), "Inter" (body)
- **Headings:** 
  - H1: 32px, font-weight 700
  - H2: 24px, font-weight 600
  - H3: 18px, font-weight 600
- **Body:** 14px, font-weight 400
- **Small:** 12px, font-weight 400

### Spacing System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px

### Responsive Breakpoints
- Mobile: < 768px (sidebar collapses to hamburger)
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 4. Page Structure

### 4.1 Dashboard Page (`/dashboard`)
**Layout:**
- Summary cards row (4 cards)
- Charts section (2x2 grid on desktop, stacked on mobile)
- Recent activity section

**Summary Cards:**
1. Total Earnings (green icon, currency format)
2. Total Expenses (red icon, currency format)
3. Net Savings (blue icon, currency format)
4. Savings Percentage (percentage with trend indicator)

**Charts:**
1. Line Chart: Earnings vs Expenses over time (6 months)
2. Pie Chart: Individual contributions (Jagan, Sunitha, Sai Charan)
3. Bar Chart: Monthly expense comparison
4. Line Chart: Daily expenses trend (last 30 days)

### 4.2 Upload Page (`/upload`)
- Drag & drop zone for Excel files
- File format instructions
- Upload progress indicator
- Recent uploads list
- Sample file download button

### 4.3 Data Table Page (`/records`)
- Searchable data table
- Column sorting
- Date range filter
- Pagination (10, 25, 50 per page)
- Export to CSV button
- Delete record action

### 4.4 Analytics Page (`/analytics`)
- Individual savings cards
- Expense ratio charts
- Monthly comparison table
- Savings trend line
- Contribution percentage breakdown

### 4.5 Manual Entry Page (`/add`)
- Date picker
- Earnings inputs for each family member
- Expenses inputs for each family member
- Daily expenses input
- Submit button with validation

---

## 5. Components

### Navigation
- `Sidebar` - Main navigation with icons
- `Header` - Top bar with theme toggle
- `MobileNav` - Hamburger menu for mobile

### Cards
- `StatCard` - Summary statistics card
- `ChartCard` - Container for charts

### Forms
- `FileUpload` - Drag & drop zone
- `ManualEntryForm` - Finance record form
- `DateRangePicker` - Date selection

### Data Display
- `DataTable` - Sortable, filterable table
- `Pagination` - Table pagination

### Charts (Recharts)
- `EarningsExpensesChart` - Line chart
- `ContributionPieChart` - Pie chart
- `ExpenseBarChart` - Bar chart
- `DailyTrendChart` - Line chart

---

## 6. Database Schema (Prisma)

```
prisma
model FinanceRecord {
  id              Int      @id @default(autoincrement())
  date            DateTime
  jagan_earnings  Float    @default(0)
  jagan_expenses  Float    @default(0)
  sunitha_earnings Float  @default(0)
  sunitha_expenses Float  @default(0)
  sai_earnings    Float    @default(0)
  sai_expenses    Float    @default(0)
  daily_expenses  Float    @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## 7. API Endpoints

### POST /api/upload
- Accepts: multipart/form-data (Excel file)
- Parses XLSX/CSV
- Validates columns
- Bulk inserts records
- Returns: success count, errors

### POST /api/add
- Accepts: JSON body with finance data
- Validates required fields
- Inserts single record
- Returns: created record

### GET /api/stats
- Calculates totals and aggregates
- Returns: summary statistics

### GET /api/records
- Query params: page, limit, sort, order, search
- Returns: paginated records

### GET /api/analytics
- Calculates insights and suggestions
- Returns: analytics data

---

## 8. Sample Data

Generate 6 months of sample data with:
- Random but realistic earnings ($3000-8000 per person)
- Random expenses ($500-4000 per person)
- Daily expenses ($50-200)
- Varied dates for trend analysis

---

## 9. Acceptance Criteria

### Functional
- [ ] Dashboard displays all 4 summary cards with correct calculations
- [ ] All 4 charts render with real data
- [ ] Excel upload parses and stores data correctly
- [ ] Manual entry form validates and saves data
- [ ] Data table shows all records with sorting/filtering/pagination
- [ ] Analytics page shows all calculated insights
- [ ] Smart suggestions generate appropriate insights

### UI/UX
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] Dark mode is default with light mode option
- [ ] Loading states shown during data fetch
- [ ] Error messages display clearly
- [ ] Charts update instantly after data changes

### Performance
- [ ] Page loads under 3 seconds
- [ ] Large datasets (1000+ records) handled smoothly
- [ ] Optimistic updates for better UX

---

## 10. Project Structure

```
family-finance-dashboard/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── upload/
│   │   └── page.tsx
│   ├── records/
│   │   └── page.tsx
│   ├── analytics/
│   │   └── page.tsx
│   ├── add/
│   │   └── page.tsx
│   └── api/
│       ├── upload/
│       │   └── route.ts
│       ├── add/
│       │   └── route.ts
│       ├── stats/
│       │   └── route.ts
│       ├── records/
│       │   └── route.ts
│       └── analytics/
│           └── route.ts
├── components/
│   ├── ui/
│   ├── layout/
│   ├── charts/
│   └── forms/
├── lib/
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
