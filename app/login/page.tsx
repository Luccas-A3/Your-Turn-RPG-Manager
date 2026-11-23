<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Turn RPG – Login</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/login.css" />
  <link rel="icon" type="image/png" href="img/Your Turn - Icon.png">
</head>
<body>
  <div class="bg"></div>

  <main class="card">
    <div class="logo-wrap"> 
      <div class="logo-circle">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F5A623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="10" width="10" height="10" rx="2"/>
          <path d="M12 12h4a2 2 0 0 1 2 2v4"/>
          <path d="M8 2h8a2 2 0 0 1 2 2v4"/>
          <circle cx="7" cy="7" r="1" fill="#F5A623" stroke="none"/>
          <circle cx="7" cy="15" r="1" fill="#F5A623" stroke="none"/>
          <circle cx="15" cy="15" r="1" fill="#F5A623" stroke="none"/>
        </svg>
      </div>
    </div>

    <h1 class="brand">Your Turn rpg</h1>
    <p class="subtitle">Entre para gerenciar suas campanhas</p>

    <div class="form">
      <div class="field">
        <label for="username">Usuário</label>
        <input id="username" type="text" placeholder="Digite seu usuário" autocomplete="username" />
      </div>

      <div class="field">
        <label for="password">Senha</label>
        <input id="password" type="password" placeholder="Digite sua senha" autocomplete="current-password" />
      </div>
      <p class="match-label" id="wrongPasswordOrUsernameWarning"></p>
      <button class="btn-entrar" type="button" id="loginButton">Entrar</button>
    </div>
    
    <p class="register-text">Não tem uma conta?</p>
    <a href="register.html" class="register-link">Criar conta</a>
    
  </main>
  
  <button class="help-btn" aria-label="Ajuda">?</button>

  <script src="js/login.js">
    `
    function handleLogin() {
      const user = document.getElementById('username').value.trim();
      const pass = document.getElementById('password').value;
      if (!user || !pass) {
        alert('Preencha usuário e senha.');
        return;
      }
      localStorage.setItem('ytrpg_user', user);
      window.location.href = 'dashboard.html';
    }
    document.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleLogin();
    });`
  </script>
</body>
</html>