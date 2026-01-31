import type { VercelRequest, VercelResponse } from '@vercel/node';
import chromium from '@sparticuz/chromium';
import { chromium as playwrightChromium } from 'playwright-core';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { slug, url } = req.query;

    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers['host'];
    const baseUrl = `${protocol}://${host}`;

    const targetUrl =
        typeof url === 'string'
            ? url
            : typeof slug === 'string'
                ? `${baseUrl}/site/${encodeURIComponent(slug)}`
                : '';

    if (!targetUrl) {
        return res.status(400).send('Missing slug or url');
    }

    let browser;
    try {
        browser = await playwrightChromium.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless === 'new' ? true : chromium.headless,
        });

        const page = await browser.newPage();
        await page.setViewportSize({ width: 1200, height: 630 });

        await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(1000);

        const image = await page.screenshot({ type: 'png' });

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
        return res.status(200).send(image);
    } catch (error) {
        const fallback =
            typeof slug === 'string'
                ? `${baseUrl}/api/og?slug=${encodeURIComponent(slug)}`
                : `${baseUrl}/api/og`;
        res.writeHead(302, { Location: fallback });
        return res.end();
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
