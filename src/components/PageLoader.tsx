import { useEffect, useState } from 'react';
import logo from '@/assets/logo.svg';

interface PageLoaderProps {
  onLoadingComplete?: () => void;
  minDuration?: number;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  onLoadingComplete,
  minDuration = 2000
}) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const elapsed = Date.now() - startTime;
        const targetProgress = Math.min(100, (elapsed / minDuration) * 100);
        const newProgress = prev + (targetProgress - prev) * 0.1;
        return Math.min(100, newProgress);
      });
    }, 50);

    // Complete loading after min duration
    const completeTimeout = setTimeout(() => {
      setProgress(100);
      clearInterval(progressInterval);
      
      // Start exit animation
      setTimeout(() => {
        setIsExiting(true);
        
        // Hide completely after exit animation
        setTimeout(() => {
          setIsHidden(true);
          onLoadingComplete?.();
        }, 600);
      }, 300);
    }, minDuration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimeout);
    };
  }, [minDuration, onLoadingComplete]);

  if (isHidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] transition-all duration-600 ${
        isExiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
      style={{
        transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out',
      }}
    >
      {/* Background animated gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #00E13C 0%, transparent 70%)',
            animation: 'pulse 2s ease-in-out infinite',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-2xl"
          style={{
            background: 'radial-gradient(circle, #FFCC00 0%, transparent 70%)',
            animation: 'pulse 2s ease-in-out infinite 0.5s',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* Logo container with animations */}
      <div 
        className="relative z-10 flex flex-col items-center"
        style={{
          animation: 'logoFloat 3s ease-in-out infinite',
        }}
      >
        {/* Logo SVG */}
        <div 
          className="relative"
          style={{
            animation: 'logoEnter 0.8s ease-out forwards',
          }}
        >
          <img 
            src={logo} 
            alt="TchovaDigital" 
            className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-28"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(0, 225, 60, 0.3))',
              animation: 'logoGlow 2s ease-in-out infinite',
            }}
          />
          
          {/* Logo reflection */}
          <div 
            className="absolute inset-0 opacity-30 blur-sm"
            style={{
              transform: 'scaleY(-0.3) translateY(100%)',
              maskImage: 'linear-gradient(to bottom, transparent, black)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)',
            }}
          >
            <img 
              src={logo} 
              alt="" 
              className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-28"
            />
          </div>
        </div>

        {/* Brand name */}
        <h1 
          className="mt-4 text-2xl sm:text-3xl font-bold text-white tracking-tight"
          style={{
            animation: 'textEnter 0.6s ease-out 0.3s forwards',
            opacity: 0,
          }}
        >
          Tchova<span className="text-[#00E13C]">Digital</span>
        </h1>

        {/* Loading bar container */}
        <div 
          className="mt-8 w-48 sm:w-64 h-1 bg-white/10 rounded-full overflow-hidden"
          style={{
            animation: 'barEnter 0.5s ease-out 0.5s forwards',
            opacity: 0,
          }}
        >
          {/* Progress bar */}
          <div 
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #00E13C 0%, #FFCC00 100%)',
              boxShadow: '0 0 20px rgba(0, 225, 60, 0.5)',
            }}
          />
        </div>

        {/* Loading text */}
        <p 
          className="mt-3 text-sm text-white/50"
          style={{
            animation: 'textEnter 0.5s ease-out 0.6s forwards',
            opacity: 0,
          }}
        >
          {progress < 100 ? 'Carregando...' : 'Pronto!'}
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes logoEnter {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes logoGlow {
          0%, 100% {
            filter: drop-shadow(0 0 30px rgba(0, 225, 60, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 50px rgba(0, 225, 60, 0.5));
          }
        }
        
        @keyframes textEnter {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes barEnter {
          0% {
            opacity: 0;
            transform: scaleX(0);
          }
          100% {
            opacity: 1;
            transform: scaleX(1);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
