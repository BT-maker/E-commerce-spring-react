import React, { useState, useEffect } from "react";
import "./Banner.css";

const slides = [
  {
    image: "/img/slider.jpeg",
    title: "Özel İndirimler",
    desc: "Seçili ürünlerde %30'a varan indirimler",
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [current, length]);

  const prevSlide = () => setCurrent((prev) => (prev - 1 + length) % length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % length);

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
              <button className="banner-btn">{slide.button}</button>
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