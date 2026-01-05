
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { funnelService } from '@/services/funnelService';
import { QuizConfig, StepType } from '@/types/funnel';
import { WelcomeScreen } from '@/components/player/WelcomeScreen';
import { QuestionScreen } from '@/components/player/QuestionScreen';
import { MessageScreen } from '@/components/player/MessageScreen';
import { LeadCaptureScreen } from '@/components/player/LeadCaptureScreen';
import { CalendarEmbedScreen } from '@/components/player/CalendarEmbedScreen';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function FunnelPlayer() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [funnelId, setFunnelId] = useState('');
  const [currentStepId, setCurrentStepId] = useState('');
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (shareToken) loadFunnel();
  }, [shareToken]);

  const loadFunnel = async () => {
    try {
      const funnel = await funnelService.getByShareToken(shareToken!);
      setFunnelId(funnel.id);
      setConfig(funnel.config);
      if (funnel.config.steps.length > 0) {
        setCurrentStepId(funnel.config.steps[0].id);
      }
    } catch (error) {
      toast({ title: 'Erreur', description: 'Funnel introuvable', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = (answer?: any) => {
    if (!config) return;
    const currentIndex = config.steps.findIndex(s => s.id === currentStepId);
    
    if (answer) {
      setAnswers(prev => ({ ...prev, [currentStepId]: answer }));
      if (answer.score) setScore(prev => prev + answer.score);
    }

    if (currentIndex < config.steps.length - 1) {
      setCurrentStepId(config.steps[currentIndex + 1].id);
    } else {
      toast({ title: 'Terminé !', description: 'Merci pour vos réponses.' });
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>;
  if (!config) return <div className="h-screen flex items-center justify-center">Funnel non disponible.</div>;

  const currentStep = config.steps.find(s => s.id === currentStepId);
  if (!currentStep) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: config.theme.colors.background }}>
      <div className="w-full max-w-2xl animate-fade-in-up">
        {currentStep.type === StepType.Welcome && <WelcomeScreen step={currentStep} theme={config.theme} onNext={() => handleNext()} />}
        {currentStep.type === StepType.Question && <QuestionScreen step={currentStep} theme={config.theme} onNext={handleNext} />}
        {currentStep.type === StepType.Message && <MessageScreen step={currentStep} theme={config.theme} onNext={() => handleNext()} />}
        {currentStep.type === StepType.LeadCapture && (
          <LeadCaptureScreen 
            step={currentStep} 
            theme={config.theme} 
            funnelId={funnelId} 
            answers={answers} 
            score={score} 
            onNext={handleNext} 
          />
        )}
        {currentStep.type === StepType.CalendarEmbed && <CalendarEmbedScreen step={currentStep} theme={config.theme} onNext={() => handleNext()} />}
      </div>
    </div>
  );
}
