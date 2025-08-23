// src/pages/AdminOrders.tsx
import { useEffect, useState } from "react";
import axiosInstance from "../api/AxiosInstance";
import type { TOrder } from "../utils/Interface.utils";



export default function AdminOrders() {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axiosInstance.get("/admin/orders");
    setOrders(res.data);
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.user_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          📦 Orders
        </h1>

        {/* Search Bar */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto rounded-xl shadow-lg bg-white/90 backdrop-blur-lg border border-gray-200">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-indigo-500 text-white sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer ID</th>
                <th className="px-6 py-3 text-center">Total</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o, idx) => (
                <tr
                  key={o.id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-indigo-50 transition`}
                >
                  <td className="px-6 py-3 font-medium">{o.id}</td>
                  <td className="px-6 py-3">{o.user_id}</td>
                  <td className="px-6 py-3 text-center font-semibold">
  ${Number(o.total || 0).toFixed(2)}
</td>

                  <td className="px-6 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        o.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : o.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : o.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
