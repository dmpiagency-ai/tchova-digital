import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useValidatedForm, gsmLoginSchema, type GsmLoginFormData } from '@/hooks/useFormValidation';
import { Loader2 } from 'lucide-react';

interface GSMLoginFormProps {
  onSubmit: (credentials: GsmLoginFormData) => void;
  onBack?: () => void;
  title?: string;
  description?: string;
  className?: string;
}

export const GSMLoginForm: React.FC<GSMLoginFormProps> = ({
  onSubmit,
  onBack,
  title = 'Acesso GSM Premium',
  description = 'Entre para acessar ferramentas premium de GSM',
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useValidatedForm(gsmLoginSchema);

  const onFormSubmit = async (data: GsmLoginFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold gradient-text">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              disabled={isLoading}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="+258 84 123 4567"
              {...register('whatsapp')}
              aria-invalid={!!errors.whatsapp}
              aria-describedby={errors.whatsapp ? 'whatsapp-error' : undefined}
              disabled={isLoading}
            />
            {errors.whatsapp && (
              <p id="whatsapp-error" className="text-sm text-destructive" role="alert">
                {errors.whatsapp.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              {...register('password')}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              disabled={isLoading}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              aria-label="Entrar no GSM Premium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>

            {onBack && (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isLoading}
                aria-label="Voltar para página inicial"
              >
                Voltar
              </Button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Não tem uma conta?</p>
          <Button variant="link" className="p-0 h-auto font-semibold">
            Criar conta GSM
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
