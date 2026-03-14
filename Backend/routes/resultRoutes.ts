import { Router } from "express";
import {
	enterMarks,
	getAllResults,
	getClassSectionComparison,
	getResultCard,
	getStudentProgress,
} from "../controller/resultController";
import { downloadResultPDF } from "../controller/pdfController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/marks", authMiddleware, enterMarks);
router.get("/", getAllResults);
router.get("/progress/:studentId", getStudentProgress);
router.get("/comparison/sections", getClassSectionComparison);
router.get("/:studentId/pdf", downloadResultPDF); // must be before /:studentId
router.get("/:studentId", getResultCard);

export default router;
