import { Loader2 } from "lucide-react";

const Loader = ({ overlay = false }: { overlay?: boolean }) => {
  return (
    <div
      className={
        overlay
          ? "fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          : "fixed inset-0 flex items-center justify-center"
      }
    >
      <Loader2 size={26} className="animate-spin text-primary" />
    </div>
  );
};

export default Loader;