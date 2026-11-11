---
name: react-bits
description: Install and use React Bits animated React components (BlurText, SplitText, Magnet, Aurora, LiquidEther, CountUp, DecryptedText, GlitchText and 200+ more) through the shadcn CLI and registry. Use when the user says "react bits" or "reactbits", asks for animated text effects, WebGL or shader backgrounds, custom cursors, scroll animations, magnetic buttons, or wants to add motion to a React or Next.js page.
---

# React Bits

213 animated React components, distributed as a **shadcn registry** — not an npm package.
You install them with the shadcn CLI and the code lands in the repo to be owned and edited.

Registry endpoint: `https://reactbits.dev/r/{name}.json`

## The one thing to get right

React Bits has **no MCP server of its own**. The `shadcn` MCP server is what reads the
registry. If a user asks to "add the react-bits MCP", register `shadcn`, not `react-bits`:

```json
{
  "mcp": {
    "shadcn": {
      "type": "local",
      "command": ["npx", "shadcn@latest", "mcp"],
      "enabled": true
    }
  }
}
```

With the shadcn MCP connected you can browse and install from natural language
("add a magnet button to the pricing page"). Without it, use the CLI directly.

## Prerequisites

The registry only resolves if it is declared in the **project's** `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "registries": {
    "@react-bits": "https://reactbits.dev/r/{name}.json"
  }
}
```

If `components.json` is missing, run `npx shadcn@latest init` first, then merge the
`registries` block in without clobbering the existing keys. Never overwrite a user's
`tailwind`, `aliases` or `cssVariables` settings.

## Item naming

Every component ships in four variants, named `ComponentName-{JS|TS}-{CSS|TW}`:

| Segment  | Options     | Pick                                     |
| -------- | ----------- | ---------------------------------------- |
| Language | `JS`, `TS`  | `TS` — always, unless the project is JS  |
| Styling  | `CSS`, `TW` | `TW` for Tailwind projects, `CSS` otherwise |

**Default to `-TS-TW` for Tailwind v3/v4 projects.** Examples:

```
BlurText-TS-TW     SplitText-TS-TW     CountUp-TS-TW
Magnet-TS-TW       Aurora-TS-TW        LiquidEther-TS-TW
```

## Install

```bash
# single component
npx shadcn@latest add @react-bits/BlurText-TS-TW

# several at once
npx shadcn@latest add @react-bits/CountUp-TS-TW @react-bits/Magnet-TS-TW

# see what a component pulls in before installing
npx shadcn@latest view @react-bits/LiquidEther-TS-TW
```

The CLI writes the `.tsx` into the configured `aliases.components` path and installs npm
dependencies automatically. React Bits items generally have **no `registryDependencies`** —
they are self-contained, so do not expect a `cn()`/utils chain to be pulled in.

To search without the MCP, hit the registry index and grep it:

```bash
curl -s https://reactbits.dev/r/registry.json | grep -i "text"
```

**Never invent an item name.** The index has 852 entries (213 components × 4 variants).
Verify the exact slug with `shadcn view` or the index before running `add`.

## Heavy components

Some components pull large npm deps. Check with `shadcn view` first and tell the user:

| Family                                                | Dependency             | Note                            |
| ----------------------------------------------------- | ---------------------- | ------------------------------- |
| `LiquidEther`, `Threads`, `Galaxy`, `Cubes`, `Hyperspeed` | `three`                | WebGL, largest bundle hit       |
| `SplitText`, `ScrollReveal`, `WarpText`, `Shredder`  | `gsap`, `@gsap/react`  | GSAP free for standard use       |
| `Dither`, `DotGrid`, `Silk`, `Threads`                | `ogl` or `three`       | raw WebGL, no abstraction        |

Adding `three` to an already-large bundle needs the user's sign-off. Always run the
project's build afterwards and report the size delta.

## Non-negotiable guardrails

Every React Bits component is animation-first and assumes a modern GPU. Before shipping one:

1. **Respect `prefers-reduced-motion`.** Most components do not do this for you. Gate it at
   the call site with a media-query listener so it reacts to changes, not just initial value,
   and render a static fallback:

   ```tsx
   const reduced = usePrefersReducedMotion()
   return reduced ? <Static>{children}</Static> : <BlurText {...props}>{children}</BlurText>
   ```

2. **Keep animation off the critical path.** Text must be readable before JS hydrates.
   Prefer `BlurText`/`CountUp` *around* a real `<h1>`, never *instead of* it — SEO and
   screen readers need that heading to exist in the server-rendered HTML.

3. **Cursor-replacement components break accessibility.** `BlobCursor`, `GlowCursor`,
   `SplashCursor`, `GhostCursor`, `SwarmCursor`, `TargetCursor`, `ClickSpark`, `CursorGrid`
   hide the native cursor. That removes the pointer for keyboard and assistive-tech users.
   Apply them only above a desktop breakpoint, keep a visible fallback, and never on a page
   whose primary flow is a form or checkout.

4. **Decorative effects get `aria-hidden`.** Keep the real content adjacent and readable.

5. **Next.js:** these are client components. A file using `useState`, `useEffect`, `useRef`
   or `window` needs `'use client'` at the top.

6. **Verify contrast after the fact.** Glow and gradient text often fail WCAG AA. Check any
   `GradientText` / `ShinyText` / `StrokeText` against the background before shipping.

## Catalog

Verified names from the registry index. Pick from these — never guess a name outside the list.

**Text & typography**
ASCIIText, BlurText, CircularText, Counter, CountUp, DecryptedText, DepthText, EchoText,
FallingText, FaultyTerminal, FuzzyText, GlitchText, LetterGlitch, MaskedHeading, MorphSlider,
ParticleText, Particles, RotatingText, ScrambledText, ShinyText, SplitFlapText, SplitText,
StrokeText, TechText, TextCursor, TextLoop, TextPressure, TextType, VariableProximity, WarpText

**Content, cards & reveal**
AccordionGallery, AnimatedContent, AnimatedList, BounceCards, CardNav, CardSwap, Carousel,
CircularCarousel, CircularGallery, DecayCard, DepthCarousel, DomeGallery, FadeContent,
FlexCarousel, FlipCard, FlyingPosters, HalftoneReveal, Masonry, OrbitImages, PeekRating,
PixelCard, PixelSwap, ProfileCard, ReflectiveCard, ScrollExpand, ScrollFloat, ScrollReveal,
ScrollStack, SpotlightCard, Stack, StaggeredMenu, StarBorder, TiltedCard

**Navigation, menus & controls**
BranchedMenu, BubbleMenu, CometDial, CurvedInput, Dock, ElasticMesh, ElasticSlider,
FlowingMenu, FuseButton, GlideSelect, GooeyNav, HoldButton, JellyRadio, Magnet, OptionWheel,
PillNav, PromptBar, RubberSegment, Shuffle, SlingButton, SlideCommit, SpringCheck,
SquishSwitch, Stepper, SloshGauge, SwipeRow, SwipeToast, VoicePill, WakeSlider, WarmTooltip

**Cursors & pointer**
BlobCursor, ClickSpark, CursorGrid, DodgeField, EvilEye, GhostCursor, GlowCursor,
SplashCursor, SwarmCursor, TargetCursor

**Backgrounds, gradients & shaders**
AcidSquares, AeroShards, Aurora, Beams, ChromaGrid, ColorBends, CRTWarp, Cubes, DarkVeil,
Dither, DitherVeil, DotField, DotGrid, DriftWall, Ferrofluid, FloatingLines, Galaxy,
GradientBlinds, GradientWaves, Grainient, GridDistortion, GridMotion, GridScan, Hyperspeed,
Iridescence, LaserFlow, Lightfall, Lightning, LightPillar, LightRays, LightTunnel,
LiquidChrome, MagicRings, MetaBalls, MoltenMetal, Noise, Orb, PatternWaves, Plasma,
PlasmaWave, Prism, PrismaticBurst, RippleDistortion, RippleGrid, ShapeBlur, ShapeGrid,
ShapeWaves, SideRays, Silk, SlicedWaves, SoftAurora, Strands, Threads, Topography, Waves,
WebThreads

**Surfaces, glass & chrome**
BorderGlow, ElectricBorder, ElectricLogo, FluidGlass, GlareHover, GlassIcons, GlassSurface,
GradualBlur, LatticeLoader, MagnetLines, PaperCrumple, Scanner, StickerPeel

**Media & motion**
ImageTrail, Lanyard, LogoLoop, MagicBento, MicroSlats, ModelViewer, PixelBlast, PixelSnow,
PixelTrail, PixelTransition, Radar, Shredder, SplitFlapText, TearTicket, ThoughtLine, TrueFocus

**Gaming-relevant finds**
For a gaming or esports site specifically: `GlowCursor`, `ShinyText`, `GradientText`,
`GlitchText`, `BlurText`, `DecryptedText`, `LetterGlitch`, `CountUp`, `Magnet`, `SlingButton`,
`ElectricBorder`, `Aurora`, `GridScan`, `RippleGrid`, `DotGrid`, `Noise`, `Cubes`, `Galaxy`,
`Silk`, `LaserFlow`, `ChromaGrid`, `StaggeredMenu`, `InfiniteMenu`, `Dock`, `GlassSurface`,
`Scanner`. For a CRT / retro-terminal look, pair `GlitchText` with `Scanner`.

**Misc / experimental**
Antigravity, BellToggle, CallChip, CodeSlots, Crosshair, Folder, FolderFloat, FoldText,
ScrollVelocity