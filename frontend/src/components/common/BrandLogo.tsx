import React from 'react';
import logoLight from '../../assets/images/logo-light.png';
import logoDark from '../../assets/images/logo-dark.png';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
}) => {
  // Strip out any w-auto or h-auto that would collapse a relative container with absolute children
  const safeClassName = className.replace(/\b(w-auto|w-full|h-auto)\b/g, '').trim();

  return (
    <div
      className={`relative h-9 w-[156px] shrink-0 inline-block select-none ${safeClassName}`}
      style={{
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        padding: 0,
        margin: 0,
      }}
    >
      {/* Light Mode Logo */}
      <img
        src={logoLight}
        alt="AlgoLearn - YOUR DSA JOURNEY"
        className="absolute inset-0 h-full w-full object-contain object-left select-none pointer-events-none block dark:hidden"
        draggable={false}
      />

      {/* Dark Mode Logo - normalized for 1:1 visual match with light mode logo */}
      <img
        src={logoDark}
        alt="AlgoLearn - YOUR DSA JOURNEY"
        className="absolute max-w-none object-contain object-left select-none pointer-events-none hidden dark:block"
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

export default BrandLogo;