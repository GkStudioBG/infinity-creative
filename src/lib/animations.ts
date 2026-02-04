import { Variants } from "framer-motion";

// Fade in animation for sections
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Stagger children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Scale up on hover (for buttons and cards)
export const scaleOnHover: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  tap: {
    scale: 0.98,
  },
};

// Slide animations for form steps
export const slideLeft: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

export const slideRight: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

// Progress bar fill animation
export const progressFill: Variants = {
  initial: { width: 0 },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

// Card entrance animation
export const cardEntrance: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Pulse animation (for countdown timer in last hour)
export const pulse: Variants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// File upload drag state animation
export const dragBorder: Variants = {
  initial: {
    borderStyle: "dashed",
    borderColor: "hsl(var(--border))",
  },
  drag: {
    borderColor: "hsl(var(--primary))",
    backgroundColor: "hsl(var(--primary) / 0.05)",
    transition: {
      duration: 0.2,
    },
  },
};

// Navbar item hover underline
export const navUnderline: Variants = {
  initial: { width: 0 },
  hover: {
    width: "100%",
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

// Icon rotation (for theme toggle, accordions, etc.)
export const iconRotate: Variants = {
  initial: { rotate: 0 },
  rotate: {
    rotate: 180,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

// Success checkmark animation
export const checkmark: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.5, ease: "easeOut" },
      opacity: { duration: 0.2 },
    },
  },
};

// Page transition
export const pageTransition: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

// Spring-based hover for interactive elements
export const springHover = {
  whileHover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  whileTap: {
    scale: 0.98,
  },
};

// Viewport trigger settings for scroll animations
export const viewportTrigger = {
  once: true,
  margin: "-50px",
};
