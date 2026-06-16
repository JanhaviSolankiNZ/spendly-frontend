import { Bell, ChartPie, FileDown, Receipt, Sparkles, Wallet } from "lucide-react";
import FeatureCard from "./FeatureCard";

const FEATURES = [
  {
    Icon:  Sparkles,
    color: "#5DCAA5",
    bg:    "rgba(93,202,165,0.12)",
    title: "AI auto-categorisation",
    description:  "Type \"grocery run\" and it's filed under Essential. Powered by Groq — no manual tagging ever.",
  },
  {
    Icon:  ChartPie,
    color: "#85B7EB",
    bg:    "rgba(133,183,235,0.12)",
    title: "Visual analytics",
    description:  "Pie charts, bar charts, and trend lines show exactly where your money goes each month.",
  },
  {
    Icon:  Wallet,
    color: "#EF9F27",
    bg:    "rgba(239,159,39,0.12)",
    title: "Budget alerts",
    description:  "Set limits per category and get notified before you overspend — not after.",
  },
  {
    Icon:  Receipt,
    color: "#AFA9EC",
    bg:    "rgba(175,169,236,0.12)",
    title: "Expense tracking",
    description:  "Log every expense in seconds. Edit, delete, search and filter by month or category.",
  },
  {
    Icon:  FileDown,
    color: "#85B7EB",
    bg:    "rgba(133,183,235,0.12)",
    title: "CSV export",
    description:  "Download your data any time for tax season, accountants, or your own records.",
  },
  {
    Icon:  Bell,
    color: "#F0997B",
    bg:    "rgba(240,153,123,0.12)",
    title: "Smart alerts",
    description:  "Get notified at 85% of your budget limit so you can course-correct before overspending.",
  },
];

const Features = () => {
    return (
        <section className="min-h-[calc(100vh-4rem)] flex flex-col text-center justify-center gap-4 py-20 px-8" id="features">
            <h1 className="text-primary text-xl font-bold uppercase">Features</h1>
            <h2 className="text-muted text-3xl font-semibold">
                Everything you need
            </h2>
            <p className="text-foreground font-light">
                Built for people who want clarity over their money
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                 {FEATURES.map(({ Icon, color, bg, title, description }) => (<FeatureCard title={title} description={description} color={color} bg={bg} Icon={Icon} />))}
            </div>
        </section>
    )
};

export default Features;