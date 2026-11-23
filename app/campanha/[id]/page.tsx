<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Turn RPG – Campanha</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/campanha.css" />
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
      <span class="nav-username" id="nav-username">usuário</span>
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

    <!-- Voltar -->
    <a href="dashboard.html" class="btn-voltar">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
      </svg>
      Voltar
    </a>

    <!-- Banner da campanha -->
    <div class="camp-banner">
      <h1 class="camp-name" id="camp-name-display">—</h1>
      <p class="camp-system" id="camp-system-display"></p>
      <p class="camp-desc"  id="camp-desc-display"></p>
    </div>

    <!-- Abas -->
    <div class="tabs">
      <button class="tab active" data-tab="personagens" onclick="switchTab('personagens', this)">Personagens</button>
      <button class="tab"        data-tab="sessoes"     onclick="switchTab('sessoes', this)">Sessões</button>
    </div>

    <!-- ── ABA PERSONAGENS ── -->
    <div class="tab-panel" id="panel-personagens">

      <!-- Formulário adicionar -->
      <div class="section-card">
        <h2 class="section-title">Adicionar Personagem</h2>
        <div class="form-grid">
          <input id="char-name"   type="text" placeholder="Nome do personagem" />
          <input id="char-player" type="text" placeholder="Nome do jogador" />
          <input id="char-class"  type="text" placeholder="Classe" />
          <input id="char-level"  type="number" placeholder="1" min="1" max="20" value="1" />
        </div>
        <button class="btn-add" onclick="adicionarPersonagem()">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Adicionar
        </button>
      </div>

      <!-- Lista personagens -->
      <div id="char-list"></div>
    </div>

    <!-- ── ABA SESSÕES ── -->
    <div class="tab-panel hidden" id="panel-sessoes">

      <!-- Formulário adicionar -->
      <div class="section-card">
        <h2 class="section-title">Adicionar Sessão</h2>
        <input id="sess-date"  type="date" />
        <textarea id="sess-notes" placeholder="Notas da sessão" rows="5"></textarea>
        <button class="btn-add" onclick="adicionarSessao()">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Adicionar Sessão
        </button>
      </div>

      <!-- Lista sessões -->
      <div id="sess-list"></div>
    </div>

  </main>

  <!-- Modal editar sessão -->
  <div class="modal-overlay" id="edit-modal-overlay" onclick="fecharEditModal(event)">
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">Editar Sessão</h2>
        <button class="modal-close" onclick="fecharEditModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="field">
          <label for="edit-date">Data</label>
          <input id="edit-date" type="date" />
        </div>
        <div class="field">
          <label for="edit-notes">Notas</label>
          <textarea id="edit-notes" rows="5" placeholder="Notas da sessão"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-criar" onclick="salvarEdicao()">Salvar</button>
        <button class="btn-cancelar" onclick="fecharEditModal()">Cancelar</button>
      </div>
    </div>
  </div>

  <script>
    // ── Helpers ─────────────────────────────────────────────────────────────
    const username = sessionStorage.getItem('ytrpg_user') || 'usuário';
    document.getElementById('nav-username').textContent = username;

    function getCampaigns() {
      return JSON.parse(sessionStorage.getItem('ytrpg_campaigns') || '[]');
    }
    function saveCampaigns(list) {
      sessionStorage.setItem('ytrpg_campaigns', JSON.stringify(list));
    }

    const idx = parseInt(sessionStorage.getItem('ytrpg_current_campaign') || '0');
    let campaigns = getCampaigns();
    let campaign  = campaigns[idx];

    if (!campaign) { window.location.href = 'dashboard.html'; }

    // ── Preenche banner ──────────────────────────────────────────────────────
    document.getElementById('camp-name-display').textContent   = campaign.name;
    document.getElementById('camp-system-display').textContent = campaign.system || '';
    document.getElementById('camp-desc-display').textContent   = campaign.description || '';

    // ── Salva campanha atualizada ────────────────────────────────────────────
    function saveCurrentCampaign() {
      campaigns[idx] = campaign;
      saveCampaigns(campaigns);
    }

    // ── Abas ─────────────────────────────────────────────────────────────────
    function switchTab(tab, btn) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
      btn.classList.add('active');
      document.getElementById('panel-' + tab).classList.remove('hidden');
    }

    // ── PERSONAGENS ──────────────────────────────────────────────────────────
    function renderPersonagens() {
      const list = document.getElementById('char-list');
      const chars = campaign.characters || [];
      list.innerHTML = '';
      chars.forEach((c, i) => {
        const el = document.createElement('div');
        el.className = 'item-card';
        el.innerHTML = `
          <div class="item-info">
            <h3 class="item-title">${c.name}</h3>
            <p class="item-sub">${c.charClass} - Nível ${c.level}</p>
            <p class="item-sub2">Jogador: ${c.player}</p>
          </div>
          <button class="item-delete" onclick="deletarPersonagem(${i})" title="Excluir">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
            </svg>
          </button>
        `;
        list.appendChild(el);
      });
    }

    function adicionarPersonagem() {
      const name      = document.getElementById('char-name').value.trim();
      const player    = document.getElementById('char-player').value.trim();
      const charClass = document.getElementById('char-class').value.trim();
      const level     = parseInt(document.getElementById('char-level').value) || 1;
      if (!name) { document.getElementById('char-name').focus(); return; }
      campaign.characters = campaign.characters || [];
      campaign.characters.push({ name, player, charClass, level });
      saveCurrentCampaign();
      renderPersonagens();
      document.getElementById('char-name').value   = '';
      document.getElementById('char-player').value = '';
      document.getElementById('char-class').value  = '';
      document.getElementById('char-level').value  = '1';
    }

    function deletarPersonagem(i) {
      campaign.characters.splice(i, 1);
      saveCurrentCampaign();
      renderPersonagens();
    }

    // ── SESSÕES ──────────────────────────────────────────────────────────────
    function renderSessoes() {
      const list     = document.getElementById('sess-list');
      const sessions = campaign.sessions || [];
      list.innerHTML = '';
      sessions.forEach((s, i) => {
        const el = document.createElement('div');
        el.className = 'item-card';
        const dateDisplay = s.date ? s.date.split('-').reverse().join('/') : '—';
        el.innerHTML = `
          <div class="item-info">
            <h3 class="item-title">Sessão #${i + 1}</h3>
            <p class="item-sub" style="color:var(--text-muted)">${dateDisplay}</p>
            <p class="item-notes">${s.notes || ''}</p>
          </div>
          <div class="item-actions">
            <button class="item-edit" onclick="abrirEditModal(${i})" title="Editar">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="item-delete" onclick="deletarSessao(${i})" title="Excluir">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
            </button>
          </div>
        `;
        list.appendChild(el);
      });
    }

    function adicionarSessao() {
      const date  = document.getElementById('sess-date').value;
      const notes = document.getElementById('sess-notes').value.trim();
      campaign.sessions = campaign.sessions || [];
      campaign.sessions.push({ date, notes });
      saveCurrentCampaign();
      renderSessoes();
      document.getElementById('sess-date').value  = '';
      document.getElementById('sess-notes').value = '';
    }

    function deletarSessao(i) {
      campaign.sessions.splice(i, 1);
      saveCurrentCampaign();
      renderSessoes();
    }

    // ── Modal editar sessão ──────────────────────────────────────────────────
    let editIndex = -1;

    function abrirEditModal(i) {
      editIndex = i;
      const s = campaign.sessions[i];
      document.getElementById('edit-date').value  = s.date  || '';
      document.getElementById('edit-notes').value = s.notes || '';
      document.getElementById('edit-modal-overlay').classList.add('active');
    }

    function fecharEditModal(e) {
      if (e && e.type === 'click') {
        if (e.target !== document.getElementById('edit-modal-overlay')) return;
      }
      document.getElementById('edit-modal-overlay').classList.remove('active');
      editIndex = -1;
    }

    function salvarEdicao() {
      if (editIndex < 0) return;
      campaign.sessions[editIndex].date  = document.getElementById('edit-date').value;
      campaign.sessions[editIndex].notes = document.getElementById('edit-notes').value.trim();
      saveCurrentCampaign();
      renderSessoes();
      document.getElementById('edit-modal-overlay').classList.remove('active');
      editIndex = -1;
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') fecharEditModal();
    });

    function sair() {
      sessionStorage.removeItem('ytrpg_user');
      sessionStorage.removeItem('ytrpg_current_campaign');
      window.location.href = 'index.html';
    }

    // ── Init ─────────────────────────────────────────────────────────────────
    renderPersonagens();
    renderSessoes();
  </script>
</body>
</html>