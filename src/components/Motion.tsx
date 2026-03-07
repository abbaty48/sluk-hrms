export { AnimatePresence } from "framer-motion";
import { motion, type Variants } from "framer-motion";
import { type ReactNode, type CSSProperties } from "react";

// ========================================
// TYPES & INTERFACES
// ========================================

// Animation variant types
export type AnimationVariant =
  | "fade"
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "scale"
  | "scaleUp"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "bounce"
  | "none";

// HTML element types that support motion
export type MotionElement = keyof typeof motion;

interface MotionProps {
  children: ReactNode;
  className?: string;
  variant?: AnimationVariant;
  element?: MotionElement;
  delay?: number;
  duration?: number;
  once?: boolean;
  viewport?: boolean;
  stagger?: number;
  custom?: Variants;
  onClick?: () => void;
  style?: CSSProperties;
}

// ========================================
// ANIMATION VARIANTS
// ========================================

const animations: Record<AnimationVariant, Variants> = {
  // No animation
  none: {},

  // Simple fade
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  // Fade with direction
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },

  fadeDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },

  fadeLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },

  fadeRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },

  // Scale animations
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },

  scaleUp: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },

  // Slide animations (no fade)
  slideUp: {
    initial: { y: 50 },
    animate: { y: 0 },
    exit: { y: 50 },
  },

  slideDown: {
    initial: { y: -50 },
    animate: { y: 0 },
    exit: { y: -50 },
  },

  slideLeft: {
    initial: { x: -50 },
    animate: { x: 0 },
    exit: { x: -50 },
  },

  slideRight: {
    initial: { x: 50 },
    animate: { x: 0 },
    exit: { x: 50 },
  },

  // Spring bounce
  bounce: {
    initial: { opacity: 0, y: -20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: { opacity: 0, y: -20 },
  },
};

// ========================================
// MAIN MOTION COMPONENT
// ========================================

/**
 * Motion Component - Animated wrapper using Framer Motion
 *
 * @param children - Child elements to animate
 * @param className - CSS classes
 * @param variant - Animation type (default: "fadeUp")
 * @param element - HTML element to render (default: "div")
 * @param delay - Animation delay in seconds (default: 0)
 * @param duration - Animation duration in seconds (default: 0.5)
 * @param once - Animate only once (default: true)
 * @param viewport - Trigger animation when in viewport (default: false)
 * @param stagger - Stagger children animations in seconds
 * @param custom - Custom animation variants (overrides preset)
 * @param onClick - Click handler
 * @param style - Inline styles
 *
 * @example
 * // Basic fade up animation
 * <Motion variant="fadeUp">Content</Motion>
 *
 * @example
 * // With custom delay and duration
 * <Motion variant="scale" delay={0.2} duration={0.8}>Content</Motion>
 *
 * @example
 * // Viewport animation
 * <Motion variant="fadeUp" viewport>Content</Motion>
 *
 * @example
 * // Custom animation
 * <Motion custom={{ initial: { x: -100 }, animate: { x: 0 } }}>
 *   Content
 * </Motion>
 */
export function Motion({
  children,
  className,
  variant = "fadeUp",
  element = "div",
  delay = 0,
  duration = 0.5,
  once = true,
  viewport = false,
  stagger,
  custom,
  onClick,
  style,
}: MotionProps) {
  const MotionComponent = motion[element] as any;
  const selectedVariant = custom || animations[variant];

  const transition = {
    duration,
    delay,
    ease: [0.25, 0.1, 0.25, 1], // Smooth easing curve
    ...(stagger && {
      staggerChildren: stagger,
      delayChildren: delay,
    }),
  };

  const viewportConfig = viewport
    ? {
        viewport: { once, amount: 0.3 },
        whileInView: "animate",
      }
    : {};

  return (
    <MotionComponent
      exit="exit"
      style={style}
      onClick={onClick}
      initial="initial"
      className={className}
      transition={transition}
      variants={selectedVariant}
      animate={viewport ? undefined : "animate"}
      {...viewportConfig}
    >
      {children}
    </MotionComponent>
  );
}

// ========================================
// STAGGER CONTAINER
// ========================================

/**
 * MotionStagger - Container for staggered list animations
 *
 * @example
 * <MotionStagger stagger={0.1}>
 *   <MotionItem>Item 1</MotionItem>
 *   <MotionItem>Item 2</MotionItem>
 *   <MotionItem>Item 3</MotionItem>
 * </MotionStagger>
 */
export function MotionStagger({
  children,
  className,
  element = "div",
  delay = 0,
  stagger = 0.1,
  viewport = false,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  element?: MotionElement;
  delay?: number;
  stagger?: number;
  viewport?: boolean;
  once?: boolean;
}) {
  const MotionComponent = motion[element] as any;

  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const viewportConfig = viewport
    ? {
        viewport: { once, amount: 0.1 },
        whileInView: "animate",
      }
    : {};

  return (
    <MotionComponent
      className={className}
      initial="initial"
      animate={viewport ? undefined : "animate"}
      variants={containerVariants}
      {...viewportConfig}
    >
      {children}
    </MotionComponent>
  );
}

// ========================================
// STAGGER ITEM
// ========================================

/**
 * MotionItem - Individual item for stagger animations
 * Use inside MotionStagger component
 *
 * @example
 * <MotionItem variant="fadeUp">Content</MotionItem>
 */
export function MotionItem({
  children,
  className,
  element = "div",
  variant = "fadeUp",
  onClick,
  style,
}: {
  children: ReactNode;
  className?: string;
  element?: MotionElement;
  variant?: AnimationVariant;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  const MotionComponent = motion[element] as any;

  return (
    <MotionComponent
      className={className}
      style={style}
      onClick={onClick}
      variants={animations[variant]}
    >
      {children}
    </MotionComponent>
  );
}

// ========================================
// PAGE TRANSITION
// ========================================

/**
 * MotionPage - Page transition wrapper
 * Use with AnimatePresence for route transitions
 *
 * @example
 * <AnimatePresence mode="wait">
 *   <MotionPage key={location.pathname}>
 *     <YourPageContent />
 *   </MotionPage>
 * </AnimatePresence>
 */
export function MotionPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
