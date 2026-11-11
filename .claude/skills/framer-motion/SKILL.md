---
name: framer-motion
description: "Framer Motion animation expert. Patterns: page transitions, scroll animations, gestures, layout animations, shared layout, variants, orchestration, exit animations. Components: motion, AnimatePresence, useAnimation, useInView, useScroll, useTransform, useSpring, useVelocity, Reorder, LayoutGroup. Integrates with React, Next.js, Vue, Svelte."
---
# Framer Motion - Animation Intelligence

Comprehensive animation guide for React and web applications. Contains animation patterns, gesture systems, scroll-driven animations, layout transitions, and performance optimization.

## When to Apply

Reference these guidelines when:
- Adding animations to React/Next.js components
- Creating page transitions or route animations
- Implementing scroll-triggered animations
- Building interactive gestures (drag, hover, tap)
- Creating staggered or orchestrated animations
- Implementing layout animations and shared element transitions
- Optimizing animation performance

---

## Core Concepts

### 1. Motion Components

```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Basic motion component
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {content}
</motion.div>
```

### 2. Animation Props Reference

| Prop | Purpose | Example |
|------|---------|---------|
| `initial` | Starting state | `{ opacity: 0, scale: 0.9 }` |
| `animate` | Target state | `{ opacity: 1, scale: 1 }` |
| `exit` | Unmount state | `{ opacity: 0, scale: 0.9 }` |
| `transition` | Animation config | `{ duration: 0.3, ease: "easeOut" }` |
| `whileHover` | Hover state | `{ scale: 1.05 }` |
| `whileTap` | Tap/click state | `{ scale: 0.95 }` |
| `whileInView` | Scroll in view | `{ opacity: 1, y: 0 }` |
| `whileFocus` | Focus state | `{ scale: 1.02 }` |
| `drag` | Enable drag | `true` or `"x"` or `"y"` |
| `layout` | Layout animation | `true` |
| `variants` | Variant system | `itemVariants` |

### 3. Transition Types

```jsx
// Spring (natural, recommended)
transition={{ type: "spring", stiffness: 300, damping: 30 }}

// Tween (precise timing)
transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}

// Keyframes (multi-step)
transition={{ type: "keyframes", times: [0, 0.5, 1] }}

// Inertia (momentum-based for drag)
transition={{ type: "inertia", velocity: 100 }}

// Duration with delay
transition={{ duration: 0.5, delay: 0.1 }}
```

### 4. Easing Functions

| Ease | Value | Use Case |
|------|-------|----------|
| `easeOut` | `[0, 0, 0.2, 1]` | Elements entering |
| `easeIn` | `[0.4, 0, 1, 1]` | Elements exiting |
| `easeInOut` | `[0.4, 0, 0.2, 1]` | Elements moving |
| `circOut` | `[0, 0.55, 0.45, 1]` | Smooth deceleration |
| `backOut` | `[0.34, 1.56, 0.64, 1]` | Playful overshoot |
| Custom bezier | `[0.68, -0.55, 0.265, 1.55]` | Custom feel |

---

## Animation Patterns

### 1. Fade In Up (Most Common)

```jsx
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.4, ease: "easeOut" }
};

<motion.div {...fadeInUp}>Content</motion.div>
```

### 2. Staggered Children

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.ul
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map((item, i) => (
    <motion.li key={i} variants={itemVariants}>
      {item}
    </motion.li>
  ))}
</motion.ul>
```

### 3. Scale on Hover

```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>
```

### 4. Card Hover Effect

```jsx
<motion.div
  className="card"
  whileHover={{
    y: -5,
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
  }}
  transition={{ duration: 0.2 }}
>
  Card content
</motion.div>
```

### 5. Page Transitions (AnimatePresence)

```jsx
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          {/* routes */}
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
```

### 6. Exit Animation

```jsx
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      Modal content
    </motion.div>
  )}
</AnimatePresence>
```

---

## Scroll Animations

### 1. WhileInView (Simple)

```jsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.5 }}
>
  Appears when scrolled into view
</motion.div>
```

### 2. useInView Hook

```jsx
import { useRef } from 'react';
import { useInView } from 'framer-motion';

function Component() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref}>
      <motion.div
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 0.5 }}
      >
        Content
      </motion.div>
    </div>
  );
}
```

### 3. useScroll Hook

```jsx
import { useScroll, useTransform } from 'framer-motion';

function ParallaxSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.div style={{ y, opacity }}>
      Parallax content
    </motion.div>
  );
}
```

### 4. Scroll-linked Animation

```jsx
import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

function ScrollProgress() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref}>
      <motion.div style={{ width }} className="progress-bar" />
    </div>
  );
}
```

### 5. Parallax Sections

```jsx
function ParallaxHero() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <motion.div style={{ y, scale }} className="hero">
      <h1>Hero Title</h1>
    </motion.div>
  );
}
```

---

## Gesture Animations

### 1. Drag

```jsx
<motion.div
  drag
  dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
  dragElastic={0.1}
  whileDrag={{ scale: 1.05, cursor: "grabbing" }}
>
  Drag me
</motion.div>
```

### 2. Drag to Reorder

```jsx
import { Reorder } from 'framer-motion';

function List() {
  const [items, setItems] = useState(['A', 'B', 'C']);

  return (
    <Reorder.Group axis="y" values={items} onReorder={setItems}>
      {items.map((item) => (
        <Reorder.Item key={item} value={item}>
          {item}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
```

### 3. Hover Variants

```jsx
const cardVariants = {
  rest: { scale: 1, rotateY: 0 },
  hover: { scale: 1.02, rotateY: 5 }
};

<motion.div
  variants={cardVariants}
  initial="rest"
  whileHover="hover"
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
>
  3D hover card
</motion.div>
```

---

## Layout Animations

### 1. Layout Prop (Auto)

```jsx
<motion.div layout>
  {items.map(item => (
    <motion.div key={item.id} layout>
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

### 2. Shared Layout Animation

```jsx
import { LayoutGroup } from 'framer-motion';

function App() {
  const [selected, setSelected] = useState(null);

  return (
    <LayoutGroup>
      {items.map(item => (
        <motion.div
          key={item.id}
          layoutId={`card-${item.id}`}
          onClick={() => setSelected(item)}
        >
          {item.title}
        </motion.div>
      ))}

      <AnimatePresence>
        {selected && (
          <motion.div
            layoutId={`card-${selected.id}`}
            className="modal"
            onClick={() => setSelected(null)}
          >
            {selected.content}
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
```

### 3. Layout Transition Config

```jsx
<motion.div
  layout
  transition={{
    layout: { type: "spring", stiffness: 300, damping: 30 }
  }}
>
  Smooth layout animation
</motion.div>
```

---

## Advanced Patterns

### 1. Stagger with Delay per Item

```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Use for grid layouts
<motion.div
  variants={container}
  initial="hidden"
  animate="show"
  className="grid"
>
  {items.map((item, i) => (
    <motion.div key={i} variants={item}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

### 2. Chain Animations with Delay

```jsx
<motion.div
  initial={{ opacity: 0, x: -50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 0 }}
/>
<motion.div
  initial={{ opacity: 0, x: -50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
/>
```

### 3. useAnimation Controls

```jsx
import { useAnimation } from 'framer-motion';

function ControlledAnimation() {
  const controls = useAnimation();

  const sequence = async () => {
    await controls.start({ opacity: 1, x: 0 });
    await controls.start({ scale: 1.2 });
    await controls.start({ scale: 1 });
  };

  return (
    <motion.div
      animate={controls}
      initial={{ opacity: 0, x: -50 }}
      onAnimationComplete={sequence}
    />
  );
}
```

### 4. Keyframe Animation

```jsx
<motion.div
  animate={{
    x: [0, 100, 50, 150],
    opacity: [0, 1, 0.5, 1]
  }}
  transition={{
    duration: 2,
    times: [0, 0.3, 0.6, 1],
    ease: "easeInOut"
  }}
/>
```

---

## Spring Physics

### Recommended Values

| Preset | Stiffness | Damping | Use Case |
|--------|-----------|---------|----------|
| Snappy | 500 | 30 | Quick, responsive |
| Default | 300 | 30 | General purpose |
| Gentle | 200 | 20 | Smooth, elegant |
| Slow | 100 | 20 | Subtle, calm |
| Bouncy | 400 | 10 | Playful, fun |
| Stiff | 400 | 40 | Precise, mechanical |

### Custom Spring

```jsx
transition={{
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1
}}
```

---

## Performance Optimization

### 1. Use Transform and Opacity

```jsx
// Good - GPU accelerated
<motion.div
  animate={{ x: 100, opacity: 0.5 }}
/>

// Bad - Causes layout reflow
<motion.div
  animate={{ width: 100, height: 100 }}
/>
```

### 2. Use `will-change` for Complex Animations

```jsx
<motion.div style={{ willChange: "transform" }}>
  Complex animation
</motion.div>
```

### 3. Limit Animated Properties

```jsx
// Animate only what changes
<motion.div
  animate={{
    opacity: isVisible ? 1 : 0,
    // Don't animate color, background, etc. if possible
  }}
/>
```

### 4. Use `layout` for Position Changes

```jsx
// Good - handles position automatically
<motion.div layout>{items.map(...)}</motion.div>

// Bad - manual calculation
<motion.div
  animate={{ x: newIndex * 100, y: newIndex * 50 }}
/>
```

### 5. Reduced Motion Support

```jsx
import { useReducedMotion } from 'framer-motion';

function SafeAnimation() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
    >
      Respects user preference
    </motion.div>
  );
}
```

---

## Hooks Reference

| Hook | Purpose | Returns |
|------|---------|---------|
| `useAnimation` | Manual control | Controls object |
| `useInView` | Intersection observer | boolean |
| `useScroll` | Scroll position | scrollY, scrollYProgress |
| `useTransform` | Map values | MotionValue |
| `useSpring` | Spring physics | MotionValue |
| `useVelocity` | Track velocity | MotionValue |
| `useMotionValue` | Create value | MotionValue |
| `useReducedMotion` | Check preference | boolean |

---

## Common Patterns & Examples

### Loading Skeleton

```jsx
<motion.div
  animate={{
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "linear"
  }}
  style={{
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%"
  }}
/>
```

### Tooltip Animation

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.9, y: 10 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.9, y: 10 }}
  transition={{ type: "spring", stiffness: 500, damping: 30 }}
>
  Tooltip content
</motion.div>
```

### Accordion

```jsx
import { motion, AnimatePresence } from 'framer-motion';

function Accordion({ isOpen, children }) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ overflow: "hidden" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### Animated Menu

```jsx
const menuVariants = {
  closed: { opacity: 0, x: "100%" },
  open: { opacity: 1, x: 0 }
};

const navVariants = {
  open: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

const linkVariants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: 20 }
};

<motion.nav
  variants={menuVariants}
  initial="closed"
  animate={isOpen ? "open" : "closed"}
>
  <motion.ul variants={navVariants}>
    {links.map((link, i) => (
      <motion.li key={i} variants={linkVariants}>
        <a href={link.href}>{link.text}</a>
      </motion.li>
    ))}
  </motion.ul>
</motion.nav>
```

---

## Best Practices

| Do | Don't |
|----|-------|
| Use spring for natural feel | Use duration for everything |
| Animate transform/opacity | Animate width/height/margin |
| Respect prefers-reduced-motion | Force animations on all users |
| Keep animations under 500ms | Create unnecessarily long animations |
| Use AnimatePresence for exits | Remove elements without exit animation |
| Use layout for repositioning | Manually calculate positions |
| Stagger children for lists | Animate all items simultaneously |
| Use whileInView for scroll | Animate on mount only |

---

## Quick Reference

### Minimal Setup

```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Hello World
</motion.div>
```

### Common Imports

```jsx
import {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  Reorder,
  LayoutGroup
} from 'framer-motion';
```

---

## Installation

```bash
# npm
npm install framer-motion

# yarn
yarn add framer-motion

# pnpm
pnpm add framer-motion
```

## Peer Dependencies

- `react` >= 18
- `react-dom` >= 18
