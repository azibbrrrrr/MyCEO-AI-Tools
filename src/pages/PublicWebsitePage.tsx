import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SitePreview } from '@/components/mini-website/preview/SitePreview';
import { getPublicWebsiteBySlug } from '@/lib/supabase/mini-website';
import type { SiteConfig } from '@/hooks/useSiteConfig';
import { Loader2 } from 'lucide-react';

export default function PublicWebsitePage() {
    const { slug } = useParams<{ slug: string }>();
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSite = async () => {
            if (!slug) return;
            
            try {
                setLoading(true);
                const website = await getPublicWebsiteBySlug(slug);
                
                if (website) {
                    // Cast the stored JSON to SiteConfig
                    // Ensure defaults are present if schema changed (basic safety)
                    setConfig(website.data as unknown as SiteConfig); 
                } else {
                    setError('Website not found');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load website');
            } finally {
                setLoading(false);
            }
        };

        fetchSite();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p>Loading your store...</p>
                </div>
            </div>
        );
    }

    if (error || !config) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-4">
                    <h1 className="text-4xl mb-4">🏪</h1>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Store Not Found</h2>
                    <p className="text-gray-500 mb-6">{error || "We couldn't find the store you're looking for."}</p>
                    <a href="/" className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity">
                        Create Your Own Store
                    </a>
                </div>
            </div>
        );
    }

    // Mock the UseSiteConfigReturn interface for the preview component
    // We only need the config for display, so setters can be no-ops
    const siteConfigHelpers = {
        config,
        setConfig: () => {},
        setMode: () => {},
        toggleBossMode: () => {},
        setLayout: () => {},
        setStyle: () => {},
        setContent: () => {},
        addReview: () => {},
        updateReview: () => {},
        removeReview: () => {},
        addFeature: () => {},
        updateFeature: () => {},
        removeFeature: () => {},
        addProduct: () => {},
        updateProduct: () => {},
        removeProduct: () => {},
    };

    return (
        <div className={`parsed-styles palette-${config.styles.palette} font-style-${config.styles.fontPair} spacing-${config.styles.spacingDensity} min-h-screen bg-background`}>
             <SitePreview config={config} siteConfig={siteConfigHelpers} isMobile={false} />
        </div>
    );
}
