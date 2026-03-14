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

// ── CORS ────────────────────────────────────────────────────────────────────
// Allowed origins loaded from ALLOWED_ORIGINS env var (comma-separated).
// Falls back to localhost Vite dev ports so the API works out of the box.
const rawOrigins =
  process.env.ALLOWED_ORIGINS ?? "http://localhost:5173,http://localhost:5174";
const allowedOrigins = rawOrigins
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const isLocalDevOrigin = (origin: string): boolean => {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
};

app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      // Allow requests with no Origin header (curl, Postman, server-to-server)
      if (!incomingOrigin) return callback(null, true);
      if (isLocalDevOrigin(incomingOrigin)) return callback(null, true);
      if (allowedOrigins.includes(incomingOrigin)) return callback(null, true);
      callback(new Error(`CORS: origin '${incomingOrigin}' is not allowed`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200, // some older browsers choke on 204
  })
);

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
