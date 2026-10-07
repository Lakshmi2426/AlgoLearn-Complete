import React from 'react';

interface ChatbotLogoProps {
  className?: string;
  size?: number | string;
  onClick?: () => void;
}

export const ChatbotLogo: React.FC<ChatbotLogoProps> = ({
  className = '',
  size = 56,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick();
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'ALGOLEARN_NAVIGATE', tab: 'ask-teacher' }, '*');
        window.parent.location.hash = '#ask-teacher';
        return;
      }
    } catch (err) {}
    window.location.href = '/#ask-teacher';
  };

  return (
    <button
      id="ai-bot-floating-button"
      type="button"
      onClick={handleClick}
      className={`rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 shadow-[0_8px_24px_-4px_rgba(37,99,235,0.5),0_0_16px_rgba(99,102,241,0.3)] hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer select-none group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${className}`}
      style={{ width: size, height: size }}
      aria-label="Ask a Teacher"
      title="Ask a Teacher — Get DSA help from an expert"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7 text-white"
      >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </svg>
    </button>
  );
};
