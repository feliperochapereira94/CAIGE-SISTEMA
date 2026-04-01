// Controlador de Autenticação

class AuthController {
  constructor() {
    this.apiUrl = 'http://localhost:3000/login';
  }

  async login(email, password) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      localStorage.setItem('userEmail', email);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async changePassword(email, currentPassword, newPassword) {
    try {
      const response = await fetch('http://localhost:3000/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, currentPassword, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao alterar senha');
      }

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  logout() {
    localStorage.removeItem('userEmail');
    window.location.href = './auth/login.html';
  }

  isAuthenticated() {
    return !!localStorage.getItem('userEmail');
  }

  getUser() {
    return localStorage.getItem('userEmail');
  }
}

export default new AuthController();
