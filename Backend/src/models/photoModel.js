import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../../uploads");
const patientUploadsDir = path.join(uploadsDir, "patients");

fs.mkdirSync(patientUploadsDir, { recursive: true });

export function isDataUrlPhoto(photo) {
  return typeof photo === "string" && photo.startsWith("data:image/");
}

export function savePhotoFromDataUrl(photoData) {
  const match = photoData.match(/^data:image\/(png|jpe?g|webp|gif);base64,(.+)$/i);
  if (!match) {
    return null;
  }

  const ext = match[1].toLowerCase() === "jpeg" ? "jpg" : match[1].toLowerCase();
  const base64Data = match[2];
  const filename = `patient_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = path.join(patientUploadsDir, filename);

  try {
    fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
    return `/uploads/patients/${filename}`;
  } catch (error) {
    console.error("Erro ao salvar foto:", error);
    return null;
  }
}

export function resolveLocalPhotoPath(photoUrl) {
  if (typeof photoUrl !== "string" || !photoUrl.startsWith("/uploads/")) {
    return null;
  }

  const relativePath = photoUrl.replace(/^\/uploads\//, "");
  const fullPath = path.normalize(path.join(uploadsDir, relativePath));

  if (!fullPath.startsWith(uploadsDir)) {
    return null;
  }

  return fullPath;
}

export function deleteLocalPhoto(photoUrl) {
  const localPath = resolveLocalPhotoPath(photoUrl);
  if (!localPath) {
    return;
  }

  try {
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
  } catch (error) {
    console.error("Erro ao remover foto:", error);
  }
}
