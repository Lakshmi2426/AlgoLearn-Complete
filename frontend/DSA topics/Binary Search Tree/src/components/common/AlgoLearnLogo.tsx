import React from 'react';

export interface AlgoLearnLogoProps {
  theme?: 'light' | 'dark';
  isDark?: boolean;
  className?: string;
  imgClassName?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: string;
}

export const AlgoLearnLogo: React.FC<AlgoLearnLogoProps> = ({
  theme,
  isDark: isDarkProp,
  className = '',
  onClick,
}) => {
  const explicitTheme = theme || (isDarkProp !== undefined ? (isDarkProp ? 'dark' : 'light') : undefined);
  const isExplicitDark = explicitTheme === 'dark';
  const isExplicitLight = explicitTheme === 'light';

  const safeClassName = className.replace(/\b(w-auto|w-full|h-auto)\b/g, '').trim();

  return (
    <div
      id="algolearn-brand-logo"
      onClick={onClick}
      className={`relative h-9 w-[156px] shrink-0 inline-block select-none cursor-pointer transition-opacity hover:opacity-95 ${safeClassName}`}
      style={{
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        padding: 0,
        margin: 0,
      }}
      title="AlgoLearn - YOUR DSA JOURNEY"
      aria-label="AlgoLearn Logo"
    >
      {/* Light Mode Logo */}
      <img
        src="/logo-light.png"
        alt="AlgoLearn - YOUR DSA JOURNEY"
        className={`absolute inset-0 h-full w-full object-contain object-left select-none pointer-events-none ${
          isExplicitDark ? 'hidden' : isExplicitLight ? 'block' : 'block dark:hidden'
        }`}
        draggable={false}
      />

      {/* Dark Mode Logo */}
      <img
        src="/logo-dark.png"
        alt="AlgoLearn - YOUR DSA JOURNEY"
        className={`absolute max-w-none object-contain object-left select-none pointer-events-none ${
          isExplicitLight ? 'hidden' : isExplicitDark ? 'block' : 'hidden dark:block'
        }`}
        style={{
          width: '166.3px',
          height: '40.4px',
          left: '-8.6px',
          top: '-0.3px',
        }}
        draggable={false}
      />
    </div>
  );
};

export default AlgoLearnLogo;
