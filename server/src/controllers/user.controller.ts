import { Request, Response } from "express";
import { pool } from "../db";

export async function getAllUsers(_req: Request, res: Response) {
  try {
    const result = await pool.query("SELECT * FROM users");
    return res.status(201).send(result.rows);
  } catch (error) {
    res.status(401).json({ message: error });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const check = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
    if (check.rows.length === 0) {
      return res.status(401).json({ message: "user not found" });
    }

    const result = await pool.query("DELETE FROM users WHERE id=$1", [id]);
    res.status(201).json({ message: "user deleted", user: check.rows[0] });
  } catch (error) {
    res.status(401).json({ message: error });
  }
}

export async function changeUserRole(req: Request, res: Response) {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ error: "Role is required" });
  }

  try {
    const result = await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, role",
      [role, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User role updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
