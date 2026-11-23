"use client";

import { Suspense, useState, useEffect, useCallback, FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import "@/styles/campanha.css";

interface CharacterItem {
  id: string;
  name: string;
  player?: string | null;
  charClass?: string | null;
  level: number;
}

interface SessionItem {
  id: string;
  date?: string | null;
  notes?: string | null;
}

interface CampaignDetail {
  id: string;
  name: string;
  system?: string | null;
  description?: string | null;
  characters: CharacterItem[];
  sessions: SessionItem[];
}

function CampaignContent() {
  const params = useParams<{ id: string }>();
  const campaignId = params?.id;
  const router = useRouter();
  const { data: sessionData } = authClient.useSession();

  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"personagens" | "sessoes">("personagens");

  // Formulário personagem
  const [charName, setCharName] = useState("");
  const [charPlayer, setCharPlayer] = useState("");
  const [charClass, setCharClass] = useState("");
  const [charLevel, setCharLevel] = useState(1);

  // Formulário sessão
  const [sessDate, setSessDate] = useState("");
  const [sessNotes, setSessNotes] = useState("");

  // Modal editar sessão
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const loadCampaign = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, { cache: "no-store" });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        router.push("/dashboard");
        return;
      }
      const data = await res.json();
      setCampaign({
        ...data,
        characters: data.characters || [],
        sessions: data.sessions || [],
      });
    } finally {
      setLoading(false);
    }
  }, [campaignId, router]);

  useEffect(() => {
    loadCampaign();
  }, [loadCampaign]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && editingSessionId) {
        fecharEditModal();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [editingSessionId]);

  async function adicionarPersonagem(e: FormEvent) {
    e.preventDefault();
    if (!campaignId) return;
    const trimmedName = charName.trim();
    if (!trimmedName) return;

    const res = await fetch(`/api/campaigns/${campaignId}/characters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: trimmedName,
        player: charPlayer.trim(),
        charClass: charClass.trim(),
        level: Number(charLevel) || 1,
      }),
    });

    if (res.ok) {
      setCharName("");
      setCharPlayer("");
      setCharClass("");
      setCharLevel(1);
      await loadCampaign();
    }
  }

  async function deletarPersonagem(characterId: string) {
    if (!campaignId) return;
    const res = await fetch(
      `/api/campaigns/${campaignId}/characters/${characterId}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      setCampaign((prev) =>
        prev
          ? {
              ...prev,
              characters: prev.characters.filter((c) => c.id !== characterId),
            }
          : prev
      );
    }
  }

  async function adicionarSessao(e: FormEvent) {
    e.preventDefault();
    if (!campaignId) return;

    const res = await fetch(`/api/campaigns/${campaignId}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: sessDate || null,
        notes: sessNotes.trim(),
      }),
    });

    if (res.ok) {
      setSessDate("");
      setSessNotes("");
      await loadCampaign();
    }
  }

  async function deletarSessao(sessionId: string) {
    if (!campaignId) return;
    const res = await fetch(
      `/api/campaigns/${campaignId}/sessions/${sessionId}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      setCampaign((prev) =>
        prev
          ? {
              ...prev,
              sessions: prev.sessions.filter((s) => s.id !== sessionId),
            }
          : prev
      );
    }
  }

  function abrirEditModal(s: SessionItem) {
    setEditingSessionId(s.id);
    setEditDate(s.date || "");
    setEditNotes(s.notes || "");
  }

  function fecharEditModal() {
    setEditingSessionId(null);
    setEditDate("");
    setEditNotes("");
  }

  async function salvarEdicao(e: FormEvent) {
    e.preventDefault();
    if (!campaignId || !editingSessionId) return;

    const res = await fetch(
      `/api/campaigns/${campaignId}/sessions/${editingSessionId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: editDate || null,
          notes: editNotes.trim(),
        }),
      }
    );

    if (res.ok) {
      fecharEditModal();
      await loadCampaign();
    }
  }

  async function sair() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  const username =
    sessionData?.user?.name || sessionData?.user?.email || "usuário";

  return (
    <>
      {/* ── NAVBAR ── */}
      <header className="navbar">
        <Link href="/dashboard" className="nav-brand">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#F5A623"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="10" width="10" height="10" rx="2" />
            <path d="M12 12h4a2 2 0 0 1 2 2v4" />
            <path d="M8 2h8a2 2 0 0 1 2 2v4" />
            <circle cx="7" cy="7" r="1" fill="#F5A623" stroke="none" />
            <circle cx="7" cy="15" r="1" fill="#F5A623" stroke="none" />
            <circle cx="15" cy="15" r="1" fill="#F5A623" stroke="none" />
          </svg>
          <span className="nav-title">Your Turn rpg</span>
        </Link>

        <div className="nav-right">
          <svg
            className="nav-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#888"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          <span className="nav-username" id="nav-username">
            {username}
          </span>
          <span className="nav-sep">···</span>
          <button className="btn-sair" type="button" onClick={sair}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sair
          </button>
        </div>
      </header>

      {/* ── CONTEÚDO ── */}
      <main className="content">
        <Link href="/dashboard" className="btn-voltar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Voltar
        </Link>

        {/* Banner da campanha */}
        <div className="camp-banner">
          <h1 className="camp-name" id="camp-name-display">
            {loading ? "Carregando..." : campaign?.name || "—"}
          </h1>
          <p className="camp-system" id="camp-system-display">
            {campaign?.system || ""}
          </p>
          <p className="camp-desc" id="camp-desc-display">
            {campaign?.description || ""}
          </p>
        </div>

        {/* Abas */}
        <div className="tabs">
          <button
            type="button"
            className={`tab ${activeTab === "personagens" ? "active" : ""}`}
            onClick={() => setActiveTab("personagens")}
          >
            Personagens
          </button>
          <button
            type="button"
            className={`tab ${activeTab === "sessoes" ? "active" : ""}`}
            onClick={() => setActiveTab("sessoes")}
          >
            Sessões
          </button>
        </div>

        {/* ── ABA PERSONAGENS ── */}
        <div
          className={`tab-panel ${activeTab === "personagens" ? "" : "hidden"}`}
          id="panel-personagens"
        >
          <form className="section-card" onSubmit={adicionarPersonagem}>
            <h2 className="section-title">Adicionar Personagem</h2>
            <div className="form-grid">
              <input
                id="char-name"
                type="text"
                placeholder="Nome do personagem"
                value={charName}
                onChange={(e) => setCharName(e.target.value)}
              />
              <input
                id="char-player"
                type="text"
                placeholder="Nome do jogador"
                value={charPlayer}
                onChange={(e) => setCharPlayer(e.target.value)}
              />
              <input
                id="char-class"
                type="text"
                placeholder="Classe"
                value={charClass}
                onChange={(e) => setCharClass(e.target.value)}
              />
              <input
                id="char-level"
                type="number"
                placeholder="1"
                min={1}
                max={20}
                value={charLevel}
                onChange={(e) => setCharLevel(Number(e.target.value) || 1)}
              />
            </div>
            <button className="btn-add" type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Adicionar
            </button>
          </form>

          <div id="char-list">
            {(campaign?.characters || []).map((c) => (
              <div key={c.id} className="item-card">
                <div className="item-info">
                  <h3 className="item-title">{c.name}</h3>
                  <p className="item-sub">
                    {c.charClass || ""} - Nível {c.level}
                  </p>
                  <p className="item-sub2">Jogador: {c.player || ""}</p>
                </div>
                <button
                  type="button"
                  className="item-delete"
                  onClick={() => deletarPersonagem(c.id)}
                  title="Excluir"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── ABA SESSÕES ── */}
        <div
          className={`tab-panel ${activeTab === "sessoes" ? "" : "hidden"}`}
          id="panel-sessoes"
        >
          <form className="section-card" onSubmit={adicionarSessao}>
            <h2 className="section-title">Adicionar Sessão</h2>
            <input
              id="sess-date"
              type="date"
              value={sessDate}
              onChange={(e) => setSessDate(e.target.value)}
            />
            <textarea
              id="sess-notes"
              placeholder="Notas da sessão"
              rows={5}
              value={sessNotes}
              onChange={(e) => setSessNotes(e.target.value)}
            />
            <button className="btn-add" type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Adicionar Sessão
            </button>
          </form>

          <div id="sess-list">
            {(campaign?.sessions || []).map((s, i) => {
              const dateDisplay = s.date
                ? s.date.split("-").reverse().join("/")
                : "—";
              return (
                <div key={s.id} className="item-card">
                  <div className="item-info">
                    <h3 className="item-title">Sessão #{i + 1}</h3>
                    <p
                      className="item-sub"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {dateDisplay}
                    </p>
                    <p className="item-notes">{s.notes || ""}</p>
                  </div>
                  <div className="item-actions">
                    <button
                      type="button"
                      className="item-edit"
                      onClick={() => abrirEditModal(s)}
                      title="Editar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="item-delete"
                      onClick={() => deletarSessao(s.id)}
                      title="Excluir"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modal editar sessão */}
      <div
        className={`modal-overlay ${editingSessionId ? "active" : ""}`}
        id="edit-modal-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) fecharEditModal();
        }}
      >
        <div className="modal">
          <div className="modal-header">
            <h2 className="modal-title">Editar Sessão</h2>
            <button
              className="modal-close"
              type="button"
              onClick={fecharEditModal}
            >
              &times;
            </button>
          </div>
          <form onSubmit={salvarEdicao}>
            <div className="modal-body">
              <div className="field">
                <label htmlFor="edit-date">Data</label>
                <input
                  id="edit-date"
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="edit-notes">Notas</label>
                <textarea
                  id="edit-notes"
                  rows={5}
                  placeholder="Notas da sessão"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-criar" type="submit">
                Salvar
              </button>
              <button
                className="btn-cancelar"
                type="button"
                onClick={fecharEditModal}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default function CampaignPage() {
  return (
    <Suspense
      fallback={
        <main className="content">
          <p className="empty-sub">Carregando campanha...</p>
        </main>
      }
    >
      <CampaignContent />
    </Suspense>
  );
}