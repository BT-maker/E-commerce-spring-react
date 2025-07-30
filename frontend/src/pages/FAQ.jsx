import React, { useState } from 'react';
import PageTitle from '../components/PageTitle/PageTitle';
import MetaTags from '../components/MetaTags/MetaTags';
import { ChevronDown, ChevronUp, HelpCircle, ShoppingCart, CreditCard, Truck, Package, User, Shield } from 'lucide-react';
import './FAQ.css';

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
    <div className="faq-container">
      <PageTitle title="Sıkça Sorulan Sorular" />
      <MetaTags 
        title="Sıkça Sorulan Sorular"
        description="Shopping platformu hakkında sıkça sorulan sorular ve cevapları. Müşteri hizmetleri ve destek bilgileri."
        keywords="sss, sıkça sorulan sorular, yardım, destek, shopping sss"
      />
      
      <div className="faq-content">
        <h1 className="faq-title">Sıkça Sorulan Sorular</h1>
        
        <div className="faq-intro">
          <HelpCircle size={48} className="faq-intro-icon" />
          <p>
            Aradığınız sorunun cevabını bulamadıysanız, müşteri hizmetlerimizle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="faq-sections">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category">
              <div className="category-header">
                {React.createElement(category.icon, { size: 24 })}
                <h2>{category.category}</h2>
              </div>
              
              <div className="faq-items">
                {category.questions.map((item, itemIndex) => {
                  const globalIndex = categoryIndex * 100 + itemIndex;
                  const isOpen = openItems.has(globalIndex);
                  
                  return (
                    <div key={itemIndex} className="faq-item">
                      <button
                        className={`faq-question ${isOpen ? 'open' : ''}`}
                        onClick={() => toggleItem(globalIndex)}
                      >
                        <span>{item.question}</span>
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                      
                      {isOpen && (
                        <div className="faq-answer">
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* İletişim Bölümü */}
        <div className="faq-contact">
          <h2>Hala Sorunuz mu Var?</h2>
          <p>
            Yukarıdaki sorular sorunuzu yanıtlamadıysa, müşteri hizmetlerimizle iletişime geçebilirsiniz.
          </p>
          <div className="contact-options">
            <div className="contact-option">
              <h3>📧 E-posta</h3>
              <p>destek@shopping.com</p>
              <p>24 saat içinde yanıt</p>
            </div>
            <div className="contact-option">
              <h3>📞 Telefon</h3>
              <p>+90 (212) 555 0123</p>
              <p>Pazartesi - Cuma: 09:00-18:00</p>
            </div>
            <div className="contact-option">
              <h3>💬 Canlı Destek</h3>
              <p>Web sitesi üzerinden</p>
              <p>Anlık yanıt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 