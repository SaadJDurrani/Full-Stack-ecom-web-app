import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../api/products.api";
import type { Product } from "../utils/Interface.utils";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const loadProducts = async (search: string, category: string) => {
    setLoading(true);
    try {
      const res = await fetchProducts({ search: search.trim(), category });
      setProducts(res ?? []);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setProducts([]);
      } else {
        console.error("Fetch products error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Run when query params change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    const category = params.get("category") || "";
    loadProducts(search, category);
  }, [location.search]);

  return (
    <div className="container mx-auto px-4 py-10">
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
