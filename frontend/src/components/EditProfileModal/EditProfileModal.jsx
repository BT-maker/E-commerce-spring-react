import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const EditProfileModal = ({ user, onClose }) => {
  const { updateProfile } = useContext(AuthContext);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Şifre güncelleme alanı doldurulmuşsa validasyon yap
    if (currentPassword || newPassword || newPassword2) {
      if (!currentPassword || !newPassword || !newPassword2) {
        setError("Şifre güncellemek için tüm şifre alanlarını doldurun.");
        return;
      }
      if (newPassword !== newPassword2) {
        setError("Yeni şifreler eşleşmiyor.");
        return;
      }
      if (newPassword.length < 6) {
        setError("Yeni şifre en az 6 karakter olmalı.");
        return;
      }
    }
    setLoading(true);
    const result = await updateProfile({
      username,
      email,
      currentPassword: currentPassword || undefined,
      newPassword: newPassword || undefined
    });
    setLoading(false);
    if (result.success) {
      setSuccess("Bilgiler başarıyla güncellendi");
      setTimeout(() => {
        setSuccess("");
        onClose();
      }, 1200);
    } else {
      setError(result.message || "Bir hata oluştu");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-xl font-bold mb-6 text-center">Profili Düzenle</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1">Kullanıcı Adı</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="border-t pt-4">
            <label className="block font-semibold mb-1">Mevcut Şifre</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded focus:outline-none"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Yeni Şifre</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded focus:outline-none"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Yeni Şifre (Tekrar)</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded focus:outline-none"
              value={newPassword2}
              onChange={e => setNewPassword2(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {error && <div className="text-red-600 text-center">{error}</div>}
          {success && <div className="text-green-600 text-center">{success}</div>}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded"
              onClick={onClose}
              disabled={loading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded"
              disabled={loading}
            >
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Profil Düzenleme: Kullanıcı profil bilgilerini güncelleme
 * 2. Modal Interface: Popup modal arayüzü
 * 3. Form Validation: Form doğrulama ve hata kontrolü
 * 4. Şifre Değiştirme: Güvenli şifre güncelleme
 * 5. Loading States: İşlem durumları için loading göstergeleri
 * 6. Success/Error Messages: Başarı ve hata mesajları
 * 7. Responsive Design: Mobil ve desktop uyumlu tasarım
 * 
 * Bu component sayesinde kullanıcılar profil bilgilerini güvenli şekilde güncelleyebilir!
 */ 