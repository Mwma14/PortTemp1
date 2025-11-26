import React from 'react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
}

const CyberButton: React.FC<CyberButtonProps> = ({ children, variant = 'primary', icon, className = '', ...props }) => {
  const baseStyles = "relative px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider transition-all duration-300 overflow-hidden";
  
  const variants = {
    primary: "bg-neon-cyan/10 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]",
    secondary: "bg-neon-purple/10 border border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white hover:shadow-[0_0_20px_rgba(188,19,254,0.5)]",
    outline: "border border-slate-700 text-slate-400 hover:border-white hover:text-white",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        {children}
      </span>
      <span className="absolute bottom-0 right-0 w-2 h-2 bg-current opacity-50" />
      <span className="absolute top-0 left-0 w-2 h-2 bg-current opacity-50" />
    </button>
  );
};

export default CyberButton;
