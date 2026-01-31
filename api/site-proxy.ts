import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// NOTE: This uses Node.js runtime, not Edge, to easily fetch the full HTML page.
export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { slug } = req.query;

    if (!slug || typeof slug !== 'string') {
        return res.status(400).send('Missing slug');
    }

    const escapeHtml = (value: string) =>
        value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

    // 1. Fetch site data
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    // Default metadata
    let title = "MyCEO Tools - Mini Website";
    let description = "Check out this amazing shop created by a young entrepreneur!";
    let imageUrl = "https://myceo.tools/og-default.png"; // Fallback

    if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data: website } = await supabase
            .from('mini_websites')
            .select('title, data, url_slug')
            .eq('url_slug', slug)
            .single();

        if (website) {
            title = website.title || title;
            // Generate dynamic OG image URL
            // Assuming the API is hosted on the same domain
            const protocol = req.headers['x-forwarded-proto'] || 'https';
            const host = req.headers['x-forwarded-host'] || req.headers['host'];
            const baseUrl = `${protocol}://${host}`;

            imageUrl = `${baseUrl}/api/og?slug=${encodeURIComponent(slug)}`;
            description = `Visit ${title} to see the products!`;
        }
    }

    // 2. Fetch the actual content of the SPA (index.html)
    // We treat the "real" index as the source of truth for the app bundle
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers['host'];
    const appUrl = `${protocol}://${host}`;

    try {
        // Fetch the raw HTML from the deployment
        // In local development, this might self-reference via localhost. 
        // In Vercel, this fetches from the CDN layer.
        const response = await fetch(appUrl);
        let html = await response.text();

        // 3. Inject Meta Tags
        // Replace existing tags or append to head
        const safeTitle = escapeHtml(title);
        const safeDescription = escapeHtml(description);
        const safeSlug = encodeURIComponent(slug);
        const metaTags = `
        <title>${safeTitle}</title>
        <meta name="description" content="${safeDescription}" />
        <meta property="og:title" content="${safeTitle}" />
        <meta property="og:description" content="${safeDescription}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:url" content="${appUrl}/site/${safeSlug}" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MyCEO Tools" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="${safeTitle}" />
        <meta property="twitter:description" content="${safeDescription}" />
        <meta property="twitter:image" content="${imageUrl}" />
        `;

        // Inject before </head>
        html = html.replace('</head>', `${metaTags}</head>`);

        // Serve the modified HTML
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400');
        return res.status(200).send(html);

    } catch (error) {
        console.error("Failed to fetch base HTML:", error);
        return res.status(500).send("Error generating preview");
    }
}
