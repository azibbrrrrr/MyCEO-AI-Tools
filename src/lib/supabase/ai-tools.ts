/**
 * AI Tools Service
 * Handles quota checking and usage tracking for AI tools
 */

import { supabase } from '@/lib/supabase'
import type { AITool, AIToolUsage, ChildLogo, InsertTables } from '@/lib/supabase/types'

// Quota limits (can be moved to config or fetched from DB later)
export const QUOTA_LIMITS = {
    premium: {
        maxGenerations: 10,
        maxImages: 10,
        imagesPerGeneration: 1,  // Premium generates 1 high-quality logo
    },
    free: {
        maxGenerations: Infinity,
        maxImages: Infinity,
        imagesPerGeneration: 3,
    },
} as const

export interface QuotaStatus {
    canGenerate: boolean
    generationsUsed: number
    generationsRemaining: number
    imagesUsed: number
    imagesRemaining: number
    planType: 'free' | 'premium'
}

/**
 * Get AI tool by key
 */
export async function getToolByKey(key: string): Promise<AITool | null> {
    const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .eq('key', key)
        .eq('is_active', true)
        .single()

    if (error) {
        console.error('Error fetching tool:', error)
        return null
    }
    return data
}

/**
 * Get or create usage record for a child + tool + plan
 */
export async function getOrCreateUsage(
    childId: string,
    toolId: string,
    planType: 'free' | 'premium'
): Promise<AIToolUsage | null> {
    // Try to get existing
    const { data: existing } = await supabase
        .from('ai_tool_usage')
        .select('*')
        .eq('child_id', childId)
        .eq('tool_id', toolId)
        .eq('plan_type', planType)
        .single()

    if (existing) return existing

    // Create new usage record
    const { data: created, error } = await supabase
        .from('ai_tool_usage')
        .insert({
            child_id: childId,
            tool_id: toolId,
            plan_type: planType,
            generation_count: 0,
            image_count: 0,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating usage record:', error)
        return null
    }
    return created
}

/**
 * Check quota status for a child + tool + plan
 */
export async function checkQuota(
    childId: string,
    toolId: string,
    planType: 'free' | 'premium'
): Promise<QuotaStatus> {
    const usage = await getOrCreateUsage(childId, toolId, planType)
    const limits = QUOTA_LIMITS[planType]

    const generationsUsed = usage?.generation_count ?? 0
    const imagesUsed = usage?.image_count ?? 0

    const generationsRemaining = Math.max(0, limits.maxGenerations - generationsUsed)
    const imagesRemaining = Math.max(0, limits.maxImages - imagesUsed)

    // Can generate if both limits allow
    const canGenerate =
        generationsRemaining > 0 && imagesRemaining >= limits.imagesPerGeneration

    return {
        canGenerate,
        generationsUsed,
        generationsRemaining: isFinite(generationsRemaining) ? generationsRemaining : -1,
        imagesUsed,
        imagesRemaining: isFinite(imagesRemaining) ? imagesRemaining : -1,
        planType,
    }
}

/**
 * Increment usage after generation
 */
export async function incrementUsage(
    childId: string,
    toolId: string,
    planType: 'free' | 'premium',
    imageCount: number = 3
): Promise<boolean> {
    const usage = await getOrCreateUsage(childId, toolId, planType)
    if (!usage) return false

    const { error } = await supabase
        .from('ai_tool_usage')
        .update({
            generation_count: usage.generation_count + 1,
            image_count: usage.image_count + imageCount,
            last_used_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', usage.id)

    if (error) {
        console.error('Error incrementing usage:', error)
        return false
    }
    return true
}

/**
 * Save generated logos to database
 */
export async function saveLogos(
    logos: InsertTables<'child_logos'>[]
): Promise<ChildLogo[] | null> {
    const { data, error } = await supabase
        .from('child_logos')
        .insert(logos)
        .select()

    if (error) {
        console.error('Error saving logos:', error)
        return null
    }
    return data
}

/**
 * Select a logo as the final choice
 */
export async function selectLogo(
    childId: string,
    logoId: string
): Promise<boolean> {
    // First, unselect all logos for this child
    await supabase
        .from('child_logos')
        .update({ is_selected: false })
        .eq('child_id', childId)

    // Then select the chosen one
    const { error } = await supabase
        .from('child_logos')
        .update({ is_selected: true })
        .eq('id', logoId)
        .eq('child_id', childId)

    if (error) {
        console.error('Error selecting logo:', error)
        return false
    }
    return true
}

/**
 * Delete a logo from child_logos
 */
export async function deleteLogo(
    childId: string,
    logoId: string
): Promise<boolean> {
    const { error } = await supabase
        .from('child_logos')
        .delete()
        .eq('id', logoId)
        .eq('child_id', childId)

    if (error) {
        console.error('Error deleting logo:', error)
        return false
    }
    console.log('✅ Logo deleted:', logoId)
    return true
}

/**
 * Get all logos for a child
 */
export async function getChildLogos(childId: string): Promise<ChildLogo[]> {
    const { data, error } = await supabase
        .from('child_logos')
        .select('*')
        .eq('child_id', childId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching logos:', error)
        return []
    }
    return data ?? []
}

/**
 * Get selected logo for a child
 */
export async function getSelectedLogo(childId: string): Promise<ChildLogo | null> {
    const { data, error } = await supabase
        .from('child_logos')
        .select('*')
        .eq('child_id', childId)
        .eq('is_selected', true)
        .single()

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching selected logo:', error)
    }
    return data ?? null
}

/**
 * Update company logo_url
 */
export async function updateCompanyLogo(
    companyId: string,
    logoUrl: string
): Promise<boolean> {
    const { error } = await supabase
        .from('companies')
        .update({ logo_url: logoUrl })
        .eq('id', companyId)

    if (error) {
        console.error('Error updating company logo:', error)
        return false
    }
    return true
}

/**
 * Select logo and update company logo in one operation
 */
export async function selectLogoAndUpdateCompany(
    childId: string,
    logoId: string,
    logoUrl: string,
    companyId: string
): Promise<boolean> {
    // 1. Unselect all logos for this child
    await supabase
        .from('child_logos')
        .update({ is_selected: false })
        .eq('child_id', childId)

    // 2. Select the chosen logo
    const { error: selectError } = await supabase
        .from('child_logos')
        .update({ is_selected: true })
        .eq('id', logoId)
        .eq('child_id', childId)

    if (selectError) {
        console.error('Error selecting logo:', selectError)
        return false
    }

    // 3. Update company logo_url
    const { error: companyError } = await supabase
        .from('companies')
        .update({ logo_url: logoUrl })
        .eq('id', companyId)

    if (companyError) {
        console.error('Error updating company logo:', companyError)
        return false
    }

    console.log('✅ Logo selected and company updated')
    return true
}
