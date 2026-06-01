// Sistema de Controle de Acesso (RBAC)
class ControleAcesso {
  constructor() {
    this.userRole = null;
    this.permissions = {};
    this.userEmail = localStorage.getItem('userEmail');
  }

  // Carregar permissões do usuário
  async carregarPermissoes() {
    try {
      const response = await fetch('/api/usuarios/permissoes', {
        headers: {
          'x-user-email': this.userEmail
        }
      });

      if (response.ok) {
        this.permissions = await response.json();
        // Inferir role das permissões (OU buscar do profile)
        await this.carregarPerfilUsuario();
        this.aplicarControleAcesso();
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
    }
  }

  // Carregar perfil do usuário
  async carregarPerfilUsuario() {
    try {
      const response = await fetch('/api/usuarios/perfil', {
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
  temPermissao(permissionName) {
    return this.permissions[permissionName] === true || this.permissions[permissionName] === 1;
  }

  // Aplicar controle de acesso aos elementos HTML
  aplicarControleAcesso() {
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

      if (!this.temPermissao(requiredPermission)) {
        element.style.display = 'none';
      }
    });

    // Desabilitar botões sem permissão
    document.querySelectorAll('[data-require-permission-disabled]').forEach(button => {
      const requiredPermission = button.getAttribute('data-require-permission-disabled');

      if (!this.temPermissao(requiredPermission)) {
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
  verificarAcesso(permissionName) {
    if (!this.temPermissao(permissionName)) {
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
const controleAcesso = new ControleAcesso();

// Compatibilidade global com nomes antigos
window.ControleAcesso = ControleAcesso;
window.controleAcesso = controleAcesso;

// Carregar permissões quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  controleAcesso.carregarPermissoes();
});


