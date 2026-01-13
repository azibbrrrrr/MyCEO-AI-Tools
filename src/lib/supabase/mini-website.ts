/**
 * Mini Website Service
 * Handles saving, loading, and publishing user websites
 */

import { supabase } from '@/lib/supabase'
import type { MiniWebsite } from '@/lib/supabase/types'
import type { SiteConfig } from '@/hooks/useSiteConfig'

/**
 * Save a mini website configuration
 * Creates a new record or updates if one exists for the child (currently assuming 1 site per child for MVP)
 */
export async function saveWebsite(
    childId: string,
    config: SiteConfig,
    title: string = 'My Amazing Store'
): Promise<MiniWebsite | null> {
    // Check if website exists for this child
    const { data: existing } = await supabase
        .from('mini_websites')
        .select('id')
        .eq('child_id', childId)
        .single()

    if (existing) {
        // Update
        const { data, error } = await supabase
            .from('mini_websites')
            .update({
                data: config as unknown as any, // Cast to any for Json compatibility
                title,
                updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
            .select()
            .single()

        if (error) {
            console.error('Error updating website:', error)
            return null
        }
        return data
    } else {
        // Create
        const { data, error } = await supabase
            .from('mini_websites')
            .insert({
                child_id: childId,
                data: config as unknown as any,
                title,
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating website:', error)
            return null
        }
        return data
    }
}

/**
 * Publish a website (make it public)
 */
export async function publishWebsite(
    websiteId: string,
    slug: string
): Promise<{ success: boolean; error?: string }> {
    // Check if slug is taken by another site
    const { data: existingSlug } = await supabase
        .from('mini_websites')
        .select('id')
        .eq('url_slug', slug)
        .neq('id', websiteId)
        .single()

    if (existingSlug) {
        return { success: false, error: 'This web address is already taken. Please try another one.' }
    }

    const { error } = await supabase
        .from('mini_websites')
        .update({
            is_published: true,
            url_slug: slug,
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', websiteId)

    if (error) {
        console.error('Error publishing website:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}

/**
 * Unpublish a website
 */
export async function unpublishWebsite(websiteId: string): Promise<boolean> {
    const { error } = await supabase
        .from('mini_websites')
        .update({
            is_published: false,
            updated_at: new Date().toISOString()
        })
        .eq('id', websiteId)

    if (error) {
        console.error('Error unpublishing website:', error)
        return false
    }
    return true
}

/**
 * Get a child's website
 */
export async function getWebsite(childId: string): Promise<MiniWebsite | null> {
    const { data, error } = await supabase
        .from('mini_websites')
        .select('*')
        .eq('child_id', childId)
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error('Error fetching website:', error)
        return null
    }
    return data
}

/**
 * Get a public website by slug
 * This ignores RLS because we have a public policy for is_published=true
 */
export async function getPublicWebsiteBySlug(slug: string): Promise<MiniWebsite | null> {
    const { data, error } = await supabase
        .from('mini_websites')
        .select('*')
        .eq('url_slug', slug)
        .eq('is_published', true)
        .single()

    if (error) {
        if (error.code !== 'PGRST116') {
            console.error('Error fetching public website:', error)
        }
        return null
    }
    return data
}
