'use client';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, LogIn, ArrowLeft } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import DarkModeToggle from '@/components/DarkModeToggle';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { env } from '@/config/env';
import logo from '@/assets/logo.svg';

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const scrolled = useScroll(10);

  const isPaymentPage = location.pathname === '/payment';

  const menuItems = [
    { name: 'Home', href: '/', isRoute: true },
    { name: 'Serviços', href: '#services' },
    { name: 'Sobre', href: '#about' },
    { name: 'Planos', href: '#planos' },
    { name: 'Contacto', href: '#contact' },
  ];

  React.useEffect(() => {
    if (open) {
      // Disable scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scroll
      document.body.style.overflow = '';
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleNavigation = (item: typeof menuItems[0]) => {
    if (item.isRoute) {
      navigate(item.href);
    } else {
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setOpen(false);
  };

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg"
      >
        Pular para o conteúdo principal
      </a>

      <DarkModeToggle />
      
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[1100] w-full transition-all',
          {
            'bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur-lg shadow-lg border-b border-border':
              scrolled && !open,
            'bg-transparent': !scrolled && !open,
            'bg-background/90 backdrop-blur-md': open,
          },
        )}
        style={{
          transition: 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'background-color, box-shadow',
        }}
      >
        <nav
          className={cn(
            'flex h-16 w-full items-center justify-between px-4 md:h-14 md:transition-all md:ease-out',
            {
              'md:px-2': scrolled,
            },
          )}
        >
          {/* Back Button for Payment Page */}
          {isPaymentPage && (
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="p-2 rounded-[24px] hover:bg-primary/10 transition-all"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Button>
          )}

          {/* Logo */}
          <div className="flex items-center gap-2">
            {isPaymentPage && (
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="hidden lg:flex items-center p-2 rounded-[24px] hover:bg-primary/10 transition-all"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-4 h-4 text-primary mr-2" />
                <span className="text-sm font-medium">Voltar</span>
              </Button>
            )}
            <img src={logo} alt="TchovaDigital Logo" className="h-7 sm:h-8 w-auto" />
            <h1 className={cn(
              'text-base sm:text-lg font-bold font-nunito tracking-tight transition-colors duration-300',
              scrolled || open
                ? 'text-brand-dark dark:text-brand-green'
                : 'text-white'
            )}>
              TchovaDigital
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item)}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  scrolled || open
                    ? 'text-foreground hover:text-primary'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                )}
              >
                {item.name}
              </button>
            ))}
            
            {/* WhatsApp Button */}
            <Button
              size="sm"
              aria-label="Abrir conversa no WhatsApp"
              className={cn(
                'font-bold px-3 py-1.5 text-sm rounded-full transition-all duration-300 hover:scale-105',
                scrolled || open
                  ? 'bg-green-500 hover:bg-green-600 text-white border-0'
                  : 'bg-green-500/90 hover:bg-green-500 text-white border border-green-400/50 shadow-lg shadow-green-500/20'
              )}
              onClick={() => window.open(`https://wa.me/${env.WHATSAPP_NUMBER}`, '_blank')}
            >
              <span>WhatsApp</span>
            </Button>

            {/* Login/Logout */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className={cn(
                  'flex items-center gap-2 rounded-full px-3 py-1.5',
                  scrolled || open ? 'bg-primary/10' : 'bg-white/10'
                )}>
                  <User className={cn(
                    'w-4 h-4',
                    scrolled || open ? 'text-primary' : 'text-white'
                  )} />
                  <span className={cn(
                    'text-sm font-semibold hidden xl:inline truncate max-w-[100px]',
                    scrolled || open ? 'text-primary' : 'text-white'
                  )}>
                    {user?.name || 'Usuário'}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    try {
                      logout();
                    } catch (error) {
                      window.location.reload();
                    }
                  }}
                  className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-full font-bold px-3 py-1.5"
                >
                  <LogOut className="w-4 h-4 xl:mr-1.5" />
                  <span className="hidden xl:inline text-sm">Sair</span>
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white font-bold px-4 py-1.5 text-sm rounded-full transition-all duration-300 hover:scale-105"
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                <span>Entrar</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          {!isPaymentPage && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => setOpen(!open)}
              className={cn(
                'md:hidden transition-colors duration-300',
                scrolled || open
                  ? 'border-primary/30 hover:bg-primary/10'
                  : 'border-white/30 hover:bg-white/10'
              )}
            >
              <MenuToggleIcon
                open={open}
                className={cn(
                  'size-5 transition-colors duration-300',
                  scrolled || open ? 'text-primary' : 'text-white'
                )}
                duration={300}
              />
            </Button>
          )}
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            'bg-background/90 fixed top-16 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden',
            open ? 'block' : 'hidden',
          )}
        >
          <div
            data-slot={open ? 'open' : 'closed'}
            className={cn(
              'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
              'flex h-full w-full flex-col justify-between gap-y-2 p-4',
            )}
          >
            <div className="grid gap-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className={buttonVariants({
                    variant: 'ghost',
                    className: 'justify-start text-foreground hover:text-primary',
                  })}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold"
                onClick={() => {
                  window.open(`https://wa.me/${env.WHATSAPP_NUMBER}`, '_blank');
                  setOpen(false);
                }}
              >
                WhatsApp
              </Button>

              {isAuthenticated ? (
                <Button
                  variant="outline"
                  className="w-full border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              ) : (
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold"
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setOpen(false);
                  }}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
