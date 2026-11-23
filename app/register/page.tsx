"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import "@/styles/register.css";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState("");

  const [emptyFields, setEmptyFields] = useState<string[]>([]);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [formWarning, setFormWarning] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validatePasswordFields(nextPassword: string, nextMatch: string) {
    if (!nextMatch) {
      setPasswordFeedback("");
      return nextPassword.length >= 8;
    }

    if (nextPassword !== nextMatch) {
      setPasswordFeedback("Senhas diferentes!");
      return false;
    }

    if (nextPassword.length < 8) {
      setPasswordFeedback("Uma senha deve ter no mínimo 8 caracteres");
      return false;
    }

    setPasswordFeedback("");
    return true;
  }

  function clearFieldError(fieldName: string) {
    setEmptyFields((prev) => prev.filter((item) => item !== fieldName));
    setFormWarning("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormWarning("");

    const missing: string[] = [];
    if (!username.trim()) missing.push("username");
    if (!email.trim()) missing.push("email");
    if (!password.trim()) missing.push("password");
    if (!passwordMatch.trim()) missing.push("passwordMatch");

    setEmptyFields(missing);

    if (missing.length > 0) {
      setFormWarning("Preencha todos os campos!");
      return;
    }

    if (password.length < 8) {
      setFormWarning("Uma senha deve ter no mínimo 8 caracteres");
      setPasswordFeedback("Uma senha deve ter no mínimo 8 caracteres");
      return;
    }

    if (password !== passwordMatch) {
      setPasswordFeedback("Senhas diferentes!");
      setFormWarning("As senhas não coincidem!");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await authClient.signUp.email({
      name: username.trim(),
      email: email.trim(),
      password,
    });

    if (error) {
      setFormWarning(error.message || "Não foi possível criar a conta.");
      return;
    }

    await authClient.getSession();
    window.location.assign("/dashboard");
    } catch {
      setFormWarning("Erro ao criar conta. Tente novamente.");
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
        <p className="subtitle">Crie sua conta e comece a aventura</p>

        <div className="form">
          <form id="regForm" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="username">Usuário</label>
              <input
                id="username"
                type="text"
                placeholder="Escolha um nome de usuário"
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  clearFieldError("username");
                }}
                className={emptyFields.includes("username") ? "fieldIsEmpty" : undefined}
              />
            </div>

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
                  clearFieldError("email");
                }}
                className={emptyFields.includes("email") ? "fieldIsEmpty" : undefined}
              />
            </div>

            <div className="field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                placeholder="Crie uma senha"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  const nextVal = e.target.value;
                  setPassword(nextVal);
                  clearFieldError("password");
                  validatePasswordFields(nextVal, passwordMatch);
                }}
                className={emptyFields.includes("password") ? "fieldIsEmpty" : undefined}
              />
            </div>

            <div className="field">
              <label htmlFor="passwordMatch">Confirmar senha</label>
              <input
                id="passwordMatch"
                type="password"
                placeholder="Repita a senha"
                autoComplete="new-password"
                value={passwordMatch}
                onChange={(e) => {
                  const nextVal = e.target.value;
                  setPasswordMatch(nextVal);
                  clearFieldError("passwordMatch");
                  validatePasswordFields(password, nextVal);
                }}
                className={
                  emptyFields.includes("passwordMatch") ? "fieldIsEmpty" : undefined
                }
              />
              <p
                className="match-label"
                id="passwordConfirmLabel"
                style={{ color: passwordFeedback ? "#e53935" : undefined }}
              >
                {passwordFeedback}
              </p>
            </div>

            <p
              className="match-label"
              id="emptyInputsWarning"
              style={{ color: formWarning ? "#e53935" : undefined }}
            >
              {formWarning}
            </p>

            <button
              className="btn-entrar"
              id="regButton"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </button>
          </form>
        </div>

        <p className="register-text">Já tem uma conta?</p>
        <Link href="/login" className="register-link">
          Entrar
        </Link>
      </main>

      <button className="help-btn" type="button" aria-label="Ajuda">
        ?
      </button>
    </div>
  );
}