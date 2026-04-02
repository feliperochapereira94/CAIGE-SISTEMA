if (sessionStorage.getItem('userEmail')) {
  localStorage.setItem('userEmail', sessionStorage.getItem('userEmail'));
} else {
  localStorage.removeItem('userEmail');
}

// Sistema de Menu de Usuário
class UserMenuSystem {
  constructor() {
    this.init();
  }

  async init() {
    this.setupMenuButton();
    this.setupModals();
    this.setupManageUsersButton();
    await this.loadUserProfile();
  }

  async loadUserProfile() {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) { window.location.href = '/Frontend/pages/auth/login.html'; return; }
      const response = await fetch('http://localhost:3000/profile', {
        headers: { 'x-user-email': userEmail }
      });

      if (response.ok) {
        const profile = await response.json();
        
        // Exibir nome e último login no dropdown
        const nameEl = document.getElementById('dropdown-name');
        const lastLoginEl = document.getElementById('dropdown-last-login');
        
        if (nameEl) {
          nameEl.textContent = profile.name || userEmail.split('@')[0];
        }
        
        if (lastLoginEl && profile.lastLogin) {
          const date = new Date(profile.lastLogin);
          const formatted = date.toLocaleString('pt-BR');
          lastLoginEl.textContent = `Último Acesso: ${formatted}`;
        }

        // Armazenar nome e role para usar depois
        sessionStorage.setItem('userName', profile.name || userEmail.split('@')[0]);
        sessionStorage.setItem('userRole', profile.role || 'PROFESSOR');
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  }

  setupMenuButton() {
    const avatarBtn = document.querySelector('.user-avatar-btn');
    const dropdown = document.querySelector('.user-dropdown');

    if (avatarBtn && dropdown) {
      avatarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
      });

      document.addEventListener('click', () => {
        dropdown.classList.remove('active');
      });

      dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  setupManageUsersButton() {
    const btnManageUsers = document.querySelector('[data-action="manage-users"]');
    if (btnManageUsers) {
      btnManageUsers.addEventListener('click', (e) => {
        e.preventDefault();
        this.checkPermissionAndNavigate();
      });
    }
  }

  async checkPermissionAndNavigate() {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const response = await fetch('http://localhost:3000/profile', {
        headers: { 'x-user-email': userEmail }
      });

      if (response.ok) {
        const profile = await response.json();
        if (profile.role === 'SUPERVISOR') {
          window.location.href = '../../pages/admin/users.html';
        } else {
          alert('Você não tem permissão para acessar esta funcionalidade');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
    }
  }

  setupModals() {
    // Modal de Conta
    const btnMinhaConta = document.querySelector('[data-modal="account"]');
    const modalConta = document.getElementById('modal-account');
    
    if (btnMinhaConta && modalConta) {
      btnMinhaConta.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal('account');
        this.loadAccountData();
        document.querySelector('.user-dropdown').classList.remove('active');
      });
    }

    // Botão Sair
    const btnSair = document.querySelector('[data-action="logout"]');
    if (btnSair) {
      btnSair.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }

    // Fechar modals
    document.querySelectorAll('.modal__close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // Botões cancelar
    document.querySelectorAll('.modal__btn--cancel').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // Fechar ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // Form para editar perfil
    const formProfile = document.getElementById('form-profile');
    if (formProfile) {
      formProfile.addEventListener('submit', (e) => {
        e.preventDefault();
        this.updateProfile();
      });
    }

    // Form para mudar senha
    const formPassword = document.getElementById('form-password');
    if (formPassword) {
      formPassword.addEventListener('submit', (e) => {
        e.preventDefault();
        this.changePassword();
      });
    }
  }

  async loadAccountData() {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const response = await fetch('http://localhost:3000/profile', {
        headers: { 'x-user-email': userEmail }
      });

      if (response.ok) {
        const profile = await response.json();
        const nameInput = document.getElementById('account-name');
        const emailInput = document.getElementById('account-email');
        
        if (nameInput) nameInput.value = profile.name || '';
        if (emailInput) emailInput.value = profile.email || '';
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }

  async updateProfile() {
    try {
      const nameInput = document.getElementById('account-name');
      const name = nameInput ? nameInput.value.trim() : '';

      if (!name) {
        alert('Nome não pode estar vazio');
        return;
      }

      const userEmail = localStorage.getItem('userEmail');
      const response = await fetch('http://localhost:3000/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': userEmail
        },
        body: JSON.stringify({ name })
      });

      if (response.ok) {
        alert('Perfil atualizado com sucesso!');
        sessionStorage.setItem('userName', name);
        this.closeModal('modal-account');
        await this.loadUserProfile();
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar perfil');
    }
  }

  async changePassword() {
    try {
      const currentPassword = document.getElementById('current-password')?.value;
      const newPassword = document.getElementById('new-password')?.value;
      const confirmPassword = document.getElementById('confirm-password')?.value;

      if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Preencha todos os campos');
        return;
      }

      if (newPassword !== confirmPassword) {
        alert('As senhas não conferem');
        return;
      }

      if (newPassword.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres');
        return;
      }

      const userEmail = localStorage.getItem('userEmail');
      const response = await fetch('http://localhost:3000/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userEmail,
          currentPassword,
          newPassword
        })
      });

      if (response.ok) {
        alert('Senha alterada com sucesso!');
        document.getElementById('form-password').reset();
        this.closeModal('modal-account');
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao alterar senha');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao alterar senha');
    }
  }

  openModal(modalName) {
    const modal = document.getElementById(`modal-${modalName}`);
    if (modal) {
      modal.classList.add('active');
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  }

  logout() {
    if (confirm('Deseja sair do sistema?')) {
      sessionStorage.removeItem('userEmail');
      localStorage.removeItem('userEmail');
      sessionStorage.clear();
      window.location.href = '../../pages/auth/login.html';
    }
  }
}

// Instanciar ao carregar
document.addEventListener('DOMContentLoaded', () => {
  new UserMenuSystem();
});
