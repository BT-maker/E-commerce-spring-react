import React from 'react';
import PageTitle from '../components/PageTitle/PageTitle';
import MetaTags from '../components/MetaTags/MetaTags';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <PageTitle title="Şirketimiz" />
      <MetaTags 
        title="Şirketimiz"
        description="Shopping platformu hakkında detaylı bilgi. Misyonumuz, vizyonumuz ve değerlerimiz."
        keywords="şirket, hakkımızda, misyon, vizyon, shopping"
      />
      
      <div className="about-us-content">
        <h1 className="about-us-title">Şirketimiz</h1>
        
        <div className="about-section">
          <h2>Hakkımızda</h2>
          <p>
            Shopping, 2024 yılında kurulmuş, Türkiye'nin önde gelen e-ticaret platformlarından biridir. 
            Müşterilerimize en kaliteli ürünleri, en uygun fiyatlarla sunmayı hedeflemekteyiz.
          </p>
        </div>

        <div className="about-section">
          <h2>Misyonumuz</h2>
          <p>
            Müşterilerimize güvenli, hızlı ve kaliteli alışveriş deneyimi sunarak, 
            hayatlarını kolaylaştırmak ve ihtiyaçlarını en iyi şekilde karşılamak.
          </p>
        </div>

        <div className="about-section">
          <h2>Vizyonumuz</h2>
          <p>
            Türkiye'nin en güvenilir ve tercih edilen e-ticaret platformu olmak, 
            teknolojik yeniliklerle müşteri memnuniyetini sürekli artırmak.
          </p>
        </div>

        <div className="about-section">
          <h2>Değerlerimiz</h2>
          <ul className="values-list">
            <li><strong>Müşteri Odaklılık:</strong> Müşterilerimizin ihtiyaçlarını her zaman ön planda tutarız</li>
            <li><strong>Güvenilirlik:</strong> Şeffaf ve dürüst iş yapma prensibiyle çalışırız</li>
            <li><strong>Kalite:</strong> En kaliteli ürünleri en uygun fiyatlarla sunarız</li>
            <li><strong>Yenilikçilik:</strong> Teknolojik gelişmeleri takip ederek hizmetlerimizi sürekli iyileştiririz</li>
            <li><strong>Sürdürülebilirlik:</strong> Çevreye duyarlı ve sürdürülebilir iş modelleri geliştiririz</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>Rakamlarla Biz</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>10,000+</h3>
              <p>Mutlu Müşteri</p>
            </div>
            <div className="stat-item">
              <h3>50,000+</h3>
              <p>Ürün Çeşidi</p>
            </div>
            <div className="stat-item">
              <h3>100+</h3>
              <p>Mağaza Ortaklığı</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Müşteri Desteği</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>Ekibimiz</h2>
          <p>
            Deneyimli ve uzman ekibimizle, müşterilerimize en iyi hizmeti sunmak için 
            sürekli kendimizi geliştiriyoruz. Teknoloji, pazarlama, müşteri hizmetleri 
            ve lojistik alanlarında uzman kadromuzla hizmetinizdeyiz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 