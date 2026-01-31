• # Mini Website UX Redesign — Implementation Plan (Expanded)
                                                                                                                                 
  ## 1) Lock Scope & Principles                                                                                                  
                                                                                                                                 
  - Public site layout stays the same: Hero → USP → Social Proof → Product → CTA.                                                
  - Quest flow = Quick Build (simple, guided, minimal inputs).                                                                   
  - Boss Mode = Refinement layer:                                                                                                
      - Users can switch layouts per section (Hero/USP/Social/Product).                                                          
      - Users can adjust advanced styles (palette, font pair, spacing, corner radius, button styles).                            
  - Preview always live (no “Apply”).                                                                                            
  - Undo / Skip / Reset Step must exist on every quest step.                                                                     
                                                                                                                                 
  ———                                                                                                                            
                                                                                                                                 
  ## 2) UX Architecture (Shell + Navigation)                                                                                     
                                                                                                                                 
  - Replace current sidebar tabs with a Quest Flow UI:                                                                           
      - 5‑step progress bar (always visible).                                                                                    
      - One quest per screen with 1–3 actions max.                                                                               
      - Clear primary CTA to continue.                                                                                           
  - Keep live preview panel (right on desktop, below on mobile).                                                                 
  - Add Boss Mode toggle (locked until publish).                                                                                 
  - Maintain Preview Mode (full‑screen site view).                                                                               
                                                                                                                                 
  ———
                                                                                                                                 
  ## 3) Quest Flow (Quick Build) — Steps 1–5                                                                                     
                                                                                                                                 
  Quest 1: Name Your Shop                                                                                                        
                                                                                                                                 
  - Template cards + custom input.                                                                                               
  - Updates hero title instantly.                                                                                                
                                                                                                                                 
  Quest 2: Choose Your Vibe
                                                                                                                                 
  - 4 theme cards (bundle palette + font + spacing).                                                                             
  - Tap to try; instant preview swap.                                                                                            
                                                                                                                                 
  Quest 3: Show What You Sell                                                                                                    
                                                                                                                                 
  - 1–2 product cards (prefilled).                                                                                               
  - Inline edit name + price.                                                                                                    
  - Logo auto‑apply if available.                                                                                                
                                                                                                                                 
  Quest 4: Add Some Trust                                                                                                        
                                                                                                                                 
  - 3 review cards, select max 2.                                                                                                
  - Tap to customize.                                                                                                            
                                                                                                                                 
  Quest 5: Go Live                                                                                                               
                                                                                                                                 
  - Full preview + publish flow.                                                                                                 
  - Confetti + URL + QR + share.                                                                                                 
                                                                                                                                 
  ———                                                                                                                            
                                                                                                                                 
  ## 4) Boss Mode (Post‑Publish Refinement)                                                                                      
                                                                                                                                 
  - Unlock advanced editing controls after Quest 5.                                                                              
  - Boss Mode includes:                                                                                                          
      - Layout switching per section: Hero / USP / Social Proof / Product.                                                       
      - Style refinements: palette, font pair, spacing, corner radius, button style.                                             
      - Content depth: USP features list, CTA buttons, urgency bar, extra product/review controls.                               
  - Boss Mode is optional but clearly accessible after publish.                                                                  
                                                                                                                                 
  ———                                                                                                                            
                                                                                                                                 
  ## 5) State & Data Mapping (Non‑Breaking)                                                                                      
                                                                                                                                 
  - Keep existing SiteConfig schema unchanged (no renames/removals).                                                             
  - Quest flow is UI‑only: it writes to the same fields already used by published sites.                                         
  - No automatic overwrites: prefill templates only if a field is empty.                                                         
  - Boss Mode state is UI‑local (or stored separately), not mixed into existing site config.                                     
  - If new metadata is needed (quest progress / XP), store it outside the site config (separate table or local state).           
  - Backward compatibility guaranteed:                                                                                           
      - Old saved configs still render in preview and published views without migration.                                         
      - Missing optional fields fall back to safe defaults.                                                                      
  - Publishing flow stays identical (same slug/URL behavior).                                                                    
                                                                                                                                 
  ———                                                                                                                            
                                                                                                                                 
  ## 6) Validation & Guardrails                                                                                                  
                                                                                                                                 
  - No blocking errors.                                                                                                          
  - Auto‑fill defaults for empty fields.                                                                                         
  - Remove PII / disallowed inputs silently with friendly copy.                                                                  
  - Keep maximum choices per screen to 3 (Quest mode only).                                                                      
                                                                                                                                 
  ———                                                                                                                            
                                                                                                                                 
  ## 7) Integration Touchpoints                                                                                                  
  - Profit Calculator → prefill product prices if available.
  - Sales Buddy → show suggestion after publish.

  ———

  ## 8) Compatibility Test Checklist (Existing Users)

  - Load a previously saved config and confirm:
      - Preview renders correctly.
      - Publish flow still works without changes.
      - Boss Mode toggle does not alter existing data unless user edits.
  - Verify old configs with missing fields still render with safe defaults.
  - Confirm save → publish → reload round‑trip keeps data intact.

  ———

  ## 9) QA & Rollout

  - Verify quest completion in <5 minutes.
  - First preview update in <60s.
  - Boss Mode toggle unlocks only after publish.
  - Mobile experience: quest panel usable, preview stable.
  - Regression check on save/publish and preview modes.

  ———