import type { VercelRequest, VercelResponse } from '@vercel/node'
import Replicate from 'replicate'

/**
 * Remove Background API
 * Uses Replicate's remove-bg model to create transparent PNG from logo
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { imageUrl } = req.body

    if (!imageUrl) {
        return res.status(400).json({ error: 'imageUrl is required' })
    }

    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

    try {
        console.log('🔵 Removing background from:', imageUrl)

        const output = await replicate.run(
            "lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1",
            { input: { image: imageUrl } }
        )

        console.log('✅ Background removed:', output)
        return res.status(200).json({ transparentUrl: String(output) })

    } catch (error) {
        console.error('🔴 Remove background error:', error)
        return res.status(500).json({ error: 'Failed to remove background' })
    }
}
