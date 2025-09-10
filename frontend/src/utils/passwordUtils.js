/**
 * Şifre hashleme utility fonksiyonları
 * Frontend'de şifreleri SHA-256 ile hash'leyerek backend'e gönderir
 */

/**
 * Şifreyi SHA-256 ile hash'ler
 * @param {string} password - Hash'lenecek şifre
 * @returns {Promise<string>} - SHA-256 hash'lenmiş şifre
 */
export const hashPassword = async (password) => {
  try {
    // Web Crypto API kullanarak SHA-256 hash'leme
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  } catch (error) {
    console.error('SHA-256 hashleme hatası:', error);
    throw new Error('Şifre hashlenemedi');
  }
};

/**
 * Şifre güçlülük kontrolü
 * @param {string} password - Kontrol edilecek şifre
 * @returns {object} - Şifre güçlülük bilgileri
 */
export const validatePasswordStrength = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const strength = {
    isValid: password.length >= minLength,
    length: password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
    score: 0
  };
  
  // Güçlülük skoru hesapla
  if (strength.length) strength.score++;
  if (hasUpperCase) strength.score++;
  if (hasLowerCase) strength.score++;
  if (hasNumbers) strength.score++;
  if (hasSpecialChar) strength.score++;
  
  return strength;
};

/**
 * Şifre güçlülük seviyesini metin olarak döner
 * @param {number} score - Güçlülük skoru
 * @returns {string} - Güçlülük seviyesi
 */
export const getPasswordStrengthText = (score) => {
  if (score < 2) return 'Çok Zayıf';
  if (score < 3) return 'Zayıf';
  if (score < 4) return 'Orta';
  if (score < 5) return 'Güçlü';
  return 'Çok Güçlü';
};

/**
 * Şifre güçlülük rengini döner
 * @param {number} score - Güçlülük skoru
 * @returns {string} - Tailwind CSS renk sınıfı
 */
export const getPasswordStrengthColor = (score) => {
  if (score < 2) return 'text-red-500';
  if (score < 3) return 'text-orange-400';
  if (score < 4) return 'text-orange-500';
  if (score < 5) return 'text-orange-600';
  return 'text-green-500';
};
