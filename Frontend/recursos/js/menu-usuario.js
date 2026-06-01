if (!window.__CAIGE_JWT_FETCH_PATCHED__) {
  window.__CAIGE_JWT_FETCH_PATCHED__ = true;
  const originalFetch = window.fetch.bind(window);

  function shouldAttachToken(inputUrl) {
    try {
      const normalized = new URL(inputUrl, window.location.origin);
      return normalized.origin === window.location.origin && normalized.pathname.startsWith('/api/');
    } catch {
      return String(inputUrl || '').startsWith('/api/');
    }
  }

  window.fetch = async (input, init = {}) => {
    const requestUrl = typeof input === 'string' ? input : input?.url;
    const token = localStorage.getItem('jwtToken');

    if (!token || !shouldAttachToken(requestUrl)) {
      return originalFetch(input, init);
    }

    const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));
    if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return originalFetch(input, {
      ...init,
      headers
    });
  };
}

if (sessionStorage.getItem('userEmail')) {
  localStorage.setItem('userEmail', sessionStorage.getItem('userEmail'));
} else {
  localStorage.removeItem('userEmail');
}

if (!window.__CAIGE_MOJIBAKE_NORMALIZER__) {
  window.__CAIGE_MOJIBAKE_NORMALIZER__ = true;

  const MOJIBAKE_PATTERN = /[ÃÂâðŸ�]/;

  function normalizeMojibake(value) {
    if (typeof value !== 'string' || !MOJIBAKE_PATTERN.test(value)) {
      return value;
    }

    try {
      const decoded = decodeURIComponent(escape(value));
      return decoded || value;
    } catch {
      return value;
    }
  }

  function normalizeDocumentText() {
    const root = document.body;
    if (!root) {
      return;
    }

    if (document.title) {
      document.title = normalizeMojibake(document.title);
    }

    const textWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (textWalker.nextNode()) {
      const node = textWalker.currentNode;
      const normalized = normalizeMojibake(node.nodeValue);
      if (normalized !== node.nodeValue) {
        node.nodeValue = normalized;
      }
    }

    const attributeNames = ['title', 'placeholder', 'aria-label', 'alt'];
    root.querySelectorAll('*').forEach((element) => {
      attributeNames.forEach((attributeName) => {
        if (element.hasAttribute(attributeName)) {
          const currentValue = element.getAttribute(attributeName);
          const normalized = normalizeMojibake(currentValue);
          if (normalized !== currentValue) {
            element.setAttribute(attributeName, normalized);
          }
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', normalizeDocumentText, { once: true });
  } else {
    normalizeDocumentText();
  }
}

// Sistema de Menu de Usuário
class UserMenuSystem {
  constructor() {
    this.init();
  }

  applyUserIdentity(userEmail, profile = null) {
    const username = String(userEmail || '').split('@')[0] || 'US';
    const initials = username.substring(0, 2).toUpperCase();

    const userAvatarEl = document.getElementById('user-avatar');
    const dropdownAvatarEl = document.getElementById('dropdown-avatar');
    const dropdownEmailEl = document.getElementById('dropdown-email');
    const welcomeEl = document.getElementById('user-welcome');

    if (userAvatarEl) userAvatarEl.textContent = initials;
    if (dropdownAvatarEl) dropdownAvatarEl.textContent = initials;
    if (dropdownEmailEl) dropdownEmailEl.textContent = userEmail;
    if (welcomeEl) {
      welcomeEl.textContent = (profile && profile.name) || username;
    }
  }

  updateManageUsersVisibility(role) {
    const btnManageUsers = document.getElementById('btn-manage-users');
    if (!btnManageUsers) {
      return;
    }
    btnManageUsers.style.display = role === 'SUPERVISOR' ? 'block' : 'none';
  }

  async init() {
    this.setupMenuButton();
    this.setupModals();
    this.setupAccountTabs();
    this.setupManageUsersButton();
    await this.loadUserProfile();
  }

  setupAccountTabs() {
    const tabButtons = document.querySelectorAll('.account-tab-btn');
    if (!tabButtons.length) {
      return;
    }

    const activateTab = (tabName) => {
      document.querySelectorAll('.account__tab').forEach((tab) => {
        tab.style.display = tab.id === `tab-${tabName}` ? 'block' : 'none';
      });

      tabButtons.forEach((button) => {
        const isActive = button.dataset.tab === tabName;
        button.style.color = isActive ? '#1f60e8' : '#999';
        button.style.borderBottom = isActive ? '3px solid #1f60e8' : 'none';
      });
    };

    tabButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        activateTab(button.dataset.tab);
      });
    });

    const defaultButton = Array.from(tabButtons).find((button) => (button.style.borderBottom || '').includes('3px')) || tabButtons[0];
    if (defaultButton && defaultButton.dataset.tab) {
      activateTab(defaultButton.dataset.tab);
    }
  }

  async loadUserProfile() {
    try {
      const token = localStorage.getItem('jwtToken');
      const userEmail = localStorage.getItem('userEmail');
      if (!token || !userEmail) { window.location.href = '../autenticacao/entrar.html'; return; }
      this.applyUserIdentity(userEmail);
      const response = await fetch('/api/autenticacao/perfil', {
        headers: { 'x-user-email': userEmail }
      });

      if (response.ok) {
        const profile = await response.json();
        this.applyUserIdentity(userEmail, profile);
        
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

        // Armazenar nome e perfil para uso posterior
        sessionStorage.setItem('userName', profile.name || userEmail.split('@')[0]);
        sessionStorage.setItem('userRole', profile.role || 'PROFESSOR');
        this.updateManageUsersVisibility(profile.role || 'PROFESSOR');
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
      const response = await fetch('/api/autenticacao/perfil', {
        headers: { 'x-user-email': userEmail }
      });

      if (response.ok) {
        const profile = await response.json();
        if (profile.role === 'SUPERVISOR') {
          window.location.href = '../../paginas/administracao/usuarios.html';
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

    // Fechar modais
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
      const response = await fetch('/api/autenticacao/perfil', {
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
      const response = await fetch('/api/autenticacao/perfil', {
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
      const response = await fetch('/api/autenticacao/alterar-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': userEmail
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
      localStorage.removeItem('jwtToken');
      sessionStorage.clear();
      window.location.href = '../../paginas/autenticacao/entrar.html';
    }
  }
}

// Instanciar ao carregar
document.addEventListener('DOMContentLoaded', () => {
  new UserMenuSystem();
});



