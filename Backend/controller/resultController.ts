import { Request, Response } from "express";
import { pool } from "../db/pool";

const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  return "D";
};

export const enterMarks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, maths, science, english, computer } = req.body;

    if (!studentId && studentId !== 0) {
      res.status(400).json({ message: "studentId is required" });
      return;
    }

    const marks = [maths, science, english, computer].map((value) => Number(value));
    const invalidMark = marks.some((mark) => Number.isNaN(mark) || mark < 0 || mark > 100);

    if (invalidMark) {
      res.status(400).json({
        message: "All subject marks must be numbers between 0 and 100",
      });
      return;
    }

    const studentCheck = await pool.query("SELECT id FROM students WHERE id = $1", [
      Number(studentId),
    ]);

    if (studentCheck.rowCount === 0) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    const total = marks.reduce((sum, mark) => sum + mark, 0);
    const percentage = Number(((total / 400) * 100).toFixed(2));
    const grade = calculateGrade(percentage);

    const result = await pool.query(
      `
      INSERT INTO marks (student_id, maths, science, english, computer, total, percentage, grade, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (student_id)
      DO UPDATE SET
        maths = EXCLUDED.maths,
        science = EXCLUDED.science,
        english = EXCLUDED.english,
        computer = EXCLUDED.computer,
        total = EXCLUDED.total,
        percentage = EXCLUDED.percentage,
        grade = EXCLUDED.grade,
        updated_at = NOW()
      RETURNING student_id AS "studentId", maths, science, english, computer, total, percentage, grade;
      `,
      [Number(studentId), marks[0], marks[1], marks[2], marks[3], total, percentage, grade]
    );

    res.status(200).json({
      message: "Marks saved and result calculated successfully",
      result: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to save marks", error: error.message });
  }
};

export const getResultCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;

    const result = await pool.query(
      `
      SELECT
        s.id,
        s.name,
        s.roll_number AS "rollNumber",
        s.class AS "className",
        s.section,
        m.maths,
        m.science,
        m.english,
        m.computer,
        m.total,
        m.percentage,
        m.grade
      FROM students s
      LEFT JOIN marks m ON m.student_id = s.id
      WHERE s.id = $1;
      `,
      [Number(studentId)]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    const student = result.rows[0];

    if (student.total === null || student.total === undefined) {
      res.status(404).json({
        message: "Marks not entered yet for this student",
        student: {
          id: student.id,
          name: student.name,
          rollNumber: student.rollNumber,
          className: student.className,
          section: student.section,
        },
      });
      return;
    }

    res.status(200).json({
      resultCard: {
        name: student.name,
        rollNumber: student.rollNumber,
        class: `${student.className}${student.section}`,
        marks: {
          maths: student.maths,
          science: student.science,
          english: student.english,
          computer: student.computer,
        },
        total: student.total,
        percentage: Number(student.percentage),
        grade: student.grade,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch result card", error: error.message });
  }
};

type ResultRow = {
  id: number;
  percentage: string | null;
  className: string;
  section: string;
  [key: string]: unknown;
};

const assignRanks = (items: ResultRow[]): Map<number, number> => {
  const rankMap = new Map<number, number>();
  // items must already be sorted by percentage desc
  let rank = 1;
  for (let i = 0; i < items.length; i++) {
    if (i > 0 && Number(items[i].percentage) !== Number(items[i - 1].percentage)) {
      rank = i + 1;
    }
    rankMap.set(items[i].id, rank);
  }
  return rankMap;
};

export const getAllResults = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT
        s.id,
        s.name,
        s.roll_number AS "rollNumber",
        s.class AS "className",
        s.section,
        m.maths,
        m.science,
        m.english,
        m.computer,
        m.total,
        m.percentage,
        m.grade
      FROM students s
      LEFT JOIN marks m ON m.student_id = s.id
      ORDER BY s.id;
    `);

    const rows: ResultRow[] = result.rows;

    // Only students who have marks, sorted by percentage desc
    const withMarks = rows
      .filter((r) => r.percentage !== null)
      .sort((a, b) => Number(b.percentage) - Number(a.percentage));

    // Overall ranks
    const overallRankMap = assignRanks(withMarks);

    // Class ranks — group by className, then rank within each group
    const classBuckets = new Map<string, ResultRow[]>();
    for (const r of withMarks) {
      if (!classBuckets.has(r.className)) classBuckets.set(r.className, []);
      classBuckets.get(r.className)!.push(r);
    }
    const classRankMap = new Map<number, number>();
    classBuckets.forEach((items) => {
      assignRanks(items).forEach((rank, id) => classRankMap.set(id, rank));
    });

    // Section ranks — group by className + section, then rank within each group
    const sectionBuckets = new Map<string, ResultRow[]>();
    for (const r of withMarks) {
      const key = `${r.className}||${r.section}`;
      if (!sectionBuckets.has(key)) sectionBuckets.set(key, []);
      sectionBuckets.get(key)!.push(r);
    }
    const sectionRankMap = new Map<number, number>();
    sectionBuckets.forEach((items) => {
      assignRanks(items).forEach((rank, id) => sectionRankMap.set(id, rank));
    });

    const results = rows.map((row) => ({
      id: row.id,
      name: row.name,
      rollNumber: row.rollNumber,
      className: row.className,
      section: row.section,
      class: `${row.className}${row.section}`,
      marks: row.total
        ? {
            maths: row.maths,
            science: row.science,
            english: row.english,
            computer: row.computer,
          }
        : null,
      total: row.total,
      percentage: row.percentage !== null ? Number(row.percentage) : null,
      grade: row.grade,
      overallRank: overallRankMap.get(row.id) ?? null,
      classRank: classRankMap.get(row.id) ?? null,
      sectionRank: sectionRankMap.get(row.id) ?? null,
    }));

    res.status(200).json({ results });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch results", error: error.message });
  }
};
