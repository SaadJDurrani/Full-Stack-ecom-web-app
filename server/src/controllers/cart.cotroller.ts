// src/controllers/cart.controller.ts
import { Request, Response } from "express";
import { pool } from "../db";
import { getUserIdFromRequest } from "../utils/getUserIdFromRequest";

export async function addToCart(req: Request, res: Response) {
  const userId = getUserIdFromRequest(req);
  const { product_id, quantity } = req.body;

  try {
    // 1. Find or create cart for user
    let cart = await pool.query("SELECT * FROM carts WHERE user_id = $1", [
      userId,
    ]);
    if (cart.rows.length === 0) {
      cart = await pool.query(
        "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
        [userId],
      );
    }

    const cartId = cart.rows[0].id;

    // 2. Check if product already in cart
    const existingItem = await pool.query(
      "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cartId, product_id],
    );

    if (existingItem.rows.length > 0) {
      // update quantity
      await pool.query(
        "UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3",
        [quantity, cartId, product_id],
      );
    } else {
      // insert new item
      await pool.query(
        "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)",
        [cartId, product_id, quantity],
      );
    }

    res.status(201).json({ message: "Item added to cart" });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getCartItems(req: Request, res: Response) {
  try {
    const userId = getUserIdFromRequest(req);

    // Step 1: Get user's cart
    const cartResult = await pool.query(
      `SELECT id FROM carts WHERE user_id = $1`,
      [userId],
    );

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartId = cartResult.rows[0].id;

    // Step 2: Get cart items with product details
    const itemsResult = await pool.query(
      `SELECT ci.*, p.title, p.image, p.price
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cartId],
    );

    res.json({ items: itemsResult.rows || [] });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateCartItem(req: Request, res: Response) {
  const { item_id, quantity } = req.body;

  try {
    await pool.query("UPDATE cart_items SET quantity = $1 WHERE id = $2", [
      quantity,
      item_id,
    ]);

    res.json({ message: "Quantity updated" });
  } catch (err) {
    console.error("Update quantity error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function removeCartItem(req: Request, res: Response) {
  const { itemId } = req.params;

  try {
    await pool.query("DELETE FROM cart_items WHERE id = $1", [itemId]);

    res.json({ message: "Item removed" });
  } catch (err) {
    console.error("Remove item error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
