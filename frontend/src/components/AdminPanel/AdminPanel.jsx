import React, { useState, useContext } from "react";
import AdminCategories from "../AdminCategories/AdminCategories";
import AdminProducts from "../AdminProducts/AdminProducts";
import { AuthContext } from "../../context/AuthContext";

const AdminPanel = () => {
  const [tab, setTab] = useState("categories");
  // AuthContext'ten role alınabilir, şimdilik placeholder
  const { isLoggedIn } = useContext(AuthContext);
  // const { isLoggedIn, user } = useContext(AuthContext); // user.role === 'ADMIN' kontrolü eklenebilir
  // Şimdilik sadece girişli ise gösteriyoruz

  // TODO: user.role !== 'ADMIN' ise erişim engellensin

  if (!isLoggedIn) {
    return <div className="cart-empty" style={{ marginTop: 40 }}>Bu sayfaya erişim yetkiniz yok.</div>;
  }

  return (
    <div className="min-h-[70vh] max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow flex flex-col md:flex-row">
      <aside className="md:w-56 border-r p-6 flex flex-row md:flex-col gap-4 bg-gray-50 rounded-l-xl">
        <button
          className={`text-lg font-semibold text-left ${tab === "categories" ? "text-green-700" : "text-gray-700"}`}
          onClick={() => setTab("categories")}
        >
          Kategoriler
        </button>
        <button
          className={`text-lg font-semibold text-left ${tab === "products" ? "text-green-700" : "text-gray-700"}`}
          onClick={() => setTab("products")}
        >
          Ürünler
        </button>
      </aside>
      <main className="flex-1 p-6">
        {tab === "categories" && <AdminCategories />}
        {tab === "products" && <AdminProducts />}
      </main>
    </div>
  );
};

export default AdminPanel; 