import { Request, Response } from "express";
import { pool } from "../db";
import { getUserIdFromRequest } from "../utils/getUserIdFromRequest";

export async function checkoutOrder(req: Request, res: Response) {
  const client = await pool.connect();
  try {
    const userId = getUserIdFromRequest(req);

    // Start transaction
    await client.query("BEGIN");

    // 1. Get the user's cart
    const cartResult = await client.query(
      "SELECT id FROM carts WHERE user_id = $1",
      [userId],
    );
    if (cartResult.rows.length === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const cartId = cartResult.rows[0].id;

    // 2. Get cart items + product details
    const itemsResult = await client.query(
      `SELECT ci.*, p.price FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cartId],
    );
    const cartItems = itemsResult.rows;

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 3. Calculate total
    let total = 0;
    for (const item of cartItems) {
      total += parseFloat(item.price) * item.quantity;
    }

    // 4. Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total)
       VALUES ($1, $2) RETURNING id`,
      [userId, total],
    );
    const orderId = orderResult.rows[0].id;

    // 5. Insert order items
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price],
      );
    }

    // 6. Clear cart
    await client.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);

    await client.query("COMMIT");

    res.status(201).json({
      message: "Order placed successfully",
      orderId,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Checkout error:", err);
    res.status(500).json({ message: "Server error during checkout" });
  } finally {
    client.release();
  }
}

export async function getAllOrders(_req: Request, res: Response) {
  try {
    const result = await pool.query("SELECT * FROM orders");
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "no orders at the time" });
    }
    res.status(201).send(result.rows);
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
