/**
 * Password Utils Test Dosyası
 * SHA-256 hashleme ve şifre güçlülük kontrolü testleri
 */

import { 
  hashPassword, 
  validatePasswordStrength, 
  getPasswordStrengthText, 
  getPasswordStrengthColor 
} from '../passwordUtils';

describe('Password Utils Tests', () => {
  
  describe('hashPassword', () => {
    test('should hash password with SHA-256', async () => {
      const password = 'testPassword123';
      const hashed = await hashPassword(password);
      
      expect(hashed).toBeDefined();
      expect(hashed).toHaveLength(64); // SHA-256 produces 64 character hex string
      expect(hashed).toMatch(/^[a-f0-9]+$/); // Should be hexadecimal
    });

    test('should produce consistent hashes for same input', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).toBe(hash2);
    });

    test('should produce different hashes for different inputs', async () => {
      const password1 = 'testPassword123';
      const password2 = 'testPassword124';
      
      const hash1 = await hashPassword(password1);
      const hash2 = await hashPassword(password2);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('validatePasswordStrength', () => {
    test('should validate weak password', () => {
      const weakPassword = '123';
      const result = validatePasswordStrength(weakPassword);
      
      expect(result.isValid).toBe(false);
      expect(result.length).toBe(false);
      expect(result.score).toBe(0);
    });

    test('should validate strong password', () => {
      const strongPassword = 'TestPassword123!';
      const result = validatePasswordStrength(strongPassword);
      
      expect(result.isValid).toBe(true);
      expect(result.length).toBe(true);
      expect(result.hasUpperCase).toBe(true);
      expect(result.hasLowerCase).toBe(true);
      expect(result.hasNumbers).toBe(true);
      expect(result.hasSpecialChar).toBe(true);
      expect(result.score).toBe(5);
    });

    test('should validate medium password', () => {
      const mediumPassword = 'Test123';
      const result = validatePasswordStrength(mediumPassword);
      
      expect(result.isValid).toBe(true);
      expect(result.length).toBe(true);
      expect(result.hasUpperCase).toBe(true);
      expect(result.hasLowerCase).toBe(true);
      expect(result.hasNumbers).toBe(true);
      expect(result.hasSpecialChar).toBe(false);
      expect(result.score).toBe(4);
    });
  });

  describe('getPasswordStrengthText', () => {
    test('should return correct strength text', () => {
      expect(getPasswordStrengthText(0)).toBe('Çok Zayıf');
      expect(getPasswordStrengthText(1)).toBe('Çok Zayıf');
      expect(getPasswordStrengthText(2)).toBe('Zayıf');
      expect(getPasswordStrengthText(3)).toBe('Orta');
      expect(getPasswordStrengthText(4)).toBe('Güçlü');
      expect(getPasswordStrengthText(5)).toBe('Çok Güçlü');
    });
  });

  describe('getPasswordStrengthColor', () => {
    test('should return correct color classes', () => {
      expect(getPasswordStrengthColor(0)).toBe('text-red-500');
      expect(getPasswordStrengthColor(1)).toBe('text-red-500');
      expect(getPasswordStrengthColor(2)).toBe('text-orange-500');
      expect(getPasswordStrengthColor(3)).toBe('text-yellow-500');
      expect(getPasswordStrengthColor(4)).toBe('text-blue-500');
      expect(getPasswordStrengthColor(5)).toBe('text-green-500');
    });
  });
});
