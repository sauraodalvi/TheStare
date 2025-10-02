export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { valid: false, message: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  
  return { valid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  return { valid: true };
};

export const validateForm = (email: string, password: string): ValidationResult => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) return emailValidation;
  
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) return passwordValidation;
  
  return { valid: true };
};
