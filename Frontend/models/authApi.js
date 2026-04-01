// API - Autenticação

export async function login(email, password) {
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  return await response.json();
}

export async function changePassword(email, currentPassword, newPassword) {
  const response = await fetch('http://localhost:3000/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, currentPassword, newPassword })
  });

  return await response.json();
}
