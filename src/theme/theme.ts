// IFAS Premium Design System Tokens

export const colors = {
  // Brand
  ink: '#0F172A',        // Deep Slate Night - headers, dark cards, dark text
  blue: '#2563EB',       // Vivid Royal Blue - primary CTAs, active focus
  blueDeep: '#1E40AF',   // Rich Sapphire - pressed states, dark accents
  blueTint: '#EFF6FF',   // Soft Ice Wash - active item selection
  blueTintStrong: '#DBEAFE', // Border accent for active states

  // Warm Accents (Light Orange & Amber)
  orange: '#F97316',      // Vivid Light Orange - energetic CTAs & badges
  orangeDeep: '#EA580C',  // Deep Warm Orange
  orangeTint: '#FFEDD5',  // Soft Peach Wash - light orange background
  orangeBorder: '#FED7AA',

  white: '#FFFFFF',
  paper: '#F8FAFC',      // Soft Slate Porcelain - background
  surface: '#FFFFFF',

  border: '#E2E8F0',     // Subtle slate border
  borderStrong: '#CBD5E1',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // Semantic
  correct: '#059669',
  correctBg: '#ECFDF5',
  correctBorder: '#A7F3D0',
  wrong: '#DC2626',
  wrongBg: '#FEF2F2',
  wrongBorder: '#FECACA',
  neutral: '#64748B',
  neutralBg: '#F1F5F9',
  neutralBorder: '#E2E8F0',
  warn: '#F97316',
  warnBg: '#FFEDD5',

  overlay: 'rgba(15, 23, 42, 0.65)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
  h1: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.4 },
  h2: { fontSize: 18, fontWeight: '700' as const, letterSpacing: -0.2 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyStrong: { fontSize: 15, fontWeight: '600' as const },
  caption: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.3 },
  mono: { fontSize: 15, fontWeight: '700' as const, letterSpacing: 0.5 },
} as const;

export const shadow = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  raised: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;
