<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Turn RPG – Criar Conta</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/register.css" />
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
    <p class="subtitle">Crie sua conta e comece a aventura</p>

    <div class="form">
      <form id="regForm">
        <div class="field">
          <label for="username">Usuário</label>
          <input id="username" type="text" placeholder="Escolha um nome de usuário" autocomplete="username" />
        </div>

        <div class="field">
          <label for="email">E-mail</label>
          <input id="email" type="email" placeholder="Digite seu e-mail" autocomplete="email" />
        </div>

        <div class="field">
          <label for="password">Senha</label>
          <input id="password" type="password" placeholder="Crie uma senha" autocomplete="new-password" />
        </div>

        <div class="field">
          <label for="passwordMatch">Confirmar senha</label>
          <input id="passwordMatch" type="password" placeholder="Repita a senha" autocomplete="new-password" />
          <p class="match-label" id="passwordConfirmLabel"></p>
        </div>
        <p class="match-label" id="emptyInputsWarning"></p>

        <button class="btn-entrar" id="regButton" type="button">Criar conta</button>
      </form>
    </div>

    <p class="register-text">Já tem uma conta?</p>
    <a href="login.html" class="register-link">Entrar</a>
  </main>

  <button class="help-btn" aria-label="Ajuda">?</button>
  <script src="js/register.js"></script>

  <!--<script>
    const pwInput      = document.getElementById('password');
    const confirmInput = document.getElementById('confirm-password');
    const matchLabel   = document.getElementById('match-label');

    confirmInput.addEventListener('input', checkMatch);
    pwInput.addEventListener('input', checkMatch);

    function checkMatch() {
      if (!confirmInput.value) { matchLabel.textContent = ''; return; }
      if (pwInput.value === confirmInput.value) {
        matchLabel.textContent = 'Senhas coincidem ✓';
        matchLabel.style.color = '#43a047';
      } else {
        matchLabel.textContent = 'Senhas não coincidem';
        matchLabel.style.color = '#e53935';
      }
    }
  </script>
  -->
</body>
</html>