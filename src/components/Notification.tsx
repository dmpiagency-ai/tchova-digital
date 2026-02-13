import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationData {
  type: 'warning' | 'error' | 'success' | 'info';
  title: string;
  message: string;
}

export const Notification: React.FC = () => {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleShowNotification = (event: CustomEvent) => {
      const data: NotificationData = event.detail;
      setNotification(data);
      setIsVisible(true);

      // Auto-hide após 5 segundos
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setNotification(null), 300);
      }, 5000);
    };

    window.addEventListener('show-notification', handleShowNotification as EventListener);

    return () => {
      window.removeEventListener('show-notification', handleShowNotification as EventListener);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setNotification(null), 300);
  };

  if (!notification || !isVisible) return null;

  const getAlertVariant = () => {
    switch (notification.type) {
      case 'warning':
        return 'default';
      case 'error':
        return 'destructive';
      case 'success':
        return 'default';
      case 'info':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm animate-fade-up">
      <Alert variant={getAlertVariant()} className="shadow-lg border-r-4 border-r-orange-500">
        <AlertCircle className="h-4 w-4" />
        <div className="flex-1">
          <AlertDescription className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{notification.title}</p>
              <p className="text-sm mt-1">{notification.message}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 ml-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
};