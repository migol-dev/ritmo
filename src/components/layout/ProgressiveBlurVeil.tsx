import React from 'react';

interface ProgressiveBlurVeilProps {
  isVisible: boolean;
}

export const ProgressiveBlurVeil: React.FC<ProgressiveBlurVeilProps> = ({ isVisible }) => {
  return (
    <div
      className={`fixed inset-0 top-14 pointer-events-none z-20 transition-all duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backdropFilter: isVisible ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: isVisible ? 'blur(12px)' : 'none',
        maskImage: isVisible
          ? `radial-gradient(circle 900px at var(--mouse-x, 75vw) var(--mouse-y, 30px), rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, transparent 80%)`
          : undefined,
        WebkitMaskImage: isVisible
          ? `radial-gradient(circle 900px at var(--mouse-x, 75vw) var(--mouse-y, 30px), rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, transparent 80%)`
          : undefined,
        backgroundColor: isVisible ? 'rgba(0, 0, 0, 0.12)' : 'transparent'
      }}
    />
  );
};
