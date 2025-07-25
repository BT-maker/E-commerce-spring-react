import React, { useEffect, useState } from "react";
import api from "../services/api";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/orders");
        if (res.status === 200 && Array.isArray(res.data)) {
          setOrders(res.data);
        } else if (res.status === 401) {
          setError("Giriş yapmanız gerekiyor.");
        } else {
          setError("Siparişler alınamadı.");
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Giriş yapmanız gerekiyor.");
        } else {
          setError("Siparişler alınamadı. Lütfen tekrar deneyin.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <div className="max-w-3xl mx-auto mt-6 sm:mt-10 bg-white rounded-xl shadow p-4 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Siparişlerim</h2>
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 bg-gray-50">
            <Skeleton height={24} width={120} className="mb-2" />
            <Skeleton height={20} width={80} className="mb-2" />
            <Skeleton height={32} width={180} />
            <Skeleton count={2} height={18} className="mt-2" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto mt-6 sm:mt-10 bg-white rounded-xl shadow p-4 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Siparişlerim</h2>
      {error ? (
        <div style={{ color: "#d32f2f" }} className="text-center">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center">Hiç siparişiniz yok.</div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
                <span className="font-semibold text-lg">Sipariş No: {order.id}</span>
                <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
                <span className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">{order.status}</span>
              </div>
              <div className="mb-2 text-right font-bold text-lg">
                Toplam: <span className="text-yellow-800">{Number(order.totalPrice).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-t border-b border-gray-300">
                  <thead>
                    <tr className="text-left border-b border-gray-200 bg-gray-100">
                      <th className="py-2 px-6 text-center">Ürün</th>
                      <th className="py-2 px-2 text-center">Adet</th>
                      <th className="py-2 px-2 text-center">Birim Fiyat</th>
                      <th className="py-2 px-2 text-center">Ara Toplam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={item.id} className={idx !== order.items.length-1 ? "border-b border-gray-200" : ""}>
                        <td className="py-2 px-6 text-center whitespace-nowrap">{item.product?.name}</td>
                        <td className="py-2 px-2 text-center">{item.quantity}</td>
                        <td className="py-2 px-2 text-center">{Number(item.price).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺</td>
                        <td className="py-2 px-2 text-center">{(item.price * item.quantity).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders; 