// src/pages/AdminProducts.tsx
import { useEffect, useState } from "react";
import axiosInstance from "../api/AxiosInstance";
import type { ProductProps } from "../utils/Interface.utils";


export default function AdminProducts() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductProps | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  // API - fetch all products
  const fetchProducts = async () => {
    const res = await axiosInstance.get("/products");
    setProducts(res.data);
  };

  // API - add product
  const addProduct = async () => {
    await axiosInstance.post("/admin/products/add", {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    });
    closeModal();
    fetchProducts();
  };

  // API - update product
  const updateProduct = async () => {
    await axiosInstance.patch(`/admin/updateProduct/${editingProduct?.id}`, {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    });
    closeModal();
    fetchProducts();
  };

  // API - delete product
  const deleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await axiosInstance.delete(`/admin/deleteproduct/${id}`);
      fetchProducts();
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      image: "",
      category: "",
      stock: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductProps) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: String(product.price),
      image: product.image,
      category: product.category,
      stock: String(product.stock),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      image: "",
      category: "",
      stock: "",
    });
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">🛍 Products</h1>

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by name or category..."
            className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={openAddModal}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition"
          >
            ➕ Add Product
          </button>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto rounded-xl shadow-lg bg-white/90 backdrop-blur-lg border border-gray-200">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-indigo-500 text-white sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-center">Price</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-center">Stock</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, idx) => (
                <tr
                  key={p.id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-indigo-50 transition`}
                >
                  <td className="px-6 py-3 font-medium">{p.title}</td>
                  <td className="px-6 py-3 text-center font-semibold">
                    ${Number(p.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-3">{p.category}</td>
                  <td className="px-6 py-3 text-center">{p.stock}</td>
                  <td className="px-6 py-3 text-center space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="px-3 py-1 text-xs bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                    >
                      ✏ Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500 italic">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h2 className="text-xl font-bold mb-4">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>

              <input
                type="text"
                placeholder="Product Title"
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price"
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              <input
                type="text"
                placeholder="Image URL"
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
              <input
                type="text"
                placeholder="Category"
                className="w-full mb-3 px-4 py-2 border rounded-lg"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
              <input
                type="number"
                placeholder="Stock"
                className="w-full mb-4 px-4 py-2 border rounded-lg"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />

              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={editingProduct ? updateProduct : addProduct}
                  className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600 text-white transition"
                >
                  {editingProduct ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
