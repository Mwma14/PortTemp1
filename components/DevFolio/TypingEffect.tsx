import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
  cursorChar?: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ 
  text, 
  speed = 50, 
  delay = 0,
  className = '',
  onComplete,
  showCursor = true,
  cursorChar = '_'
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursorBlink, setShowCursorBlink] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const startTyping = () => {
      setIsTyping(true);
      let currentIndex = 0;

      const typeChar = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          timeout = setTimeout(typeChar, speed);
        } else {
          setIsTyping(false);
          onComplete?.();
        }
      };

      typeChar();
    };

    const delayTimeout = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(timeout);
      clearTimeout(delayTimeout);
    };
  }, [text, speed, delay, onComplete]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursorBlink(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <span 
          className={`text-neon-cyan ${showCursorBlink ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
};

export default TypingEffect;
