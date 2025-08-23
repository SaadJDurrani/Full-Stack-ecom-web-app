import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "../db";
dotenv.config();

export async function authSignup(req: Request, res: Response) {
  const secret = process.env.SECRET;
  console.log(secret);
  const { name, email, password } = req.body;

  try {
    const userExists = pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if ((await userExists).rows.length > 0) {
      return res.status(400).json({ message: "User exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword],
    );

    const token = jwt.sign(
      { id: result.rows[0].id, role: result.rows[0].role },
      secret!,
      { expiresIn: "1h" },
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
