import "./db";
import express, { Request, Response } from "express";
import cors from "cors";
import { authSignup } from "./controllers/auth.signup";
import { authLogin } from "./controllers/auth.login";
import { isAdmin, verifyToken } from "./middlewares/jwt.auth";
import { getUserIdFromRequest } from "./utils/getUserIdFromRequest";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "./controllers/products.controllers";
import {
  addToCart,
  updateCartItem,
  removeCartItem,
  getCartItems,
} from "./controllers/cart.cotroller";
import { checkoutOrder, getAllOrders } from "./controllers/order.controller";
import {
  changeUserRole,
  deleteUser,
  getAllUsers,
} from "./controllers/user.controller";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("working");
});
app.get("/api/admin/users", verifyToken, isAdmin, getAllUsers);
app.patch("/api/admin/userrole/:id", verifyToken, isAdmin, changeUserRole);
app.delete("/api/admin/deleteuser/:id", verifyToken, isAdmin, deleteUser);
app.post("/api/auth/signup", authSignup);
app.post("/api/auth/login", authLogin);
app.post("/api/admin/products/add", verifyToken, isAdmin, createProduct);
app.patch("/api/admin/updateProduct/:id", verifyToken, isAdmin, updateProduct);
app.delete("/api/admin/deleteProduct/:id", verifyToken, isAdmin, deleteProduct);
app.get("/api/products", getAllProducts);
app.get("/api/products/:id", verifyToken, isAdmin, getProductById);
app.post("/api/cart/add", verifyToken, addToCart);
app.get("/api/cart/items", verifyToken, getCartItems);
app.patch("/api/cart/update", verifyToken, updateCartItem);
app.delete("/api/cart/remove/:itemId", verifyToken, removeCartItem);
app.post("/api/checkout", verifyToken, checkoutOrder);
app.get("/api/admin/orders", verifyToken, isAdmin, getAllOrders);

app.listen(3000, () => {
  console.log(`🚀 Server running on http://localhost:3000`);
});
