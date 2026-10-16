import React from 'react';
import { ThemeMode } from '../../types/telemetry.types';

interface SpotlightBackgroundProps {
  theme: ThemeMode;
}

export const SpotlightBackground: React.FC<SpotlightBackgroundProps> = ({ theme }) => {
  const isDark = theme === 'obsidian';

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
      style={{
        background: isDark
          ? `radial-gradient(750px circle at var(--mouse-x, 50vw) var(--mouse-y, 30vh), rgba(255, 79, 0, 0.055), transparent 75%)`
          : `radial-gradient(750px circle at var(--mouse-x, 50vw) var(--mouse-y, 30vh), rgba(200, 100, 70, 0.055), transparent 75%)`
      }}
    />
  );
};
