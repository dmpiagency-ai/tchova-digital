import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAICredits } from '@/contexts/AICreditsContext';
import { useAuth } from '@/contexts/AuthContext';
import { MOZAMBICAN_AI_TEMPLATES, getTemplatesByCategory, processPrompt } from '@/config/aiTemplates';
import {
  Sparkles,
  Image,
  Type,
  Palette,
  Upload,
  Download,
  CreditCard,
  Zap,
  Wand2,
  FileImage,
  Edit3,
  Settings
} from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  cost: number;
  category: 'generation' | 'editing' | 'enhancement';
}

const AI_TOOLS: AITool[] = [
  // Geração
  {
    id: 'logo-generator',
    name: 'Gerador de Logos',
    description: 'Crie logos profissionais com elementos locais',
    icon: <Palette className="w-5 h-5" />,
    cost: 50,
    category: 'generation'
  },
  {
    id: 'post-generator',
    name: 'Gerador de Posts',
    description: 'Gere posts para redes sociais com linguagem jovem',
    icon: <Type className="w-5 h-5" />,
    cost: 30,
    category: 'generation'
  },
  {
    id: 'banner-generator',
    name: 'Gerador de Banners',
    description: 'Crie banners impactantes para fachadas e anúncios',
    icon: <FileImage className="w-5 h-5" />,
    cost: 40,
    category: 'generation'
  },
  // Edição
  {
    id: 'image-editor',
    name: 'Editor de Imagens',
    description: 'Edite e personalize imagens com IA',
    icon: <Edit3 className="w-5 h-5" />,
    cost: 25,
    category: 'editing'
  },
  {
    id: 'text-overlay',
    name: 'Sobreposição de Texto',
    description: 'Adicione textos estilizados às suas imagens',
    icon: <Type className="w-5 h-5" />,
    cost: 20,
    category: 'editing'
  },
  // Aprimoramento
  {
    id: 'upscale',
    name: 'Aumentar Resolução',
    description: 'Melhore a qualidade e resolução de imagens',
    icon: <Zap className="w-5 h-5" />,
    cost: 35,
    category: 'enhancement'
  },
  {
    id: 'color-enhance',
    name: 'Otimização de Cores',
    description: 'Melhore cores e contraste automaticamente',
    icon: <Wand2 className="w-5 h-5" />,
    cost: 15,
    category: 'enhancement'
  }
];

interface AIToolsDashboardProps {
  onClose?: () => void;
}

export const AIToolsDashboard: React.FC<AIToolsDashboardProps> = ({ onClose }) => {
  const { credits, deductCredits, hasEnoughCredits } = useAICredits();
  const { user } = useAuth();
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});

  const handleToolSelect = (tool: AITool) => {
    if (!hasEnoughCredits(tool.cost)) {
      alert('Créditos insuficientes! Adicione mais créditos para usar esta ferramenta.');
      return;
    }
    setSelectedTool(tool);
    setTemplateVariables({});
  };

  const handleGenerate = async () => {
    if (!selectedTool) return;

    setIsGenerating(true);

    // Verificar se é um template
    const template = MOZAMBICAN_AI_TEMPLATES.find(t => t.id === selectedTool.id);
    let prompt = '';

    if (template) {
      // Usar template com variáveis preenchidas
      prompt = processPrompt(template, templateVariables);
    } else {
      // Usar prompt personalizado (simulado)
      prompt = `Gerar ${selectedTool.name.toLowerCase()} baseado na descrição fornecida`;
    }

    // Simular geração com IA (em produção, seria chamada para API)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Deduzir créditos
    const success = deductCredits(selectedTool.cost, selectedTool.id, `Geração com ${selectedTool.name}`);

    if (success) {
      // Simular resultado baseado no template
      let resultMessage = `Resultado gerado com ${selectedTool.name}`;
      if (template) {
        resultMessage += ` usando template "${template.name}"`;
      }
      resultMessage += ` - ${new Date().toLocaleString()}`;

      setGeneratedResult(resultMessage);
    }

    setIsGenerating(false);
  };

  const toolsByCategory = AI_TOOLS.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, AITool[]>);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Ferramentas de IA</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
          Use inteligência artificial para criar conteúdo profissional rapidamente.
          Cada ferramenta consome créditos que você pode recarregar a qualquer momento.
        </p>

        {/* Saldo de Créditos */}
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="font-semibold text-sm sm:text-base">
                  <span className="hidden sm:inline">Créditos Disponíveis</span>
                  <span className="sm:hidden">Créditos</span>
                </span>
              </div>
              <Badge variant="secondary" className="text-base sm:text-lg font-bold">
                {credits.balance} MZN
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ferramentas por Categoria */}
      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="templates" className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5">
            <span className="hidden sm:inline">Templates Prontos para Vender</span>
            <span className="sm:hidden">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="generation" className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5">
            Geração
          </TabsTrigger>
          <TabsTrigger value="editing" className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5">
            Edição
          </TabsTrigger>
          <TabsTrigger value="enhancement" className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5">
            <span className="hidden sm:inline">Aprimoramento</span>
            <span className="sm:hidden">Aprimorar</span>
          </TabsTrigger>
        </TabsList>

        {/* Templates Prontos para Vender */}
        <TabsContent value="templates" className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Templates Prontos para Vender</h3>
            <p className="text-muted-foreground">
              Templates otimizados para converter visitantes em clientes. Linguagem jovem e elementos locais incluídos.
            </p>
          </div>

          {/* Templates por categoria */}
          <div className="space-y-6">
            {['logos', 'posts', 'banners', 'cartazes'].map(category => {
              const templates = getTemplatesByCategory(category);
              if (templates.length === 0) return null;

              return (
                <div key={category} className="space-y-3">
                  <h4 className="text-base sm:text-lg font-semibold capitalize">{category}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {templates.map(template => (
                      <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleToolSelect({
                        id: template.id,
                        name: template.name,
                        description: template.description,
                        icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />,
                        cost: 25,
                        category: 'generation'
                      })}>
                        <CardHeader className="pb-2 sm:pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-sm sm:text-base">{template.name}</CardTitle>
                              <CardDescription className="text-xs sm:text-sm">{template.description}</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1 ml-2">
                              <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                ✔ Local
                              </Badge>
                              <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                ✔ Jovem
                              </Badge>
                              <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                ✔ WhatsApp
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">
                              {template.variables.length} variável{template.variables.length !== 1 ? 'is' : ''}
                            </div>
                            <div className="space-y-1">
                              <Button
                                size="sm"
                                className="w-full text-xs sm:text-sm h-9 sm:h-10 touch-manipulation"
                              >
                                <span className="hidden sm:inline">Usar Template (25 MZN)</span>
                                <span className="sm:hidden">Usar (25 MZN)</span>
                              </Button>
                              <p className="text-xs text-muted-foreground text-center">
                                Menos que um pacote de dados diário
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prova Social */}
          <div className="text-center py-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Mais de 100 designs criados para negócios locais
            </p>
          </div>
        </TabsContent>

        {Object.entries(toolsByCategory).map(([category, tools]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {tools.map((tool) => (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="text-lg sm:text-xl">{tool.icon}</div>
                        <CardTitle className="text-sm sm:text-base lg:text-lg">{tool.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs">{tool.cost} MZN</Badge>
                    </div>
                    <CardDescription className="text-xs sm:text-sm">{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      onClick={() => handleToolSelect(tool)}
                      className="w-full text-xs sm:text-sm h-9 sm:h-11 touch-manipulation"
                      disabled={!hasEnoughCredits(tool.cost)}
                    >
                      <span className="hidden sm:inline">
                        {hasEnoughCredits(tool.cost) ? 'Usar Ferramenta' : 'Créditos Insuficientes'}
                      </span>
                      <span className="sm:hidden">
                        {hasEnoughCredits(tool.cost) ? 'Usar' : 'Sem Créditos'}
                      </span>
                    </Button>
                    {hasEnoughCredits(tool.cost) && (
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        {tool.cost === 50 && 'Menos que um pacote de dados diário'}
                        {tool.cost === 40 && 'Valor de uma refeição em restaurante'}
                        {tool.cost === 30 && 'Preço de um café na cidade'}
                        {tool.cost === 25 && 'Valor de uma chamada de táxi curta'}
                        {tool.cost === 20 && 'Preço de uma água mineral'}
                        {tool.cost === 15 && 'Valor de um bilhete de autocarro'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Modal de Ferramenta Selecionada */}
      <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <div className="text-lg sm:text-xl">{selectedTool?.icon}</div>
              <span>{selectedTool?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">{selectedTool?.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Inputs baseados na ferramenta ou template */}
            {(() => {
              const template = MOZAMBICAN_AI_TEMPLATES.find(t => t.id === selectedTool?.id);
              if (template) {
                // É um template - mostrar campos das variáveis
                return (
                  <div className="space-y-4">
                    {template.variables.map(variable => (
                      <div key={variable}>
                        <Label htmlFor={variable} className="capitalize">
                          {variable.replace('_', ' ')}
                        </Label>
                        <Input
                          id={variable}
                          placeholder={`Ex: ${template.examples[Math.floor(Math.random() * template.examples.length)]}`}
                          value={templateVariables[variable] || ''}
                          onChange={(e) => setTemplateVariables(prev => ({
                            ...prev,
                            [variable]: e.target.value
                          }))}
                        />
                      </div>
                    ))}
                  </div>
                );
              }

              // Ferramentas normais
              if (selectedTool?.id === 'logo-generator') {
                return (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="business-name">Nome do Negócio</Label>
                      <Input id="business-name" placeholder="Ex: Tchova Digital" />
                    </div>
                    <div>
                      <Label htmlFor="business-type">Tipo de Negócio</Label>
                      <Input id="business-type" placeholder="Ex: Tecnologia, Alimentação, etc." />
                    </div>
                    <div>
                      <Label htmlFor="style">Estilo Preferido</Label>
                      <Input id="style" placeholder="Ex: Moderno, Clássico, Criativo" />
                    </div>
                  </div>
                );
              }

              if (selectedTool?.id === 'post-generator') {
                return (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="post-theme">Tema do Post</Label>
                      <Input id="post-theme" placeholder="Ex: Promoção, Anúncio de produto" />
                    </div>
                    <div>
                      <Label htmlFor="target-audience">Público-Alvo</Label>
                      <Input id="target-audience" placeholder="Ex: Jovens, Empresários" />
                    </div>
                    <div>
                      <Label htmlFor="platform">Plataforma</Label>
                      <Input id="platform" placeholder="Ex: Instagram, Facebook" />
                    </div>
                  </div>
                );
              }

              if (selectedTool?.id === 'image-editor') {
                return (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="image-upload">Upload de Imagem</Label>
                      <Input id="image-upload" type="file" accept="image/*" />
                    </div>
                    <div>
                      <Label htmlFor="edit-description">Descrição das Edições</Label>
                      <Textarea
                        id="edit-description"
                        placeholder="Descreva as edições desejadas..."
                        rows={3}
                      />
                    </div>
                  </div>
                );
              }

              // Default para outras ferramentas
              return (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Descrição do que você quer gerar</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva detalhadamente o que você quer criar..."
                      rows={4}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Botão de Geração */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t gap-3 sm:gap-0">
              <div className="text-xs sm:text-sm text-muted-foreground">
                Custo: {selectedTool?.cost} MZN créditos
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full sm:w-auto sm:min-w-32 h-10 sm:h-10"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span className="hidden sm:inline">Gerando...</span>
                    <span className="sm:hidden">Gerando</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar
                  </>
                )}
              </Button>
            </div>

            {/* Resultado */}
            {generatedResult && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  ✅ Resultado Gerado
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {generatedResult}
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Resultado
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};