
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { funnelService } from '@/services/funnelService';
import { aiService } from '@/services/aiService';
import { QuizConfig, QuizStep } from '@/types/funnel';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Loader2, Wand2, Check, ChevronRight, ChevronLeft, Save, RefreshCw } from 'lucide-react';

interface AIFunnelGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AIFunnelGenerator = ({ open, onOpenChange }: AIFunnelGeneratorProps) => {
  const [step, setStep] = useState<'prompt' | 'generating' | 'preview'>('prompt');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [generatedConfig, setGeneratedConfig] = useState<QuizConfig | null>(null);
  const [funnelName, setFunnelName] = useState('');
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setStep('generating');
    setProgress(10);
    
    try {
      const config = await aiService.generateFunnel(prompt);
      setProgress(100);
      setGeneratedConfig(config);
      setFunnelName(`Funnel - ${new Date().toLocaleDateString()}`);
      setTimeout(() => setStep('preview'), 500);
    } catch (error: any) {
      toast.error("Échec de la génération: " + error.message);
      setStep('prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedConfig) return;
    setLoading(true);
    try {
      const funnel = await funnelService.create({
        name: funnelName,
        description: prompt.substring(0, 150),
        config: generatedConfig
      });
      toast.success("Funnel créé avec succès !");
      onOpenChange(false);
      navigate(`/funnels/${funnel.id}/edit`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="text-primary" /> Générateur de Funnel IA
          </DialogTitle>
        </DialogHeader>

        {step === 'prompt' && (
          <div className="space-y-4">
            <Label>Décrivez votre projet de funnel</Label>
            <Textarea 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Un funnel pour vendre un programme de fitness avec un quiz de diagnostic..."
              className="h-40"
            />
            <Button onClick={handleGenerate} className="w-full" disabled={!prompt.trim()}>
              Générer la stratégie <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 'generating' && (
          <div className="py-12 text-center space-y-6">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <h3 className="text-xl font-bold">L'IA élabore votre funnel...</h3>
            <Progress value={progress} className="max-w-md mx-auto" />
          </div>
        )}

        {step === 'preview' && generatedConfig && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nom du funnel</Label>
                <Input value={funnelName} onChange={(e) => setFunnelName(e.target.value)} />
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={() => setStep('prompt')} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" /> Recommencer
                </Button>
              </div>
            </div>
            <ScrollArea className="h-64 border rounded-xl p-4">
              {generatedConfig.steps.map((s, i) => (
                <div key={i} className="mb-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs font-bold text-primary uppercase">{s.type}</p>
                  <p className="font-bold">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </div>
              ))}
            </ScrollArea>
            <Button onClick={handleSave} className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Finaliser et Créer le Funnel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AIFunnelGenerator;
