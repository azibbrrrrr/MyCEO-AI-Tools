import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

/**
 * Upload Image API
 * Fetches image from temporary Replicate URL and uploads to Supabase Storage
 * Returns permanent public URL
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('🔴 Missing Supabase configuration:', {
            hasUrl: !!supabaseUrl,
            hasServiceKey: !!supabaseServiceKey
        })
        return res.status(500).json({
            error: 'Server configuration error',
            details: 'Missing Supabase URL or Service Role Key'
        })
    }
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { tempUrl, childId, filename } = req.body as {
        tempUrl: string
        childId: string
        filename?: string
    }

    if (!tempUrl || !childId) {
        return res.status(400).json({ error: 'tempUrl and childId are required' })
    }

    try {
        console.log('🔵 Uploading image to storage...', { childId, tempUrl: tempUrl.substring(0, 50) + '...' })

        // 1. Fetch image from temporary URL
        const imageResponse = await fetch(tempUrl)
        if (!imageResponse.ok) {
            throw new Error(`Failed to fetch image: ${imageResponse.status}`)
        }

        const imageBlob = await imageResponse.blob()
        const arrayBuffer = await imageBlob.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // 2. Generate filename with timestamp for uniqueness
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(2, 8)
        const ext = tempUrl.includes('.png') ? 'png' : 'webp'
        const storagePath = `${childId}/${filename || `logo-${timestamp}-${randomId}`}.${ext}`

        // 3. Create Supabase client with service role key (for server-side uploads)
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: { persistSession: false }
        })

        // 4. Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('generated-images')
            .upload(storagePath, buffer, {
                contentType: `image/${ext}`,
                upsert: false,
            })

        if (uploadError) {
            console.error('🔴 Storage upload error:', uploadError)
            throw new Error(`Upload failed: ${uploadError.message}`)
        }

        // 5. Get public URL
        const { data: urlData } = supabase.storage
            .from('generated-images')
            .getPublicUrl(storagePath)

        const permanentUrl = urlData.publicUrl

        console.log('✅ Image uploaded successfully:', permanentUrl)

        return res.status(200).json({
            permanentUrl,
            path: storagePath,
        })

    } catch (error) {
        console.error('🔴 Upload image error:', error)
        return res.status(500).json({
            error: 'Failed to upload image',
            details: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}
