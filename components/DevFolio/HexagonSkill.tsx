import React from 'react';

interface HexagonSkillProps {
  name: string;
  level: number;
  icon?: string;
  color?: 'cyan' | 'purple' | 'green';
}

const HexagonSkill: React.FC<HexagonSkillProps> = ({ name, level, icon, color = 'cyan' }) => {
  const colors = {
    cyan: {
      border: 'border-neon-cyan',
      bg: 'bg-neon-cyan/10',
      text: 'text-neon-cyan',
      glow: 'shadow-neon-cyan',
    },
    purple: {
      border: 'border-neon-purple',
      bg: 'bg-neon-purple/10',
      text: 'text-neon-purple',
      glow: 'shadow-neon-purple',
    },
    green: {
      border: 'border-neon-green',
      bg: 'bg-neon-green/10',
      text: 'text-neon-green',
      glow: 'shadow-neon-green',
    },
  };

  const c = colors[color];

  return (
    <div className="group relative">
      <div 
        className={`hexagon w-24 h-28 ${c.bg} ${c.border} border flex items-center justify-center 
          transition-all duration-300 group-hover:scale-110 group-hover:${c.glow}`}
      >
        <div className="text-center">
          {icon && <span className="text-2xl mb-1 block">{icon}</span>}
          <span className={`text-xs font-mono ${c.text} font-bold`}>{level}%</span>
        </div>
      </div>
      <p className={`text-center mt-2 text-xs font-mono text-slate-400 group-hover:${c.text} transition-colors`}>
        {name}
      </p>
    </div>
  );
};

export default HexagonSkill;
