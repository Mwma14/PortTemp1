import React, { useState } from 'react';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
  className?: string;
  color?: 'cyan' | 'purple' | 'green';
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, as: Component = 'span', className = '', color = 'cyan' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const colors = {
    cyan: 'text-neon-cyan',
    purple: 'text-neon-purple',
    green: 'text-neon-green',
  };

  return (
    <Component
      className={`relative inline-block transition-colors duration-200 ${colors[color]} ${className} ${isHovered ? 'animate-glitch' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-text={text}
    >
      <span className={isHovered ? 'relative z-10' : ''}>{text}</span>
      {isHovered && (
        <>
          <span className="absolute top-0 left-0 -ml-[2px] text-red-500 opacity-70 animate-pulse">{text}</span>
          <span className="absolute top-0 left-0 ml-[2px] text-blue-500 opacity-70 animate-pulse">{text}</span>
        </>
      )}
    </Component>
  );
};

export default GlitchText;
