import { Router } from "express";
import { addStudent, getStudents } from "../controller/studentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, addStudent);
router.get("/", getStudents);

export default router;
