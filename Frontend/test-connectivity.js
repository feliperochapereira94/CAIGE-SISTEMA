// Teste de Conectividade Frontend

console.log('=== TESTE DE CONECTIVIDADE FRONTEND ===\n');

// 1. Verificar localStorage
console.log('1️⃣ localStorage:');
const userEmail = localStorage.getItem('userEmail');
console.log('   userEmail:', userEmail);
const userName = sessionStorage.getItem('userName');
console.log('   userName:', userName);
const userRole = sessionStorage.getItem('userRole');
console.log('   userRole:', userRole);

// 2. Testar conexão com /api/patients
console.log('\n2️⃣ Testando GET /api/patients:');
fetch('http://localhost:3000/api/patients', {
  headers: {
    'x-user-email': userEmail || 'suportecaige@univale.br'
  }
})
.then(res => {
  console.log('   Status:', res.status);
  return res.json();
})
.then(data => {
  console.log('   Pacientes recebidos:', Array.isArray(data) ? data.length : 'ERRO');
  if (Array.isArray(data) && data.length > 0) {
    console.log('   Primeira resultado:', data[0]);
  }
})
.catch(err => console.error('   ❌ Erro:', err.message));

// 3. Testar conexão com /api/activities
console.log('\n3️⃣ Testando GET /api/activities:');
fetch('http://localhost:3000/api/activities', {
  headers: {
    'x-user-email': userEmail || 'suportecaige@univale.br'
  }
})
.then(res => {
  console.log('   Status:', res.status);
  return res.json();
})
.then(data => {
  console.log('   Atividades recebidas:', data.activities ? data.activities.length : 'ERRO');
})
.catch(err => console.error('   ❌ Erro:', err.message));

// 4. Testar conexão com /profile
console.log('\n4️⃣ Testando GET /profile:');
fetch('http://localhost:3000/profile', {
  headers: {
    'x-user-email': userEmail || 'suportecaige@univale.br'
  }
})
.then(res => {
  console.log('   Status:', res.status);
  return res.json();
})
.then(data => {
  console.log('   Perfil retornado:', data.email);
})
.catch(err => console.error('   ❌ Erro:', err.message));

console.log('\n=== FIM DO TESTE ===');
console.log('Copie e cole este código no Console do Navegador (F12) para diagnosticar');
