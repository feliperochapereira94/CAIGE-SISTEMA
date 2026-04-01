import pool from "../models/database.js";

let schemaPromise = null;

export async function getPatientSchema() {
  if (!schemaPromise) {
    schemaPromise = Promise.resolve({
      patientTable: "patients",
      attendancePatientColumn: "patient_id",
      medicalRecordPatientColumn: "patient_id",
      questionnaireResponsePatientColumn: "patient_id"
    });
  }

  return schemaPromise;
}

export async function resolvePermissionColumn(permission) {
  return permission;
}