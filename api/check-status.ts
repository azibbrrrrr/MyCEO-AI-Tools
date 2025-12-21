import type { VercelRequest, VercelResponse } from '@vercel/node'
import Replicate from 'replicate'

// ============================================
// Handler - Check Prediction Status
// ============================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Prediction ID required' })
    }

    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

    try {
        const prediction = await replicate.predictions.get(id)

        // Parse progress from logs if available
        let progress = 0
        if (prediction.status === 'starting') {
            progress = 10
        } else if (prediction.status === 'processing') {
            progress = 50
            // Try to parse actual progress from logs
            if (prediction.logs) {
                const match = prediction.logs.match(/(\d+)%/)
                if (match) {
                    progress = parseInt(match[1], 10)
                }
            }
        } else if (prediction.status === 'succeeded') {
            progress = 100
        }

        res.status(200).json({
            status: prediction.status, // starting, processing, succeeded, failed, canceled
            output: prediction.output, // URL(s) or null
            error: prediction.error,
            progress,
        })

    } catch (error) {
        console.error('Error checking status:', error)
        res.status(500).json({ error: 'Failed to check status' })
    }
}
