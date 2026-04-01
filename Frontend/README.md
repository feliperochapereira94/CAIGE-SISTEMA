# CAIGE Frontend

Interface de login para o sistema CAIGE de gerenciamento.

## 📁 Estrutura

```
Frontend/
├── pages/              # Páginas HTML
│   ├── login.html      # Página de login
│   └── dashboard.html  # Dashboard
├── css/                # Estilos
│   ├── login.css       # Estilos do login
│   └── dashboard.css   # Estilos do dashboard
├── public/             # Arquivos estáticos (imagens, fontes, etc)
└── README.md           # Este arquivo
```

## 🎨 Design

- **Responsivo**: Funciona em desktop, tablet e mobile
- **BEM Naming Convention**: Código CSS bem organizado
- **Google Fonts**: Tipografia Inter de alta qualidade
- **Acessível**: HTML semântico

## 🚀 Como usar

1. Abra o arquivo `pages/login.html` no navegador
2. Para desenvolvimento, use um servidor local (Live Server, http-server, etc)

## 📝 Páginas

### Login (`pages/login.html`)
- Formulário de autenticação
- Email/Usuário e Senha
- Opção "Lembrar de mim"
- Seção hero com informações sobre o CAIGE

### Dashboard (`pages/dashboard.html`)
- Página protegida (após login)

## 🔗 Conexão com Backend

O formulário de login pode ser conectado ao backend:

```javascript
const form = document.querySelector('.login__form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = form.querySelector('input[type="email"]').value;
  const password = form.querySelector('input[type="password"]').value;
  
  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
});
```
