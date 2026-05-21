import Navbar from "@/features/landing/Navbar";
import Hero from "@/features/landing/Hero";
import Features from "@/features/landing/Features";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
        <header className="sticky top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur">
            <Navbar />
        </header>
        <main>
            <Hero />
            <Features />
        </main>
    </div>
  )
}

export default MainLayout