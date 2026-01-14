
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import VoiceChat from './components/VoiceChat';
import TextChat from './components/TextChat';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { BotMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<BotMode>(BotMode.IDLE);

  const renderContent = () => {
    switch (mode) {
      case BotMode.VOICE:
        return <VoiceChat onBack={() => setMode(BotMode.IDLE)} />;
      case BotMode.TEXT:
        return <TextChat onBack={() => setMode(BotMode.IDLE)} />;
      case BotMode.DASHBOARD:
        return <Dashboard onBack={() => setMode(BotMode.IDLE)} />;
      default:
        return (
          <LandingPage
            onSelectVoice={() => setMode(BotMode.VOICE)}
            onSelectText={() => setMode(BotMode.TEXT)}
            onSelectDashboard={() => setMode(BotMode.DASHBOARD)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {renderContent()}
      </main>

      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-300 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-200 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
};

export default App;
