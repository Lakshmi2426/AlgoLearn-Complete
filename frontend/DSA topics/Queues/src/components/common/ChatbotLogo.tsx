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
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer group ${className}`}
      style={{ width: size, height: size }}
      role="button"
      aria-label="AlgoLearn AI Assistant"
    >
      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-0.5">
        <img
          src="/ai-assistant-icon.jpg.jpeg"
          alt="AI Assistant"
          className="w-full h-full object-cover scale-[1.23] select-none pointer-events-none rounded-full"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    </div>
  );
};


