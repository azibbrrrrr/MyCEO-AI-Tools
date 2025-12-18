import { useNavigate } from 'react-router-dom';
import { Sparkles, Rocket, Star, ArrowRight, Palette, Calculator, Lightbulb, MessageSquare } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { Button } from '@/components/ui/button';

const tools = [
  {
    icon: Palette,
    name: 'tool.logo.name',
    desc: 'tool.logo.desc',
    color: 'from-primary to-cyan-400',
    available: true,
  },
  {
    icon: Calculator,
    name: 'tool.calculator.name',
    desc: 'tool.calculator.desc',
    color: 'from-accent to-orange-400',
    available: true,
  },
  {
    icon: Lightbulb,
    name: 'tool.name.name',
    desc: 'tool.name.desc',
    color: 'from-warning to-yellow-400',
    available: false,
  },
  {
    icon: MessageSquare,
    name: 'tool.marketing.name',
    desc: 'tool.marketing.desc',
    color: 'from-success to-emerald-400',
    available: false,
  },
];

export default function LandingPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">KidBiz Tools</span>
          </div>
          <LanguageToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto text-center relative">
          {/* Floating decorations */}
          <div className="absolute top-0 left-10 w-16 h-16 rounded-2xl bg-accent/20 animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-20 right-10 w-12 h-12 rounded-full bg-primary/20 animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-0 left-1/4 w-20 h-20 rounded-3xl bg-success/20 animate-float" style={{ animationDelay: '1s' }} />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8 animate-pop-in">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">For Young Entrepreneurs 🚀</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 animate-slide-up">
            {t('landing.hero.title')}
            <br />
            <span className="gradient-text">✨ With AI Magic! ✨</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {t('landing.hero.subtitle')}
          </p>

          {/* CTA */}
          <Button
            onClick={() => navigate('/dashboard')}
            size="lg"
            className="text-lg px-8 py-6 rounded-2xl font-bold animate-pulse-glow animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            {t('landing.hero.cta')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-black text-foreground">
                <Star className="w-5 h-5 text-warning fill-warning" />
                4.9
              </div>
              <p className="text-sm text-muted-foreground">Rating</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-black text-foreground">10K+</div>
              <p className="text-sm text-muted-foreground">Students</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-black text-foreground">50K+</div>
              <p className="text-sm text-muted-foreground">Logos Made</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Preview */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              {t('landing.tools.title')} 🎨
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('landing.tools.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.name}
                  className="group relative bg-card rounded-2xl p-6 border border-border fun-card overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  {/* Coming Soon badge */}
                  {!tool.available && (
                    <div className="absolute top-4 right-4 px-2 py-1 bg-muted rounded-full text-xs font-semibold text-muted-foreground">
                      {t('tool.state.comingSoon')}
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    {t(tool.name as any)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(tool.desc as any)}
                  </p>

                  {/* Decorative */}
                  <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${tool.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Made with 💖 for young entrepreneurs
          </p>
        </div>
      </footer>
    </div>
  );
}
