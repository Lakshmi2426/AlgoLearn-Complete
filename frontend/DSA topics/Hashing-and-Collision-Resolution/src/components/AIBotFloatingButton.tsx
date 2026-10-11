import React from 'react';

/**
 * Unified Floating Chat/Ask a Teacher Button (Referral Image 1)
 */
export const AIBotFloatingButton: React.FC = () => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
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
      aria-label="Ask a Teacher"
      title="Ask a Teacher — Get DSA help from an expert"
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 lg:bottom-6 lg:right-6 z-30 w-[56px] h-[56px] rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 shadow-[0_8px_24px_-4px_rgba(37,99,235,0.5),0_0_16px_rgba(99,102,241,0.3)] hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer select-none group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      onClick={handleClick}
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
