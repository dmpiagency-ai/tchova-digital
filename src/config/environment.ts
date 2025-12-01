// 🔌 PLUG-IN SYSTEM: Environment Configuration
// Centralized environment variables and configuration

// Environment Detection
export const environment = {
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  isTest: import.meta.env.MODE === 'test',
  mode: import.meta.env.MODE,
  baseUrl: import.meta.env.BASE_URL
};

// 🔌 PLUG-IN: Firebase Environment Variables
export const firebaseEnv = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  useEmulator: import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true'
};

// 🔌 PLUG-IN: WhatsApp Configuration
export const whatsappConfig = {
  number: import.meta.env.VITE_WHATSAPP_NUMBER || '+258841234567',
  defaultMessage: 'Olá! Gostaria de saber mais sobre os serviços da TchovaDigital.',
  serviceMessages: {
    design: 'Olá! Estou interessado em serviços de design gráfico.',
    web: 'Olá! Preciso de desenvolvimento web para meu negócio.',
    marketing: 'Olá! Quero melhorar minha presença digital com marketing.',
    gsm: 'Olá! Preciso de assistência técnica GSM.',
    default: 'Olá! Gostaria de conversar sobre meus projetos digitais.'
  }
};

// 🔌 PLUG-IN: Payment Configuration
export const paymentConfig = {
  // M-Pesa
  mpesa: {
    enabled: true,
    shortcode: import.meta.env.VITE_MPESA_SHORTCODE,
    passkey: import.meta.env.VITE_MPESA_PASSKEY,
    consumerKey: import.meta.env.VITE_MPESA_CONSUMER_KEY,
    consumerSecret: import.meta.env.VITE_MPESA_CONSUMER_SECRET
  },

  // eMola
  emola: {
    enabled: true,
    merchantId: import.meta.env.VITE_EMOLA_MERCHANT_ID,
    apiKey: import.meta.env.VITE_EMOLA_API_KEY
  },

  // Demo Mode
  demo: {
    enabled: !environment.isProduction,
    simulateDelay: 2000,
    successRate: 0.9
  }
};

// 🔌 PLUG-IN: Analytics Configuration
export const analyticsConfig = {
  googleAnalyticsId: import.meta.env.VITE_GA_MEASUREMENT_ID,
  facebookPixelId: import.meta.env.VITE_FB_PIXEL_ID,
  enableTracking: environment.isProduction && !import.meta.env.VITE_DISABLE_ANALYTICS,
  debugMode: import.meta.env.VITE_ANALYTICS_DEBUG === 'true'
};

// 🔌 PLUG-IN: API Configuration
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.tchovadigital.com',
  timeout: 10000,
  retries: 3,
  enableCache: true
};

// 🔌 PLUG-IN: Security Configuration
export const securityConfig = {
  enableCSP: environment.isProduction,
  enableHSTS: environment.isProduction,
  corsOrigins: environment.isProduction
    ? ['https://tchovadigital.com', 'https://www.tchovadigital.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};

// 🔌 PLUG-IN: Feature Flags from Environment
export const featureFlags = {
  enableLogin: import.meta.env.VITE_ENABLE_LOGIN !== 'false',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
  enablePayments: import.meta.env.VITE_ENABLE_PAYMENTS !== 'false',
  enableAdmin: import.meta.env.VITE_ENABLE_ADMIN === 'true',
  useEmulator: import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true'
};

// 🔌 PLUG-IN: Validation Function
export const validateEnvironment = () => {
  const issues: string[] = [];

  // Check required Firebase config in production
  if (environment.isProduction) {
    const requiredFirebase = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_PROJECT_ID'];
    requiredFirebase.forEach(key => {
      if (!import.meta.env[key]) {
        issues.push(`Missing required Firebase config: ${key}`);
      }
    });
  }

  // Check WhatsApp number
  if (!whatsappConfig.number || whatsappConfig.number === '+258841234567') {
    issues.push('WhatsApp number not configured - using demo number');
  }

  // Check analytics in production
  if (environment.isProduction && !analyticsConfig.googleAnalyticsId) {
    issues.push('Google Analytics ID not configured for production');
  }

  return {
    valid: issues.length === 0,
    issues,
    config: {
      environment,
      firebase: firebaseEnv,
      whatsapp: whatsappConfig,
      analytics: analyticsConfig,
      features: featureFlags
    }
  };
};

// 🔌 PLUG-IN: Configuration Status
export const getConfigStatus = () => {
  const validation = validateEnvironment();

  return {
    environment: environment.mode,
    firebase: firebaseEnv.projectId ? 'configured' : 'missing',
    whatsapp: whatsappConfig.number !== '+258841234567' ? 'configured' : 'demo',
    analytics: analyticsConfig.googleAnalyticsId ? 'configured' : 'missing',
    payments: paymentConfig.demo.enabled ? 'demo' : 'configured',
    valid: validation.valid,
    issues: validation.issues
  };
};