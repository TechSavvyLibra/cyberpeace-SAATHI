
import React, { useState, useRef, useEffect } from 'react';
import { createChatSession } from '../services/geminiService';
import { Message, ComplaintData } from '../types';
import ComplaintModal from './ComplaintModal';
import { parse } from 'marked';

interface TextChatProps {
  onBack: () => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', greeting: 'Hello, I am your CyberPeace Guardian. You can ask me about recent cyber news, reported scams, or how to stay safe online. How can I help you today?' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', greeting: 'नमस्ते, मैं आपका साइबरपीस गार्जियन हूँ। आप मुझसे हालिया साइबर समाचारों, रिपोर्ट किए गए घोटालों या ऑनलाइन सुरक्षित रहने के तरीके के बारे में पूछ सकते हैं। मैं आज आपकी कैसे मदद कर सकता हूँ?' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', greeting: 'ನಮಸ್ಕಾರ, ನಾನು ನಿಮ್ಮ ಸೈಬರ್ ಪೀಸ್ ಗಾರ್ಡಿಯನ್. ಇತ್ತೀಚಿನ ಸೈಬರ್ ಸುದ್ದಿಗಳು, ವರದಿಯಾದ ಹಗರಣಗಳು ಅಥವಾ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿರುವುದು ಹೇಗೆ ಎಂಬುದರ ಕುರಿತು ನೀವು ನನ್ನನ್ನು ಕೇಳಬಹುದು. ನಾನು ಇಂದು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', greeting: 'வணக்கம், நான் உங்கள் சைபர்பீஸ் கார்டியன். சமீபத்திய சைபர் செய்திகள், புகாரளிக்கப்பட்ட மோசடிகள் அல்லது ஆன்லைனில் பாதுகாப்பாக இருப்பது எப்படி என்பது பற்றி நீங்கள் என்னிடம் கேட்கலாம். நான் இன்று உங்களுக்கு எப்படி உதவ முடியும்?' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', greeting: 'నమస్కారం, నేను మీ సైబర్‌పీస్ గార్డియన్. మీరు ఇటీవలి సైబర్ వార్తలు, రిపోర్ట్ చేయబడిన స్కామ్‌లు లేదా ఆన్‌లైన్‌లో సురక్షితంగా ఎలా ఉండాలో నన్ను అడగవచ్చు. నేను మీకు ఈరోజు ఎలా సహాయపడగలను?' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', greeting: 'नमस्कार, मी तुमचा सायबरपीस गार्डियन आहे. तुम्ही मला अलीकडील सायबर बातम्या, नोंदवलेले घोटाळे किंवा ऑनलाइन सुरक्षित कसे राहायचे याबद्दल विचारू शकता. मी तुम्हाला आज कशी मदत करू शकतो?' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', greeting: 'নমস্কার, আমি আপনার সাইবারপিস গার্ডিয়ান। আপনি আমাকে সাম্প্রতিক সাইবার সংবাদ, রিপোর্ট করা কেলেঙ্কারি বা কীভাবে অনলাইনে নিরাপদ থাকবেন সে সম্পর্কে জিজ্ঞাসা করতে পারেন। আমি আজ আপনাকে কীভাবে সাহায্য করতে পারি?' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', greeting: 'નમસ્તે, હું તમારો સાયબરપીસ ગાર્ડિયન છું. તમે મને તાજેતરના સાયબર સમાચારો, નોંધાયેલા કૌભાંડો અથવા ઓનલાઇન સુરક્ષિત કેવી રીતે રહેવું તે વિશે પૂછી શકો છો. હું આજે તમને કેવી રીતે મદદ કરી શકું?' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', greeting: 'നമസ്കാരം, ഞാൻ നിങ്ങളുടെ സൈബർപീസ് ഗാർഡിയൻ ആണ്. സമീപകാല സൈബർ വാർത്തകളെക്കുറിച്ചോ റിപ്പോർട്ട് ചെയ്ത തട്ടിപ്പുകളെക്കുറിച്ചോ ഓൺലൈനിൽ സുരക്ഷിതമായിരിക്കുന്നത് എങ്ങനെയെന്നോ നിങ്ങൾക്ക് എന്നോട് ചോദിക്കാം. എനിക്ക് ഇന്ന് നിങ്ങളെ എങ്ങനെ സഹായിക്കാനാകും?' }
];

const TextChat: React.FC<TextChatProps> = ({ onBack }) => {
  const [selectedLang, setSelectedLang] = useState<typeof LANGUAGES[0] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [complaintData, setComplaintData] = useState<ComplaintData | null>(null);
  const chatSessionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleLanguageSelect = (lang: typeof LANGUAGES[0]) => {
    setSelectedLang(lang);
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: lang.greeting,
        timestamp: new Date()
      }
    ]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping || !selectedLang) return;

    // Ensure session is created right before first use
    if (!chatSessionRef.current) {
      chatSessionRef.current = createChatSession(selectedLang.name);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await chatSessionRef.current.sendMessage({ message: inputValue });

      let responseText = response.text || '';

      // Handle the text-based complaint trigger
      const triggerRegex = /\[COMPLAINT_TRIGGER:\s*({.*?})\]/s;
      const match = responseText.match(triggerRegex);
      if (match) {
        try {
          const data = JSON.parse(match[1]);
          setComplaintData(data as ComplaintData);
          responseText = responseText.replace(triggerRegex, '').trim();
        } catch (e) {
          console.error("Failed to parse complaint data from text:", e);
        }
      }

      // Extract Google Search grounding chunks
      const sources: { uri: string; title: string }[] = [];
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      if (groundingMetadata?.groundingChunks) {
        groundingMetadata.groundingChunks.forEach((chunk: any) => {
          if (chunk.web) {
            sources.push({ uri: chunk.web.uri, title: chunk.web.title });
          }
        });
      }

      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || 'I have analyzed your request.',
        timestamp: new Date(),
        sources: sources.length > 0 ? sources : undefined
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'Sorry, I encountered an issue. This might be due to a network interruption. Please try your message again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMarkdown = (text: string) => {
    const html = parse(text, { breaks: true, gfm: true }) as string;
    return { __html: html };
  };

  if (!selectedLang) {
    return (
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6 h-full items-center justify-center">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Choose Your Language</h2>
          <p className="text-slate-600">Select a language to start your consultation with CyberPeace Guardian</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang)}
              className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-400 hover:scale-105 transition-all group flex flex-col items-center gap-2"
            >
              <span className="text-2xl font-bold text-slate-800 group-hover:text-blue-600">{lang.native}</span>
              <span className="text-sm text-slate-500 uppercase tracking-widest font-medium">{lang.name}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onBack}
          className="mt-12 text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-2 font-medium"
        >
          <i className="fas fa-arrow-left"></i> Cancel and go back
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 h-full overflow-hidden">
      {complaintData && (
        <ComplaintModal
          data={complaintData}
          onClose={() => setComplaintData(null)}
        />
      )}

      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
            <i className="fas fa-arrow-left"></i> Back
          </button>
          <div className="h-4 w-px bg-slate-200"></div>
          <span className="text-sm font-semibold text-slate-700">{selectedLang.native} ({selectedLang.name})</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-blue-100">
          <i className="fas fa-magnifying-glass text-[8px]"></i> Powered by Google Grounded Search
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 px-2 mb-4 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-start gap-2 max-w-[85%]">
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm border border-blue-200">
                  <i className="fas fa-user-tie text-sm"></i>
                </div>
              )}
              <div className={`p-4 rounded-3xl shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                }`}>
                {msg.role === 'model' ? (
                  <div
                    className="markdown-content text-[15px] leading-relaxed"
                    dangerouslySetInnerHTML={renderMarkdown(msg.text)}
                  />
                ) : (
                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{msg.text}</p>
                )}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[9px] font-extrabold text-slate-400 mb-2 uppercase tracking-tighter">Verified References</p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((s, i) => (
                        <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="text-[10px] bg-slate-50 text-blue-600 border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all flex items-center gap-1.5">
                          <i className="fas fa-external-link-alt text-[8px]"></i> {s.title || 'Source'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <span className="text-[9px] text-slate-400 mt-1 px-1">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start px-2">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-2 flex items-center shadow-2xl shadow-slate-200 transition-all focus-within:ring-2 focus-within:ring-blue-100">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Type in ${selectedLang.name}...`}
          className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2.5 text-slate-700"
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isTyping}
          className={`w-11 h-11 rounded-xl transition-all flex items-center justify-center ${inputValue.trim() && !isTyping ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' : 'bg-slate-100 text-slate-300'
            }`}
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default TextChat;
