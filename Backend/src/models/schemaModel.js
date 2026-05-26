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
  const allowedColumns = new Set([
    "can_view_patient",
    "can_create_patient",
    "can_edit_patient",
    "can_check_in",
    "can_view_reports",
    "can_manage_activities",
    "can_manage_users",
    "can_view_medical_records"
  ]);

  if (!allowedColumns.has(permission)) {
    throw new Error("Permissao invalida");
  }

  return permission;
}
