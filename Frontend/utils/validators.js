// Validadores

export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function validateForm(data) {
  const errors = {};
  
  if (!data.name) errors.name = 'Nome é obrigatório';
  if (!data.birth_date) errors.birth_date = 'Data de nascimento é obrigatória';
  if (!data.street) errors.street = 'Rua é obrigatória';
  if (!data.number) errors.number = 'Número é obrigatório';
  if (!data.city) errors.city = 'Cidade é obrigatória';
  if (!data.state) errors.state = 'Estado é obrigatório';
  if (!data.responsible) errors.responsible = 'Responsável é obrigatório';
  
  return errors;
}
