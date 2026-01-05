
import { useState } from 'react';
import { QuizStep } from '@/types/funnel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Link as LinkIcon, Image as ImageIcon, Film, Loader2 } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '@/lib/youtube';

interface MediaTabProps {
  step: QuizStep;
  onUpdate: (step: QuizStep) => void;
}

export function MediaTab({ step, onUpdate }: MediaTabProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async (type: 'image' | 'video') => {
    if (!prompt.trim()) {
      toast({ title: 'Erreur', description: 'Veuillez décrire le média à générer', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    try {
      if (type === 'image') {
        const url = await aiService.generateImage(prompt);
        onUpdate({ ...step, media: { type: 'image', url } });
      } else {
        const url = await aiService.generateVideo(prompt, setAiStatus);
        onUpdate({ ...step, media: { type: 'video', url } });
      }
      toast({ title: 'Succès', description: `${type === 'image' ? 'Image' : 'Vidéo'} générée avec succès.` });
    } catch (error: any) {
      toast({ title: 'Erreur IA', description: error.message, variant: 'destructive' });
    } finally {
      setIsGenerating(false);
      setAiStatus("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Type de média</Label>
        <Select value={step.media.type} onValueChange={(val: any) => onUpdate({...step, media: {...step.media, type: val}})}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucun</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Vidéo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {step.media.type !== 'none' && (
        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="ai"><Sparkles className="w-4 h-4 mr-2" /> Générer IA</TabsTrigger>
            <TabsTrigger value="link"><LinkIcon className="w-4 h-4 mr-2" /> Lien externe</TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Description pour l'IA</Label>
              <Textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="Ex: Un entrepreneur souriant dans un bureau moderne avec une lumière cinématographique..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => handleGenerate('image')} disabled={isGenerating} variant="outline">
                {isGenerating ? <Loader2 className="animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
                Générer Image
              </Button>
              <Button onClick={() => handleGenerate('video')} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="animate-spin" /> : <Film className="mr-2 h-4 w-4" />}
                Générer Vidéo
              </Button>
            </div>
            {aiStatus && <p className="text-xs text-center text-primary animate-pulse">{aiStatus}</p>}
          </TabsContent>

          <TabsContent value="link" className="space-y-4 mt-4">
            <Label>URL du média</Label>
            <Input 
              value={step.media.url} 
              onChange={(e) => onUpdate({...step, media: {...step.media, url: e.target.value}})} 
              placeholder="https://..."
            />
          </TabsContent>
        </Tabs>
      )}

      {step.media.url && (
        <div className="border rounded-xl overflow-hidden aspect-video bg-black flex items-center justify-center">
          {step.media.type === 'image' ? (
            <img src={step.media.url} className="w-full h-full object-cover" alt="Preview" />
          ) : (
            <video src={step.media.url} controls className="w-full h-full object-cover" />
          )}
        </div>
      )}
    </div>
  );
}
