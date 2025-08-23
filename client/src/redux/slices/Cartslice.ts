import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../Store";
import type { CartItem } from "../../utils/Interface.utils";
import * as cartApi from "../../api/cart.api";

// Thunks
export const fetchCart = createAsyncThunk("cart/items", async () => {
  const res = await cartApi.getCart();
  return res.items as CartItem[]; // backend returns { items: [...] }
});

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product_id, quantity }: { product_id: string; quantity: number }) => {
    await cartApi.addToCartAPI(product_id, quantity);
    const res = await cartApi.getCart();
    return res.items as CartItem[];
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ item_id, quantity }: { item_id: string; quantity: number }) => {
    await cartApi.updateCartItemAPI(item_id, quantity);
    const res = await cartApi.getCart();
    return res.items as CartItem[];
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (item_id: string) => {
    await cartApi.removeCartItemAPI(item_id);
    const res = await cartApi.getCart();
    return res.items as CartItem[];
  }
);

export const checkout = createAsyncThunk("cart/checkout", async () => {
  const res = await cartApi.checkoutAPI();
  // checkout returns order info; after successful checkout we should fetch an empty cart
  await cartApi.getCart();
  return res;
});

type CartState = {
  cartItems: CartItem[];
  loading: boolean;
  error?: string | null;
};

const initialState: CartState = {
  cartItems: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // local sync actions if needed
    clearCart(state) {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchCart.fulfilled, (s, a: PayloadAction<CartItem[]>) => { s.loading = false; s.cartItems = a.payload; })
      .addCase(fetchCart.rejected, (s, action) => { s.loading = false; s.error = action.error.message ?? "Failed to fetch cart"; })

      .addCase(addToCart.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(addToCart.fulfilled, (s, a: PayloadAction<CartItem[]>) => { s.loading = false; s.cartItems = a.payload; })
      .addCase(addToCart.rejected, (s, action) => { s.loading = false; s.error = action.error.message })

      .addCase(updateCartItem.fulfilled, (s, a: PayloadAction<CartItem[]>) => { s.cartItems = a.payload; })
      .addCase(removeCartItem.fulfilled, (s, a: PayloadAction<CartItem[]>) => { s.cartItems = a.payload; })

      .addCase(checkout.fulfilled, (s) => { s.cartItems = []; })
      .addCase(checkout.rejected, (s, action) => { s.error = action.error.message });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Selector helpers
export const selectCartItems = (state: RootState) => state.cart.cartItems;
export const selectCartCount = (state: RootState) =>
  state.cart.cartItems.reduce((acc, item) => acc + item.quantity, 0);
