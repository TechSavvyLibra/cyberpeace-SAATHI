
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getGeminiClient, getLiveConfig } from '../services/geminiService';
import { decodeAudioData, decode, createBlob } from '../utils/audioUtils';
import Visualizer from './Visualizer';
import ComplaintModal from './ComplaintModal';
import { LiveServerMessage } from '@google/genai';
import { ComplaintData } from '../types';

interface VoiceChatProps {
  onBack: () => void;
}

// --- Global Singleton Manager to prevent double-connects ---
let activeSession: any = null;
let activeAudioContext: AudioContext | null = null;
let activeMicStream: MediaStream | null = null;
let currentSessionId = 0;

const VoiceChat: React.FC<VoiceChatProps> = ({ onBack }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [complaintData, setComplaintData] = useState<ComplaintData | null>(null);

  const mountedRef = useRef(true);
  const sessionIdRef = useRef(0);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const cleanupGlobals = async () => {
    console.log("[VoiceBot] Global cleanup triggered");
    if (activeSession) {
      console.log("[VoiceBot] Closing active global session");
      try { activeSession.close(); } catch (e) { }
      activeSession = null;
    }
    if (activeMicStream) {
      activeMicStream.getTracks().forEach(t => t.stop());
      activeMicStream = null;
    }
    // We keep the AudioContext alive but suspended to avoid re-creation issues
    if (activeAudioContext && activeAudioContext.state !== 'closed') {
      try { await activeAudioContext.suspend(); } catch (e) { }
    }
  };

  const stopAllAudio = useCallback(() => {
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) { }
    });
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  }, []);

  const startSession = async () => {
    const sid = ++currentSessionId;
    sessionIdRef.current = sid;

    console.log(`[VoiceBot] Starting session #${sid}`);
    setIsConnecting(true);
    setError(null);

    // 1. Kill any existing session immediately
    await cleanupGlobals();

    try {
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      activeMicStream = micStream;

      if (!mountedRef.current || sessionIdRef.current !== sid) {
        micStream.getTracks().forEach(t => t.stop());
        return;
      }

      if (!activeAudioContext || activeAudioContext.state === 'closed') {
        activeAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      const ctx = activeAudioContext;
      await ctx.resume();

      const ai = getGeminiClient();
      console.log(`[VoiceBot] #${sid} Connecting to Gemini...`);

      const session = await ai.live.connect({
        ...getLiveConfig(),
        callbacks: {
          onopen: () => {
            if (!mountedRef.current || sessionIdRef.current !== sid) return;
            console.log(`[VoiceBot] #${sid} Connected`);
            setIsConnected(true);
            setIsConnecting(false);

            const source = ctx.createMediaStreamSource(micStream);
            const scriptProcessor = ctx.createScriptProcessor(4096, 1, 1);

            scriptProcessor.onaudioprocess = (e) => {
              if (mountedRef.current && session && sessionIdRef.current === sid) {
                const inputData = e.inputBuffer.getChannelData(0);
                session.sendRealtimeInput({ media: createBlob(inputData) });
              }
            };

            source.connect(scriptProcessor);
            const silentGain = ctx.createGain();
            silentGain.gain.value = 0;
            scriptProcessor.connect(silentGain);
            silentGain.connect(ctx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (!mountedRef.current || sessionIdRef.current !== sid) return;

            console.log(`[VoiceBot] #${sid} Message received:`, message);

            if (message.toolCall) {
              console.log(`[VoiceBot] #${sid} Tool Call detected:`, message.toolCall);
              for (const fc of message.toolCall.functionCalls) {
                if (fc.name === 'triggerComplaintDialog') {
                  console.log(`[VoiceBot] #${sid} Triggering Modal with args:`, fc.args);
                  setComplaintData(fc.args as unknown as ComplaintData);
                  try {
                    console.log(`[VoiceBot] #${sid} Sending tool response for ${fc.id}`);
                    session.sendToolResponse({
                      functionResponses: [{ id: fc.id, name: fc.name, response: { result: "OK" } }]
                    });
                    console.log(`[VoiceBot] #${sid} Tool response sent.`);
                  } catch (toolErr) {
                    console.error(`[VoiceBot] #${sid} Error sending tool response:`, toolErr);
                  }
                }
              }
            }

            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              // Filter out the technical trigger so it doesn't show on screen
              const cleanText = text.replace(/\[COMPLAINT_TRIGGER:\s*{.*?}\]/g, '');
              setTranscription(prev => prev + cleanText);
            }

            const audioPart = message.serverContent?.modelTurn?.parts[0];
            const audioData = audioPart?.inlineData?.data;
            if (audioData) {
              setIsSpeaking(true);
              try {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.onended = () => {
                  sourcesRef.current.delete(source);
                  if (sourcesRef.current.size === 0) setIsSpeaking(false);
                };
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
              } catch (audioErr) {
                console.error(`[VoiceBot] #${sid} Audio decode/play error:`, audioErr);
              }
            }

            if (message.serverContent?.interrupted) {
              console.log(`[VoiceBot] #${sid} Model interrupted.`);
              stopAllAudio();
              setIsSpeaking(false);
            }

            if (message.serverContent?.turnComplete) {
              console.log(`[VoiceBot] #${sid} Turn complete.`);
              setTranscription('');
            }
          },
          onerror: (e) => {
            if (sessionIdRef.current !== sid) return;
            console.error(`[VoiceBot] #${sid} WebSocket ERROR:`, e);
            setError("Connection issue. Please check your internet or API key.");
            setIsConnecting(false);
            setIsConnected(false);
          },
          onclose: (reason) => {
            if (sessionIdRef.current !== sid) return;
            console.warn(`[VoiceBot] #${sid} WebSocket CLOSED. Reason:`, reason);
            setIsConnected(false);
            setIsConnecting(false);
          }
        }
      });

      if (!mountedRef.current || sessionIdRef.current !== sid) {
        session.close();
        return;
      }

      activeSession = session;
      console.log(`[VoiceBot] #${sid} Ready`);
    } catch (err: any) {
      if (sessionIdRef.current === sid) {
        console.error(`[VoiceBot] #${sid} Init failed:`, err);
        setError(err.message || "Failed to start.");
        setIsConnecting(false);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    startSession();
    return () => {
      console.log(`[VoiceBot] Unmounting session #${sessionIdRef.current}`);
      mountedRef.current = false;
      stopAllAudio();
      cleanupGlobals();
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50/50 to-white">
      {complaintData && (
        <ComplaintModal
          data={complaintData}
          onClose={() => setComplaintData(null)}
        />
      )}

      <div className="w-full max-w-2xl flex flex-col items-center">
        <button
          onClick={onBack}
          className="self-start mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <i className="fas fa-chevron-left"></i> Back to Home
        </button>

        <div className="relative w-full aspect-square max-w-md flex flex-col items-center justify-center bg-white rounded-full shadow-2xl border border-slate-100 mb-12">
          {error ? (
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-wifi-slash text-2xl"></i>
              </div>
              <p className="text-slate-900 font-bold mb-2">Connection Failed</p>
              <p className="text-slate-500 text-sm mb-6">{error}</p>
              <button
                onClick={startSession}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Reconnect Now
              </button>
            </div>
          ) : (
            <>
              <Visualizer isActive={isConnected} isModelSpeaking={isSpeaking} />
              <div className="absolute bottom-12 text-center w-full px-8">
                <div className={`text-sm font-black tracking-[0.2em] uppercase mb-2 ${isConnected ? 'text-blue-600' : 'text-slate-400'}`}>
                  {isConnecting ? (
                    <span>Initializing Link...</span>
                  ) : isConnected ? (
                    isSpeaking ? (
                      <span>Guardian Speaking</span>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className="block text-lg">Listening...</span>
                        <span className="block text-lg text-slate-500 lowercase normal-case font-bold opacity-80">You can talk to me in any language.</span>
                      </div>
                    )
                  ) : (
                    <span>System Offline</span>
                  )}
                </div>
                <div className="flex items-center justify-center gap-1.5 opacity-40">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-blue-600 animate-pulse' : 'bg-slate-200'}`} style={{ animationDelay: `${i * 200}ms` }}></div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-full text-center">
          <div className="min-h-[4rem] px-8 py-4 bg-white/80 rounded-3xl border border-slate-200 shadow-sm backdrop-blur-sm">
            {transcription ? (
              <p className="text-slate-800 font-medium text-lg leading-relaxed italic">"{transcription}"</p>
            ) : (
              <p className="text-slate-400 italic">"I've been scammed through a WhatsApp message..."</p>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              onClick={() => {
                stopAllAudio();
                onBack();
              }}
              className="w-16 h-16 bg-white text-red-500 rounded-full flex items-center justify-center hover:bg-red-50 transition-all border border-slate-200 shadow-md group"
              title="End Call"
            >
              <i className="fas fa-phone-slash text-xl group-hover:scale-110 transition-transform"></i>
            </button>
            <div className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-slate-200">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Encrypted Voice Tunnel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
