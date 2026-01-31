import { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import type { UseSiteConfigReturn } from '@/hooks/useSiteConfig';
import { useLanguage } from '@/components/language-provider';
import { useChildSession } from '@/hooks/useChildSession';
import { QuestShell } from '../QuestShell';
import { QuestControls } from '../QuestControls';
import { QUEST_DEFAULT_SHOP_NAME } from '@/lib/questTemplates';
import { sanitizeText, sanitizeWithFallback } from '@/lib/questGuardrails';

interface QuestStepBaseProps {
  siteConfig: UseSiteConfigReturn;
  steps: { id: string; label: string }[];
  currentIndex: number;
  onStepSelect: (index: number) => void;
  onNext: () => void;
  isPublished: boolean;
}

export const QuestStep1Name = ({
  siteConfig,
  steps,
  currentIndex,
  onStepSelect,
  onNext,
  isPublished,
}: QuestStepBaseProps) => {
  const { config, setContent } = siteConfig;
  const { language } = useLanguage();
  const { child } = useChildSession();

  const hasUserEditedRef = useRef(false);

  const applyHeading = (value: string) => {
    setContent('heroHeading', value);
  };

  const handleNameChange = (value: string) => {
    hasUserEditedRef.current = true;
    applyHeading(value);
  };

  const handleTaglineChange = (value: string) => {
    setContent('heroSubheading', value);
  };

  useEffect(() => {
    if (isPublished) return;
    if (hasUserEditedRef.current) return;
    const companyName = child?.companies?.[0]?.company_name;
    if (!companyName) return;

    const currentName = config.content.heroHeading?.trim();
    if (currentName && currentName !== QUEST_DEFAULT_SHOP_NAME) return;

    applyHeading(sanitizeWithFallback(companyName, QUEST_DEFAULT_SHOP_NAME));
  }, [child?.companies?.[0]?.company_name, config.content.heroHeading, isPublished]);

  useEffect(() => {
    if (isPublished) return;
    const logoUrl = child?.companies?.[0]?.logo_url;
    if (!logoUrl) return;
    if (config.content.heroImage) return;
    setContent('heroImage', logoUrl);
  }, [child?.companies?.[0]?.logo_url, config.content.heroImage, isPublished]);

  return (
    <QuestShell
      steps={steps}
      currentIndex={currentIndex}
      onStepSelect={onStepSelect}
      title={language === 'EN' ? 'Company Name & Tagline' : 'Nama Syarikat & Tagline'}
      subtitle={
        language === 'EN'
          ? 'Share your company name and a short tagline.'
          : 'Kongsi nama syarikat dan tagline ringkas anda.'
      }
      controls={
        <QuestControls
          onNext={onNext}
          nextLabel={language === 'EN' ? 'Next' : 'Seterusnya'}
          nextDisabled={
            config.content.heroHeading.trim().length === 0 ||
            config.content.heroSubheading.trim().length === 0
          }
        />
      }
    >
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4">
        <label className="block text-xs font-semibold text-slate-600 mb-2">
          {language === 'EN' ? 'Company name' : 'Nama syarikat'}
        </label>
        <Input
          value={config.content.heroHeading}
          onChange={(event) => handleNameChange(sanitizeText(event.target.value))}
          placeholder={language === 'EN' ? 'Type your company name' : 'Taip nama syarikat'}
          className="bg-white"
        />
        <p className="text-[11px] text-slate-500 mt-2">
          {language === 'EN' ? 'Example: Cookies by Aisyah' : 'Contoh: Kuih by Siti'}
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4">
        <label className="block text-xs font-semibold text-slate-600 mb-2">
          {language === 'EN'
            ? 'Tagline'
            : 'Tagline'}
        </label>
        <Input
          value={config.content.heroSubheading}
          onChange={(event) => handleTaglineChange(sanitizeText(event.target.value))}
          placeholder={
            language === 'EN'
              ? 'Short line that explains your offer'
              : 'Ayat ringkas yang terangkan tawaran anda'
          }
          className="bg-white"
        />
        <p className="text-[11px] text-slate-500 mt-2">
          {language === 'EN'
            ? 'Example: Fresh, handmade treats every day'
            : 'Contoh: Kudapan segar buatan tangan setiap hari'}
        </p>
      </div>
    </QuestShell>
  );
};
