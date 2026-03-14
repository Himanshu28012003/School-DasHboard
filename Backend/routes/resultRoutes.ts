import { Router } from "express";
import { enterMarks, getAllResults, getResultCard } from "../controller/resultController";
import { downloadResultPDF } from "../controller/pdfController";

const router = Router();

router.post("/marks", enterMarks);
router.get("/", getAllResults);
router.get("/:studentId/pdf", downloadResultPDF); // must be before /:studentId
router.get("/:studentId", getResultCard);

export default router;
