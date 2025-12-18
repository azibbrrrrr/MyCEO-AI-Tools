import { useNavigate } from 'react-router-dom';
import { Palette, Calculator, Lightbulb, MessageSquare } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { HelpBubble } from '@/components/ui/HelpBubble';
import { ToolCard, ToolState } from '@/components/cards/ToolCard';
import { MissionCard } from '@/components/cards/MissionCard';
import { CreationCard } from '@/components/cards/CreationCard';
import { TipCard } from '@/components/cards/TipCard';

// Mock data - in production, this would come from API/database
const mockCreations = [
  { id: '1', imageUrl: 'https://placehold.co/200x200/10b981/ffffff?text=Logo+1', title: 'Tasty Treats', date: 'Today' },
  { id: '2', imageUrl: 'https://placehold.co/200x200/f97316/ffffff?text=Logo+2', title: 'Cool Crafts', date: 'Yesterday' },
  { id: '3', imageUrl: 'https://placehold.co/200x200/06b6d4/ffffff?text=Logo+3', title: 'Game Zone', date: '2 days ago' },
];

export default function DashboardPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  // Mock user data
  const userEmail = 'student@school.edu.my';
  const completedTasks = 2;
  const totalTasks = 5;
  const streak = 3;

  // Tool states (in production, these would be dynamic)
  const tools = [
    {
      name: t('tool.logo.name'),
      description: t('tool.logo.desc'),
      icon: Palette,
      state: 'available' as ToolState,
      color: 'primary' as const,
      path: '/logo-maker',
    },
    {
      name: t('tool.calculator.name'),
      description: t('tool.calculator.desc'),
      icon: Calculator,
      state: 'available' as ToolState,
      color: 'accent' as const,
      path: '/calculator',
    },
    {
      name: t('tool.name.name'),
      description: t('tool.name.desc'),
      icon: Lightbulb,
      state: 'comingSoon' as ToolState,
      color: 'warning' as const,
      path: '/coming-soon',
    },
    {
      name: t('tool.marketing.name'),
      description: t('tool.marketing.desc'),
      icon: MessageSquare,
      state: 'comingSoon' as ToolState,
      color: 'success' as const,
      path: '/coming-soon',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Header userEmail={userEmail} />

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Welcome */}
        <div className="animate-slide-up">
          <h1 className="text-2xl md:text-3xl font-black text-foreground mb-1">
            {t('dashboard.welcome')}, <span className="gradient-text">Champion!</span> 🌟
          </h1>
          <p className="text-muted-foreground">Let's create something amazing today!</p>
        </div>

        {/* Mission Card */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <MissionCard completed={completedTasks} total={totalTasks} streak={streak} />
        </div>

        {/* Tools Grid */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            {t('dashboard.tools.title')} 🛠️
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool, index) => (
              <div key={tool.path} style={{ animationDelay: `${0.3 + index * 0.1}s` }} className="animate-slide-up">
                <ToolCard
                  name={tool.name}
                  description={tool.description}
                  icon={tool.icon}
                  state={tool.state}
                  color={tool.color}
                  onClick={() => tool.state !== 'comingSoon' && navigate(tool.path)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Creations & Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Creations */}
          <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              {t('dashboard.recent.title')} 🎨
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {mockCreations.map((creation) => (
                <CreationCard
                  key={creation.id}
                  imageUrl={creation.imageUrl}
                  title={creation.title}
                  date={creation.date}
                  onView={() => console.log('View', creation.id)}
                  onDownload={() => console.log('Download', creation.id)}
                />
              ))}
            </div>
          </div>

          {/* Tip of the Day */}
          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <TipCard />
          </div>
        </div>
      </main>

      <MobileNav />
      <HelpBubble />
    </div>
  );
}
