// Debug para Dashboard
console.log('=== DEBUG DASHBOARD ===');

const API_URL = 'http://localhost:3000';
const userEmail = localStorage.getItem('userEmail') || 'suportecaige@univale.br';

console.log('1. UserEmail:', userEmail);
console.log('2. API_URL:', API_URL);

// Testar conexão básica
console.log('\n3. Testando conexões:');

// 3a. Testar /dashboard-data
console.log('   a) GET /dashboard-data');
fetch(`${API_URL}/dashboard-data`, {
  headers: {
    'x-user-email': userEmail
  }
})
.then(r => {
  console.log('      Status:', r.status);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
})
.then(data => {
  console.log('      ✓ Stats recebidos:', data.stats ? data.stats.length : 0);
})
.catch(e => console.error('      ✗ Erro:', e.message));

// 3b. Testar /api/patients
console.log('   b) GET /api/patients');
fetch(`${API_URL}/api/patients`, {
  headers: {
    'x-user-email': userEmail
  }
})
.then(r => {
  console.log('      Status:', r.status);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
})
.then(data => {
  console.log('      ✓ Pacientes recebidos:', Array.isArray(data) ? data.length : 0);
  if (Array.isArray(data) && data.length > 0) {
    console.log('      Primeira pessoa:', data[0].name);
  }
})
.catch(e => console.error('      ✗ Erro:', e.message));

// 3c. Testar /api/activities
console.log('   c) GET /api/activities');
fetch(`${API_URL}/api/activities`, {
  headers: {
    'x-user-email': userEmail
  }
})
.then(r => {
  console.log('      Status:', r.status);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
})
.then(data => {
  console.log('      ✓ Atividades recebidas:', data.activities ? data.activities.length : 0);
})
.catch(e => console.error('      ✗ Erro:', e.message));

console.log('\n=== FIM DEBUG ===\n');
