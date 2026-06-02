import FeatureCard from "./FeatureCard";

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
                <FeatureCard title="AI auto-categorisation" description="Type 'grocery run' and it's filed under Essential. Powered by Groq — no manual tagging ever." />
                <FeatureCard title="Visual analytics" description="Pie charts, bar charts, and trend lines show exactly where your money goes each month."   />
                {/* <FeatureCard title="Budget alerts" description="Set limits per category and get notified before you overspend — not after." /> */}
                {/* <FeatureCard title="Recurring expenses" description="Mark rent, subscriptions, and EMIs as recurring — they auto-populate each period." /> */}
                <FeatureCard title="CSV / PDF export" description="Download your data any time for tax season, accountants, or your own records."/>
                {/* <FeatureCard title="Receipt uploads" description="Attach receipt photos to any expense. Stored securely in Cloudinary."/> */}
            </div>
        </section>
    )
};

export default Features;