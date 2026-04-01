// Controlador de Dashboard

class DashboardController {
  constructor() {
    this.apiUrl = 'http://localhost:3000/dashboard-data';
  }

  async loadDashboard() {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const response = await fetch(this.apiUrl, {
        headers: {
          'x-user-email': userEmail
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao carregar dashboard');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default new DashboardController();
