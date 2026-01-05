
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Mic, MicOff, Volume2, Sparkles, X } from 'lucide-react';

// Fonctions d'aide recommandées par la documentation Google GenAI
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LiveCoach: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'active'>('idle');
  const [transcription, setTranscription] = useState('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    setStatus('connecting');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'Tu es Nümtema Coach. Aide l\'utilisateur à structurer son funnel LGM.'
        },
        callbacks: {
          onopen: () => {
            setStatus('active');
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000'
              };
              
              sessionPromiseRef.current?.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => stopSession(),
          onerror: () => stopSession()
        }
      });
      
      sessionPromiseRef.current = sessionPromise;
    } catch (e) {
      console.error(e);
      stopSession();
    }
  };

  const stopSession = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setIsActive(false);
    setStatus('idle');
  };

  return (
    <div className={`fixed bottom-8 right-8 z-50 transition-all ${isActive ? 'w-96' : 'w-20'}`}>
      {!isActive ? (
        <button onClick={startSession} className="w-20 h-20 bg-[#FF4D00] rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-105 transition-all">
          {status === 'connecting' ? <div className="animate-spin border-4 border-white/20 border-t-white w-8 h-8 rounded-full" /> : <Mic size={32} />}
        </button>
      ) : (
        <div className="bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[400px]">
          <div className="bg-[#FF4D00] p-4 text-white flex items-center justify-between">
            <span className="font-bold flex items-center gap-2"><Sparkles size={16}/> Nümtema Coach</span>
            <button onClick={stopSession}><X size={20}/></button>
          </div>
          <div className="flex-1 p-6 flex items-center justify-center">
             <div className="flex gap-1 items-end h-16">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-2 bg-orange-400 rounded-full animate-bounce" style={{ height: '50%', animationDelay: `${i * 0.1}s` }} />
                ))}
             </div>
          </div>
          <div className="p-4 bg-gray-50 border-t text-xs text-center text-gray-400">
             Coaching vocal en temps réel activé
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCoach;
