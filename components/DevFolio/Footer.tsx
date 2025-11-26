import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 bg-black border-t border-slate-900 text-center font-mono text-xs text-slate-600">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} DEV PORTFOLIO. SYSTEM VERSION 1.0</p>
        <p className="mt-2">Built with React · Tailwind CSS · Next-Gen Web</p>
      </div>
    </footer>
  );
};

export default Footer;
