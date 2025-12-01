// 🔌 PLUG-IN SYSTEM: Feature Configuration
// Easily enable/disable features without breaking code

export interface FeatureConfig {
  name: string;
  enabled: boolean;
  description: string;
  dependencies?: string[];
  fallback?: string;
}

// 🔌 PLUG-IN: Core Features Configuration
export const features: Record<string, FeatureConfig> = {
  // Authentication & User Management
  auth: {
    name: 'Authentication',
    enabled: true,
    description: 'User login, registration and session management',
    dependencies: ['firebase'],
    fallback: 'Demo mode with mock authentication'
  },

  // Analytics & Tracking
  analytics: {
    name: 'Analytics & Tracking',
    enabled: true,
    description: 'User behavior tracking and conversion analytics',
    dependencies: ['firebase'],
    fallback: 'Console logging only'
  },

  // Lead Management
  leadCapture: {
    name: 'Lead Capture',
    enabled: true,
    description: 'Intelligent lead capture and qualification',
    fallback: 'Basic form submission'
  },

  // Payment Processing
  payments: {
    name: 'Payment Processing',
    enabled: true,
    description: 'M-Pesa, eMola and card payment integration',
    fallback: 'Demo payment flow'
  },

  // WhatsApp Integration
  whatsapp: {
    name: 'WhatsApp Integration',
    enabled: true,
    description: 'Contextual WhatsApp messaging and tracking',
    fallback: 'Standard WhatsApp links'
  },

  // Admin Dashboard
  admin: {
    name: 'Admin Dashboard',
    enabled: true,
    description: 'Administrative panel for lead and user management',
    dependencies: ['auth'],
    fallback: 'Basic admin view'
  },

  // Progressive Web App
  pwa: {
    name: 'Progressive Web App',
    enabled: false,
    description: 'PWA features for mobile app-like experience',
    fallback: 'Standard web experience'
  },

  // A/B Testing
  abTesting: {
    name: 'A/B Testing',
    enabled: false,
    description: 'Automated A/B testing for optimization',
    dependencies: ['analytics'],
    fallback: 'Static content'
  }
};

// 🔌 PLUG-IN: Environment-based Feature Control
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

// Auto-disable certain features in development/demo mode
if (isDevelopment) {
  features.analytics.enabled = false; // No real analytics in dev
  features.payments.enabled = false; // Use demo payments
  features.abTesting.enabled = false; // No A/B testing in dev
}

// 🔌 PLUG-IN: Feature Status Checker
export const isFeatureEnabled = (featureName: string): boolean => {
  const feature = features[featureName];
  if (!feature) {
    console.warn(`Feature "${featureName}" not found in configuration`);
    return false;
  }

  // Check dependencies
  if (feature.dependencies) {
    for (const dep of feature.dependencies) {
      if (!isFeatureEnabled(dep)) {
        console.warn(`Feature "${featureName}" disabled due to missing dependency: ${dep}`);
        return false;
      }
    }
  }

  return feature.enabled;
};

// 🔌 PLUG-IN: Safe Feature Access
export const getFeatureConfig = (featureName: string): FeatureConfig | null => {
  return features[featureName] || null;
};

// 🔌 PLUG-IN: Feature Status Report
export const getFeaturesStatus = () => {
  const status: Record<string, { enabled: boolean; status: string }> = {};

  Object.keys(features).forEach(featureName => {
    const feature = features[featureName];
    const enabled = isFeatureEnabled(featureName);
    let statusText = enabled ? 'active' : 'disabled';

    // Check for issues
    if (enabled && feature.dependencies) {
      const missingDeps = feature.dependencies.filter(dep => !isFeatureEnabled(dep));
      if (missingDeps.length > 0) {
        statusText = `error: missing ${missingDeps.join(', ')}`;
      }
    }

    status[featureName] = {
      enabled,
      status: statusText
    };
  });

  return status;
};

// 🔌 PLUG-IN: Feature Toggle (for development/testing)
export const toggleFeature = (featureName: string): boolean => {
  if (features[featureName]) {
    features[featureName].enabled = !features[featureName].enabled;
    console.log(`🔌 Feature "${featureName}" ${features[featureName].enabled ? 'enabled' : 'disabled'}`);
    return features[featureName].enabled;
  }
  return false;
};