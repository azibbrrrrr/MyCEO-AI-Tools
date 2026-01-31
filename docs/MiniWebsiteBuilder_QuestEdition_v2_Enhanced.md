# 🎮 Mini Website Builder: v2.0

## Enhanced UX Specification for Students Aged 9–13

**Document Version:** 2.0  
**Date:** January 2026  
**Platform:** My-CEO AI Tools

---

## 1. Executive Summary

Transform the Mini Website Builder from a complex section-based editor into a **5-Quest Adventure** optimized for children aged 9–13. This redesign applies evidence-based UX research specifically for young learners.

### Core Design Philosophy

- **Build fast → Publish early → Improve later**
- **First success visible within 60 seconds**
- **No failures, only "try this instead"**
- **One task per screen, maximum 3 choices**
- **Always allow Skip and Undo**

### Target Metrics

| Metric | Target |
|--------|--------|
| Time to first publish | Under 5 minutes |
| Time to first preview update | Under 60 seconds |
| Maximum choices per screen | 3 options |
| Completion rate goal | 90%+ without adult help |

---

## 2. Research Foundation

This specification is built on child development research and UX studies specific to ages 9–13. Each design decision maps to documented findings.

### 2.1 Key Research Findings Applied

| Research Finding | Implication | Our Solution |
|-----------------|-------------|--------------|
| Kids need explicit guidance (developing reasoning skills) | Avoid "figure it out" interfaces | Quest-based flow with clear goals |
| Choice overload causes fatigue and abandonment | Reduce decisions to minimum | Max 3 choices per screen |
| "Low floor, high ceiling, wide walls" (Scratch principles) | Easy start, room to grow | Quick Build → Unlock Custom |
| Short, active, delightful sessions | 5-7 min engagement window | Publish in under 5 minutes |
| Numeric scores feel evaluative | Progress feedback over grades | Levels + badges, no 0-100 |

### 2.2 The "First Success in 60 Seconds" Principle

Research shows that an immediate visible transformation reduces fear and locks motivation. The first screen must produce a preview change—not just collect information.

**Implementation:**
- Quest 1 immediately shows the business name on a live preview
- Every input instantly reflects in the preview—no "Apply" buttons

### 2.3 The "Wide Walls, Safe Walls" Principle

Creativity through variety (skins, stickers, presets), not through complexity (no full drag-drop). This keeps cognitive load low while allowing personal expression.

---

## 3. Complete Quest Flow

Each quest is a single screen with 2-3 interactions. Students complete quests sequentially but can always go back. Publishing happens by Quest 5, with improvements unlocked afterward.

---

### 🚀 Quest 1: Name Your Shop

| Element | Detail |
|---------|--------|
| **Duration** | 30 seconds |
| **Goal** | Pick a catchy business name |
| **XP Reward** | +50 XP |
| **Preview Update** | Name appears on hero banner INSTANTLY |

**UI Elements:**
- 3 template cards + 1 "Custom" option (always show custom last)
- Each card shows live preview of how name looks
- Inline example shown directly under input field

**Copy (English):**
> "Every great boss needs a great name! Pick one you love 👇"
> 
> *Example shown: "Like: Cookies by Aisyah, Hafiz's Slime Shop"*

**Copy (Bahasa Melayu):**
> "Setiap boss hebat perlukan nama hebat! Pilih satu yang kamu suka 👇"
> 
> *Contoh: "Macam: Kuih by Siti, Kedai Gelang Aishah"*

**Templates:**
- `{Product} by {Name}` → "Cookies by Aisyah"
- `{Name}'s {Product} Shop` → "Hafiz's Slime Shop"
- `The {Adjective} {Product}` → "The Yummy Cupcakes"

**Controls (REQUIRED on every quest):**

| Control | Behavior |
|---------|----------|
| ↩️ **Undo** | Resets to previous selection (visible at all times) |
| ⏭️ **Skip** | Uses default: "My Shop" — still earns 25 XP (half) |
| 🔄 **Reset Step** | Clears all choices in this quest only |

---

### 🎨 Quest 2: Choose Your Vibe

| Element | Detail |
|---------|--------|
| **Duration** | 45 seconds |
| **Goal** | Select color palette + style |
| **XP Reward** | +50 XP |
| **Preview Update** | Entire preview theme changes on tap |

**UI Elements:**
- 4 large visual cards (NO text input)
- Each card is a full mini-preview of that theme
- Tap to try = instant preview swap
- Selection is indicated by border glow, not checkbox

**Copy (English):**
> "What's your shop's personality? Tap to try! ✨"

**Copy (Bahasa Melayu):**
> "Apa gaya kedai kamu? Tekan untuk cuba! ✨"

**Vibe Options:**

| Vibe | Colors | Best For |
|------|--------|----------|
| 🌈 Fun & Colorful | Pastels (pink, mint, yellow) | Crafts, toys, sweets |
| 🔥 Bold & Cool | Neon (cyan, magenta, lime) | Tech, gaming, sports |
| 🍂 Warm & Cozy | Earth tones (brown, cream) | Food, handmade items |
| 🌙 Sleek & Pro | Dark mode (black, gold) | Premium, minimal |

**Controls:**
- ↩️ **Undo** — Reverts to previous vibe
- ⏭️ **Skip** — Uses "Fun & Colorful" default, earns 25 XP
- 🔄 **Reset Step** — Clears vibe selection

---

### 🛍️ Quest 3: Show What You Sell

| Element | Detail |
|---------|--------|
| **Duration** | 60 seconds |
| **Goal** | Add 1-2 products with prices |
| **XP Reward** | +75 XP (base) + 25 XP per extra product |
| **Preview Update** | Product cards appear with logo from AI Logo Maker |

**UI Elements:**
- Pre-filled product cards (edit inline)
- Logo from AI Logo Maker auto-appears on cards
- Price input has RM prefix already shown
- "Add another" button appears AFTER first product done

**Copy (English):**
> "Time to show off! What are you selling, Boss?"
> 
> *Example shown: "Like: Chocolate Chip Cookies — RM5"*

**Copy (Bahasa Melayu):**
> "Masa untuk tunjuk! Apa yang kamu jual, Boss?"
> 
> *Contoh: "Macam: Kuih Lapis — RM3"*

**Pre-filled Templates:**
- "My Best Seller" — RM10
- "Special Bundle" — RM15

**Integration Note:**
If student has used the AI Logo Maker, their selected logo automatically appears on product cards. If no logo exists, a friendly placeholder appears with option to "Create a logo later."

**Controls:**
- ↩️ **Undo** — Reverts last edit
- ⏭️ **Skip** — Uses template products as-is, earns 40 XP
- 🔄 **Reset Step** — Clears all products back to templates

---

### ⭐ Quest 4: Add Some Trust

| Element | Detail |
|---------|--------|
| **Duration** | 45 seconds |
| **Goal** | Pick/customize 2 reviews |
| **XP Reward** | +50 XP |
| **Preview Update** | Review bubbles appear in Social Proof section |

**UI Elements:**
- 3 template review cards (tap to select)
- Each review has avatar + star rating visual
- Tap to use, tap again to customize text
- Maximum 2 reviews to avoid overwhelm

**Copy (English):**
> "Happy customers = more sales! Pick reviews that fit your shop 🌟"

**Copy (Bahasa Melayu):**
> "Pelanggan gembira = lebih jualan! Pilih review yang sesuai 🌟"

**Template Reviews (Bilingual):**
- "Sedap sangat! Will buy again!" — Happy Customer ⭐⭐⭐⭐⭐
- "Fast delivery, nice packaging!" — Satisfied Buyer ⭐⭐⭐⭐⭐
- "Best in class, 10/10!" — Loyal Fan ⭐⭐⭐⭐⭐

**Educational Moment:**
> 💡 Micro-copy appears: "Reviews help people trust your shop!"

**Controls:**
- ↩️ **Undo** — Deselects last review
- ⏭️ **Skip** — No reviews added (still earn 25 XP)
- 🔄 **Reset Step** — Clears all review selections

---

### 🎉 Quest 5: GO LIVE!

| Element | Detail |
|---------|--------|
| **Duration** | 30 seconds |
| **Goal** | Review preview and publish |
| **XP Reward** | +100 XP + 🏆 "First Website" Badge |
| **Outcome** | Live URL + QR code generated |

**UI Elements:**
- Full-screen preview of final website
- Big "PUBLISH" button (pulsing animation)
- Small "Go back and edit" link (not prominent)
- Confetti explosion on publish
- Sound effect celebration (optional, respect device settings)

**Copy (English):**
> "Your website is READY! Let's show the world! 🚀"

**Copy (Bahasa Melayu):**
> "Website kamu SIAP! Jom tunjuk kepada dunia! 🚀"

**After Publish:**
- Live URL displayed: `myceo.tools/site/{business-slug}`
- QR code for easy sharing (can screenshot)
- "Share to WhatsApp" button (common in Malaysia)
- Coach mascot appears with congratulations

**Post-Publish Unlock:**
After publish, students unlock "Boss Mode" — additional customization options they can add to improve their site. This reinforces "finish first, improve later."

---

## 4. Marketing Coach Level System

Replace numeric scores (0-100) with a friendly Boss Level system. The Coach appears as a mascot character, not a widget, and gives ONE tip at a time.

### 4.1 Level Progression

| Level | Name | Unlock Condition | Coach Message |
|-------|------|------------------|---------------|
| 1 | 🌱 Rookie Seller | Complete Quest 1-2 | "Good start, Boss! Your shop looks great!" |
| 2 | 💪 Confident Seller | Complete Quest 3 | "Products added! You're ready to sell!" |
| 3 | ⭐ Pro Boss | Complete Quest 4-5 | "Reviews boost trust! Smart move!" |
| 4 | 👑 Carnival Legend | Add all optional extras | "You're a marketing master, Boss!" |

### 4.2 "Tap to Fix" One-Tap Improvements

Each Coach tip includes a "Tap to Fix" shortcut that applies an improvement automatically. This reduces friction and teaches by doing.

| Tip Shown | Tap to Fix Action | Result |
|-----------|-------------------|--------|
| "Add a call-to-action!" | Auto-adds "Order Now!" button | +10 XP |
| "Show your price clearly!" | Enlarges price font on products | +10 XP |
| "Add urgency!" | Adds scarcity bar: "Only 20 left!" | +15 XP |
| "Make it colorful!" | Adds decorative stickers/emojis | +5 XP |

### 4.3 Coach Mascot Design Notes

- Friendly animal character (suggest: owl or fox — symbolizes wisdom/cleverness)
- Appears in corner of screen, animated idle
- Speech bubble shows ONE tip at a time
- Tapping mascot shows the tip again
- Never shows more than one tip per quest
- All messages in positive, encouraging tone

---

## 5. Gamification & Rewards

### 5.1 XP System

| Action | Full XP | Skip XP |
|--------|---------|---------|
| Quest 1: Name Your Shop | +50 | +25 |
| Quest 2: Choose Your Vibe | +50 | +25 |
| Quest 3: Show What You Sell | +75 | +40 |
| Quest 4: Add Some Trust | +50 | +25 |
| Quest 5: GO LIVE! | +100 | N/A |
| Bonus: Each "Tap to Fix" applied | +5 to +15 | — |
| **TOTAL (minimum to publish)** | **325 XP** | **215 XP** |

### 5.2 Badge Collection

| Badge | Unlock Condition | Description |
|-------|------------------|-------------|
| 🚀 First Website | Publish your first site | "You did it!" |
| 🎨 Style Master | Try all 4 vibe themes | "Explorer of styles" |
| 💬 Review Pro | Customize a review (not just select) | "Trust builder" |
| ⚡ Speed Boss | Publish in under 3 minutes | "Faster than fast!" |
| 👑 Carnival Legend | Reach Level 4 | "Marketing master" |

### 5.3 Progress Bar

A progress bar is ALWAYS visible at the top of the screen. It shows which quest the student is on and fills as quests complete.

- 5 segments (one per quest)
- Current quest segment pulses gently
- Completed segments show checkmark
- Skipped segments show gray (still counts as complete)
- Tapping any segment shows quest name

---

## 6. Safety & Guardrails

All safety measures are designed to redirect, not punish. No red error messages. No "You can't do that." Always offer an alternative.

### 6.1 Input Validation Matrix

| Risk | Detection | Friendly Response |
|------|-----------|-------------------|
| **Gibberish input** | Pattern: >3 consonants in row, no vowels | "Hmm, let's try a clearer name! Pick from these instead 👇" [shows templates] |
| **Bad words** | Blocklist filter (silent) | "Oops! Let's pick something nicer 😊" [auto-clears, shows templates] |
| **Phone numbers** | Regex: sequences of 8+ digits | "Oops! No phone numbers needed here 😊" [auto-removes numbers] |
| **Email addresses** | Regex: @ symbol pattern | "Oops! No emails needed on your site 😊" [auto-removes] |
| **Long text** | Character count > limit | Visual countdown shows remaining (no error), auto-trims if exceeded |
| **Empty fields** | Field left blank | Auto-fill with template, NEVER block progress |
| **All-caps text** | Entire input uppercase | Auto-convert to Title Case (no message) |

### 6.2 PII Protection

- NO personal data is ever sent to AI models
- Business names are checked locally before display
- Student's real name is never shown on public site (only business name)
- Generated URL uses business slug only: `myceo.tools/site/cookies-by-boss`

### 6.3 Emotional Safety

- No failure states — only "try this instead"
- No comparisons to other students
- Skipping earns reduced XP (not zero) — all progress is celebrated
- Coach never criticizes, only suggests improvements
- Confetti and celebration even for minimal completion

---

## 7. Technical Integration Notes

### 7.1 Module Connections

| Module | Integration |
|--------|-------------|
| **AI Logo Maker** | If student has a selected logo, auto-populate on Quest 3 product cards and site header. If no logo, show placeholder with "Create logo later" link. |
| **Profit Calculator** | If student has used Profit Calculator, pre-fill suggested prices in Quest 3. Show profit margin badge on products. |
| **AI Sales Buddy** | After website publish, prompt: "Practice selling your products with Sales Buddy!" as a natural next step. |
| **Company Profile** | Business name and industry from Company Profile pre-fill Quest 1 if available. |

### 7.2 Preview Behavior

- Every input change reflects INSTANTLY in preview (no "Apply" buttons)
- Preview is interactive — student can scroll their site
- Preview shows "DRAFT" watermark until published


## 8. Design Principles Summary

These principles must guide all future iterations and decisions for the Mini Website Builder.

✅ **One task per screen** — never overwhelm with multiple goals

✅ **Maximum 3 choices** — reduce decision fatigue

✅ **Templates over blank fields** — lower the floor

✅ **Publish early, improve later** — celebrate completion

✅ **No wrong answers** — only "try this instead"

✅ **Progress always visible** — the bar never lies

✅ **Celebrate loudly on completion** — confetti is mandatory

✅ **Undo everywhere** — exploration without fear

✅ **Skip always allowed** — never block a child

✅ **Preview updates instantly** — see changes happen

✅ **First success in 60 seconds** — lock motivation early

✅ **Examples inline** — show, don't tell

---
