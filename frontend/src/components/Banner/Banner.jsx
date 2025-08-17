import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Banner.css";

const slides = [
  {
    image: "/img/slider.jpeg",
    title: "Özel İndirimler",
    desc: "Seçili ürünlerde  indirimler",
    button: "İndirimleri Gör",
    align: "left"
  },
  {
    image: "/img/slider2.jpeg",
    title: "Yeni Sezon Ürünleri",
    desc: "İlkbahar koleksiyonunu keşfet!",
    button: "Koleksiyonu İncele",
    align: "right"
  },
  {
    image: "/img/slider3.jpeg",
    title: "Fırsat Günleri",
    desc: "Sadece bu hafta geçerli büyük fırsatlar!",
    button: "Fırsatları Kaçırma",
    align: "left"
  }
];

const Banner = () => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [current, length]);

  const prevSlide = () => setCurrent((prev) => (prev - 1 + length) % length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % length);
  
  const handleBannerButtonClick = (buttonText) => {
    if (buttonText === "İndirimleri Gör") {
      // İndirimli ürünleri göster
      navigate("/discounted-products");
    } else if (buttonText === "Koleksiyonu İncele") {
      // Koleksiyon sayfasına git
      navigate("/products");
    } else if (buttonText === "Fırsatları Kaçırma") {
      // Fırsatlar sayfasına git
      navigate("/products");
    }
  };

  return (
    <section className="banner-slider">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`banner-slide${current === idx ? " active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          {current === idx && <div className="banner-darken"></div>}
          {current === idx && (
            <div className={`banner-overlay ${slide.align}`}>
              <h2 className="banner-title">{slide.title}</h2>
              <p className="banner-desc">{slide.desc}</p>
              <button 
                className="banner-btn"
                onClick={() => handleBannerButtonClick(slide.button)}
              >
                {slide.button}
              </button>
            </div>
          )}
          {/* Sol Ok */}
          {current === idx && (
            <button
              onClick={prevSlide}
              className="banner-arrow left"
              aria-label="Önceki"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          {/* Sağ Ok */}
          {current === idx && (
            <button
              onClick={nextSlide}
              className="banner-arrow right"
              aria-label="Sonraki"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          )}
        </div>
      ))}
      {/* Dot Navigasyon */}
      <div className="banner-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`banner-dot${current === idx ? " active" : ""}`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Banner;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Slider Banner: Ana sayfa için otomatik geçişli banner
 * 2. Otomatik Geçiş: 5 saniyede bir slide değişimi
 * 3. Manuel Kontrol: Ok tuşları ile manuel geçiş
 * 4. Dot Navigation: Alt kısımda nokta navigasyonu
 * 5. Responsive Design: Mobil ve desktop uyumlu tasarım
 * 6. Call-to-Action: Her slide için aksiyon butonları
 * 7. Dark Overlay: Metin okunabilirliği için karanlık katman
 * 
 * Bu component sayesinde ana sayfa etkileyici ve kullanıcı dostu bir görünüme sahip olur!
 */