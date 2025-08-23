import axiosInstance from "./AxiosInstance";

export async function getCart() {
  const res = await axiosInstance.get("/cart/items"); // GET /api/cart
  // expected shape: { items: [ { id, cart_id, product_id, quantity, title, image, price } ] }
  return res.data;
}

export async function addToCartAPI(product_id: string, quantity = 1) {
  const res = await axiosInstance.post("/cart/add", { product_id, quantity });
  return res.data;
}

export async function updateCartItemAPI(item_id: string, quantity: number) {
  const res = await axiosInstance.patch("/cart/update", { item_id, quantity });
  return res.data;
}

export async function removeCartItemAPI(item_id: string) {
  const res = await axiosInstance.delete(`/cart/remove/${item_id}`);
  return res.data;
}

export async function checkoutAPI() {
  const res = await axiosInstance.post("/checkout");
  return res.data;
}
