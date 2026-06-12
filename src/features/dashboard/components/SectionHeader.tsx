import { ArrowRight } from 'lucide-react';

const SectionHeader = ({
  title, linkLabel, onLink,
}: {
  title: string; linkLabel?: string; onLink?: () => void;
}) => {
  return (
    <div className="flex items-center justify-between px-4 pt-3 pb-2">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      {linkLabel && onLink && (
        <button
          onClick={onLink}
          className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
        >
          {linkLabel} <ArrowRight size={11} />
        </button>
      )}
    </div>
  );
}

export default SectionHeader
