import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal } from 'lucide-react';

interface NavbarProps {
  onBack?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onBack }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'ABOUT', href: '#about' },
    { name: 'MODULES', href: '#services' },
    { name: 'PROJECTS', href: '#projects' },
    { name: 'COMMS', href: '#contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-white/5 ${
        scrolled ? 'bg-black/90 backdrop-blur-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Brand */}
        <div className="flex items-center gap-2 group cursor-pointer" onClick={onBack}>
          <Terminal className="text-neon-cyan w-6 h-6 group-hover:animate-pulse" />
          <span className="font-display font-bold text-xl tracking-widest text-white">
            PORTFOLIO<span className="text-neon-cyan">_DEV</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="font-mono text-sm text-slate-400 hover:text-neon-cyan transition-colors relative group"
            >
              <span className="absolute -left-3 opacity-0 group-hover:opacity-100 transition-opacity text-neon-cyan">[</span>
              {link.name}
              <span className="absolute -right-3 opacity-0 group-hover:opacity-100 transition-opacity text-neon-cyan">]</span>
            </a>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-neon-cyan"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 border-b border-neon-cyan/20 backdrop-blur-xl p-4 flex flex-col gap-4">
          {links.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="font-mono text-center py-3 text-slate-300 hover:text-neon-cyan"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
