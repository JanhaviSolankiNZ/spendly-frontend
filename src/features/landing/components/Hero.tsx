import { Button } from "@/components/ui/button";

const Hero = () => {
    return (
        <section className="min-h-[calc(100vh-4rem)] flex flex-col text-center justify-center items-center gap-8 py-20 px-8">
            <span className="border border-primary w-fit py-2 px-6 rounded-4xl bg-primary-muted text-primary">AI-powered expense tracking</span>
            <h1 className="text-4xl font-bold text-muted">Your money, <span className="text-primary">finally making sense</span></h1>
            <p className="text-foreground w-90 m-0 font-light">Track expenses, visualise spending patterns, and let AI auto-categorise every transaction — all in one place.</p>
            <Button className="w-35 h-12 p-4 cursor-pointer">Start for free</Button>
        </section>
    )
}

export default Hero;