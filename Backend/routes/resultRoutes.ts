import { Router } from "express";
import {
	enterMarks,
	getAllResults,
	getClassSectionComparison,
	getResultCard,
	getStudentProgress,
} from "../controller/resultController";
import { downloadResultPDF } from "../controller/pdfController";

const router = Router();

router.post("/marks", enterMarks);
router.get("/", getAllResults);
router.get("/progress/:studentId", getStudentProgress);
router.get("/comparison/sections", getClassSectionComparison);
router.get("/:studentId/pdf", downloadResultPDF); // must be before /:studentId
router.get("/:studentId", getResultCard);

export default router;
