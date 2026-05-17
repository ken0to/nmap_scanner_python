---
name: Serene Habit Systems
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#464555'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#416656'
  on-secondary: '#ffffff'
  secondary-container: '#c3ecd7'
  on-secondary-container: '#476c5b'
  tertiary: '#3f4b45'
  on-tertiary: '#ffffff'
  tertiary-container: '#57635c'
  on-tertiary-container: '#d2dfd6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#c3ecd7'
  secondary-fixed-dim: '#a8cfbc'
  on-secondary-fixed: '#002115'
  on-secondary-fixed-variant: '#294e3f'
  tertiary-fixed: '#d9e6dd'
  tertiary-fixed-dim: '#bdcac1'
  on-tertiary-fixed: '#131e19'
  on-tertiary-fixed-variant: '#3e4943'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: auto
  max-width-content: 1200px
---

## Brand & Style

The design system is anchored in a philosophy of "Productive Calm." It targets high-achieving professionals and mindfulness-seekers who require a tool that reduces cognitive load rather than adding to it. The aesthetic is **Minimalist** with a lean toward **Modern Corporate**—utilizing generous whitespace to create a sense of mental "room to breathe." 

The UI should evoke feelings of clarity, reliability, and steady progress. Every interaction is designed to feel intentional and low-friction, avoiding unnecessary flourishes in favor of structural elegance and soft, tactile feedback.

## Colors

The color palette is divided into functional zones to guide the user's emotional state:
- **Primary (Vibrant Indigo):** Used exclusively for high-priority actions, focus states, and primary navigation. It provides a professional "anchor" to the design.
- **Success (Soft Mint & Sage):** A spectrum of greens used for completion states, progress bars, and positive reinforcement. This reduces the "stress" of tracking by using soothing, nature-inspired tones.
- **Typography (Deep Charcoal):** Provides high legibility and a grounded feel without the harshness of pure black.
- **Backgrounds:** A mix of off-white and light sage to create subtle depth and separate different content regions without relying on heavy borders.

## Typography

This design system utilizes **Inter** for its exceptional legibility and neutral, professional character. 

- **Scale:** High contrast between display sizes and body text helps establish a clear information hierarchy.
- **Weight:** Medium and Semi-bold weights are used for labels and headlines to maintain authority, while Regular weight is used for body text to ensure a light, airy feel.
- **Spacing:** Slightly tightened letter spacing on larger headlines gives a modern, "tucked-in" editorial look, while labels use slightly increased tracking for clarity at small sizes.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to maintain a sense of order, transitioning to a fluid model for mobile.

- **Rhythm:** A strict 8px baseline grid ensures vertical harmony. 
- **Margins:** Generous external margins (40px+ on desktop) prevent the UI from feeling cramped. 
- **Hierarchy:** Elements are grouped using whitespace rather than lines. Use `lg` (40px) spacing between major sections and `md` (24px) for internal component padding.
- **Desktop:** 12-column grid with a max-width of 1200px.
- **Mobile:** Single column with 16px side margins and increased vertical padding to accommodate touch targets.

## Elevation & Depth

Elevation in the design system is communicated through **Ambient Shadows** and **Tonal Layering** rather than heavy physical metaphors.

1.  **Level 0 (Base):** Off-white or Light Sage background.
2.  **Level 1 (Cards):** Pure white surfaces with a very soft, diffused shadow (Blur: 20px, Y: 4px, Opacity: 4% Black). This creates a "floating" effect that feels light.
3.  **Level 2 (Active/Modals):** Increased shadow spread (Blur: 40px, Y: 12px, Opacity: 8% Black) to pull the element closer to the user.

Avoid inner shadows or harsh strokes. Depth should feel like natural light hitting a matte surface.

## Shapes

The shape language is defined by **High Circularity**. 

- **Main Components:** Cards, input fields, and containers use a 16px (`rounded-lg`) or 24px (`rounded-xl`) radius to evoke a soft, friendly, and modern feel.
- **Interactive Elements:** Buttons and tags use a fully "Pill-shaped" (999px) radius to distinguish them clearly from layout containers.
- **Progress:** Progress rings use rounded caps to maintain the soft visual language even in data visualization.

## Components

### Buttons
- **Primary:** Vibrant Indigo background, white text, pill-shaped. No shadow on rest; subtle lift on hover.
- **Secondary:** Light Sage background, Charcoal text, pill-shaped.
- **Ghost:** No background, Indigo text, used for less frequent actions.

### Cards (Habit Items)
- White background, 24px border radius, subtle ambient shadow.
- Content is padded with 24px (md) spacing. 
- Success states within cards should use the Soft Mint palette for backgrounds and iconography.

### Progress Rings
- Background track: Soft Sage (low opacity).
- Active track: Mint Green (for success) or Indigo (for focus).
- Stroke weight: Medium-thick (approx 8-10px) with rounded ends.

### Input Fields
- Off-white background, 16px border radius.
- Border appears only on focus (2px, Vibrant Indigo).
- Placeholder text in a muted charcoal.

### Toggles & Switches
- Track: Light Sage when off, Mint Green when on.
- Thumb: Pure white, circular, with a micro-shadow for a tactile feel.

### Lists
- Spacing between list items should be at least 12px.
- Use dividers sparingly; prefer whitespace or very subtle 1px sage lines.