/**
 * Verification Code System for Sensitive Actions
 * 
 * Provides 6-digit OTP codes for protecting sensitive actions
 * in the client panel without requiring traditional login.
 */

// Storage keys
const VERIFICATION_STORAGE_KEY = 'tchova_verification';
const SECURE_SESSION_KEY = 'tchova_secure_session';

// Configuration
const CODE_LENGTH = 6;
const CODE_VALIDITY_MINUTES = 5;
const MAX_ATTEMPTS = 3;
const BLOCK_DURATION_MINUTES = 15;
const SECURE_SESSION_MINUTES = 10;

/**
 * Verification code data structure
 */
export interface VerificationCode {
  codeHash: string;
  projectId: string;
  phoneNumber: string;
  createdAt: Date;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
}

/**
 * Secure session data structure
 */
export interface SecureSession {
  projectId: string;
  verifiedAt: Date;
  expiresAt: Date;
  actions: string[]; // Actions that were verified
}

/**
 * Verification result
 */
export interface VerificationResult {
  success: boolean;
  error?: string;
  blocked?: boolean;
  blockedUntil?: Date;
  remainingAttempts?: number;
}

/**
 * Generate a random 6-digit verification code
 * @returns 6-digit numeric code as string
 */
export const generateVerificationCode = (): string => {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
};

/**
 * Hash a verification code (simple implementation for frontend)
 * In production, this should be done on the backend
 * @param code - Code to hash
 * @returns Hashed code
 */
export const hashCode = (code: string): string => {
  // Simple hash for demo - in production use bcrypt or similar on backend
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    const char = code.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).toUpperCase();
};

/**
 * Create a verification code for a project
 * @param projectId - Project ID
 * @param phoneNumber - Client phone number
 * @returns Object with code and verification data
 */
export const createVerificationCode = (
  projectId: string,
  phoneNumber: string
): { code: string; verificationData: VerificationCode } => {
  const code = generateVerificationCode();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CODE_VALIDITY_MINUTES * 60 * 1000);

  const verificationData: VerificationCode = {
    codeHash: hashCode(code),
    projectId,
    phoneNumber,
    createdAt: now,
    expiresAt,
    attempts: 0,
    verified: false
  };

  // Store verification data (in production, this would be in a database)
  storeVerificationData(verificationData);

  return { code, verificationData };
};

/**
 * Store verification data in localStorage
 * @param data - Verification data to store
 */
const storeVerificationData = (data: VerificationCode): void => {
  try {
    localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error storing verification data:', error);
  }
};

/**
 * Get stored verification data
 * @returns Verification data or null
 */
export const getVerificationData = (): VerificationCode | null => {
  try {
    const stored = localStorage.getItem(VERIFICATION_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Convert date strings back to Date objects
      data.createdAt = new Date(data.createdAt);
      data.expiresAt = new Date(data.expiresAt);
      return data;
    }
  } catch (error) {
    console.error('Error getting verification data:', error);
  }
  return null;
};

/**
 * Clear stored verification data
 */
export const clearVerificationData = (): void => {
  try {
    localStorage.removeItem(VERIFICATION_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing verification data:', error);
  }
};

/**
 * Check if verification is blocked due to too many attempts
 * @param data - Verification data
 * @returns Object with blocked status and remaining time
 */
export const isVerificationBlocked = (data: VerificationCode): { blocked: boolean; remainingMinutes: number } => {
  // This would check a database in production
  // For now, we check if attempts >= MAX_ATTEMPTS
  if (data.attempts >= MAX_ATTEMPTS) {
    const blockExpires = new Date(data.createdAt.getTime() + BLOCK_DURATION_MINUTES * 60 * 1000);
    const now = new Date();
    
    if (now < blockExpires) {
      const remainingMs = blockExpires.getTime() - now.getTime();
      const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
      return { blocked: true, remainingMinutes };
    }
  }
  return { blocked: false, remainingMinutes: 0 };
};

/**
 * Verify a code
 * @param code - Code to verify
 * @param projectId - Project ID for validation
 * @returns Verification result
 */
export const verifyCode = (code: string, projectId: string): VerificationResult => {
  const data = getVerificationData();

  if (!data) {
    return {
      success: false,
      error: 'Nenhum código encontrado. Solicite um novo código.'
    };
  }

  // Check if project matches
  if (data.projectId !== projectId) {
    return {
      success: false,
      error: 'Código inválido para este projeto.'
    };
  }

  // Check if already verified
  if (data.verified) {
    return {
      success: false,
      error: 'Código já foi utilizado. Solicite um novo código.'
    };
  }

  // Check if blocked
  const { blocked, remainingMinutes } = isVerificationBlocked(data);
  if (blocked) {
    return {
      success: false,
      blocked: true,
      blockedUntil: new Date(data.createdAt.getTime() + BLOCK_DURATION_MINUTES * 60 * 1000),
      error: `Muitas tentativas. Tente novamente em ${remainingMinutes} minutos.`
    };
  }

  // Check if expired
  if (new Date() > data.expiresAt) {
    return {
      success: false,
      error: 'Código expirado. Solicite um novo código.'
    };
  }

  // Increment attempts
  data.attempts += 1;
  storeVerificationData(data);

  // Verify code
  const inputHash = hashCode(code);
  if (inputHash !== data.codeHash) {
    const remainingAttempts = MAX_ATTEMPTS - data.attempts;
    return {
      success: false,
      error: 'Código incorreto.',
      remainingAttempts: Math.max(0, remainingAttempts)
    };
  }

  // Success - mark as verified
  data.verified = true;
  storeVerificationData(data);

  // Create secure session
  createSecureSession(projectId);

  return { success: true };
};

/**
 * Create a secure session after verification
 * @param projectId - Project ID
 */
export const createSecureSession = (projectId: string): void => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SECURE_SESSION_MINUTES * 60 * 1000);

  const session: SecureSession = {
    projectId,
    verifiedAt: now,
    expiresAt,
    actions: []
  };

  try {
    localStorage.setItem(SECURE_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error creating secure session:', error);
  }
};

/**
 * Get current secure session
 * @returns Secure session or null
 */
export const getSecureSession = (): SecureSession | null => {
  try {
    const stored = localStorage.getItem(SECURE_SESSION_KEY);
    if (stored) {
      const session = JSON.parse(stored);
      session.verifiedAt = new Date(session.verifiedAt);
      session.expiresAt = new Date(session.expiresAt);
      
      // Check if expired
      if (new Date() > session.expiresAt) {
        clearSecureSession();
        return null;
      }
      
      return session;
    }
  } catch (error) {
    console.error('Error getting secure session:', error);
  }
  return null;
};

/**
 * Clear secure session
 */
export const clearSecureSession = (): void => {
  try {
    localStorage.removeItem(SECURE_SESSION_KEY);
  } catch (error) {
    console.error('Error clearing secure session:', error);
  }
};

/**
 * Check if action requires verification
 * @param action - Action to check
 * @returns Boolean indicating if verification is required
 */
export const requiresVerification = (action: string): boolean => {
  const sensitiveActions = [
    'view_payment_details',
    'request_project_change',
    'download_final_files',
    'approve_milestone',
    'generate_new_link',
    'update_contact_info'
  ];
  
  return sensitiveActions.includes(action);
};

/**
 * Check if action is already verified in current session
 * @param action - Action to check
 * @returns Boolean indicating if action is verified
 */
export const isActionVerified = (action: string): boolean => {
  const session = getSecureSession();
  if (!session) return false;
  return session.actions.includes(action);
};

/**
 * Mark action as verified in current session
 * @param action - Action to mark
 */
export const markActionVerified = (action: string): void => {
  const session = getSecureSession();
  if (!session) return;
  
  if (!session.actions.includes(action)) {
    session.actions.push(action);
    try {
      localStorage.setItem(SECURE_SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Error marking action as verified:', error);
    }
  }
};

/**
 * Format verification code for display
 * @param code - Code to format
 * @returns Formatted code (e.g., "482 193")
 */
export const formatVerificationCode = (code: string): string => {
  if (code.length !== CODE_LENGTH) return code;
  return `${code.slice(0, 3)} ${code.slice(3)}`;
};

/**
 * Get time remaining until code expires
 * @param expiresAt - Expiration date
 * @returns Object with minutes and seconds remaining
 */
export const getTimeRemaining = (expiresAt: Date): { minutes: number; seconds: number; total: number } => {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { minutes: 0, seconds: 0, total: 0 };
  }
  
  const minutes = Math.floor(diff / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);
  
  return { minutes, seconds, total: diff };
};

/**
 * Mock function to send verification code via WhatsApp
 * In production, this would call a backend API
 * @param phoneNumber - Phone number to send to
 * @param code - Verification code
 * @returns Promise resolving to success status
 */
export const sendCodeViaWhatsApp = async (phoneNumber: string, code: string): Promise<{ success: boolean; error?: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In production, this would:
  // 1. Call a backend endpoint
  // 2. Backend would send WhatsApp message via Twilio/WhatsApp Business API
  // 3. Message: "Tchova Digital: Seu código de verificação é 482193. Válido por 5 minutos."
  
  console.log(`[MOCK] Sending code ${code} to WhatsApp ${phoneNumber}`);
  
  // For demo, open WhatsApp with pre-filled message
  const message = `Tchova Digital: Meu código de verificação é ${formatVerificationCode(code)}. Válido por 5 minutos.`;
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
  
  return { success: true };
};

/**
 * Mock function to send verification code via SMS
 * In production, this would call a backend API
 * @param phoneNumber - Phone number to send to
 * @param code - Verification code
 * @returns Promise resolving to success status
 */
export const sendCodeViaSMS = async (phoneNumber: string, code: string): Promise<{ success: boolean; error?: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In production, this would call an SMS gateway API
  console.log(`[MOCK] Sending code ${code} to SMS ${phoneNumber}`);
  
  return { success: true };
};
