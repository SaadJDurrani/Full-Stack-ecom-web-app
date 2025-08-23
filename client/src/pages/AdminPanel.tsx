// src/pages/AdminLayout.tsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token"); // or however you're storing JWT
    navigate("/login");
  };
  const isDashboardRoot = location.pathname === "/admin";

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex justify-between items-center bg-white shadow px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {isDashboardRoot ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white shadow rounded-xl p-6 hover:shadow-md transition">
                <h2 className="text-lg font-semibold text-gray-700">👥 Manage Users</h2>
                <p className="text-sm text-gray-500 mt-2">
                  View, update, or remove user accounts.
                </p>
              </div>
              <div className="bg-white shadow rounded-xl p-6 hover:shadow-md transition">
                <h2 className="text-lg font-semibold text-gray-700">📦 Manage Products</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Add, edit, or delete products in your store.
                </p>
              </div>
              <div className="bg-white shadow rounded-xl p-6 hover:shadow-md transition">
                <h2 className="text-lg font-semibold text-gray-700">🧾 Manage Orders</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Track, update, and fulfill customer orders.
                </p>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
