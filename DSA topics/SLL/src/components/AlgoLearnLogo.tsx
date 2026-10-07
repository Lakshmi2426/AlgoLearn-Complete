import React from 'react';

export interface AlgoLearnLogoProps {
  theme?: 'light' | 'dark';
  className?: string;
  onClick?: () => void;
}

export const AlgoLearnLogo: React.FC<AlgoLearnLogoProps> = ({
  theme = 'light',
  className = 'h-8 sm:h-9 w-auto',
  onClick,
}) => {
  const isDark = theme === 'dark';

  const handleLogoClick = (e: React.MouseEvent) => {
    if (onClick) onClick();
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'ALGOLEARN_NAVIGATE', tab: 'home' }, '*');
        window.parent.location.hash = '';
        return;
      }
    } catch (err) {}
    window.location.href = '/';
  };

  return (
    <div
      id="btn-logo-home"
      onClick={handleLogoClick}
      className={`inline-flex items-center select-none cursor-pointer transition-all duration-200 hover:opacity-95 shrink-0 ${className}`}
      title="AlgoLearn - YOUR DSA JOURNEY"
      aria-label="AlgoLearn Logo"
      role="button"
      tabIndex={0}
    >
      <img
        src={isDark ? '/algolearn-logo-dark.png' : '/algolearn-logo.png'}
        alt="AlgoLearn - YOUR DSA JOURNEY"
        className="h-8 sm:h-9 w-auto object-contain select-none pointer-events-none"
        draggable={false}
      />
    </div>
  );
};
