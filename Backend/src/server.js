import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import patientRoutes from "./routes/patients.js";
import dashboardRoutes from "./routes/dashboard.js";
import activitiesRoutes from "./routes/activities.js";
import attendanceRoutes from "./routes/attendance.js";
import archiveRoutes from "./routes/archive.js";
import medicalRecordsRoutes from "./routes/medical-records.js";
import questionnaireRoutes from "./routes/questionnaires.js";
import coursesRoutes from "./routes/courses.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../../Frontend");
const uploadsDir = path.join(__dirname, "../uploads");
const faviconPath = path.join(frontendPath, "assets/images/logo-caige.png");

fs.mkdirSync(uploadsDir, { recursive: true });

console.log("=== INICIANDO SERVIDOR CAIGE ===");
console.log(`Porta: ${PORT}`);
console.log(`Env NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

// Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files - ANTES do requestLogger
app.use("/uploads", express.static(uploadsDir));
app.use(express.static(frontendPath));

// Request logger - DEPOIS dos arquivos estáticos
app.use((req, res, next) => {
  const startTime = Date.now();
  console.log(`-> ${req.method} ${req.path} | IP: ${req.ip}`);

  const originalJson = res.json;
  res.json = function patchedJson(data) {
    const duration = Date.now() - startTime;
    console.log(`<- ${req.method} ${req.path} | Status: ${res.statusCode} | ${duration}ms`);
    return originalJson.call(this, data);
  };

  next();
});

console.log("Middleware configurado");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/dashboard-data", dashboardRoutes);
app.use("/api/activities", activitiesRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/archive", archiveRoutes);
app.use("/api/medical-records", medicalRecordsRoutes);
app.use("/api/questionnaires", questionnaireRoutes);
app.use("/api/courses", coursesRoutes);

console.log("Rotas configuradas");

// Rota de raiz - serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Evita 404 do navegador para favicon.ico
app.get("/favicon.ico", (req, res) => {
  if (fs.existsSync(faviconPath)) {
    res.sendFile(faviconPath);
    return;
  }
  res.status(204).end();
});

// 404 handler - ÚLTIMO
app.use((req, res) => {
  console.error(`Rota nao encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ message: "Rota não encontrada." });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`Erro nao tratado: ${err.message}`, err);
  res.status(500).json({ message: "Erro interno do servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado com sucesso em http://localhost:${PORT}`);
});
