export const EXPENSE_CATEGORIES = [
  "Essential / Fixed",
  "Lifestyle / Variable",
  "Financial",
  "Work & Education",
  "Social & Family",
  "Miscellaneous",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes?: string;
}

export interface ExpenseSummary {
  dailyAverage: number;
  daysInMonth: number;
  largestSpend: {
    description: string;
    amount: number;
  };
  totalExpenses: number;
  vsLastMonth: number;
  transactions?: number;
}

export const CAT_COLORS: Record<string, string> = {
  "Essential / Fixed": "#85B7EB",
  "Lifestyle / Variable": "#5DCAA5",
  Financial: "#EF9F27",
  "Work & Education": "#AFA9EC",
  "Social & Family": "#F0997B",
  Miscellaneous: "#6b7280",
};

export const CAT_SHORT: Record<string, string> = {
  "Essential / Fixed": "Essential",
  "Lifestyle / Variable": "Lifestyle",
  Financial: "Financial",
  "Work & Education": "Work",
  "Social & Family": "Social",
  Miscellaneous: "Misc",
};

export interface Income {
  _id: string;
  source: string;
  amount: number;
  date: string;
  incomeType: string;
  notes?: string;
}

export interface IncomeSummary {
  total: number;
  count: number;
  byType: {
    type: string;
    total: number;
  }[];
}

export const INCOME_TYPES = [
  "Salary",
  "Freelance",
  "Investment",
  "Rental",
  "Business",
  "Other",
] as const;

export interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
  percent: number;
}

export interface TopCategory {
  name: string;
  total: number;
  percent: number;
}

export interface AnalyticsSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  topCategory: TopCategory | null;
  vsLastMonth: number | null;
  savingsPercentage: number;
  expensesPercentage: number;
  byCategory: CategoryBreakdown[];
}

interface Trend{
  year: number;
  month: number;
  label: string;
  total: number;
  count: number;
  current: boolean;
}
export interface SixMonthTrend {
  average: number;
  trend: Trend[]
}