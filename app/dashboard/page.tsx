"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import "@/styles/dashbord.css";

interface SessionItem {
  id: string;
  date?: string | null;
  notes?: string | null;
}

interface CharacterItem {
  id: string;
  name: string;
  player?: string | null;
  charClass?: string | null;
  level: number;
}

interface CampaignItem {
  id: string;
  name: string;
  system?: string | null;
  description?: string | null;
  sessions?: SessionItem[];
  characters?: CharacterItem[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: sessionData, isPending: sessionLoading } = authClient.useSession();

  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campName, setCampName] = useState("");
  const [campSystem, setCampSystem] = useState("");
  const [campDesc, setCampDesc] = useState("");
  const [nameError, setNameError] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!sessionLoading && !sessionData?.user) {
      router.push("/login");
    }
  }, [sessionData, sessionLoading, router]);

  async function loadCampaigns() {
    setLoadingCampaigns(true);
    try {
      const res = await fetch("/api/campaigns", { cache: "no-store" });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setCampaigns(Array.isArray(data) ? data : data.campaigns || []);
      }
    } finally {
      setLoadingCampaigns(false);
    }
  }

  useEffect(() => {
    if (sessionData?.user) {
      loadCampaigns();
    }
  }, [sessionData]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isModalOpen) {
        fecharModal();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  function abrirModal() {
    setNameError(false);
    setIsModalOpen(true);
  }

  function fecharModal() {
    setIsModalOpen(false);
    setCampName("");
    setCampSystem("");
    setCampDesc("");
    setNameError(false);
  }

  async function criarCampanha(e?: FormEvent) {
    if (e) e.preventDefault();
    const trimmedName = campName.trim();
    if (!trimmedName) {
      setNameError(true);
      setTimeout(() => setNameError(false), 1500);
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          system: campSystem.trim(),
          description: campDesc.trim(),
        }),
      });
      if (res.ok) {
        fecharModal();
        await loadCampaigns();
      }
    } finally {
      setCreating(false);
    }
  }

  async function deleteCampaign(campaignId: string) {
    if (!window.confirm("Excluir esta campanha?")) return;
    const res = await fetch(`/api/campaigns/${campaignId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    }
  }

  async function sair() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  function getNextSession(sessions: SessionItem[] = []) {
    const today = new Date().toISOString().slice(0, 10);
    return sessions
      .map((s) => s.date)
      .filter((d): d is string => Boolean(d && d >= today))
      .sort()[0];
  }

  const displayName =
    sessionData?.user?.name || sessionData?.user?.email || "Entrar";

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
          {sessionData?.user ? (
            <span className="register-link" id="nav-username">
              {displayName}
            </span>
          ) : (
            <Link href="/login" className="register-link" id="nav-username">
              Entrar
            </Link>
          )}
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
        <div className="page-header">
          <h1 className="page-title">Minhas Campanhas</h1>
          <button className="btn-nova" type="button" onClick={abrirModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
            Nova Campanha
          </button>
        </div>

        {loadingCampaigns ? (
          <p className="empty-sub">Carregando campanhas...</p>
        ) : campaigns.length === 0 ? (
          <div className="empty-state" id="empty-state">
            <svg
              className="empty-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="72"
              height="72"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#444"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="10" width="10" height="10" rx="2" />
              <path d="M12 12h4a2 2 0 0 1 2 2v4" />
              <path d="M8 2h8a2 2 0 0 1 2 2v4" />
              <circle cx="7" cy="7" r="1" fill="#444" stroke="none" />
              <circle cx="7" cy="15" r="1" fill="#444" stroke="none" />
              <circle cx="15" cy="15" r="1" fill="#444" stroke="none" />
            </svg>
            <h2 className="empty-title">Nenhuma campanha criada</h2>
            <p className="empty-sub">Comece criando sua primeira campanha de RPG</p>
            <button className="btn-primeira" type="button" onClick={abrirModal}>
              Criar Primeira Campanha
            </button>
          </div>
        ) : (
          <div className="campaign-grid" id="campaign-grid">
            {campaigns.map((c) => {
              const sessions = c.sessions || [];
              const characters = c.characters || [];
              const nextSession = getNextSession(sessions);

              return (
                <div
                  key={c.id}
                  className="camp-card"
                  onClick={() => router.push(`/campanha/${c.id}`)}
                >
                  <div className="camp-card-top">
                    <div>
                      <h3 className="camp-name">{c.name}</h3>
                      <p className="camp-system">{c.system || ""}</p>
                    </div>
                    <button
                      type="button"
                      className="camp-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCampaign(c.id);
                      }}
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

                  <div className="camp-stats">
                    <span className="camp-stat">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                      {sessions.length}{" "}
                      {sessions.length === 1 ? "sessão" : "sessões"}
                    </span>
                    <span className="camp-stat">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      {characters.length}{" "}
                      {characters.length === 1 ? "jogador" : "jogadores"}
                    </span>
                  </div>

                  <div className="camp-divider" />

                  <div className="camp-next">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {nextSession ? (
                      `Próxima sessão: ${nextSession.split("-").reverse().join("/")}`
                    ) : (
                      <span style={{ color: "var(--text-dim)" }}>
                        Sem sessão agendada
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── MODAL NOVA CAMPANHA ── */}
      <div
        className={`modal-overlay ${isModalOpen ? "active" : ""}`}
        id="modal-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) fecharModal();
        }}
      >
        <div className="modal">
          <div className="modal-header">
            <h2 className="modal-title">Nova Campanha</h2>
            <button className="modal-close" type="button" onClick={fecharModal}>
              &times;
            </button>
          </div>
          <form onSubmit={criarCampanha}>
            <div className="modal-body">
              <div className="field">
                <label htmlFor="camp-name">Nome da Campanha</label>
                <input
                  id="camp-name"
                  type="text"
                  placeholder="Ex: A Mina Perdida de Phandelver"
                  value={campName}
                  onChange={(e) => {
                    setCampName(e.target.value);
                    if (nameError) setNameError(false);
                  }}
                  style={nameError ? { borderColor: "#e53935" } : undefined}
                />
              </div>
              <div className="field">
                <label htmlFor="camp-system">Sistema</label>
                <input
                  id="camp-system"
                  type="text"
                  placeholder="Ex: D&D 5e, Pathfinder, Call of Cthulhu"
                  value={campSystem}
                  onChange={(e) => setCampSystem(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="camp-desc">Descrição</label>
                <textarea
                  id="camp-desc"
                  placeholder="Descreva o enredo e cenário da campanha"
                  rows={4}
                  value={campDesc}
                  onChange={(e) => setCampDesc(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-criar" type="submit" disabled={creating}>
                {creating ? "Criando..." : "Criar Campanha"}
              </button>
              <button
                className="btn-cancelar"
                type="button"
                onClick={fecharModal}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <button className="help-btn" type="button" aria-label="Ajuda">
        ?
      </button>
    </>
  );
}