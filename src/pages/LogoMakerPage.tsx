import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { HelpBubble } from '@/components/ui/HelpBubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Sparkles, ArrowRight, ArrowLeft, Check, Download, RefreshCw,
  Utensils, Palette as PaletteIcon, Wrench, Shirt, Gamepad2,
  Type, Image, Layers, Award,
  Smile, Briefcase, Leaf, Zap, Crown,
  Star, Heart, Rocket, Music, Camera
} from 'lucide-react';

// Types
type WizardStep = 'intro' | 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6' | 'step7';

interface LogoData {
  businessName: string;
  businessType: string;
  logoType: string;
  vibe: string;
  colors: string[];
  symbol: string;
  slogan: string;
}

// Business type options
const businessTypes = [
  { id: 'food', icon: Utensils, label: 'business.food', emoji: '🍕' },
  { id: 'craft', icon: PaletteIcon, label: 'business.craft', emoji: '🎨' },
  { id: 'service', icon: Wrench, label: 'business.service', emoji: '🔧' },
  { id: 'fashion', icon: Shirt, label: 'business.fashion', emoji: '👕' },
  { id: 'tech', icon: Gamepad2, label: 'business.tech', emoji: '🎮' },
];

// Logo type options
const logoTypes = [
  { id: 'text', icon: Type, label: 'logoType.text' },
  { id: 'icon', icon: Image, label: 'logoType.icon' },
  { id: 'combo', icon: Layers, label: 'logoType.combo' },
  { id: 'badge', icon: Award, label: 'logoType.badge' },
];

// Vibe options
const vibes = [
  { id: 'fun', icon: Smile, label: 'vibe.fun', emoji: '😄' },
  { id: 'pro', icon: Briefcase, label: 'vibe.pro', emoji: '💼' },
  { id: 'eco', icon: Leaf, label: 'vibe.eco', emoji: '🌿' },
  { id: 'modern', icon: Zap, label: 'vibe.modern', emoji: '⚡' },
  { id: 'classic', icon: Crown, label: 'vibe.classic', emoji: '👑' },
];

// Color presets
const colorPresets = [
  { id: 'ocean', colors: ['#06b6d4', '#0ea5e9', '#3b82f6'], name: 'Ocean' },
  { id: 'sunset', colors: ['#f97316', '#ef4444', '#ec4899'], name: 'Sunset' },
  { id: 'forest', colors: ['#10b981', '#22c55e', '#84cc16'], name: 'Forest' },
  { id: 'candy', colors: ['#ec4899', '#a855f7', '#6366f1'], name: 'Candy' },
  { id: 'earth', colors: ['#92400e', '#b45309', '#d97706'], name: 'Earth' },
];

// Symbol options
const symbols = [
  { id: 'star', icon: Star, emoji: '⭐' },
  { id: 'heart', icon: Heart, emoji: '❤️' },
  { id: 'rocket', icon: Rocket, emoji: '🚀' },
  { id: 'music', icon: Music, emoji: '🎵' },
  { id: 'camera', icon: Camera, emoji: '📷' },
];

// Mock generated logos
const mockLogos = [
  'https://placehold.co/300x300/06b6d4/ffffff?text=Logo+A',
  'https://placehold.co/300x300/10b981/ffffff?text=Logo+B',
  'https://placehold.co/300x300/f97316/ffffff?text=Logo+C',
];

// Loading tips
const loadingTips = [
  'logo.step4.tip1',
  'logo.step4.tip2',
  'logo.step4.tip3',
];

export default function LogoMakerPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<WizardStep>('intro');
  const [logoData, setLogoData] = useState<LogoData>({
    businessName: '',
    businessType: '',
    logoType: '',
    vibe: '',
    colors: [],
    symbol: '',
    slogan: '',
  });
  const [selectedLogo, setSelectedLogo] = useState<number | null>(null);
  const [boothMockups, setBoothMockups] = useState({
    banner: true,
    table: true,
    sticker: true,
    priceTag: true,
  });
  const [loadingTipIndex, setLoadingTipIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  // Check if intro was shown this session
  useEffect(() => {
    const introShown = sessionStorage.getItem('logo-intro-shown');
    if (introShown) {
      setShowIntro(false);
      setCurrentStep('step1');
    }
  }, []);

  // Loading tip rotation
  useEffect(() => {
    if (currentStep === 'step4') {
      const interval = setInterval(() => {
        setLoadingTipIndex((prev) => (prev + 1) % loadingTips.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // Simulate AI generation
  useEffect(() => {
    if (currentStep === 'step4') {
      const timer = setTimeout(() => {
        setCurrentStep('step5');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Step navigation helper
  const getStepNumber = (step: WizardStep): number => {
    const stepMap: Record<WizardStep, number> = {
      intro: 0,
      step1: 1,
      step2: 2,
      step3: 3,
      step4: 4,
      step5: 5,
      step6: 6,
      step7: 7,
    };
    return stepMap[step];
  };

  const handleStartWizard = () => {
    sessionStorage.setItem('logo-intro-shown', 'true');
    setCurrentStep('step1');
  };

  const handleNext = () => {
    const steps: WizardStep[] = ['intro', 'step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: WizardStep[] = ['intro', 'step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 1) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 'step1':
        return logoData.businessName.trim().length > 0 && logoData.businessType !== '';
      case 'step2':
        return logoData.logoType !== '' && logoData.vibe !== '' && logoData.colors.length > 0;
      case 'step5':
        return selectedLogo !== null;
      default:
        return true;
    }
  };

  // Render different steps
  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
      <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 animate-bounce-in">
        <Sparkles className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4">
        {t('logo.intro.title')} 🎨
      </h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        {t('logo.intro.subtitle')}
      </p>
      <Button
        onClick={handleStartWizard}
        size="lg"
        className="text-lg px-8 py-6 rounded-2xl font-bold animate-pulse-glow"
      >
        {t('logo.intro.start')}
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );

  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto px-4 animate-slide-up">
      <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2 text-center">
        {t('logo.step1.title')} 🏪
      </h2>
      <p className="text-muted-foreground text-center mb-8">Tell us about your business!</p>

      {/* Business Name */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-foreground mb-2">
          {t('logo.step1.name')}
        </label>
        <Input
          type="text"
          placeholder={t('logo.step1.namePlaceholder')}
          value={logoData.businessName}
          onChange={(e) => setLogoData({ ...logoData, businessName: e.target.value })}
          className="h-14 text-lg rounded-xl"
        />
      </div>

      {/* Business Type */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-4">
          {t('logo.step1.type')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {businessTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = logoData.businessType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setLogoData({ ...logoData, businessType: type.id })}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 bounce-hover",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <span className="text-3xl">{type.emoji}</span>
                <span className={cn("text-sm font-medium", isSelected ? "text-primary" : "text-foreground")}>
                  {t(type.label as any)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-2xl mx-auto px-4 animate-slide-up">
      <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2 text-center">
        {t('logo.step2.title')} ✨
      </h2>
      <p className="text-muted-foreground text-center mb-8">What style speaks to you?</p>

      {/* Logo Type */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-foreground mb-4">
          {t('logo.step2.logoType')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {logoTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = logoData.logoType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setLogoData({ ...logoData, logoType: type.id })}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 bounce-hover",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <Icon className={cn("w-8 h-8", isSelected ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-sm font-medium", isSelected ? "text-primary" : "text-foreground")}>
                  {t(type.label as any)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vibe */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-foreground mb-4">
          {t('logo.step2.vibe')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {vibes.map((vibe) => {
            const isSelected = logoData.vibe === vibe.id;
            return (
              <button
                key={vibe.id}
                onClick={() => setLogoData({ ...logoData, vibe: vibe.id })}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 bounce-hover",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <span className="text-2xl">{vibe.emoji}</span>
                <span className={cn("text-xs font-medium", isSelected ? "text-primary" : "text-foreground")}>
                  {t(vibe.label as any)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-4">
          {t('logo.step2.colors')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {colorPresets.map((preset) => {
            const isSelected = logoData.colors.includes(preset.id);
            return (
              <button
                key={preset.id}
                onClick={() => setLogoData({ ...logoData, colors: [preset.id] })}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 bounce-hover",
                  isSelected
                    ? "border-primary"
                    : "border-border hover:border-primary/30"
                )}
              >
                <div className="flex gap-1">
                  {preset.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className={cn("text-xs font-medium", isSelected ? "text-primary" : "text-foreground")}>
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-2xl mx-auto px-4 animate-slide-up">
      <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2 text-center">
        {t('logo.step3.title')} 🎉
      </h2>
      <p className="text-muted-foreground text-center mb-8">Add some extra magic (or skip)!</p>

      {/* Symbols */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-foreground mb-4">
          {t('logo.step3.symbol')}
        </label>
        <div className="grid grid-cols-5 gap-3">
          {symbols.map((sym) => {
            const isSelected = logoData.symbol === sym.id;
            return (
              <button
                key={sym.id}
                onClick={() => setLogoData({ ...logoData, symbol: isSelected ? '' : sym.id })}
                className={cn(
                  "flex items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 bounce-hover",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <span className="text-3xl">{sym.emoji}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slogan */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-foreground mb-2">
          {t('logo.step3.slogan')}
        </label>
        <Input
          type="text"
          placeholder={t('logo.step3.sloganPlaceholder')}
          value={logoData.slogan}
          onChange={(e) => setLogoData({ ...logoData, slogan: e.target.value })}
          className="h-14 text-lg rounded-xl"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-primary/30 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-16 h-16 text-primary animate-spin-slow" />
        </div>
      </div>
      <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4">
        {t('logo.step4.title')} ✨
      </h2>
      <div className="bg-muted rounded-2xl px-6 py-4 max-w-md">
        <p className="text-muted-foreground">
          💡 {t(loadingTips[loadingTipIndex] as any)}
        </p>
      </div>
      <div className="mt-8 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="max-w-3xl mx-auto px-4 animate-slide-up">
      <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2 text-center">
        {t('logo.step5.title')} 🎨
      </h2>
      <p className="text-muted-foreground text-center mb-8">{t('logo.step5.subtitle')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {mockLogos.map((logo, index) => (
          <button
            key={index}
            onClick={() => setSelectedLogo(index)}
            className={cn(
              "relative aspect-square rounded-2xl border-4 overflow-hidden transition-all duration-300 bounce-hover",
              selectedLogo === index
                ? "border-primary shadow-glow scale-105"
                : "border-border hover:border-primary/30"
            )}
          >
            <img src={logo} alt={`Logo option ${index + 1}`} className="w-full h-full object-cover" />
            {selectedLogo === index && (
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-bounce-in">
                <Check className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="max-w-2xl mx-auto px-4 animate-slide-up">
      <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2 text-center">
        {t('logo.step6.title')} 🎪
      </h2>
      <p className="text-muted-foreground text-center mb-8">{t('logo.step6.subtitle')}</p>

      <div className="space-y-4">
        {[
          { key: 'banner', label: 'logo.step6.banner', emoji: '🏳️' },
          { key: 'table', label: 'logo.step6.table', emoji: '🪧' },
          { key: 'sticker', label: 'logo.step6.sticker', emoji: '🏷️' },
          { key: 'priceTag', label: 'logo.step6.priceTag', emoji: '💰' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setBoothMockups({
              ...boothMockups,
              [item.key]: !boothMockups[item.key as keyof typeof boothMockups]
            })}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200",
              boothMockups[item.key as keyof typeof boothMockups]
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            )}
          >
            <span className="text-3xl">{item.emoji}</span>
            <span className="flex-1 text-left font-semibold text-foreground">
              {t(item.label as any)}
            </span>
            <div className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
              boothMockups[item.key as keyof typeof boothMockups]
                ? "border-primary bg-primary"
                : "border-border"
            )}>
              {boothMockups[item.key as keyof typeof boothMockups] && (
                <Check className="w-4 h-4 text-primary-foreground" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
      {/* Celebration */}
      <div className="relative mb-8">
        <div className="text-7xl animate-bounce-in">🎉</div>
        <div className="absolute -top-4 -left-8 text-2xl animate-confetti" style={{ animationDelay: '0.1s' }}>⭐</div>
        <div className="absolute -top-4 -right-8 text-2xl animate-confetti" style={{ animationDelay: '0.2s' }}>✨</div>
        <div className="absolute top-0 left-12 text-2xl animate-confetti" style={{ animationDelay: '0.3s' }}>🌟</div>
      </div>

      <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
        {t('logo.step7.title')} 🏆
      </h2>
      <p className="text-lg text-muted-foreground mb-8">
        {t('logo.step7.subtitle')}
      </p>

      {/* Preview grid */}
      <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-md">
        {selectedLogo !== null && (
          <div className="aspect-square rounded-xl overflow-hidden border border-border">
            <img src={mockLogos[selectedLogo]} alt="Your logo" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="aspect-square rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
          Banner Preview
        </div>
        <div className="aspect-square rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
          Sticker Preview
        </div>
        <div className="aspect-square rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
          Price Tag
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="px-8 rounded-xl font-bold">
          <Download className="w-5 h-5 mr-2" />
          {t('logo.step7.download')}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="px-8 rounded-xl font-bold"
          onClick={() => {
            setCurrentStep('step1');
            setLogoData({
              businessName: '',
              businessType: '',
              logoType: '',
              vibe: '',
              colors: [],
              symbol: '',
              slogan: '',
            });
            setSelectedLogo(null);
          }}
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          {t('logo.step7.createAnother')}
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'intro':
        return renderIntro();
      case 'step1':
        return renderStep1();
      case 'step2':
        return renderStep2();
      case 'step3':
        return renderStep3();
      case 'step4':
        return renderStep4();
      case 'step5':
        return renderStep5();
      case 'step6':
        return renderStep6();
      case 'step7':
        return renderStep7();
      default:
        return null;
    }
  };

  const showNavigation = !['intro', 'step4', 'step7'].includes(currentStep);

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header
        showProgress={currentStep !== 'intro'}
        currentStep={getStepNumber(currentStep)}
        totalSteps={7}
      />

      <main className="container mx-auto py-8">
        {renderCurrentStep()}
      </main>

      {/* Bottom Navigation */}
      {showNavigation && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border p-4">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              disabled={currentStep === 'step1'}
              className="rounded-xl px-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('common.back')}
            </Button>

            {currentStep === 'step3' && (
              <Button
                variant="ghost"
                onClick={handleNext}
                className="text-muted-foreground"
              >
                {t('logo.step3.skip')}
              </Button>
            )}

            <Button
              size="lg"
              onClick={handleNext}
              disabled={!canProceed()}
              className="rounded-xl px-8 font-bold"
            >
              {t('common.next')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}

      <HelpBubble
        tips={[
          "Click on the options to select them!",
          "You can change your choices anytime.",
          "Don't worry - there are no wrong answers!",
        ]}
      />
    </div>
  );
}
