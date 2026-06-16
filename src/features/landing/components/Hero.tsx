import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex flex-col text-center justify-center items-center gap-8 py-20 px-8">
      <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs px-3 py-1.5 md:px-6 md:py-2 rounded-full mb-6">
        <Sparkles size={13} />
        AI-powered expense tracking
      </span>
      <h1 className="text-3xl md:text-4xl font-bold text-muted">
        Your money, <span className="text-primary">finally making sense</span>
      </h1>
      <p className="text-foreground w-auto md:w-90 m-0 font-light">
        Track expenses, visualise spending patterns, and let AI auto-categorise
        every transaction — all in one place.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
        <Button className="w-fit md:w-35 h-10 md:h-12 p-4 cursor-pointer text-sm md:text-md  hover:bg-primary/90">
          <Link to="/signup">Start for free</Link>
        </Button>
        <Button
          variant="outline"
          className="border-border text-secondary cursor-pointer h-10 p-4 md:h-12 w-fit hover:bg-foreground/10"
          onClick={() => {
            document
              .querySelector("#features")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          See features
        </Button>
      </div>
    </section>
  );
};

export default Hero;
