import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <section className="min-h-[calc(100vh-4rem)] flex flex-col text-center justify-center items-center gap-8 py-20 px-8">
            <span className="border border-primary w-fit py-2 px-6 rounded-4xl bg-primary-muted text-primary">AI-powered expense tracking</span>
            <h1 className="text-3xl md:text-4xl font-bold text-muted">Your money, <span className="text-primary">finally making sense</span></h1>
            <p className="text-foreground w-auto md:w-90 m-0 font-light">Track expenses, visualise spending patterns, and let AI auto-categorise every transaction — all in one place.</p>
            <Button className="w-fit md:w-35 h-10 md:h-12 p-4 cursor-pointer text-sm md:text-md">
                <Link to="/signup">Start for free</Link>
            </Button>
        </section>
    )
}

export default Hero;