
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 md:px-12 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img
          src="https://cdn.prod.website-files.com/64b6853d6c8a2733e0348380/64d28d4c5130957a48d0e325_Logo.svg"
          alt="CyberPeace Logo"
          className="h-10 w-auto"
        />
        <div className="h-6 w-px bg-slate-300 mx-1"></div>
        <img
          src="/assets/google-logo.png"
          alt="Google Logo"
          className="h-6 w-auto opacity-90"
        />
        <div className="h-6 w-px bg-slate-300 mx-1"></div>
        <img
          src="/assets/libra-ai-tek-logo.png"
          alt="LibraAITek Logo"
          className="h-8 w-auto"
        />
      </div>

      <div className="hidden md:flex items-center gap-6">
        <a href="https://cyberpeace.org/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
          CyberPeace official website
        </a>
        <a href="https://cybercrime.gov.in/Webform/Accept.aspx#:~:text=Please%20contact%20local%20police%20in,Cyber%20Crime%20Helpline%20is%201930." target="_blank" rel="noopener noreferrer" className="text-sm font-medium px-4 py-2 bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors">
          Report CyberCrime / Cyber Crime Helpline - 1930
        </a>
      </div>
    </header>
  );
};

export default Header;
