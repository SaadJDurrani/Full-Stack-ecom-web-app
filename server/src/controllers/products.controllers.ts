import { Request, Response } from "express";
import { pool } from "../db";

export async function createProduct(req: Request, res: Response) {
  const { title, description, price, image, category, stock } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO products (title, description, price, image, category, stock)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, price, image, category, stock],
    );

    res.status(201).json({
      message: "Product created successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
export async function getAllProducts(req: Request, res: Response) {
  try {
    const rawSearch =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const rawCategory =
      typeof req.query.category === "string" ? req.query.category.trim() : "";

    let query = "SELECT * FROM products WHERE 1=1";
    const params: any[] = [];

    if (rawSearch) {
      // search title OR description OR category
      params.push(`%${rawSearch}%`);
      query += ` AND (
        LOWER(title) LIKE LOWER($${params.length})
        OR COALESCE(LOWER(description), '') LIKE LOWER($${params.length})
        OR LOWER(category) LIKE LOWER($${params.length})
      )`;
    }

    if (rawCategory) {
      params.push(rawCategory);
      query += ` AND LOWER(category) = LOWER($${params.length})`;
    }

    const products = await pool.query(query, params);

    // return array (can be empty) with 200
    res.status(200).json(products.rows);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getProductById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM products WHERE id=$1", [id]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "product not found" });
    }
    res.status(200).send(result.rows[0]);
  } catch (error) {
    res.status(401).json({ error: error });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;

  try {
    // Check if product exists
    const check = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete product
    await pool.query("DELETE FROM products WHERE id = $1", [id]);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;
  const { name, price, description, stock, category, image_url } = req.body;
  console.log(req.body);

  try {
    // Get the current product
    const existing = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const current = existing.rows[0];

    // Use new value if provided, otherwise keep old value
    const updatedName = name ?? current.name;
    const updatedPrice = price ?? current.price;
    const updatedDescription = description ?? current.description;
    const updatedStock = stock ?? current.stock;
    const updatedCategory = category ?? current.category;
    const updatedImage = image_url ?? current.image;

    // Update product
    const result = await pool.query(
      `UPDATE products 
       SET title = $1, price = $2, description = $3, stock = $4, category = $5, image = $6
       WHERE id = $7 RETURNING *`,
      [
        updatedName,
        updatedPrice,
        updatedDescription,
        updatedStock,
        updatedCategory,
        updatedImage,
        id,
      ],
    );

    res.json({
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
}
