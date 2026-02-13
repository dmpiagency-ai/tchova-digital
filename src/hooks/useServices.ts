/**
 * ============================================
 * CUSTOM HOOKS - TCHOVA DIGITAL
 * ============================================
 * Hooks reutilizáveis para funcionalidades comuns
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { 
  Service, 
  ServiceCategory, 
  GSMTool,
  CheckoutFormData,
  PaymentMethod,
  ApiResponse 
} from '../types';
import { 
  AUDIOVISUAL_PACKAGES, 
  AUDIOVISUAL_EXTRAS, 
  GSM_TOOLS,
  WHATSAPP_CONFIG,
  EXTERNAL_URLS 
} from '../constants';

// ============================================
// USE SERVICES HOOK
// ============================================

interface UseServicesOptions {
  category?: ServiceCategory;
  autoFetch?: boolean;
}

interface UseServicesReturn {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getServiceBySlug: (slug: string) => Service | undefined;
  getServicesByCategory: (category: ServiceCategory) => Service[];
}

export function useServices(options: UseServicesOptions = {}): UseServicesReturn {
  const { category, autoFetch = true } = options;
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simular chamada de API - substituir por chamada real
      // const response = await fetch('/api/services');
      // const data = await response.json();
      
      // Por agora, retornar dados mockados
      const mockServices: Service[] = [];
      setServices(mockServices);
    } catch (err) {
      setError('Erro ao carregar serviços');
      toast.error('Erro ao carregar serviços');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getServiceBySlug = useCallback((slug: string): Service | undefined => {
    return services.find(service => service.slug === slug);
  }, [services]);

  const getServicesByCategory = useCallback((cat: ServiceCategory): Service[] => {
    return services.filter(service => service.category === cat);
  }, [services]);

  useEffect(() => {
    if (autoFetch) {
      fetchServices();
    }
  }, [autoFetch, fetchServices]);

  const filteredServices = useMemo(() => {
    if (category) {
      return services.filter(service => service.category === category);
    }
    return services;
  }, [services, category]);

  return {
    services: filteredServices,
    isLoading,
    error,
    refetch: fetchServices,
    getServiceBySlug,
    getServicesByCategory
  };
}

// ============================================
// USE GSM SERVICES HOOK
// ============================================

interface UseGSMReturn {
  tools: typeof GSM_TOOLS;
  selectedTool: typeof GSM_TOOLS[number] | null;
  selectTool: (toolId: string) => void;
  getToolPrice: (toolId: string) => number;
  getEstimatedTime: (toolId: string) => string;
}

export function useGSM(): UseGSMReturn {
  const [selectedTool, setSelectedTool] = useState<typeof GSM_TOOLS[number] | null>(null);

  const selectTool = useCallback((toolId: string) => {
    const tool = GSM_TOOLS.find(t => t.id === toolId);
    setSelectedTool(tool || null);
  }, []);

  const getToolPrice = useCallback((toolId: string): number => {
    const tool = GSM_TOOLS.find(t => t.id === toolId);
    return tool?.price || 0;
  }, []);

  const getEstimatedTime = useCallback((toolId: string): string => {
    const tool = GSM_TOOLS.find(t => t.id === toolId);
    return tool?.estimatedTime || 'N/A';
  }, []);

  return {
    tools: GSM_TOOLS,
    selectedTool,
    selectTool,
    getToolPrice,
    getEstimatedTime
  };
}

// ============================================
// USE AUDIOVISUAL PACKAGES HOOK
// ============================================

interface UseAudiovisualReturn {
  packages: typeof AUDIOVISUAL_PACKAGES;
  extras: typeof AUDIOVISUAL_EXTRAS;
  selectedPackage: typeof AUDIOVISUAL_PACKAGES[number] | null;
  selectedExtras: string[];
  totalPrice: number;
  selectPackage: (packageId: string) => void;
  toggleExtra: (extraId: string) => void;
  reset: () => void;
}

export function useAudiovisual(): UseAudiovisualReturn {
  const [selectedPackage, setSelectedPackage] = useState<typeof AUDIOVISUAL_PACKAGES[number] | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const selectPackage = useCallback((packageId: string) => {
    const pkg = AUDIOVISUAL_PACKAGES.find(p => p.id === packageId);
    setSelectedPackage(pkg || null);
  }, []);

  const toggleExtra = useCallback((extraId: string) => {
    setSelectedExtras(prev => 
      prev.includes(extraId)
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  }, []);

  const totalPrice = useMemo(() => {
    const packagePrice = selectedPackage?.price || 0;
    const extrasPrice = selectedExtras.reduce((total, extraId) => {
      const extra = AUDIOVISUAL_EXTRAS.find(e => e.id === extraId);
      return total + (extra?.price || 0);
    }, 0);
    return packagePrice + extrasPrice;
  }, [selectedPackage, selectedExtras]);

  const reset = useCallback(() => {
    setSelectedPackage(null);
    setSelectedExtras([]);
  }, []);

  return {
    packages: AUDIOVISUAL_PACKAGES,
    extras: AUDIOVISUAL_EXTRAS,
    selectedPackage,
    selectedExtras,
    totalPrice,
    selectPackage,
    toggleExtra,
    reset
  };
}

// ============================================
// USE CHECKOUT HOOK
// ============================================

interface UseCheckoutOptions {
  onSuccess?: (data: CheckoutFormData) => void;
  onError?: (error: string) => void;
}

interface UseCheckoutReturn {
  isProcessing: boolean;
  processCheckout: (data: CheckoutFormData) => Promise<void>;
  calculateTotal: (items: { price: number; quantity: number }[]) => number;
}

export function useCheckout(options: UseCheckoutOptions = {}): UseCheckoutReturn {
  const { onSuccess, onError } = options;
  const [isProcessing, setIsProcessing] = useState(false);

  const processCheckout = useCallback(async (data: CheckoutFormData) => {
    setIsProcessing(true);
    
    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui seria a integração real com gateway de pagamento
      // const response = await fetch('/api/checkout', {
      //   method: 'POST',
      //   body: JSON.stringify(data)
      // });
      
      toast.success('Pagamento processado com sucesso!');
      onSuccess?.(data);
    } catch (error) {
      const errorMessage = 'Erro ao processar pagamento';
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [onSuccess, onError]);

  const calculateTotal = useCallback((items: { price: number; quantity: number }[]): number => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, []);

  return {
    isProcessing,
    processCheckout,
    calculateTotal
  };
}

// ============================================
// USE WHATSAPP HOOK
// ============================================

type WhatsAppMessageType = 'quote' | 'support' | 'gsm' | 'general';

interface UseWhatsAppReturn {
  sendMessage: (type?: WhatsAppMessageType, customMessage?: string) => void;
  getWhatsAppUrl: (message: string) => string;
}

export function useWhatsApp(): UseWhatsAppReturn {
  const getWhatsAppUrl = useCallback((message: string): string => {
    return EXTERNAL_URLS.whatsapp(WHATSAPP_CONFIG.phoneNumber, message);
  }, []);

  const sendMessage = useCallback((type: WhatsAppMessageType = 'general', customMessage?: string) => {
    const message = customMessage || WHATSAPP_CONFIG.defaultMessages[type];
    const url = getWhatsAppUrl(message);
    window.open(url, '_blank');
  }, [getWhatsAppUrl]);

  return {
    sendMessage,
    getWhatsAppUrl
  };
}

// ============================================
// USE LOCAL STORAGE HOOK
// ============================================

interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

export function useLocalStorage<T>(
  key: string, 
  initialValue: T
): UseLocalStorageReturn<T> {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }, [key, initialValue]);

  return { value: storedValue, setValue, removeValue };
}

// ============================================
// USE DEBOUNCE HOOK
// ============================================

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================
// USE MEDIA QUERY HOOK
// ============================================

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    const updateMatch = () => setMatches(media.matches);
    updateMatch();
    
    media.addEventListener('change', updateMatch);
    return () => media.removeEventListener('change', updateMatch);
  }, [query]);

  return matches;
}

// ============================================
// USE BREAKPOINTS HOOK
// ============================================

interface Breakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
}

export function useBreakpoints(): Breakpoints {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px) and (max-width: 1279px)');
  const isLargeDesktop = useMediaQuery('(min-width: 1280px)');

  return { isMobile, isTablet, isDesktop, isLargeDesktop };
}

// ============================================
// USE CLICK OUTSIDE HOOK
// ============================================

import { RefObject } from 'react';

export function useClickOutside(
  ref: RefObject<HTMLElement>,
  handler: () => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// ============================================
// USE SCROLL POSITION HOOK
// ============================================

interface ScrollPosition {
  x: number;
  y: number;
}

export function useScrollPosition(): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY
      });
    };

    window.addEventListener('scroll', updatePosition);
    updatePosition();

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition;
}

// ============================================
// EXPORT ALL HOOKS
// ============================================

export default {
  useServices,
  useGSM,
  useAudiovisual,
  useCheckout,
  useWhatsApp,
  useLocalStorage,
  useDebounce,
  useMediaQuery,
  useBreakpoints,
  useClickOutside,
  useScrollPosition
};
