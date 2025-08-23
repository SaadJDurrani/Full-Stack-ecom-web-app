// src/components/AdminSidebar.tsx
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();

  const navItems = [
    { label: "Products", path: "/admin/products" },
    { label: "Users", path: "/admin/users" },
    { label: "Orders", path: "/admin/orders" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <h2 className="text-2xl font-bold p-4 border-b border-gray-700">
        Admin Panel
      </h2>
      <nav className="flex-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-3 hover:bg-gray-800 ${
              location.pathname === item.path ? "bg-gray-800" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
