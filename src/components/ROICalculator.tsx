import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';

interface ROICalculatorProps {
  onClose?: () => void;
}

export const ROICalculator: React.FC<ROICalculatorProps> = ({ onClose }) => {
  const [investment, setInvestment] = useState('');
  const [expectedRevenue, setExpectedRevenue] = useState('');
  const [results, setResults] = useState<{
    roi: number;
    profit: number;
    roiPercentage: string;
    status: 'excellent' | 'good' | 'average' | 'poor';
  } | null>(null);

  const calculateROI = () => {
    const invest = parseFloat(investment);
    const revenue = parseFloat(expectedRevenue);

    if (!invest || !revenue || invest <= 0) return;

    const profit = revenue - invest;
    const roi = (profit / invest) * 100;
    const roiPercentage = roi.toFixed(1) + '%';

    let status: 'excellent' | 'good' | 'average' | 'poor';
    if (roi >= 300) status = 'excellent';
    else if (roi >= 150) status = 'good';
    else if (roi >= 50) status = 'average';
    else status = 'poor';

    setResults({
      roi,
      profit,
      roiPercentage,
      status
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'average': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bom';
      case 'average': return 'Regular';
      case 'poor': return 'Ruim';
      default: return 'N/A';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold gradient-text">Calculadora ROI</h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base">
          Calcule o retorno sobre investimento das suas campanhas de marketing
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Dados da Campanha</span>
          </CardTitle>
          <CardDescription>
            Insira os valores para calcular o ROI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="investment" className="text-sm">Investimento (MZN)</Label>
              <Input
                id="investment"
                type="number"
                placeholder="Ex: 50000"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                className="h-10 sm:h-11"
              />
            </div>
            <div>
              <Label htmlFor="revenue" className="text-sm">Receita Esperada (MZN)</Label>
              <Input
                id="revenue"
                type="number"
                placeholder="Ex: 150000"
                value={expectedRevenue}
                onChange={(e) => setExpectedRevenue(e.target.value)}
                className="h-10 sm:h-11"
              />
            </div>
          </div>
          <Button
            onClick={calculateROI}
            className="w-full h-10 sm:h-11"
            disabled={!investment || !expectedRevenue}
          >
            Calcular ROI
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Resultados</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                  {results.roiPercentage}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">ROI</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-green-500/5 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                  {results.profit.toLocaleString()} MZN
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Lucro</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Badge className={`${getStatusColor(results.status)} text-white mb-2 text-xs sm:text-sm`}>
                  {getStatusText(results.status)}
                </Badge>
                <div className="text-xs sm:text-sm text-muted-foreground">Avaliação</div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Interpretação:</h4>
              <div className="text-sm space-y-1">
                {results.roi >= 300 && (
                  <p>🎉 Excelente! Sua campanha tem um retorno excepcional.</p>
                )}
                {results.roi >= 150 && results.roi < 300 && (
                  <p>👍 Bom retorno! Considere otimizar para melhorar ainda mais.</p>
                )}
                {results.roi >= 50 && results.roi < 150 && (
                  <p>⚖️ Retorno regular. Avalie estratégias para aumentar a conversão.</p>
                )}
                {results.roi < 50 && (
                  <p>⚠️ Retorno baixo. Considere revisar a estratégia da campanha.</p>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-10 sm:h-11 text-sm sm:text-base"
              onClick={() => window.open('https://wa.me/258879097249?text=Ol%C3%A1%2C+fiz+um+c%C3%A1lculo+de+ROI+e+gostaria+de+conversar+sobre+minha+campanha', '_blank')}
            >
              <span className="hidden sm:inline">Consultar Estratégia de Marketing</span>
              <span className="sm:hidden">Consultar Estratégia</span>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="text-center pt-4">
        <Button variant="ghost" onClick={onClose} className="h-9 sm:h-10">
          <span className="hidden sm:inline">Fechar Calculadora</span>
          <span className="sm:hidden">Fechar</span>
        </Button>
      </div>
    </div>
  );
};