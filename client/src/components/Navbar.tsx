import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import CartDrawer from "../pages/CartPage";
import type { RootState } from "../redux/Store";
import { fetchCart } from "../redux/slices/Cartslice";

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = useSelector((s: RootState) =>
    s.cart.cartItems.reduce((acc, i) => acc + i.quantity, 0)
  );

  useEffect(() => {
    dispatch(fetchCart() as any);
  }, [dispatch]);

  const onSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (cat) params.set("category", cat);
    navigate(`/?${params.toString()}`); // Home page now has ProductList
  };

  // Sync search/category with URL when navigating back/forward
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("search") || "");
    setCat(params.get("category") || "");
  }, [location.search]);

  // --- Logout handler ---
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT
    navigate("/login"); // redirect to login page
  };

  return (
    <>
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="text-2xl font-extrabold text-blue-700"
              >
                🛒 StarkCart
              </button>
            </div>

            {/* Search */}
            <form onSubmit={onSearch} className="flex-1 mx-6 flex items-center">
              <div className="flex w-full bg-gray-50 border rounded-lg overflow-hidden shadow-sm">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 px-4 py-2 text-sm bg-transparent outline-none"
                />
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  className="bg-white text-sm px-3 border-l outline-none"
                >
                  <option value="">All</option>
                  <option value="electronics">Electronics</option>
                  <option value="accessories">Accessories</option>
                  <option value="wearing">Wearing</option>
                  <option value="fashion">Fashion</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm hover:bg-blue-700"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Right side (Cart + Logout) */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded hover:bg-gray-100"
              >
                <span className="text-2xl">🛍️</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1.5">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-gray-200 text-sm font-medium hover:bg-gray-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {isCartOpen && <CartDrawer onClose={() => setIsCartOpen(false)} />}
    </>
  );
}
