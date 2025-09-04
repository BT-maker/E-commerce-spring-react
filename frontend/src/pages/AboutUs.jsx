import React from 'react';
import PageTitle from '../components/PageTitle/PageTitle';
import MetaTags from '../components/MetaTags/MetaTags';
import { Users, Package, Store, Clock, Award, Target, Eye, Heart, Zap, Leaf } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      <PageTitle title="Şirketimiz" />
      <MetaTags 
        title="Şirketimiz"
        description="Shopping platformu hakkında detaylı bilgi. Misyonumuz, vizyonumuz ve değerlerimiz."
        keywords="şirket, hakkımızda, misyon, vizyon, shopping"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Şirketimiz</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Türkiye'nin önde gelen e-ticaret platformlarından biri olarak, 
            müşterilerimize en kaliteli ürünleri, en uygun fiyatlarla sunuyoruz.
          </p>
        </div>

        {/* About Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-8 h-8 text-orange-500" />
                <h2 className="text-2xl font-bold text-gray-900">Misyonumuz</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Müşterilerimize güvenli, hızlı ve kaliteli alışveriş deneyimi sunarak, 
                hayatlarını kolaylaştırmak ve ihtiyaçlarını en iyi şekilde karşılamak.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-8 h-8 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-900">Vizyonumuz</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Türkiye'nin en güvenilir ve tercih edilen e-ticaret platformu olmak, 
                teknolojik yeniliklerle müşteri memnuniyetini sürekli artırmak.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <Heart className="w-8 h-8 text-red-500" />
                <h2 className="text-2xl font-bold text-gray-900">Değerlerimiz</h2>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-gray-900">Müşteri Odaklılık:</strong> Müşterilerimizin ihtiyaçlarını her zaman ön planda tutarız
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-gray-900">Güvenilirlik:</strong> Şeffaf ve dürüst iş yapma prensibiyle çalışırız
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-gray-900">Kalite:</strong> En kaliteli ürünleri en uygun fiyatlarla sunarız
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-gray-900">Yenilikçilik:</strong> Teknolojik gelişmeleri takip ederek hizmetlerimizi sürekli iyileştiririz
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-gray-900">Sürdürülebilirlik:</strong> Çevreye duyarlı ve sürdürülebilir iş modelleri geliştiririz
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-8 h-8 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-900">Ekibimiz</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Deneyimli ve uzman ekibimizle, müşterilerimize en iyi hizmeti sunmak için 
                sürekli kendimizi geliştiriyoruz. Teknoloji, pazarlama, müşteri hizmetleri 
                ve lojistik alanlarında uzman kadromuzla hizmetinizdeyiz.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Rakamlarla Biz</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white/20 rounded-xl p-4 mb-3">
                <Users className="w-8 h-8 text-white mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">10,000+</h3>
              <p className="text-orange-100">Mutlu Müşteri</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-xl p-4 mb-3">
                <Package className="w-8 h-8 text-white mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">50,000+</h3>
              <p className="text-orange-100">Ürün Çeşidi</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-xl p-4 mb-3">
                <Store className="w-8 h-8 text-white mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">100+</h3>
              <p className="text-orange-100">Mağaza Ortaklığı</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-xl p-4 mb-3">
                <Clock className="w-8 h-8 text-white mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">24/7</h3>
              <p className="text-orange-100">Müşteri Desteği</p>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <Award className="w-8 h-8 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900">Hakkımızda</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            Shopping, 2024 yılında kurulmuş, Türkiye'nin önde gelen e-ticaret platformlarından biridir. 
            Müşterilerimize en kaliteli ürünleri, en uygun fiyatlarla sunmayı hedeflemekteyiz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 