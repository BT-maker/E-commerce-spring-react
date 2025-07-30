import { useEffect } from 'react';

const PageTitle = ({ title, suffix = "E-Ticaret" }) => {
  useEffect(() => {
    const fullTitle = suffix ? `${title} - ${suffix}` : title;
    document.title = fullTitle;
    
    // Component unmount olduğunda varsayılan başlığa geri dön
    return () => {
      document.title = "E-Ticaret";
    };
  }, [title, suffix]);

  return null; // Bu component sadece title'ı değiştirir, UI render etmez
};

export default PageTitle;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Sayfa Başlığı: Browser tab'ında görünen sayfa başlığını güncelleme
 * 2. Dynamic Title: Sayfa içeriğine göre dinamik başlık
 * 3. SEO Optimization: Arama motorları için optimize edilmiş başlıklar
 * 4. Cleanup: Component unmount olduğunda varsayılan başlığa dönme
 * 5. Suffix Support: Başlık sonuna site adı ekleme
 * 
 * Bu component sayesinde her sayfa uygun başlığa sahip olur ve SEO performansı artar!
 */ 