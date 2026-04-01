// Sistema de Controle de Acesso (RBAC)
class AccessControl {
  constructor() {
    this.userRole = null;
    this.permissions = {};
    this.userEmail = localStorage.getItem('userEmail');
  }

  // Carregar permissões do usuário
  async loadPermissions() {
    try {
      const response = await fetch('http://localhost:3000/api/users/permissions', {
        headers: {
          'x-user-email': this.userEmail
        }
      });

      if (response.ok) {
        this.permissions = await response.json();
        // Inferir role das permissões (OU buscar do profile)
        await this.loadUserProfile();
        this.applyAccessControl();
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
    }
  }

  // Carregar perfil do usuário
  async loadUserProfile() {
    try {
      const response = await fetch('http://localhost:3000/api/users/profile', {
        headers: {
          'x-user-email': this.userEmail
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.userRole = data.user.role;
        this.permissions = data.permissions;
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  }

  // Verificar se tem permissão
  hasPermission(permissionName) {
    return this.permissions[permissionName] === true || this.permissions[permissionName] === 1;
  }

  // Aplicar controle de acesso aos elementos HTML
  applyAccessControl() {
    // Mostrar/esconder elementos por role
    document.querySelectorAll('[data-require-role]').forEach(element => {
      const requiredRole = element.getAttribute('data-require-role');
      const allowedRoles = requiredRole.split(',').map(r => r.trim());

      if (!allowedRoles.includes(this.userRole)) {
        element.style.display = 'none';
      }
    });

    // Mostrar/esconder elementos por permissão
    document.querySelectorAll('[data-require-permission]').forEach(element => {
      const requiredPermission = element.getAttribute('data-require-permission');

      if (!this.hasPermission(requiredPermission)) {
        element.style.display = 'none';
      }
    });

    // Desabilitar botões sem permissão
    document.querySelectorAll('[data-require-permission-disabled]').forEach(button => {
      const requiredPermission = button.getAttribute('data-require-permission-disabled');

      if (!this.hasPermission(requiredPermission)) {
        button.disabled = true;
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
        button.title = 'Você não tem permissão para esta ação';
      }
    });

    // Aplicar classe CSS por role
    document.body.classList.add(`role-${this.userRole.toLowerCase()}`);
  }

  // Método para verificar acesso antes de executar ação
  checkAccess(permissionName) {
    if (!this.hasPermission(permissionName)) {
      console.warn(`Acesso negado: ${permissionName}`);
      return false;
    }
    return true;
  }

  // Mostrar elemento (com fallback)
  showElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = '';
    }
  }

  // Esconder elemento
  hideElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = 'none';
    }
  }

  // Desabilitar botão
  disableButton(selector) {
    const button = document.querySelector(selector);
    if (button) {
      button.disabled = true;
      button.style.opacity = '0.5';
      button.style.cursor = 'not-allowed';
    }
  }

  // Habilitar botão
  enableButton(selector) {
    const button = document.querySelector(selector);
    if (button) {
      button.disabled = false;
      button.style.opacity = '1';
      button.style.cursor = 'pointer';
    }
  }
}

// Instância global
const accessControl = new AccessControl();

// Carregar permissões quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  accessControl.loadPermissions();
});
