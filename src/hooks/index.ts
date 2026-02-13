/**
 * ============================================
 * EXPORTAÇÃO CENTRAL DE HOOKS - TCHOVA DIGITAL
 * ============================================
 * Este arquivo exporta todos os hooks customizados
 */

// Re-exportar hooks existentes
export { useLazyImage } from './use-lazy-image';
export { useIsMobile } from './use-mobile';
export { useToast } from './use-toast';
export { useAnalytics } from './useAnalytics';
export { useFirebaseAnalytics } from './useFirebaseAnalytics';
export { useFirebaseAuth } from './useFirebaseAuth';
export { useMozambiqueMobile } from './useMozambiqueMobile';

// Exportar novos hooks
export {
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
} from './useServices';
