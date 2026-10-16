import React from 'react';

interface StatusToastProps {
  message: string | null;
  accentColor: string;
}

export const StatusToast: React.FC<StatusToastProps> = ({ message, accentColor }) => {
  if (!message) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 font-mono-metric text-xs px-3.5 py-2.5 rounded-[4px] bg-[#191918] text-[#FAF8F5] dark:bg-[#F7F8F8] dark:text-[#08090A] border shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{ borderColor: accentColor }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
      <span>{message}</span>
    </div>
  );
};
