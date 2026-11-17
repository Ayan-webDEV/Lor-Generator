// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import path from "node:path";
// import { fileURLToPath } from "node:url";
// import lorRoutes from "./routes/lor.routes.js";

// const app = express();
// const PORT = Number(process.env.PORT || 5000);
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const clientDist = path.resolve(__dirname, "../../client/dist");

// const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
//   .split(",").map((origin) => origin.trim()).filter(Boolean);

// app.use(cors({
//   origin(origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
//     return callback(new Error("Origin is not allowed by CORS."));
//   }
// }));
// app.use(express.json({ limit: "1mb" }));

// app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "velop-lor-generator" }));
// app.use("/api/lor", lorRoutes);

// app.use(express.static(clientDist));
// app.get("*", (req, res, next) => {
//   if (req.path.startsWith("/api/")) return next();
//   res.sendFile(path.join(clientDist, "index.html"), (error) => error && next(error));
// });

// app.listen(PORT, () => console.log(`VELOOP LOR Generator API running on port ${PORT}`));

import "dotenv/config";
import express from "express";
import cors from "cors";
import lorRoutes from "./routes/lor.routes.js";

const app = express();

const PORT = Number(process.env.PORT || 5000);

// Allowed frontend origins
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

// CORS configuration
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS."));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// JSON request body
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "veloop-lor-generator",
    message: "VELOOP LOR Generator API is running",
  });
});

// LOR PDF generation routes
app.use("/api/lor", lorRoutes);

// API 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Backend error:", err);

  if (err.message === "Origin is not allowed by CORS.") {
    return res.status(403).json({
      success: false,
      message: "CORS origin not allowed",
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error",
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log("-----------------------------------");
  console.log("VELOOP LOR Generator Backend");
  console.log(`Server running on port ${PORT}`);
  console.log("API endpoints:");
  console.log("GET  /api/health");
  console.log("GET  /api/lor/templates");
  console.log("POST /api/lor/generate");
  console.log("-----------------------------------");
});
