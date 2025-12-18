import { useNavigate } from 'react-router-dom';
import { Palette, Calculator, Lightbulb, MessageSquare, Lock, ArrowLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const allTools = [
  {
    name: 'tool.logo.name',
    desc: 'tool.logo.desc',
    icon: Palette,
    color: 'from-primary to-cyan-400',
    available: true,
    path: '/logo-maker',
  },
  {
    name: 'tool.calculator.name',
    desc: 'tool.calculator.desc',
    icon: Calculator,
    color: 'from-accent to-orange-400',
    available: true,
    path: '/calculator',
  },
  {
    name: 'tool.name.name',
    desc: 'tool.name.desc',
    icon: Lightbulb,
    color: 'from-warning to-yellow-400',
    available: false,
    path: '',
  },
  {
    name: 'tool.marketing.name',
    desc: 'tool.marketing.desc',
    icon: MessageSquare,
    color: 'from-success to-emerald-400',
    available: false,
    path: '',
  },
];

export default function ToolsPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground">
              {t('nav.tools')} 🛠️
            </h1>
            <p className="text-muted-foreground">All your creative tools in one place!</p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.name}
                onClick={() => tool.available && navigate(tool.path)}
                disabled={!tool.available}
                className={cn(
                  "group relative bg-card rounded-2xl p-6 border border-border text-left transition-all duration-300 overflow-hidden animate-slide-up",
                  tool.available
                    ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                    : "opacity-70 cursor-not-allowed"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background gradient */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
                  tool.color,
                  tool.available && "group-hover:opacity-5"
                )} />

                {/* Coming Soon badge */}
                {!tool.available && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full">
                    <Lock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground">
                      {t('tool.state.comingSoon')}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={cn(
                  "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 transition-transform duration-300",
                  tool.color,
                  tool.available && "group-hover:scale-110 group-hover:rotate-3"
                )}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-bold text-xl text-foreground mb-2">
                  {t(tool.name as any)}
                </h3>
                <p className="text-muted-foreground">
                  {t(tool.desc as any)}
                </p>

                {/* Available indicator */}
                {tool.available && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-full text-success text-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    {t('tool.state.available')}
                  </div>
                )}

                {/* Decorative circle */}
                <div className={cn(
                  "absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br opacity-10 transition-opacity",
                  tool.color,
                  tool.available && "group-hover:opacity-20"
                )} />
              </button>
            );
          })}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-lg">🚀</span>
            <span className="font-semibold text-primary">More tools coming soon!</span>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're working hard to bring you more awesome tools. Check back soon!
          </p>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
