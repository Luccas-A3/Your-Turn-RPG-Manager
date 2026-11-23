"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import "@/styles/login.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasError = Boolean(errorMessage);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Preencha todos os campos");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message || "E-mail ou senha incorretos");
        return;
      }

        await authClient.getSession();
        window.location.assign("/dashboard");
    } catch {
      setErrorMessage("Erro ao tentar entrar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="bg" />

      <main className="card">
        <div className="logo-wrap">
          <div className="logo-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
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
          </div>
        </div>

        <h1 className="brand">Your Turn rpg</h1>
        <p className="subtitle">Entre para gerenciar suas campanhas</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              className={hasError ? "fieldIsWrong" : undefined}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              className={hasError ? "fieldIsWrong" : undefined}
            />
          </div>

          <p
            className="match-label"
            id="wrongPasswordOrUsernameWarning"
            style={{ color: errorMessage ? "#e53935" : undefined }}
          >
            {errorMessage}
          </p>

          <button
            className="btn-entrar"
            type="submit"
            id="loginButton"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="register-text">Não tem uma conta?</p>
        <Link href="/register" className="register-link">
          Criar conta
        </Link>
      </main>

      <button className="help-btn" type="button" aria-label="Ajuda">
        ?
      </button>
    </div>
  );
}