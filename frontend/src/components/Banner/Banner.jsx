import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    <section className="relative w-full h-96 md:h-128 overflow-hidden rounded-lg">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            current === idx ? "opacity-100" : "opacity-0"
          }`}
          style={{ 
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {current === idx && <div className="absolute inset-0 bg-black bg-opacity-40"></div>}
          {current === idx && (
            <div className={`absolute inset-0 flex flex-col justify-center p-8 ${
              slide.align === 'left' ? 'items-start' : 'items-end'
            }`}>
              <div className={`max-w-md ${slide.align === 'left' ? 'text-left' : 'text-right'}`}>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{slide.title}</h2>
                <p className="text-lg text-white mb-6">{slide.desc}</p>
                <button 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  onClick={() => handleBannerButtonClick(slide.button)}
                >
                  {slide.button}
                </button>
              </div>
            </div>
          )}
          {/* Sol Ok */}
          {current === idx && (
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all duration-200"
              aria-label="Önceki"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          {/* Sağ Ok */}
          {current === idx && (
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all duration-200"
              aria-label="Sonraki"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          )}
        </div>
      ))}
      {/* Dot Navigasyon */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              current === idx ? "bg-orange-500" : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
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