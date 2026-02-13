import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Image as ImageIcon, Wand2, Zap, Sliders, Layers, RotateCw, Crop, Eye, Trash2, CheckCircle2 } from 'lucide-react';

interface ImageEditorProps {
  onComplete?: (result: string) => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ onComplete }) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingOptions, setEditingOptions] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    rotation: 0,
    crop: 'original'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          newImages.push(result);
          if (newImages.length === files.length) {
            setUploadedImages(prev => [...prev, ...newImages]);
            if (!selectedImage && newImages.length > 0) {
              setSelectedImage(newImages[0]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const newImages: string[] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        newImages.push(result);
        if (newImages.length === files.length) {
          setUploadedImages(prev => [...prev, ...newImages]);
          if (!selectedImage && newImages.length > 0) {
            setSelectedImage(newImages[0]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleEditImage = () => {
    setIsProcessing(true);
    // Simulação de processamento de imagem com IA
    setTimeout(() => {
      const processedImage = selectedImage || '';
      setProcessedImages(prev => [...prev, processedImage]);
      setIsProcessing(false);
      setActiveTab('results');
    }, 2000);
  };

  const handleBatchProcess = () => {
    setIsProcessing(true);
    // Simulação de processamento em massa
    setTimeout(() => {
      const processedBatch = uploadedImages;
      setProcessedImages(prev => [...prev, ...processedBatch]);
      setIsProcessing(false);
      setActiveTab('results');
    }, 3000);
  };

  const handleDownload = (image: string) => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `edited-image-${Date.now()}.png`;
    link.click();
  };

  const handleDelete = (image: string, from: 'uploaded' | 'processed') => {
    if (from === 'uploaded') {
      setUploadedImages(prev => prev.filter(img => img !== image));
      if (selectedImage === image) {
        setSelectedImage(null);
      }
    } else {
      setProcessedImages(prev => prev.filter(img => img !== image));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-2xl animate-glow">
            <Wand2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text">Editor de Imagens IA</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
          Edite e aprimore suas imagens com inteligência artificial. Suporte para upload, aprimoramento, processamento em massa e download de resultados.
        </p>
      </div>

      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 bg-gradient-to-r from-primary/10 to-accent/10 p-2 rounded-2xl">
          <TabsTrigger 
            value="upload" 
            className="text-sm sm:text-base px-3 sm:px-4 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all duration-300 hover:bg-white/20"
          >
            <Upload className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Upload</span>
            <span className="sm:hidden">Upload</span>
          </TabsTrigger>
          <TabsTrigger 
            value="enhance" 
            className="text-sm sm:text-base px-3 sm:px-4 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all duration-300 hover:bg-white/20"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Aprimorar</span>
            <span className="sm:hidden">Aprimorar</span>
          </TabsTrigger>
          <TabsTrigger 
            value="batch" 
            className="text-sm sm:text-base px-3 sm:px-4 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all duration-300 hover:bg-white/20"
          >
            <Layers className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Em Massa</span>
            <span className="sm:hidden">Massa</span>
          </TabsTrigger>
          <TabsTrigger 
            value="results" 
            className="text-sm sm:text-base px-3 sm:px-4 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all duration-300 hover:bg-white/20"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Resultados</span>
            <span className="sm:hidden">Resultados</span>
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6 pt-6">
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-3xl p-8 sm:p-12 text-center hover:border-primary transition-colors duration-300 cursor-pointer bg-gradient-to-br from-white/5 to-white/10"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <Upload className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Arraste e solte suas imagens aqui</h3>
                <p className="text-muted-foreground">ou clique para selecionar</p>
                <p className="text-sm text-muted-foreground">Suporta JPG, PNG, WEBP até 10MB</p>
              </div>
              <Button className="premium-button">
                <Upload className="w-4 h-4 mr-2" />
                Selecionar Imagens
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {uploadedImages.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold">Imagens Carregadas ({uploadedImages.length})</h4>
                <Badge variant="secondary" className="text-sm">
                  {uploadedImages.length} arquivo{uploadedImages.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploadedImages.map((image, index) => (
                  <Card 
                    key={index} 
                    className="relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl shadow-lg hover:scale-105 card-hover"
                  >
                    <div className="absolute top-3 right-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(image, 'uploaded')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                        <img
                          src={image}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground text-center">
                        Imagem {index + 1}
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedImage(image);
                          setActiveTab('enhance');
                        }}
                        className="w-full mt-3 premium-button text-sm"
                      >
                        Editar Imagem
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {uploadedImages.length > 1 && (
                <div className="text-center">
                  <Button
                    onClick={handleBatchProcess}
                    disabled={isProcessing}
                    className="premium-button"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processando...
                      </>
                    ) : (
                      <>
                        <Layers className="w-4 h-4 mr-2" />
                        Processar em Massa ({uploadedImages.length} imagens)
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Enhance Tab */}
        <TabsContent value="enhance" className="space-y-6 pt-6">
          {selectedImage ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-bold">Pré-visualização</h4>
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <img
                    src={selectedImage}
                    alt="Imagem selecionada"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Tamanho: ~2.5MB</span>
                  <span>Resolução: 1920x1080</span>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-lg font-bold">Opções de Edição</h4>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="brightness" className="text-sm font-medium">Brilho</Label>
                      <span className="text-sm text-muted-foreground">{editingOptions.brightness}%</span>
                    </div>
                    <input
                      id="brightness"
                      type="range"
                      min="0"
                      max="200"
                      value={editingOptions.brightness}
                      onChange={(e) => setEditingOptions(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="contrast" className="text-sm font-medium">Contraste</Label>
                      <span className="text-sm text-muted-foreground">{editingOptions.contrast}%</span>
                    </div>
                    <input
                      id="contrast"
                      type="range"
                      min="0"
                      max="200"
                      value={editingOptions.contrast}
                      onChange={(e) => setEditingOptions(prev => ({ ...prev, contrast: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="saturation" className="text-sm font-medium">Saturação</Label>
                      <span className="text-sm text-muted-foreground">{editingOptions.saturation}%</span>
                    </div>
                    <input
                      id="saturation"
                      type="range"
                      min="0"
                      max="200"
                      value={editingOptions.saturation}
                      onChange={(e) => setEditingOptions(prev => ({ ...prev, saturation: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="blur" className="text-sm font-medium">Desfoque</Label>
                      <span className="text-sm text-muted-foreground">{editingOptions.blur}px</span>
                    </div>
                    <input
                      id="blur"
                      type="range"
                      min="0"
                      max="20"
                      value={editingOptions.blur}
                      onChange={(e) => setEditingOptions(prev => ({ ...prev, blur: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="premium-button"
                    onClick={handleEditImage}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Aplicar Edições
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingOptions({
                      brightness: 100,
                      contrast: 100,
                      saturation: 100,
                      blur: 0,
                      rotation: 0,
                      crop: 'original'
                    })}
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    Resetar
                  </Button>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-blue-800 dark:text-blue-200">Dica do Dia</h5>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Aumentar a saturação em 15% e o contraste em 10% pode fazer sua imagem destacar mais nas redes sociais!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl inline-block mb-4">
                <Eye className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Nenhuma Imagem Selecionada</h3>
              <p className="text-muted-foreground mb-4">Selecione uma imagem para começar a editar</p>
              <Button
                onClick={() => setActiveTab('upload')}
                className="premium-button"
              >
                <Upload className="w-4 h-4 mr-2" />
                Carregar Imagem
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Batch Tab */}
        <TabsContent value="batch" className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-bold mb-3">Processamento em Massa</h3>
              <p className="text-muted-foreground mb-4">
                Processar múltiplas imagens simultaneamente com as mesmas configurações. Ideal para editores de conteúdo e marketers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-white/50 dark:bg-black/30 rounded-xl">
                  <div className="text-3xl font-bold text-primary">{uploadedImages.length}</div>
                  <div className="text-sm text-muted-foreground">Imagens Carregadas</div>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-black/30 rounded-xl">
                  <div className="text-3xl font-bold text-accent">0:00</div>
                  <div className="text-sm text-muted-foreground">Tempo Estimado</div>
                </div>
              </div>
              <Button
                onClick={handleBatchProcess}
                disabled={isProcessing || uploadedImages.length === 0}
                className="w-full premium-button"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando {uploadedImages.length} imagens...
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4 mr-2" />
                    Iniciar Processamento em Massa
                  </>
                )}
              </Button>
            </div>

            {uploadedImages.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold">Imagens para Processamento</h4>
                  <Badge variant="secondary" className="text-sm">
                    {uploadedImages.length} arquivo{uploadedImages.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                        <img
                          src={image}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                        <span className="text-white text-xs font-medium">Imagem {index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6 pt-6">
          {processedImages.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold">Resultados Processados</h4>
                <Badge variant="secondary" className="text-sm">
                  {processedImages.length} arquivo{processedImages.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedImages.map((image, index) => (
                  <Card 
                    key={index} 
                    className="relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl shadow-lg hover:scale-105 card-hover"
                  >
                    <div className="absolute top-3 right-3 flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(image, 'processed')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                        <img
                          src={image}
                          alt={`Resultado ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                            ✔ Processado
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground text-center">
                        Resultado {index + 1}
                      </div>
                      <Button
                        onClick={() => handleDownload(image)}
                        className="w-full mt-3 premium-button text-sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar Imagem
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveTab('upload');
                    setProcessedImages([]);
                  }}
                  className="px-6 py-3"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Processar Mais Imagens
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl inline-block mb-4">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Nenhum Resultado Processado</h3>
              <p className="text-muted-foreground mb-4">Processue algumas imagens para ver os resultados aqui</p>
              <Button
                onClick={() => setActiveTab('upload')}
                className="premium-button"
              >
                <Upload className="w-4 h-4 mr-2" />
                Começar Processamento
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper component for labels
const Label = ({ htmlFor, className, children }: { htmlFor?: string; className?: string; children: React.ReactNode }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium text-foreground ${className}`}
    >
      {children}
    </label>
  );
};