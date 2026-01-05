
import React, { useState } from 'react';
import { FunnelStep, StepType } from '../types';
import { ArrowRight, ChevronLeft, Volume2, VolumeX, MessageCircle, Send } from 'lucide-react';

interface FunnelPreviewProps {
  steps: FunnelStep[];
  onClose: () => void;
}

const FunnelPreview: React.FC<FunnelPreviewProps> = ({ steps, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  
  if (!steps || steps.length === 0) return null;
  
  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  if (!currentStep) return null;

  const mediaType = currentStep.media?.type || 'none';
  const mediaUrl = currentStep.media?.url || '';

  return (
    <div className="w-full h-full flex flex-col md:flex-row relative bg-black">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {mediaType === 'video' && mediaUrl ? (
          <div className="relative w-full h-full">
            <video 
              src={mediaUrl} 
              autoPlay 
              loop 
              muted={isMuted} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
          </div>
        ) : mediaType === 'image' && mediaUrl ? (
          <div className="relative w-full h-full">
            <img src={mediaUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black"></div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-8 md:p-20">
        <div className="max-w-2xl w-full animate-fade-in space-y-8">
           <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
                {currentStep.title}
              </h2>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-md">
                {currentStep.description}
              </p>
           </div>

           <div className="pt-10">
              {currentStep.type === StepType.LeadCapture ? (
                <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[32px] border border-white/20 space-y-4 max-w-sm mx-auto shadow-2xl">
                   <input type="text" placeholder="Prénom" className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:outline-none" />
                   <input type="email" placeholder="Email professionnel" className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:outline-none" />
                   <button onClick={handleNext} className="w-full py-4 bg-[#FF4D00] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-orange-900/40">
                      Recevoir l'accès <Send size={20}/>
                   </button>
                </div>
              ) : (
                <button 
                  onClick={handleNext}
                  className="group px-10 py-5 bg-white text-black font-black text-xl rounded-full flex items-center gap-4 mx-auto hover:scale-105 transition-all shadow-2xl hover:bg-[#FF4D00] hover:text-white"
                >
                  {currentStep.buttonText}
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </button>
              )}
           </div>
        </div>
      </div>

      {/* Overlay Controls */}
      <div className="absolute bottom-8 left-8 z-20 flex items-center gap-4">
        {currentStepIndex > 0 && (
          <button 
            onClick={handleBack}
            className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="flex gap-2">
           {steps.map((_, idx) => (
             <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentStepIndex ? 'w-8 bg-[#FF4D00]' : 'w-2 bg-white/30'}`}
             ></div>
           ))}
        </div>
      </div>

      <div className="absolute top-8 right-8 z-20 flex items-center gap-4">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest">
           <MessageCircle size={14}/> Preview Mode
        </div>
      </div>
    </div>
  );
};

export default FunnelPreview;
