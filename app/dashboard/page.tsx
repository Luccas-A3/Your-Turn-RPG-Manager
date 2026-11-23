<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Turn RPG – Minhas Campanhas</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/dashbord.css" />
  <link rel="icon" type="image/png" href="img/Your Turn - Icon.png">
</head>
<body>

  <!-- ── NAVBAR ── -->
  <header class="navbar">
    <a href="dashboard.html" class="nav-brand">
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F5A623" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="10" width="10" height="10" rx="2"/>
        <path d="M12 12h4a2 2 0 0 1 2 2v4"/>
        <path d="M8 2h8a2 2 0 0 1 2 2v4"/>
        <circle cx="7" cy="7" r="1" fill="#F5A623" stroke="none"/>
        <circle cx="7" cy="15" r="1" fill="#F5A623" stroke="none"/>
        <circle cx="15" cy="15" r="1" fill="#F5A623" stroke="none"/>
      </svg>
      <span class="nav-title">Your Turn rpg</span>
    </a>
    <div class="nav-right">
      <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
      <a href='login.html' class="register-link" id="nav-username">Entrar</a>
      <span class="nav-sep">···</span>
      <button class="btn-sair" onclick="sair()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Sair
      </button>
    </div>
  </header>

  <!-- ── CONTEÚDO ── -->
  <main class="content">
    <div class="page-header">
      <h1 class="page-title">Minhas Campanhas</h1>
      <button class="btn-nova" onclick="abrirModal()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nova Campanha
      </button>
    </div>

    <!-- estado vazio -->
    <div class="empty-state" id="empty-state">
      <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="10" width="10" height="10" rx="2"/>
        <path d="M12 12h4a2 2 0 0 1 2 2v4"/>
        <path d="M8 2h8a2 2 0 0 1 2 2v4"/>
        <circle cx="7" cy="7" r="1" fill="#444" stroke="none"/>
        <circle cx="7" cy="15" r="1" fill="#444" stroke="none"/>
        <circle cx="15" cy="15" r="1" fill="#444" stroke="none"/>
      </svg>
      <h2 class="empty-title">Nenhuma campanha criada</h2>
      <p class="empty-sub">Comece criando sua primeira campanha de RPG</p>
      <button class="btn-primeira" onclick="abrirModal()">Criar Primeira Campanha</button>
    </div>

    <!-- grid de campanhas -->
    <div class="campaign-grid" id="campaign-grid"></div>
  </main>

  <!-- ── MODAL NOVA CAMPANHA ── -->
  <div class="modal-overlay" id="modal-overlay" onclick="fecharModalFora(event)">
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">Nova Campanha</h2>
        <button class="modal-close" onclick="fecharModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="field">
          <label for="camp-name">Nome da Campanha</label>
          <input id="camp-name" type="text" placeholder="Ex: A Mina Perdida de Phandelver" />
        </div>
        <div class="field">
          <label for="camp-system">Sistema</label>
          <input id="camp-system" type="text" placeholder="Ex: D&D 5e, Pathfinder, Call of Cthulhu" />
        </div>
        <div class="field">
          <label for="camp-desc">Descrição</label>
          <textarea id="camp-desc" placeholder="Descreva o enredo e cenário da campanha" rows="4"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-criar" onclick="criarCampanha()">Criar Campanha</button>
        <button class="btn-cancelar" onclick="fecharModal()">Cancelar</button>
      </div>
    </div>
  </div>

  <button class="help-btn" aria-label="Ajuda">?</button>

  <script src="js/dashboard.js">
    
  </script>
</body>
</html>