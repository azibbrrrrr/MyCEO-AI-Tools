import { Download, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreationCardProps {
  imageUrl: string;
  title: string;
  date: string;
  onView?: () => void;
  onDownload?: () => void;
}

export function CreationCard({ imageUrl, title, date, onView, onDownload }: CreationCardProps) {
  return (
    <div className="group relative bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image */}
      <div className="aspect-square bg-muted overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
        {onView && (
          <button
            onClick={onView}
            className="w-12 h-12 rounded-full bg-card flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors bounce-hover"
          >
            <Eye className="w-5 h-5" />
          </button>
        )}
        {onDownload && (
          <button
            onClick={onDownload}
            className="w-12 h-12 rounded-full bg-card flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors bounce-hover"
          >
            <Download className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className="font-semibold text-sm text-foreground truncate">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1">{date}</p>
      </div>
    </div>
  );
}
