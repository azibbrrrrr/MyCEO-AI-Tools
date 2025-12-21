/**
 * BoothRenderer
 * Dynamic renderer that selects and renders the appropriate booth template
 * Supports ref forwarding for SVG export
 */

import { forwardRef } from 'react'
import type { BoothProps, BoothTemplateId } from './Booth.types'
import { BoothTemplateBanner } from './BoothTemplateBanner'
import { BoothTemplateTable } from './BoothTemplateTable'
import { BoothTemplateSticker } from './BoothTemplateSticker'
import { BoothTemplatePriceTag } from './BoothTemplatePriceTag'

interface BoothRendererProps extends BoothProps {
  templateId: BoothTemplateId
}

const TEMPLATE_MAP: Record<BoothTemplateId, React.ComponentType<BoothProps>> = {
  banner: BoothTemplateBanner,
  table: BoothTemplateTable,
  sticker: BoothTemplateSticker,
  pricetag: BoothTemplatePriceTag,
}

export const BoothRenderer = forwardRef<HTMLDivElement, BoothRendererProps>(
  function BoothRenderer({ templateId, ...props }, ref) {
    const TemplateComponent = TEMPLATE_MAP[templateId]
    
    if (!TemplateComponent) {
      console.warn(`Unknown booth template: ${templateId}`)
      return null
    }
    
    // Wrap in a div to capture the ref for export
    return (
      <div ref={ref}>
        <TemplateComponent {...props} />
      </div>
    )
  }
)

// Export all templates for direct use if needed
export { BoothTemplateBanner } from './BoothTemplateBanner'
export { BoothTemplateTable } from './BoothTemplateTable'
export { BoothTemplateSticker } from './BoothTemplateSticker'
export { BoothTemplatePriceTag } from './BoothTemplatePriceTag'
export * from './Booth.types'
