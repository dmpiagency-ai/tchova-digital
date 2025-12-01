import { useState } from 'react';
import { Send, MapPin, Phone, Mail, Instagram, Facebook, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Mensagem deve ter pelo menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Mensagem enviada!",
        description: "Obrigado pelo contacto. Responderemos em breve!",
      });

      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente ou entre em contacto pelo WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/tchovadigital',
      color: 'hover:text-pink-500'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/tchovadigital',
      color: 'hover:text-blue-500'
    }
  ];

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Localização',
      info: 'Centro Urbano'
    },
    {
      icon: Phone,
      title: 'Telefone',
      info: '+258 123 456 789'
    },
    {
      icon: Mail,
      title: 'E-mail',
      info: 'hello@tchovadigital.com'
    }
  ];

  return (
    <>
      {/* Final CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto animate-fade-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
              <span className="gradient-text">Vamos levar seu negócio para o próximo nível.</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-12 leading-relaxed">
              Somos a ponte entre sua ideia e o sucesso digital.
              Vamos construir juntos o futuro do seu negócio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                aria-label="Abrir conversa no WhatsApp"
                className="glass-card hover-glow px-8 py-4 rounded-2xl font-semibold text-primary border border-primary/30 hover:bg-primary/10 transition-all duration-300"
                onClick={() => window.open('https://wa.me/258123456789', '_blank')}
              >
                Falar no WhatsApp
              </button>
              <button
                type="button"
                aria-label="Ir para o formulário de contato"
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover-lift"
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Solicitar Orçamento
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-12 lg:py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-32 right-20 w-80 h-80 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-32 left-20 w-64 h-64 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-12 animate-fade-up">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 lg:mb-6">
            <span className="gradient-text">Vamos conversar e fazer acontecer.</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto font-light">
            Contacto rápido:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          
          {/* Contact Form */}
          <div className="animate-fade-up">
            <div className="neo p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-4 lg:mb-6">
                Envie a sua mensagem
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder="O seu nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`neo-inset border-0 focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground ${errors.name ? 'ring-2 ring-red-500/50' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="O seu melhor e-mail"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`neo-inset border-0 focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground ${errors.email ? 'ring-2 ring-red-500/50' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Textarea
                    name="message"
                    placeholder="Fale-me sobre o seu projeto..."
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className={`neo-inset border-0 focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground resize-none ${errors.message ? 'ring-2 ring-red-500/50' : ''}`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.message}
                    </p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 lg:py-4 rounded-2xl text-base lg:text-lg hover-lift animate-glow relative overflow-hidden focus-visible"
                  aria-describedby={Object.keys(errors).length > 0 ? "form-errors" : undefined}
                >
                  {isSubmitting ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 animate-pulse"></div>
                      <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 relative z-10" />
                      <span className="relative z-10 truncate">Enviando...</span>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      <Send className="w-4 h-4 lg:w-5 lg:h-5 mr-2 relative z-10 flex-shrink-0" />
                      <span className="relative z-10 truncate">Enviar Mensagem</span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-up space-y-6 lg:space-y-8">

            {/* Contact Details */}
            <div className="space-y-4 lg:space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="neo p-4 lg:p-6 hover-lift flex items-center">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 neo-inset rounded-xl flex items-center justify-center mr-3 lg:mr-4 flex-shrink-0">
                    <item.icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-foreground mb-1 text-sm lg:text-base">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground text-xs lg:text-sm break-words">
                      {item.info}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="neo p-6 lg:p-8">
              <h4 className="font-bold text-foreground mb-4 lg:mb-6 text-center text-sm lg:text-base">
                Siga-nos nas Redes Sociais
              </h4>
              <div className="flex justify-center space-x-4 lg:space-x-6">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`w-10 h-10 lg:w-12 lg:h-12 neo-inset rounded-xl flex items-center justify-center text-muted-foreground transition-all duration-300 hover:scale-110 ${social.color}`}
                  >
                    <social.icon className="w-5 h-5 lg:w-6 lg:h-6" aria-hidden="true" focusable="false" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Contact */}
            <div className="glass-card p-6 lg:p-8 text-center">
              <h4 className="font-bold text-foreground mb-3 lg:mb-4 text-sm lg:text-base">
                Prefere conversar diretamente?
              </h4>
              <p className="text-muted-foreground mb-4 lg:mb-6 text-xs lg:text-sm">
                Clique no botão abaixo e vamos conversar pelo WhatsApp agora mesmo!
              </p>
              <Button
                aria-label="Abrir conversa no WhatsApp"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl lg:rounded-2xl hover-lift relative overflow-hidden group focus-visible text-xs lg:text-sm w-full max-w-xs mx-auto"
                onClick={() => window.open('https://wa.me/258123456789', '_blank')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                <Phone className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 relative z-10 flex-shrink-0" aria-hidden="true" focusable="false" />
                <span className="relative z-10 truncate">Chamar no WhatsApp</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Contact;