import Navbar from "@/features/landing/components/Navbar"
import Hero from "@/features/landing/components/Hero"
import Features from "@/features/landing/components/Features"
import Pricing from "../components/Pricing"

const LandingPage = () => {
    return (
         <div className="min-h-screen bg-background">
        <header className="sticky top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur">
            <Navbar />
        </header>
        <main>
            <Hero />
            <Features />
            <Pricing />
        </main>
    </div>
    )
}

export default LandingPage