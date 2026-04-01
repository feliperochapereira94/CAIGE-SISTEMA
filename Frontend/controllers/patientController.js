// Controlador de Pacientes

class PatientController {
  constructor() {
    this.apiUrl = 'http://localhost:3000/api/patients';
  }

  async getAll() {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const response = await fetch(this.apiUrl, {
        headers: {
          'x-user-email': userEmail
        }
      });
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getById(id) {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const response = await fetch(`${this.apiUrl}/${id}`, {
        headers: {
          'x-user-email': userEmail
        }
      });
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async create(patientData) {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-email': userEmail
        },
        body: JSON.stringify(patientData)
      });

      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async update(id, patientData) {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-email': userEmail
        },
        body: JSON.stringify(patientData)
      });

      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async delete(id) {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-email': userEmail
        }
      });

      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default new PatientController();
