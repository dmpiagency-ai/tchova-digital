// 🔌 PLUG-IN SYSTEM: Firebase Integrations
// Central hub for all Firebase integrations in TchovaDigital

import React from 'react';
import { useAuth } from '@/hooks/useFirebaseAuth';
import { useAnalytics } from '@/hooks/useFirebaseAnalytics';
import { getFirebaseStatus } from '@/config/firebase';
import { getFeaturesStatus } from '@/config/features';
import { validateEnvironment } from '@/config/environment';

// 🔌 PLUG-IN: Main Firebase Integration Hook
export const useFirebaseIntegrations = () => {
  // 🔌 PLUG-IN: Connect authentication
  const auth = useAuth();

  // 🔌 PLUG-IN: Connect analytics
  const analytics = useAnalytics();

  // 🔌 PLUG-IN: Auto-track user authentication events
  React.useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      // Track login event
      analytics.setUser(auth.user.uid, {
        email: auth.user.email,
        name: auth.user.displayName
      });
      analytics.trackEvent({
        name: 'login',
        parameters: { method: 'email' }
      });
    }
  }, [auth.isAuthenticated, auth.user, analytics]);

  // 🔌 PLUG-IN: Auto-track logout
  React.useEffect(() => {
    if (!auth.isAuthenticated && auth.user === null) {
      analytics.trackEvent({ name: 'logout' });
    }
  }, [auth.isAuthenticated, analytics]);

  return {
    // Authentication
    auth,

    // Analytics
    analytics,

    // System Status
    getStatus: () => ({
      firebase: getFirebaseStatus(),
      features: getFeaturesStatus(),
      environment: validateEnvironment()
    }),

    // Utility functions
    trackWhatsAppClick: (source: string, service?: string) => {
      analytics.trackWhatsAppClick(source, service);
    },

    trackServiceView: (serviceName: string) => {
      analytics.trackServiceView(serviceName);
    },

    trackConversion: (type: string, value?: number) => {
      analytics.trackConversion(type, value);
    }
  };
};

// 🔌 PLUG-IN: WhatsApp Integration with Analytics
export const useWhatsAppIntegration = () => {
  const { analytics } = useFirebaseIntegrations();

  const sendWhatsAppMessage = (message: string, source: string, service?: string) => {
    // Track the click
    analytics.trackWhatsAppClick(source, service);

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return { sendWhatsAppMessage };
};

// 🔌 PLUG-IN: Service Tracking Integration
export const useServiceTracking = () => {
  const { analytics } = useFirebaseIntegrations();

  const trackServiceInteraction = (serviceName: string, action: 'view' | 'click' | 'convert') => {
    switch (action) {
      case 'view':
        analytics.trackServiceView(serviceName);
        break;
      case 'click':
        analytics.trackEvent({
          name: 'service_click',
          parameters: { service_name: serviceName }
        });
        break;
      case 'convert':
        analytics.trackConversion('service_booking', undefined);
        break;
    }
  };

  return { trackServiceInteraction };
};

// 🔌 PLUG-IN: Lead Capture Integration
export const useLeadCapture = () => {
  const { analytics } = useFirebaseIntegrations();

  const captureLead = (leadData: {
    name: string;
    email: string;
    service?: string;
    source: string;
  }) => {
    // Track lead capture event
    analytics.trackEvent({
      name: 'lead_capture',
      parameters: {
        lead_source: leadData.source,
        service_interest: leadData.service,
        has_email: !!leadData.email
      }
    });

    // Here you would typically save to Firebase Firestore
    // or send to your CRM system
    console.log('Lead captured:', leadData);

    return {
      success: true,
      leadId: `lead_${Date.now()}`
    };
  };

  return { captureLead };
};

// 🔌 PLUG-IN: Payment Tracking Integration
export const usePaymentTracking = () => {
  const { analytics } = useFirebaseIntegrations();

  const trackPaymentEvent = (
    event: 'start' | 'complete' | 'fail',
    amount: number,
    service: string
  ) => {
    const eventName = event === 'start' ? 'payment_start' :
                     event === 'complete' ? 'payment_complete' : 'payment_fail';

    analytics.trackEvent({
      name: eventName,
      parameters: {
        value: amount,
        currency: 'MZN',
        service_name: service
      }
    });

    if (event === 'complete') {
      analytics.trackPurchase(`payment_${Date.now()}`, amount, 'MZN');
    }
  };

  return { trackPaymentEvent };
};

// 🔌 PLUG-IN: Debug and Development Helpers
export const useFirebaseDebug = () => {
  const integrations = useFirebaseIntegrations();

  const logStatus = () => {
    const status = integrations.getStatus();
    console.group('🔥 Firebase Status');
    console.log('Firebase:', status.firebase);
    console.log('Features:', status.features);
    console.log('Environment:', status.environment);
    console.groupEnd();
  };

  const testIntegrations = async () => {
    console.group('🧪 Testing Firebase Integrations');

    // Test analytics
    integrations.analytics.trackEvent({
      name: 'test_event',
      parameters: { test: true }
    });

    // Test WhatsApp tracking
    integrations.trackWhatsAppClick('test', 'design');

    // Test service tracking
    integrations.trackServiceView('Design Test');

    console.log('✅ All integrations tested');
    console.groupEnd();
  };

  return {
    logStatus,
    testIntegrations,
    status: integrations.getStatus()
  };
};

// 🔌 PLUG-IN: Export all integrations
export {
  useAuth
} from '@/hooks/useFirebaseAuth';

export {
  useAnalytics
} from '@/hooks/useFirebaseAnalytics';