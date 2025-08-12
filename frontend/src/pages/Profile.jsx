import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaEdit, FaUser, FaEnvelope, FaShieldAlt, FaSave, FaTimes } from "react-icons/fa";
import EditProfileModal from "../components/EditProfileModal/EditProfileModal";
import ChangePasswordModal from "../components/EditProfileModal/ChangePasswordModal";
import PageTitle from "../components/PageTitle/PageTitle";
import MetaTags from "../components/MetaTags/MetaTags";
import "./Profile.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto mt-8 sm:mt-16">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600">Lütfen giriş yapın.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 sm:mt-16">
      <PageTitle title="Profilim" />
      <MetaTags 
        title="Profilim"
        description="Hesap bilgilerinizi görüntüleyin ve düzenleyin. Kişisel bilgilerinizi güncelleyin."
        keywords="profil, hesap bilgileri, kullanıcı profili"
      />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Profil Yönetimi</h1>
        <p className="text-gray-600">Hesap bilgilerinizi görüntüleyin ve güncelleyin</p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Üyelik Bilgilerim</h2>
            <p className="text-gray-600 mt-1">Kişisel bilgilerinizi ve şifrenizi güncelleyin</p>
          </div>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={() => setEditModalOpen(true)}
          >
            <FaEdit />
            Düzenle
          </button>
        </div>

        {/* Profile Information Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ad Soyad</label>
              <div className="flex items-center gap-3">
                <FaUser className="text-gray-400" />
                <span className="text-gray-800">{user.username || 'Belirtilmemiş'}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-2">E-posta</label>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gray-400" />
                <span className="text-gray-800">{user.email || 'Belirtilmemiş'}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cep Telefonu</label>
              <div className="flex items-center gap-3">
                <FaShieldAlt className="text-gray-400" />
                <span className="text-gray-800">{user.phone || 'Belirtilmemiş'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Doğum Tarihi</label>
              <div className="flex items-center gap-3">
                <FaUser className="text-gray-400" />
                <span className="text-gray-800">{user.birthDate ? new Date(user.birthDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Adres</label>
              <div className="flex items-center gap-3">
                <FaShieldAlt className="text-gray-400" />
                <span className="text-gray-800">{user.adress || 'Belirtilmemiş'}</span>
              </div>
            </div>

            {user.createdAt && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kayıt Tarihi</label>
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-gray-400" />
                  <span className="text-gray-800">{new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Üyelik Bilgilerim</h3>
          <div className="flex flex-wrap gap-4">
            <button
              className="bg-gray-100 hover:bg-orange-500 text-gray-600 hover:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              onClick={() => setEditModalOpen(true)}
            >
              <FaSave className="text-orange-400" />
              Bilgileri Güncelle
            </button>
            <button
              className="bg-gray-100 hover:bg-orange-500 text-gray-600 hover:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              onClick={() => setPasswordModalOpen(true)}
            >
              <FaShieldAlt className="text-orange-400" />
              Şifre Güncelleme
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <EditProfileModal user={user} onClose={() => setEditModalOpen(false)} />
      )}

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <ChangePasswordModal onClose={() => setPasswordModalOpen(false)} />
      )}
    </div>
  );
};

export default Profile; 