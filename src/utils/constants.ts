import { Briefcase, Building2, Code, HelpCircle, Home, TrendingUp, type LucideIcon } from "lucide-react";

export const INCOME_ICONS: Record<string, LucideIcon> = {
  Salary:     Briefcase,
  Freelance:  Code,
  Investment: TrendingUp,
  Rental:     Home,
  Business:   Building2,
  Other:      HelpCircle,
};


export const INCOME_COLORS: Record<string, string> = {
  Salary:     "#5DCAA5",
  Freelance:  "#EF9F27",
  Investment: "#85B7EB",
  Rental:     "#AFA9EC",
  Business:   "#F0997B",
  Other:      "#6b7280",
};