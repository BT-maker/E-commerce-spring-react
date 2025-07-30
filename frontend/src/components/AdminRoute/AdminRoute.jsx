import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  if (!user || user.role !== "ADMIN") {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem", fontSize: "1.5rem", color: "#d32f2f" }}>
        YETKİNİZ YOK<br />
        Ana sayfaya yönlendiriliyorsunuz...
      </div>
    );
  }

  return children;
};

export default AdminRoute;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Yetki Kontrolü: Sadece ADMIN rolündeki kullanıcıların erişimi
 * 2. Route Protection: Admin sayfalarını koruma
 * 3. Otomatik Yönlendirme: Yetkisiz kullanıcıları ana sayfaya yönlendirme
 * 4. Kullanıcı Kontrolü: Giriş yapmış kullanıcının rolünü kontrol etme
 * 5. Güvenlik: Admin paneline yetkisiz erişimi engelleme
 * 
 * Bu component sayesinde admin sayfaları güvenli şekilde korunur!
 */