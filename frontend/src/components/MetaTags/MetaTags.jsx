import { useEffect } from 'react';

const MetaTags = ({ 
  title, 
  description, 
  keywords = "", 
  image = "", 
  url = window.location.href,
  type = "website",
  siteName = "E-Ticaret"
}) => {
  useEffect(() => {
    // Meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;

    // Meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords;

    // Open Graph meta tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = title;

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.content = description;

    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.content = image;

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = url;

    // Yeni OG etiketleri
    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      document.head.appendChild(ogType);
    }
    ogType.content = type;

    let ogSiteName = document.querySelector('meta[property="og:site_name"]');
    if (!ogSiteName) {
      ogSiteName = document.createElement('meta');
      ogSiteName.setAttribute('property', 'og:site_name');
      document.head.appendChild(ogSiteName);
    }
    ogSiteName.content = siteName;

    let ogLocale = document.querySelector('meta[property="og:locale"]');
    if (!ogLocale) {
      ogLocale = document.createElement('meta');
      ogLocale.setAttribute('property', 'og:locale');
      document.head.appendChild(ogLocale);
    }
    ogLocale.content = 'tr_TR';

    // Twitter Card meta tags
    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
      twitterCard = document.createElement('meta');
      twitterCard.name = 'twitter:card';
      document.head.appendChild(twitterCard);
    }
    twitterCard.content = 'summary_large_image';

    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.name = 'twitter:title';
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.content = title;

    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta');
      twitterDescription.name = 'twitter:description';
      document.head.appendChild(twitterDescription);
    }
    twitterDescription.content = description;

    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (!twitterImage) {
      twitterImage = document.createElement('meta');
      twitterImage.name = 'twitter:image';
      document.head.appendChild(twitterImage);
    }
    twitterImage.content = image;

    // Cleanup function
    return () => {
      // Component unmount olduğunda varsayılan değerlere dön
      if (metaDescription) metaDescription.content = "E-Ticaret platformu - En kaliteli ürünler, en uygun fiyatlarla";
      if (metaKeywords) metaKeywords.content = "e-ticaret, online alışveriş, ürünler, mağaza";
      if (ogTitle) ogTitle.content = "E-Ticaret";
      if (ogDescription) ogDescription.content = "E-Ticaret platformu - En kaliteli ürünler, en uygun fiyatlarla";
      if (ogImage) ogImage.content = "";
      if (ogUrl) ogUrl.content = window.location.origin;
      if (ogType) ogType.content = "website";
      if (ogSiteName) ogSiteName.content = "E-Ticaret";
      if (ogLocale) ogLocale.content = "tr_TR";
      if (twitterTitle) twitterTitle.content = "E-Ticaret";
      if (twitterDescription) twitterDescription.content = "E-Ticaret platformu - En kaliteli ürünler, en uygun fiyatlarla";
      if (twitterImage) twitterImage.content = "";
    };
  }, [title, description, keywords, image, url, type, siteName]);

  return null; // Bu component sadece meta etiketleri günceller, UI render etmez
};

export default MetaTags;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. SEO Meta Tags: Sayfa meta etiketlerini dinamik olarak güncelleme
 * 2. Open Graph: Sosyal medya paylaşımları için OG etiketleri
 * 3. Twitter Cards: Twitter paylaşımları için meta etiketleri
 * 4. Dynamic Content: Sayfa içeriğine göre meta etiketleri
 * 5. Cleanup: Component unmount olduğunda varsayılan değerlere dönme
 * 6. Accessibility: Erişilebilirlik için gerekli meta etiketleri
 * 
 * Bu component sayesinde web sitesi SEO açısından optimize edilmiş ve sosyal medya paylaşımları güzel görünür!
 */ 