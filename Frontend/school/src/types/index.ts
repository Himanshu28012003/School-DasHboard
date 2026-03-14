export type AuthMode = "login" | "signup";

export type StoredUser = {
  fullName: string;
  email: string;
  password: string;
};

export type Student = {
  id: number;
  name: string;
  rollNumber: number;
  className: string;
  section: string;
};

export type Result = {
  id: number;
  name: string;
  rollNumber: number;
  className: string;
  section: string;
  class: string;
  marks: {
    maths: number;
    science: number;
    english: number;
    computer: number;
  } | null;
  total: number | null;
  percentage: number | null;
  grade: string | null;
  overallRank: number | null;
  classRank: number | null;
  sectionRank: number | null;
};

export type StudentFormState = {
  name: string;
  rollNumber: string;
  className: string;
  section: string;
};

export type MarksFormState = {
  studentId: string;
  maths: string;
  science: string;
  english: string;
  computer: string;
};

export type AuthFormState = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};
