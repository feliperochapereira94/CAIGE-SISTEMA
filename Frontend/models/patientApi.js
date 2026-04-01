// API - Pacientes

const getHeaders = () => {
  const userEmail = localStorage.getItem('userEmail');
  return {
    'Content-Type': 'application/json',
    'x-user-email': userEmail
  };
};

export async function fetchAllPatients() {
  const response = await fetch('http://localhost:3000/api/patients', {
    headers: getHeaders()
  });
  return await response.json();
}

export async function fetchPatient(id) {
  const response = await fetch(`http://localhost:3000/api/patients/${id}`, {
    headers: getHeaders()
  });
  return await response.json();
}

export async function createPatient(data) {
  const response = await fetch('http://localhost:3000/api/patients', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });

  return await response.json();
}

export async function updatePatient(id, data) {
  const response = await fetch(`http://localhost:3000/api/patients/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });

  return await response.json();
}

export async function deletePatient(id) {
  const response = await fetch(`http://localhost:3000/api/patients/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });

  return await response.json();
}
