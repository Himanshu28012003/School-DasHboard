import { Request, Response } from "express";
import { pool } from "../db/pool";

export const addStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, rollNumber, className, section } = req.body;

    if (!name || !rollNumber || !className || !section) {
      res.status(400).json({
        message: "name, rollNumber, className and section are required",
      });
      return;
    }

    const result = await pool.query(
      `
      INSERT INTO students (name, roll_number, class, section)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, roll_number AS "rollNumber", class AS "className", section;
      `,
      [name, Number(rollNumber), className, section]
    );

    res.status(201).json({
      message: "Student created successfully",
      student: result.rows[0],
    });
  } catch (error: any) {
    if (error?.code === "23505") {
      res.status(409).json({ message: "Roll number already exists" });
      return;
    }
    res.status(500).json({ message: "Failed to add student", error: error.message });
  }
};

export const getStudents = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `
      SELECT id, name, roll_number AS "rollNumber", class AS "className", section
      FROM students
      ORDER BY id;
      `
    );

    res.status(200).json({ students: result.rows });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch students", error: error.message });
  }
};
