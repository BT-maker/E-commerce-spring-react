import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Hakkımızda */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400">Hakkımızda</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-orange-400 transition-colors">Şirketimiz</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-orange-400 transition-colors">İletişim</Link></li>
            </ul>
          </div>
          {/* Yardım */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400">Yardım</h3>
            <ul className="space-y-2">
              <li><Link to="/order-tracking" className="text-gray-300 hover:text-orange-400 transition-colors">Sipariş Takibi</Link></li>
              <li><Link to="/return-exchange" className="text-gray-300 hover:text-orange-400 transition-colors">İade ve Değişim</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-orange-400 transition-colors">Sıkça Sorulan Sorular</Link></li>
            </ul>
          </div>
          {/* Sosyal Medya */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400">Bizi Takip Edin</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-orange-400 transition-colors text-2xl"><FaInstagram /></a>
              <a href="#" aria-label="Twitter" className="text-gray-300 hover:text-orange-400 transition-colors text-2xl"><FaTwitter /></a>
              <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-orange-400 transition-colors text-2xl"><FaFacebook /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">© 2024 Shopping. Tüm hakları saklıdır.</div>
      </div>
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