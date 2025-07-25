import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Hakkımızda */}
        <div>
          <h3 className="footer-title">Hakkımızda</h3>
          <ul className="footer-list">
            <li><a href="#" className="footer-link">Şirketimiz</a></li>
            <li><a href="#" className="footer-link">İletişim</a></li>
          </ul>
        </div>
        {/* Yardım */}
        <div>
          <h3 className="footer-title">Yardım</h3>
          <ul className="footer-list">
            <li><a href="#" className="footer-link">Sipariş Takibi</a></li>
            <li><a href="#" className="footer-link">İade ve Değişim</a></li>
            <li><a href="#" className="footer-link">Sıkça Sorulan Sorular</a></li>
          </ul>
        </div>
        {/* Sosyal Medya */}
        <div>
          <h3 className="footer-title">Bizi Takip Edin</h3>
          <div className="footer-social">
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-copyright">© 2024 Shopping. Tüm hakları saklıdır.</div>
    </footer>
  );
};

export default Footer; 