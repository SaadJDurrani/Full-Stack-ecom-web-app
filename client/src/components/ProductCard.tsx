import { useDispatch } from "react-redux";
import type { Product} from "../utils/Interface.utils";
import { addToCart } from "../redux/slices/Cartslice";
import { jwtDecode } from "jwt-decode";
import { deleteProoduct, fetchProducts } from "../api/products.api";
import { useEffect } from "react";


const ProductCard= ({ id, title, image, price, category }:Product) => {
  const dispatch = useDispatch();
   const token = localStorage.getItem("token");
  let isAdmin = false;

  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      isAdmin = decoded.role === "admin";
      console.log(isAdmin)
    } catch (error) {
      console.error("Invalid token", error);
    }
  }
  const handleDelete=async ()=>{
    await deleteProoduct(id)

  }
  useEffect(()=>{
    fetchProducts

  },[deleteProoduct])

  const handleAdd = () => {
    dispatch(addToCart({ product_id: id, quantity: 1 }) as any);
  };
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {title}
        </h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
          {category}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-indigo-600">
            ${price}
          </span>
          {!isAdmin ?(
          <button onClick={handleAdd}className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
            Add to Cart
          </button>
          ):(<button onClick={handleDelete}className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
            delete
          </button>)}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
