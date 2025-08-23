import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/Store";
import { useEffect } from "react";
import { fetchCart, updateCartItem, removeCartItem, selectCartItems } from "../redux/slices/Cartslice";

type Props = { onClose: () => void };

const CartDrawer = ({ onClose }: Props) => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);

  useEffect(() => {
    dispatch(fetchCart() as any);
  }, [dispatch]);

  const total = items.reduce((acc, i) => acc + (Number(i.price) || 0) * i.quantity, 0);

  const inc = (id: string, qty: number) => dispatch(updateCartItem({ item_id: id, quantity: qty + 1 }) as any);
  const dec = (id: string, qty: number) => {
    if (qty <= 1) return dispatch(removeCartItem(id) as any);
    dispatch(updateCartItem({ item_id: id, quantity: qty - 1 }) as any);
  };
  const rm = (id: string) => dispatch(removeCartItem(id) as any);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1" onClick={onClose} />
      <aside className="w-96 bg-white shadow-xl p-4 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Cart</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">Close ✖</button>
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center text-gray-500">Your cart is empty</div>
        ) : (
          <>
            <ul className="space-y-4">
              {items.map((it) => (
                <li key={it.id} className="flex gap-3">
                  <img src={it.image} alt={it.title} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{it.title}</div>
                    <div className="text-xs text-gray-500">${it.price}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => dec(it.id, it.quantity)} className="px-2 py-0.5 border rounded">-</button>
                      <div className="px-2">{it.quantity}</div>
                      <button onClick={() => inc(it.id, it.quantity)} className="px-2 py-0.5 border rounded">+</button>
                      <button onClick={() => rm(it.id)} className="ml-auto text-sm text-red-500">Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between mb-3">
                <div className="text-sm text-gray-600">Subtotal</div>
                <div className="font-semibold">${total.toFixed(2)}</div>
              </div>
              <div className="flex gap-2">
                <a href="/checkout" onClick={onClose} className="flex-1 text-center py-2 bg-blue-600 text-white rounded">Checkout</a>
                <button onClick={() => { /* future: continue shopping */ }} className="px-4 py-2 border rounded">Continue</button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;
