import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({ message: "fullName, email and password are required" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return;
    }

    const existing = await pool.query(
      "SELECT id FROM admins WHERE email = $1",
      [email.toLowerCase()]
    );
    if (existing.rows.length > 0) {
      res.status(409).json({ message: "This email is already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO admins (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name AS "fullName", email`,
      [fullName.trim(), email.toLowerCase().trim(), passwordHash]
    );

    const admin = result.rows[0];
    const jwtSecret = process.env.JWT_SECRET!;
    const token = jwt.sign({ id: admin.id, email: admin.email }, jwtSecret, {
      expiresIn: "7d",
    });

    res.status(201).json({ message: "Account created successfully", token, fullName: admin.fullName });
  } catch (error: any) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const result = await pool.query(
      `SELECT id, full_name AS "fullName", email, password_hash AS "passwordHash"
       FROM admins WHERE email = $1`,
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET!;
    const token = jwt.sign({ id: admin.id, email: admin.email }, jwtSecret, {
      expiresIn: "7d",
    });

    res.status(200).json({ message: "Login successful", token, fullName: admin.fullName });
  } catch (error: any) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
