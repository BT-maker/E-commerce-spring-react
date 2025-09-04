import React, { useState } from 'react';
import PageTitle from '../components/PageTitle/PageTitle';
import MetaTags from '../components/MetaTags/MetaTags';
import { ChevronDown, ChevronUp, HelpCircle, ShoppingCart, CreditCard, Truck, Package, User, Shield, Mail, Phone, MessageCircle } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      category: 'Sipariş ve Ödeme',
      icon: ShoppingCart,
      questions: [
        {
          question: 'Siparişimi nasıl takip edebilirim?',
          answer: 'Siparişinizi takip etmek için "Sipariş Takibi" sayfasını kullanabilirsiniz. Sipariş numaranızı girerek güncel durumu görebilirsiniz.'
        },
        {
          question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
          answer: 'Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerini sunuyoruz. Tüm ödemeler güvenli SSL sertifikası ile korunmaktadır.'
        },
        {
          question: 'Siparişim ne zaman teslim edilecek?',
          answer: 'Siparişleriniz genellikle 1-3 iş günü içinde kargoya verilir. Teslimat süresi bulunduğunuz bölgeye göre 1-3 gün arasında değişmektedir.'
        },
        {
          question: 'Kargo ücreti ne kadar?',
          answer: '150 TL ve üzeri alışverişlerde kargo ücretsizdir. 150 TL altındaki siparişlerde 19.90 TL kargo ücreti alınır.'
        }
      ]
    },
    {
      category: 'İade ve Değişim',
      icon: Package,
      questions: [
        {
          question: 'Ürün iade edebilir miyim?',
          answer: 'Evet, ürünlerinizi teslim aldığınız tarihten itibaren 14 gün içinde iade edebilirsiniz. Ürün orijinal ambalajında ve kullanılmamış olmalıdır.'
        },
        {
          question: 'İade süreci nasıl işliyor?',
          answer: 'İade talebinizi online olarak oluşturun. Kargo firması ürünü adresinizden alacak ve kontrol sonrası iade işlemi tamamlanacaktır.'
        },
        {
          question: 'Hangi ürünler iade edilemez?',
          answer: 'Kişisel bakım ürünleri, iç çamaşırı, yüzme kıyafetleri ve özel sipariş ürünleri iade edilemez.'
        },
        {
          question: 'Değişim yapabilir miyim?',
          answer: 'Evet, ürünlerinizi 30 gün içinde aynı ürünün farklı boyut/renk seçenekleri ile değiştirebilirsiniz.'
        }
      ]
    },
    {
      category: 'Kargo ve Teslimat',
      icon: Truck,
      questions: [
        {
          question: 'Hangi kargo firmalarını kullanıyorsunuz?',
          answer: 'Yurtiçi Kargo, Aras Kargo ve MNG Kargo ile çalışıyoruz. Siparişinizin bulunduğu bölgeye en uygun kargo firması seçilir.'
        },
        {
          question: 'Kargo takip numarasını nasıl alabilirim?',
          answer: 'Siparişiniz kargoya verildiğinde size SMS ve e-posta ile kargo takip numarası gönderilir.'
        },
        {
          question: 'Teslimat saatleri nedir?',
          answer: 'Kargo firmaları genellikle 09:00-18:00 saatleri arasında teslimat yapar. Teslimat öncesi telefon ile bilgilendirme yapılır.'
        },
        {
          question: 'Adres değişikliği yapabilir miyim?',
          answer: 'Siparişiniz kargoya verilmeden önce adres değişikliği yapabilirsiniz. Kargo firması ile iletişime geçerek değişiklik talebinde bulunabilirsiniz.'
        }
      ]
    },
    {
      category: 'Hesap ve Güvenlik',
      icon: User,
      questions: [
        {
          question: 'Hesabımı nasıl oluşturabilirim?',
          answer: 'Ana sayfadaki "Kayıt Ol" butonuna tıklayarak hesabınızı oluşturabilirsiniz. E-posta adresiniz ve şifreniz ile giriş yapabilirsiniz.'
        },
        {
          question: 'Şifremi unuttum, ne yapmalıyım?',
          answer: 'Giriş sayfasındaki "Şifremi Unuttum" linkine tıklayarak yeni şifre oluşturabilirsiniz.'
        },
        {
          question: 'Kişisel bilgilerim güvende mi?',
          answer: 'Tüm kişisel bilgileriniz SSL sertifikası ile şifrelenir ve KVKK uyumlu olarak saklanır.'
        },
        {
          question: 'Hesabımı nasıl silebilirim?',
          answer: 'Hesap ayarlarından hesabınızı silebilirsiniz. Silme işlemi geri alınamaz.'
        }
      ]
    },
    {
      category: 'Güvenlik ve Ödeme',
      icon: Shield,
      questions: [
        {
          question: 'Ödeme bilgilerim güvende mi?',
          answer: 'Tüm ödeme işlemleri PCI DSS standartlarında güvenli altyapı ile gerçekleştirilir. Kart bilgileriniz sistemimizde saklanmaz.'
        },
        {
          question: 'Dolandırıcılık koruması var mı?',
          answer: 'Evet, tüm işlemlerimiz 7/24 güvenlik sistemi ile korunmaktadır. Şüpheli işlemler otomatik olarak tespit edilir.'
        },
        {
          question: '3D Secure nedir?',
          answer: '3D Secure, kredi kartı ödemelerinde ek güvenlik katmanı sağlayan bir sistemdir. Bankanızın SMS doğrulaması ile ödeme onaylanır.'
        },
        {
          question: 'İade edilen ürünlerin parası ne zaman iade edilir?',
          answer: 'İade edilen ürünler kontrol edildikten sonra 3-5 iş günü içinde ödeme iade edilir.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen ">
      <PageTitle title="Sıkça Sorulan Sorular" />
      <MetaTags 
        title="Sıkça Sorulan Sorular"
        description="Shopping platformu hakkında sıkça sorulan sorular ve cevapları. Müşteri hizmetleri ve destek bilgileri."
        keywords="sss, sıkça sorulan sorular, yardım, destek, shopping sss"
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sıkça Sorulan Sorular</h1>
          
          <div className="flex items-center justify-center space-x-3 text-gray-600 mb-6">
            <HelpCircle size={24} className="text-orange-500" />
            <p className="text-lg">
              Aradığınız sorunun cevabını bulamadıysanız, müşteri hizmetlerimizle iletişime geçebilirsiniz.
            </p>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    {React.createElement(category.icon, { size: 20, className: "text-white" })}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{category.category}</h2>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {category.questions.map((item, itemIndex) => {
                  const globalIndex = categoryIndex * 100 + itemIndex;
                  const isOpen = openItems.has(globalIndex);
                  
                  return (
                    <div key={itemIndex} className="bg-white">
                      <button
                        className={`w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                          isOpen ? 'bg-orange-50' : ''
                        }`}
                        onClick={() => toggleItem(globalIndex)}
                      >
                        <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                        <div className="flex-shrink-0">
                          {isOpen ? (
                            <ChevronUp size={20} className="text-orange-500" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-400" />
                          )}
                        </div>
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hala Sorunuz mu Var?</h2>
            <p className="text-gray-600">
              Yukarıdaki sorular sorunuzu yanıtlamadıysa, müşteri hizmetlerimizle iletişime geçebilirsiniz.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-orange-50 rounded-xl">
              <div className="flex justify-center mb-3">
                <Mail className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">E-posta</h3>
              <p className="text-orange-600 font-medium">destek@shopping.com</p>
              <p className="text-sm text-gray-600 mt-1">24 saat içinde yanıt</p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="flex justify-center mb-3">
                <Phone className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Telefon</h3>
              <p className="text-blue-600 font-medium">+90 (212) 555 0123</p>
              <p className="text-sm text-gray-600 mt-1">Pazartesi - Cuma: 09:00-18:00</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="flex justify-center mb-3">
                <MessageCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Canlı Destek</h3>
              <p className="text-green-600 font-medium">Web sitesi üzerinden</p>
              <p className="text-sm text-gray-600 mt-1">Anlık yanıt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 