"use client";

import { useState } from "react";
import styles from "../styles/auth.module.css";

interface Props {
  initialEmail?: string;
  onSwitchVista: (vista: "login") => void;
}

export default function ResetPasswordForm({
  initialEmail = "",
  onSwitchVista,
}: Props) {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setMensaje("");
    setCargando(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error || "No se pudo actualizar la contraseña"
        );
      } else {
        setMensaje("Contraseña actualizada con éxito");

        setTimeout(() => {
          onSwitchVista("login");
        }, 1200);
      }
    } catch {
      setError("Error al actualizar la contraseña.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {error && (
        <div className={styles.alertError}>
          {error}
        </div>
      )}

      {mensaje && (
        <div className={styles.alertSuccess}>
          {mensaje}
        </div>
      )}

      <form onSubmit={handleReset} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>
            Correo Electrónico
          </label>

          <input
            type="email"
            required
            autoComplete="off"
            placeholder="correo@ejemplo.com"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Código de Verificación
          </label>

          <input
            type="text"
            required
            maxLength={6}
            inputMode="numeric"
            placeholder="123456"
            className={styles.input}
            value={code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setCode(value);
            }}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Nueva Contraseña
          </label>

          <div
            style={{
              position: "relative",
              width: "100%",
            }}
          >
            <input
              type={mostrarPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              className={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() =>
                setMostrarPassword(!mostrarPassword)
              }
              aria-label={
                mostrarPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
              title={
                mostrarPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "34px",
                height: "34px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                borderRadius: "8px",
                background: "transparent",
                cursor: "pointer",
                color: "#6b7280",
                padding: 0,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ea580c";
                e.currentTarget.style.background =
                  "rgba(234, 88, 12, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#6b7280";
                e.currentTarget.style.background =
                  "transparent";
              }}
            >
              {mostrarPassword ? (
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 12C3.8 7.8 7.5 5 12 5C16.5 5 20.2 7.8 22 12C20.2 16.2 16.5 19 12 19C7.5 19 3.8 16.2 2 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 3L21 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <path
                    d="M10.6 5.2C11.05 5.07 11.52 5 12 5C16.5 5 20.2 7.8 22 12C21.35 13.5 20.4 14.8 19.2 15.85"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M6.15 6.15C4.35 7.55 2.95 9.55 2 12C3.8 16.2 7.5 19 12 19C13.48 19 14.85 18.65 16.1 18.05"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M9.9 9.9C9.35 10.45 9 11.18 9 12C9 13.66 10.34 15 12 15C12.82 15 13.55 14.65 14.1 14.1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>

          <small
            style={{
              color: "#6b7280",
              fontSize: "0.75rem",
              marginTop: "3px",
            }}
          >
            La contraseña debe tener mínimo 6 caracteres.
          </small>
        </div>

        <button
          type="submit"
          disabled={cargando}
          className={styles.submitBtn}
        >
          {cargando
            ? "Actualizando..."
            : "Guardar Contraseña"}
        </button>
      </form>

      <button
        type="button"
        className={styles.linkBtn}
        onClick={() => onSwitchVista("login")}
      >
        Volver al inicio de sesión
      </button>
    </>
  );
}