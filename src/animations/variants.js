/**
 * Reusable Framer Motion Animation Variants
 */

export const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: [0.7, 0, 0.84, 0],
    },
  },
};

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const fadeIn = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  hover: {
    y: -6,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

export const modalBackdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalContentVariants = {
  initial: { opacity: 0, scale: 0.94, y: 15 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 10,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export const heartPopVariants = {
  initial: { scale: 1 },
  tap: { scale: 0.75 },
  active: {
    scale: [1, 1.35, 1],
    transition: { duration: 0.35, ease: 'easeInOut' },
  },
};

export const seatVariants = {
  idle: { scale: 1 },
  selected: {
    scale: [1, 1.25, 1],
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  hover: { scale: 1.15 },
};

export const dropdownVariants = {
  initial: { opacity: 0, y: 10, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.95,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};
