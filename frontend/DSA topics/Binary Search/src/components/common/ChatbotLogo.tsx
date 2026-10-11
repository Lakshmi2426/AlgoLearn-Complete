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
      aria-label="AlgoLearn AI Chatbot"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md group-hover:drop-shadow-xl transition-all duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Circular Diagonal Gradient (Royal Blue to Vibrant Purple) */}
          <linearGradient id="aiLogoGrad" x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="40%" stopColor="#4338CA" />
            <stop offset="75%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>
        </defs>

        {/* Outer Circular Gradient Badge */}
        <circle cx="50" cy="50" r="49" fill="url(#aiLogoGrad)" />

        {/* Centered White Chat Bubble Outline matching uploaded AI Logo */}
        <g transform="translate(23.5, 23.5) scale(2.2)">
          <path
            d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
};

