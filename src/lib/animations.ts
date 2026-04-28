import type { Variants } from 'framer-motion'

// Scroll reveal para cards — stagger 0.1s ao entrar na viewport
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

// Transição de página — opacity 0→1, 300ms
export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeInOut' },
  },
}

// Hero 360 — cada dígito entra em sequência
export const heroDigitVariants = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 32, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  },
})

// Dígitos: 3 → delay 0.2s | 6 → delay 0.4s | 0 → delay 0.6s
export const digit3 = heroDigitVariants(0.2)
export const digit6 = heroDigitVariants(0.4)
export const digit0 = heroDigitVariants(0.6)
