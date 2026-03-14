import { Router } from "express";
import { addStudent, getStudents } from "../controller/studentController";

const router = Router();

router.post("/", addStudent);
router.get("/", getStudents);

export default router;
