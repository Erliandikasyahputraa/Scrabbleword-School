# Animation Patterns Knowledge Base

This document synthesizes micro-animations, transitions, and performance optimizations for interface animations.

## 1. Entrance Transitions (Blur Fade)
- **Concept**: Fade and scale components smoothly as they enter the viewport to make page loads feel natural.
- **Repositories Analyzed**: `magicui`
- **Implementation**:
  - Uses Framer Motion's `AnimatePresence` and `motion.div` wrappers to handle transition states.
  - Combines small offset shifts (e.g. `y: 6` to `y: 0`), opacity transitions (`0` to `1`), and blur filters (`blur(6px)` to `blur(0px)`) to create a smooth entrance.
  - Applying scroll-linked triggers (like `whileInView` hooks) ensures animations only run when components enter the viewport.

## 2. Interactive States & Micro-interactions
- **Concept**: Use subtle hover animations on cards and buttons to provide instant feedback to users.
- **Repositories Analyzed**: `magicui`, `shadcn-admin`
- **Application**:
  - **Bento Grid Cards**: Elevate cards slightly on hover, combining scale shifts (e.g., `scale-[1.01]`), transition durations (`duration-300`), and shadow transitions to make elements feel responsive.
  - **Active Sidebar Links**: Highlight active navigation links with smooth background slide-ins or border transitions.

## 3. Dynamic Visual Accents
- **Concept**: Draw attention to primary actions (e.g., "Submit Assignment") using subtle animated borders or gradients.
- **Repositories Analyzed**: `magicui`
- **Application**:
  - **Shimmer Button**: Uses rotating linear gradients as background elements, creating a subtle glowing sweep effect.
  - **Pulsating Button**: Adds soft glowing borders that pulse continuously using CSS keyframes, highlighting key actions without cluttering the screen.
