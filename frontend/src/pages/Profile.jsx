import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaEdit } from "react-icons/fa";
import EditProfileModal from "../components/EditProfileModal/EditProfileModal";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);

  if (!user) return (
    <div className="max-w-xl mx-auto mt-8 sm:mt-16 bg-white p-4 sm:p-8 rounded shadow">
      <Skeleton height={32} width={180} className="mb-4" />
      <Skeleton count={3} height={20} className="mb-2" />
    </div>
  );

  return (
    <div className="max-w-xl mx-auto mt-8 sm:mt-16 bg-white p-4 sm:p-8 rounded shadow">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Profil Bilgileri</h2>
        <button
          className="text-gray-500 hover:text-yellow-600 focus:outline-none"
          title="Düzenle"
          onClick={() => setModalOpen(true)}
        >
          <FaEdit className="text-xl" />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <span className="font-semibold">Kullanıcı Adı:</span> {user.username}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user.email}
        </div>
        {user.createdAt && (
          <div>
            <span className="font-semibold">Kayıt Tarihi:</span> {new Date(user.createdAt).toLocaleDateString()}
          </div>
        )}
      </div>
      {modalOpen && (
        <EditProfileModal user={user} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default Profile; 