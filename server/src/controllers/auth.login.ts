import { Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db";
dotenv.config();

export async function authLogin(req: Request, res: Response) {
  const secret = process.env.SECRET;
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if ((await user).rows.length === 0) {
      return res.status(400).json({ message: "user not found" });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
      return res.status(400).json({ message: "incorrect Password" });
    }
    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      secret!,
      { expiresIn: "1h" },
    );

    res.status(201).json({
      message: "logged in successfully",
      user: user.rows[0],
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
