# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-07-02
- Primary product surfaces: new tab, settings, navigation hub
- Evidence reviewed: `newtab.js`, `newtab.css`, user screenshots

## Brand
- Personality: calm, practical, young without neon styling
- Trust signals: clear hierarchy, stable contrast, restrained accents
- Avoid: large saturated color fields, gradients that imply AI products, white or black surfaces that merge with icon carriers

## Product goals
- Goals: fast reading, recognizable states, consistent palette coverage
- Non-goals: decorative theme effects or custom color editing
- Success signals: every palette remains readable in light and dark modes

## Personas and jobs
- Primary personas: frequent browser users
- User jobs: search, reopen sites, manage settings, scan navigation groups
- Key contexts of use: repeated daily use in varied ambient light

## Information architecture
- Primary navigation: new tab, settings, navigation hub
- Core routes/screens: `newtab.html`
- Content hierarchy: search first, shortcuts and recent content second, configuration last

## Design principles
- Keep large surfaces quiet; reserve color for focus, selection, and identity.
- Separate white and black icon carriers from every surrounding surface.
- Tradeoffs: visual calm takes priority over palette saturation.

## Visual language
- Color: four low-chroma surface families with one readable accent each
- Typography: existing type scale and weights
- Spacing/layout rhythm: existing layout tokens
- Shape/radius/elevation: existing component geometry
- Motion: existing transitions; no decorative motion
- Imagery/iconography: preserve the shared icon carrier algorithm

## Components
- Existing components to reuse: search panel, recent cards, settings groups, portal panel
- New/changed components: none
- Variants and states: light and dark for Wayleaf, Yuzu, Papaya, Denim
- Token/component ownership: palette tokens in `newtab.js`; component consumption in `newtab.css`

## Accessibility
- Target standard: WCAG AA for normal text
- Keyboard/focus behavior: preserve existing focus behavior
- Contrast/readability: primary text 7:1, secondary text 4.5:1, accent content 4.5:1
- Screen-reader semantics: preserve existing labels
- Reduced motion and sensory considerations: avoid high-chroma full-page surfaces

## Responsive behavior
- Supported breakpoints/devices: existing desktop and narrow layouts
- Layout adaptations: preserve current responsive rules
- Touch/hover differences: preserve current interaction states

## Interaction states
- Loading: existing behavior
- Empty: existing behavior
- Error: existing behavior
- Success: accent color only
- Disabled: muted tokens
- Offline/slow network: existing behavior

## Content voice
- Tone: direct and compact
- Terminology: Wayleaf, Yuzu, Papaya, Denim
- Microcopy rules: no explanatory theme marketing copy

## Implementation constraints
- Framework/styling system: native HTML, CSS, and JavaScript
- Design-token constraints: keep stored palette IDs stable
- Performance constraints: no new runtime work or dependencies
- Compatibility constraints: preserve icon rendering and carrier polarity
- Test/screenshot expectations: palette contrast and shared-surface ownership must stay covered

## Open questions
- None.
