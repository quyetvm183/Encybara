// Animation classes that can be reused across components
export const animations = {
  // Fade transitions
  fade: {
    enter: 'transition-opacity duration-300 ease-in-out',
    enterFrom: 'opacity-0',
    enterTo: 'opacity-100',
    leave: 'transition-opacity duration-200 ease-in-out',
    leaveFrom: 'opacity-100',
    leaveTo: 'opacity-0',
  },

  // Scale transitions
  scale: {
    enter: 'transition-all duration-300 ease-out',
    enterFrom: 'transform scale-95 opacity-0',
    enterTo: 'transform scale-100 opacity-100',
    leave: 'transition-all duration-200 ease-in',
    leaveFrom: 'transform scale-100 opacity-100',
    leaveTo: 'transform scale-95 opacity-0',
  },

  // Slide transitions
  slideDown: {
    enter: 'transition-all duration-300 ease-out',
    enterFrom: 'transform -translate-y-2 opacity-0',
    enterTo: 'transform translate-y-0 opacity-100',
    leave: 'transition-all duration-200 ease-in',
    leaveFrom: 'transform translate-y-0 opacity-100',
    leaveTo: 'transform -translate-y-2 opacity-0',
  },

  slideUp: {
    enter: 'transition-all duration-300 ease-out',
    enterFrom: 'transform translate-y-2 opacity-0',
    enterTo: 'transform translate-y-0 opacity-100',
    leave: 'transition-all duration-200 ease-in',
    leaveFrom: 'transform translate-y-0 opacity-100',
    leaveTo: 'transform translate-y-2 opacity-0',
  },

  // Loading animations
  loading: {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
  },

  // State transitions
  state: {
    active: 'transition-colors duration-200',
    hover: 'transition-all duration-200',
    disabled: 'transition-opacity duration-200',
  }
};

// Common animation variants for components
export const variants = {
  // Button variants
  button: {
    initial: 'transform-gpu transition-all duration-200',
    hover: 'hover:scale-105',
    active: 'active:scale-95',
    disabled: 'opacity-50 cursor-not-allowed',
  },

  // Form field variants
  formField: {
    initial: 'transition-all duration-200',
    focus: 'focus:ring-2 focus:ring-offset-2',
    error: 'ring-2 ring-red-500',
    success: 'ring-2 ring-green-500',
  },

  // Modal/Dialog variants
  modal: {
    overlay: {
      enter: 'transition-opacity duration-300 ease-out',
      enterFrom: 'opacity-0',
      enterTo: 'opacity-100',
      leave: 'transition-opacity duration-200 ease-in',
      leaveFrom: 'opacity-100',
      leaveTo: 'opacity-0',
    },
    content: {
      enter: 'transition-all duration-300 ease-out',
      enterFrom: 'transform scale-95 opacity-0',
      enterTo: 'transform scale-100 opacity-100',
      leave: 'transition-all duration-200 ease-in',
      leaveFrom: 'transform scale-100 opacity-100',
      leaveTo: 'transform scale-95 opacity-0',
    },
  }
};

// Helper function to combine animation classes
export const combineAnimations = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};