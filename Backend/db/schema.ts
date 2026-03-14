import { pool } from "./pool";

export const initializeDatabase = async (): Promise<void> => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      roll_number INT NOT NULL UNIQUE,
      class VARCHAR(50) NOT NULL,
      section VARCHAR(10) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS marks (
      id SERIAL PRIMARY KEY,
      student_id INT NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
      maths INT NOT NULL CHECK (maths BETWEEN 0 AND 100),
      science INT NOT NULL CHECK (science BETWEEN 0 AND 100),
      english INT NOT NULL CHECK (english BETWEEN 0 AND 100),
      computer INT NOT NULL CHECK (computer BETWEEN 0 AND 100),
      total INT NOT NULL,
      percentage NUMERIC(5,2) NOT NULL,
      grade VARCHAR(2) NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS marks_history (
      id SERIAL PRIMARY KEY,
      student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      attempt_no INT NOT NULL,
      maths INT NOT NULL CHECK (maths BETWEEN 0 AND 100),
      science INT NOT NULL CHECK (science BETWEEN 0 AND 100),
      english INT NOT NULL CHECK (english BETWEEN 0 AND 100),
      computer INT NOT NULL CHECK (computer BETWEEN 0 AND 100),
      total INT NOT NULL,
      percentage NUMERIC(5,2) NOT NULL,
      grade VARCHAR(2) NOT NULL,
      exam_date TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(student_id, attempt_no)
    );
  `);
};
