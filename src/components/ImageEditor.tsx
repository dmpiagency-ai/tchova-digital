import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAICredits } from '@/contexts/AICreditsContext';
import {
  Upload,
  Download,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Crop,
  Wand2,
  Users,
  Smartphone,
  Palette,
  Sparkles,
  Image as ImageIcon,
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface EditedImage {
  id: string;
  original: string;
  edited: string;
  name: string;
  status: 'processing' | 'completed' | 'error';
  enhancements: string[];
}

interface ImageEditorProps {
  onClose: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ onClose }) => {
  const { credits, deductCredits } = useAICredits();
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [editedImages, setEditedImages] = useState<EditedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<EditedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configurações de edição
  const [enhancementPrompt, setEnhancementPrompt] = useState('');
  const [targetAudience, setTargetAudience] = useState('jovens-negros');
  const [style, setStyle] = useState('moderno');

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setUploadedImages(prev => [...prev, ...files]);
    }
  }, []);

  const handleImageEdit = async (image: File, enhancements: string[]) => {
    if (credits.balance < 50) {
      alert('Créditos insuficientes! Você precisa de pelo menos 50 MZN.');
      return;
    }

    setIsProcessing(true);
    const imageId = Date.now().toString();

    // Simular processamento de IA
    const editedImage: EditedImage = {
      id: imageId,
      original: URL.createObjectURL(image),
      edited: URL.createObjectURL(image), // Em produção, seria a imagem processada pela IA
      name: image.name,
      status: 'processing',
      enhancements
    };

    setEditedImages(prev => [...prev, editedImage]);

    // Simular delay de processamento
    setTimeout(() => {
      setEditedImages(prev =>
        prev.map(img =>
          img.id === imageId
            ? { ...img, status: 'completed' as const }
            : img
        )
      );
      deductCredits(50, 'image-editor', `Processamento de imagem: ${image.name}`);
      setIsProcessing(false);
    }, 3000);
  };

  const handleBulkProcess = async () => {
    if (uploadedImages.length === 0) return;

    const cost = uploadedImages.length * 50;
    if (credits.balance < cost) {
      alert(`Créditos insuficientes! Você precisa de ${cost} MZN.`);
      return;
    }

    setIsProcessing(true);

    for (const image of uploadedImages) {
      await handleImageEdit(image, [
        `Otimizar para ${targetAudience}`,
        `Estilo ${style}`,
        enhancementPrompt || 'Melhorar qualidade geral'
      ]);
    }

    setIsProcessing(false);
    setActiveTab('results');
  };

  const downloadImage = (image: EditedImage) => {
    const link = document.createElement('a');
    link.href = image.edited;
    link.download = `editado_${image.name}`;
    link.click();
  };

  const removeImage = (imageId: string) => {
    setEditedImages(prev => prev.filter(img => img.id !== imageId));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">
            Editor de Imagens IA
          </h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          Aprimore suas imagens de vendas com IA. Substitua elementos, melhore qualidade e crie versões otimizadas para WhatsApp.
        </p>

        {/* Saldo de Créditos */}
        <Card className="max-w-sm mx-auto">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Créditos IA:</span>
              </div>
              <Badge variant="secondary">{credits.balance} MZN</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              50 MZN por imagem processada
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Perfeito para anúncios, catálogos e status do WhatsApp
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 text-xs h-8"
              onClick={() => window.open('https://wa.me/258879097249?text=Ol%C3%A1%2C+gostaria+de+ver+exemplos+de+edi%C3%A7%C3%A3o+de+imagens+com+IA', '_blank')}
            >
              VER EXEMPLOS
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Editor Principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="upload" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
            <Upload className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Upload</span>
          </TabsTrigger>
          <TabsTrigger value="enhance" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
            <Wand2 className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Aprimorar</span>
          </TabsTrigger>
          <TabsTrigger value="bulk" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
            <Users className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Em Massa</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
            <CheckCircle className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Resultados</span>
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Upload className="w-5 h-5 mr-2" />
                Upload de Imagens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed border-primary/30 rounded-lg p-6 sm:p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-primary/60" />
                <p className="text-sm sm:text-base text-muted-foreground mb-2">
                  Clique para selecionar imagens ou arraste aqui
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, JPEG até 10MB cada
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                aria-label="Selecionar imagens para upload"
              />

              {uploadedImages.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Imagens Selecionadas ({uploadedImages.length})</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {uploadedImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-20 sm:h-24 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-xs mt-1 truncate">{file.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhance Tab */}
        <TabsContent value="enhance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Wand2 className="w-5 h-5 mr-2" />
                Aprimoramento com IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="audience">Público-Alvo</Label>
                  <select
                    id="audience"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                    aria-label="Selecionar público-alvo"
                  >
                    <option value="jovens-negros">Jovens Negros</option>
                    <option value="mulheres">Mulheres</option>
                    <option value="homens">Homens</option>
                    <option value="familias">Famílias</option>
                    <option value="empresas">Empresas</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="style">Estilo Visual</Label>
                  <select
                    id="style"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                    aria-label="Selecionar estilo visual"
                  >
                    <option value="moderno">Moderno</option>
                    <option value="elegante">Elegante</option>
                    <option value="casual">Casual</option>
                    <option value="profissional">Profissional</option>
                    <option value="criativo">Criativo</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="prompt">Instruções Específicas (Opcional)</Label>
                <Textarea
                  id="prompt"
                  placeholder="Ex: Substitua a pessoa na imagem por uma mulher negra jovem sorrindo, mantenha o fundo da loja..."
                  value={enhancementPrompt}
                  onChange={(e) => setEnhancementPrompt(e.target.value)}
                  className="min-h-20"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  💡 Exemplos de Uso:
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• "Substitua a modelo por uma mulher negra jovem"</li>
                  <li>• "Melhore a iluminação e adicione brilho aos produtos"</li>
                  <li>• "Mude o fundo para uma loja moderna"</li>
                  <li>• "Ajuste as cores para combinar com nossa identidade"</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Processing Tab */}
        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Users className="w-5 h-5 mr-2" />
                Processamento em Massa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-semibold text-green-800 dark:text-green-200">
                    {uploadedImages.length} imagens prontas para processamento
                  </span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Custo total: {uploadedImages.length * 50} MZN ({uploadedImages.length} × 50 MZN)
                </p>
              </div>

              <Button
                onClick={handleBulkProcess}
                disabled={uploadedImages.length === 0 || isProcessing}
                className="w-full h-12"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processando {uploadedImages.length} imagens...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Processar Todas as Imagens
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {editedImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm sm:text-base truncate">{image.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    {image.status === 'processing' && (
                      <Badge variant="secondary" className="text-xs">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Processando
                      </Badge>
                    )}
                    {image.status === 'completed' && (
                      <Badge variant="default" className="text-xs bg-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Concluído
                      </Badge>
                    )}
                    {image.status === 'error' && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Erro
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={image.edited}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      <strong>Melhorias aplicadas:</strong>
                      <ul className="mt-1 space-y-1">
                        {image.enhancements.map((enhancement, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-1 h-1 bg-primary rounded-full mr-2 flex-shrink-0" />
                            {enhancement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => downloadImage(image)}
                      disabled={image.status !== 'completed'}
                      className="flex-1 h-8 text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Baixar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeImage(image.id)}
                      className="h-8 px-2"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {editedImages.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Nenhuma imagem processada ainda. Faça upload e aprimore suas imagens!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de Preview */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedImage?.name}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Original</h4>
                  <img
                    src={selectedImage.original}
                    alt="Original"
                    className="w-full rounded-lg border"
                  />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Editado</h4>
                  <img
                    src={selectedImage.edited}
                    alt="Editado"
                    className="w-full rounded-lg border"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedImage(null)}>
                  Fechar
                </Button>
                <Button onClick={() => downloadImage(selectedImage)}>
                  <Download className="w-4 h-4 mr-2" />
                  Baixar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="outline" onClick={onClose}>
          Fechar Editor
        </Button>
      </div>
    </div>
  );
};

export default ImageEditor;