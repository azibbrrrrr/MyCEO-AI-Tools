import { useI18n, Language } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function LanguageToggle() {
  const { language, setLanguage } = useI18n();

  const handleToggle = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="flex items-center bg-muted rounded-full p-1 gap-0.5">
      <button
        onClick={() => handleToggle('bm')}
        className={cn(
          "px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200",
          language === 'bm'
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        BM
      </button>
      <button
        onClick={() => handleToggle('en')}
        className={cn(
          "px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200",
          language === 'en'
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        ENG
      </button>
    </div>
  );
}
