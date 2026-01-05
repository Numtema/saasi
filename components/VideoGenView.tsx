
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Play, Sparkles, Loader2, Download, Wand2, Film, RefreshCcw } from 'lucide-react';
import AIStudioKeyGate from './AIStudioKeyGate';

const VideoGenView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'polling'>('idle');
  const [progress, setProgress] = useState(0);

  const generateVideo = async () => {
    setStatus('generating');
    setProgress(10);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    try {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Cinematic commercial for a high-end AI software, professional lighting, corporate aesthetics, ${prompt}`,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      setStatus('polling');
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
        setProgress(prev => Math.min(prev + 5, 95));
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      const finalRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await finalRes.blob();
      setVideoUrl(URL.createObjectURL(blob));
      setStatus('idle');
      setProgress(100);
    } catch (e) {
      console.error(e);
      setStatus('idle');
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-[28px] font-bold text-gray-900">Studio Veo Video</h2>
        <p className="text-gray-500">Générez des clips marketing cinématiques pour vos funnels en quelques secondes.</p>
      </header>

      <AIStudioKeyGate onKeySelected={() => {}}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Votre Prompt Visuel</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Décrivez la scène que vous voulez créer (ex: Un entrepreneur qui sourit en regardant ses statistiques sur un écran holographique...)"
                className="w-full h-40 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all text-[15px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">Résolution</span>
                  <span className="font-bold">1080p HD</span>
               </div>
               <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">Ratio</span>
                  <span className="font-bold">16:9 Landscape</span>
               </div>
            </div>

            <button 
              onClick={generateVideo}
              disabled={status !== 'idle' || !prompt}
              className="w-full py-4 bg-[#FF4D00] text-white font-bold rounded-2xl shadow-xl shadow-orange-100 flex items-center justify-center gap-3 hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              {status === 'idle' ? (
                <><Sparkles size={20} /> Générer la Vidéo</>
              ) : (
                <><Loader2 size={20} className="animate-spin" /> Création en cours... {progress}%</>
              )}
            </button>
          </div>

          <div className="bg-black rounded-[32px] aspect-video relative overflow-hidden flex items-center justify-center shadow-2xl border-4 border-white">
            {videoUrl ? (
              <>
                <video src={videoUrl} controls className="w-full h-full object-cover" />
                <button 
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-3 rounded-xl text-white hover:bg-white/40 transition-all"
                  onClick={() => setVideoUrl(null)}
                >
                  <RefreshCcw size={20} />
                </button>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto text-white/30">
                  <Film size={32} />
                </div>
                <p className="text-white/40 font-medium text-sm">L'aperçu de votre vidéo apparaîtra ici</p>
              </div>
            )}
            
            {status !== 'idle' && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-12 text-center text-white space-y-6">
                <div className="w-full max-w-xs space-y-2">
                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-orange-500">
                      <span>Rendu Veo Engine</span>
                      <span>{progress}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                   </div>
                </div>
                <p className="text-sm font-medium animate-pulse">L'IA de Google Veo façonne vos pixels...</p>
              </div>
            )}
          </div>
        </div>
      </AIStudioKeyGate>
    </div>
  );
};

export default VideoGenView;
