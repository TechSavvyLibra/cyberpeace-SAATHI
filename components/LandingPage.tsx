
import React, { useState } from 'react';
import ArchitectureModal from './ArchitectureModal';

interface LandingPageProps {
  onSelectVoice: () => void;
  onSelectText: () => void;
  onSelectDashboard: () => void;
}

const LANGUAGES = [
  { code: 'HI', label: 'Hindi', phrase: 'नमस्ते, मैं आपकी सहायता के लिए यहाँ हूँ।' },
  { code: 'KN', label: 'Kannada', phrase: 'ಸೈಬರ್ ಬೆದರಿಕೆಗಳಿಂದ ರಕ್ಷಿಸಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ.' },
  { code: 'TA', label: 'Tamil', phrase: 'சைபர் பாதுகாப்பிற்கு நாங்கள் உங்களுக்கு உதவுகிறோம்.' },
  { code: 'TE', label: 'Telugu', phrase: 'సైబర్ నేరాల నుండి మిమ్మల్ని రక్షించడానికి నేను ఇక్కడ ఉన్నాను.' },
  { code: 'MR', label: 'Marathi', phrase: 'सायबर धोक्यांपासून तुमचे रक्षण करण्यासाठी मी येथे आहे.' },
  { code: 'BN', label: 'Bengali', phrase: 'সাইবার অপরাধ থেকে আপনাকে রক্ষা করতে আমি আছি।' },
  { code: 'GU', label: 'Gujarati', phrase: 'સાયબર સુરક્ષા માટે હું તમારી સાથે છું.' },
  { code: 'ML', label: 'Malayalam', phrase: 'സൈബർ സുരക്ഷയ്ക്കായി ഞാൻ ഇവിടെയുണ്ട്.' },
];

const LandingPage: React.FC<LandingPageProps> = ({ onSelectVoice, onSelectText, onSelectDashboard }) => {
  const [showArchModal, setShowArchModal] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-5xl mx-auto w-full relative">
      {showArchModal && <ArchitectureModal onClose={() => setShowArchModal(false)} />}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={onSelectDashboard}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all shadow-lg active:scale-95 group"
        >
          <i className="fas fa-chart-line text-blue-400 group-hover:rotate-12 transition-transform"></i>
          <span className="font-semibold text-xs">Analytics Dashboard</span>
        </button>
      </div>
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
          <i className="fas fa-language"></i> Multilingual Support Active
        </div>
        <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-2 tracking-tight">
          CyberPeace <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">SAATHI</span>
        </h2>
        <p className="text-sm md:text-base font-semibold text-slate-500 mb-6 uppercase tracking-[0.2em]">
          <span className="text-blue-600 font-extrabold">S</span>ecure <span className="text-blue-600 font-extrabold">A</span>gentic <span className="text-blue-600 font-extrabold">A</span>I for <span className="text-blue-600 font-extrabold">T</span>hreat <span className="text-blue-600 font-extrabold">H</span>andling & <span className="text-blue-600 font-extrabold">I</span>ntelligence
        </p>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Combat cybercrime threats with our advanced Agentic AI assistant. Talk or Chat in <b>English, हिन्दी, ಕನ್ನಡ, தமிழ், తెలుగు, मराठी, বাংলা, ગુજરાતી, മലയാളം or any Indian language.</b>
        </p>

        {/* Multilingual Ticker Section */}
        <div className="relative w-full overflow-hidden mb-12 py-4">
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10"></div>

          <div className="flex whitespace-nowrap animate-scroll">
            {[...LANGUAGES, ...LANGUAGES].map((lang, idx) => (
              <div
                key={idx}
                className="inline-flex items-center mx-4 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm gap-3 group hover:border-blue-300 transition-colors"
              >
                <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">{lang.code}</span>
                <span className="text-sm font-medium text-slate-700">{lang.phrase}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Showcase Section */}
      <div className="w-full max-w-5xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-slate-800">Advanced Capabilities</h3>
          <p className="text-slate-500 mt-2">Empowering you with AI-driven cyber protection</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 max-w-2xl mx-auto text-left">
          {[
            { icon: 'fa-check-circle', title: 'Complaint Registration', color: 'text-blue-600' },
            { icon: 'fa-check-circle', title: 'Track Complaint', color: 'text-teal-600' },
            { icon: 'fa-check-circle', title: 'Trending Scam News', color: 'text-indigo-600' },
            { icon: 'fa-check-circle', title: 'Scam Analyzer Tool', color: 'text-purple-600' },
            { icon: 'fa-check-circle', title: 'Digital Peace Guardrails', color: 'text-cyan-600' }
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3 py-1">
              <i className={`fas ${feature.icon} ${feature.color} text-lg`}></i>
              <span className="text-base font-semibold text-slate-700">{feature.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        <button
          onClick={onSelectVoice}
          className="group relative bg-orange-500 p-8 rounded-3xl border border-orange-400 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <i className="fas fa-microphone text-9xl text-white"></i>
          </div>
          <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform backdrop-blur-sm">
            <i className="fas fa-microphone-lines text-2xl"></i>
          </div>
          <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Voice SAATHI</h3>
          <p className="text-orange-50 mb-6 font-medium leading-relaxed">Talk naturally in your native language. Our AI detects and responds in the same tongue instantly.</p>
          <div className="flex items-center text-white font-bold gap-2">
            Start Talking <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </div>
        </button>

        <button
          onClick={onSelectText}
          className="group relative bg-green-600 p-8 rounded-3xl border border-green-500 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <i className="fas fa-message text-9xl text-white"></i>
          </div>
          <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform backdrop-blur-sm">
            <i className="fas fa-comment-dots text-2xl"></i>
          </div>
          <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Chat SAATHI</h3>
          <p className="text-green-50 mb-6 font-medium leading-relaxed">Interactive text chat with Google Search grounding for verified helpline numbers and data. You can chat in your native language.</p>
          <div className="flex items-center text-white font-bold gap-2">
            Open Chat <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </div>
        </button>
      </div>

      {/* New Action Buttons Section */}
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl active:scale-95 group"
        >
          <i className="fas fa-code-branch text-blue-400 group-hover:rotate-12 transition-transform"></i>
          <span className="font-semibold text-sm">Source Code & Repository</span>
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowArchModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-95 group"
        >
          <i className="fas fa-sitemap text-white group-hover:rotate-12 transition-transform"></i>
          <span className="font-semibold text-sm">Architecture Documentation</span>
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl active:scale-95 group"
        >
          <i className="fas fa-circle-play text-red-500 group-hover:scale-110 transition-transform"></i>
          <span className="font-semibold text-sm">Working Demo Video</span>
        </a>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          width: fit-content;
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="mt-16 text-slate-400 text-sm flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2">
          <i className="fas fa-earth-asia"></i>
          <span>Supports any Indian language</span>
        </div>
        <span className="hidden md:block w-1 h-1 bg-slate-300 rounded-full"></span>
        <a href="https://cyberpeace.org" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">By CyberPeace Foundation</a>
      </div>
    </div>
  );
};

export default LandingPage;
