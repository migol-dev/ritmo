export const THEME_TOKENS = {
  paper: {
    canvas: 'bg-[#FAF8F5] text-[#191918]',
    surfaceElevated: 'bg-[#F2EFE9]',
    surfaceHover: 'hover:bg-[#EAE6DF]',
    rowSelected: 'bg-[#F2EFE9]',
    hairline: 'border-[#E4E0D8]',
    hairlineDivider: 'divide-[#E4E0D8]',
    inkMuted: 'text-[#6E6A63]',
    accentPrimary: '#C86446',
    accentForest: '#2D4F3E',
    subtleStage: 'bg-[#F7F5F0]'
  },
  obsidian: {
    canvas: 'bg-[#08090A] text-[#F7F8F8]',
    surfaceElevated: 'bg-[#141416]',
    surfaceHover: 'hover:bg-[#1C1D21]',
    rowSelected: 'bg-[#1C1D21]',
    hairline: 'border-white/[0.08]',
    hairlineDivider: 'divide-white/[0.08]',
    inkMuted: 'text-[#8A8F98]',
    accentPrimary: '#FF4F00',
    accentForest: '#3B6E56',
    subtleStage: 'bg-[#0F1012]'
  }
} as const;

export const DISCIPLINES = ['Todas', 'Enfoque', 'Cuerpo', 'Mente', 'Descanso'] as const;
export const LENS_LIST = ['cadence', 'streaks', 'matrix28', 'chronotype'] as const;

export type ThemeTokens = (typeof THEME_TOKENS)['paper'];

