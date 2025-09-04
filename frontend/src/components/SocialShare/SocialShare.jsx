import React from 'react';
import { Facebook, Twitter, Linkedin, Mail, Share2 } from 'lucide-react';


const SocialShare = ({ 
  title, 
  description, 
  url = window.location.href,
  className = '' 
}) => {
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedUrl = encodeURIComponent(url);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };

  const handleShare = (platform) => {
    const shareUrl = shareUrls[platform];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
      } catch (error) {
        console.log('Paylaşım iptal edildi veya hata oluştu');
      }
    } else {
      // Fallback: URL'yi panoya kopyala
      navigator.clipboard.writeText(url).then(() => {
        alert('Link panoya kopyalandı!');
      });
    }
  };

  return (
    <div className={`social-share ${className}`}>
      <div className="social-share-title">Paylaş:</div>
      <div className="social-share-buttons">
        <button
          onClick={() => handleShare('facebook')}
          className="social-share-btn facebook"
          title="Facebook'ta paylaş"
          aria-label="Facebook'ta paylaş"
        >
          <Facebook size={18} />
        </button>
        
        <button
          onClick={() => handleShare('twitter')}
          className="social-share-btn twitter"
          title="Twitter'da paylaş"
          aria-label="Twitter'da paylaş"
        >
          <Twitter size={18} />
        </button>
        
        <button
          onClick={() => handleShare('linkedin')}
          className="social-share-btn linkedin"
          title="LinkedIn'de paylaş"
          aria-label="LinkedIn'de paylaş"
        >
          <Linkedin size={18} />
        </button>
        
        <button
          onClick={() => handleShare('email')}
          className="social-share-btn email"
          title="E-posta ile paylaş"
          aria-label="E-posta ile paylaş"
        >
          <Mail size={18} />
        </button>
        
        <button
          onClick={handleNativeShare}
          className="social-share-btn native"
          title="Paylaş"
          aria-label="Paylaş"
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default SocialShare;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Sosyal Medya Paylaşımı: Ürünleri sosyal medyada paylaşma
 * 2. Platform Desteği: Facebook, Twitter, LinkedIn, Email
 * 3. Native Share: Mobil cihazlarda native paylaşım API'si
 * 4. URL Encoding: Paylaşım linklerini güvenli şekilde kodlama
 * 5. Fallback: Native share desteklenmeyen cihazlarda URL kopyalama
 * 6. Accessibility: Erişilebilirlik için aria-label'lar
 * 7. Responsive Design: Mobil ve desktop uyumlu tasarım
 * 
 * Bu component sayesinde kullanıcılar ürünleri kolayca sosyal medyada paylaşabilir!
 */ 