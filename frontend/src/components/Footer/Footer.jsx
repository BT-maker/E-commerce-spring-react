import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Hakkımızda */}
        <div>
          <h3 className="footer-title">Hakkımızda</h3>
          <ul className="footer-list">
            <li><Link to="/about" className="footer-link">Şirketimiz</Link></li>
            <li><Link to="/contact" className="footer-link">İletişim</Link></li>
          </ul>
        </div>
        {/* Yardım */}
        <div>
          <h3 className="footer-title">Yardım</h3>
          <ul className="footer-list">
            <li><Link to="/order-tracking" className="footer-link">Sipariş Takibi</Link></li>
            <li><Link to="/return-exchange" className="footer-link">İade ve Değişim</Link></li>
            <li><Link to="/faq" className="footer-link">Sıkça Sorulan Sorular</Link></li>
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

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Site Footer: Web sitesinin alt kısmı
 * 2. Navigasyon Linkleri: Hakkımızda, iletişim, yardım sayfaları
 * 3. Sosyal Medya: Sosyal medya platformlarına linkler
 * 4. Copyright: Telif hakkı bilgisi
 * 5. Responsive Design: Mobil ve desktop uyumlu tasarım
 * 6. Accessibility: Erişilebilirlik için aria-label'lar
 * 
 * Bu component sayesinde web sitesi profesyonel ve kullanıcı dostu bir footer'a sahip olur!
 */