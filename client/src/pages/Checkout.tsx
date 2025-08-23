import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, selectCartItems, checkout } from "../redux/slices/Cartslice";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);

  useEffect(() => {
    dispatch(fetchCart() as any);
  }, [dispatch]);

  const total = items.reduce((s, i) => s + (Number(i.price) || 0) * i.quantity, 0);

  const place = async () => {
    try {
      await dispatch(checkout() as any).unwrap();
      alert("Order placed");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="bg-white shadow rounded p-4">
        {items.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No items in cart.</div>
        ) : (
          <>
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={it.image} alt={it.title} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <div className="font-medium">{it.title}</div>
                      <div className="text-sm text-gray-500">{it.quantity} x ${it.price}</div>
                    </div>
                  </div>
                  <div className="font-semibold">${((Number(it.price) || 0) * it.quantity).toFixed(2)}</div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-between items-center">
              <div className="text-lg font-semibold">Total</div>
              <div className="text-2xl font-bold">${total.toFixed(2)}</div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={place} className="flex-1 bg-green-600 text-white py-2 rounded">Place Order</button>
              <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Back</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Checkout;
