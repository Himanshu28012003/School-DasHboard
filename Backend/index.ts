import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import studentRoutes from "./routes/studentRoutes";
import resultRoutes from "./routes/resultRoutes";
import { initializeDatabase } from "./db/schema";
import { getDatabaseTarget, testDatabaseConnection } from "./db/pool";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
	res.status(200).json({ message: "Student Result API is running" });
});

app.use("/api/students", studentRoutes);
app.use("/api/results", resultRoutes);

const startServer = async (): Promise<void> => {
	try {
		const dbTarget = getDatabaseTarget();
		console.log(`[DB] Connecting to ${dbTarget}...`);
		await testDatabaseConnection();
		console.log(`[DB] Connected successfully to ${dbTarget}`);

		await initializeDatabase();
		console.log("[DB] Schema check complete");

		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error("[DB] Connection/startup failed", error);
		process.exit(1);
	}
};

startServer();
