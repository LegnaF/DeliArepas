"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/auth.module.css";

interface LoginFormProps {
  onSwitchVista: (
    vista: "login" | "forgot" | "reset" | "register"
  ) => void;
}

export default function LoginForm({ onSwitchVista }: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          recordarme,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Ocurrió un error al iniciar sesión"
        );
      }

      // GUARDAR EN LOCALSTORAGE Y CREAR COOKIE DE SESIÓN
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("usuario", JSON.stringify(data.user));
        window.dispatchEvent(new Event("storage"));
      }

      const token = data.token || "token_sesion_activa";
      const maxAge = recordarme ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;
      document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;

      const rol = data.user?.rol;

      if (rol === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (rol === "EMPLEADO") {
        router.push("/empleado/pedidos");
      } else {
        router.push("/cliente");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error inesperado al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
      autoComplete="off"
    >
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {/* CORREO ELECTRÓNICO */}
      <div className={styles.field}>
        <label className={styles.label}>
          Correo Electrónico *
        </label>
        <div className={styles.inputWrapper}>
          <input
            type="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="juan@deliarepas.com"
            className={styles.input}
            required
          />
        </div>
      </div>

      {/* CONTRASEÑA */}
      <div className={styles.field}>
        <label className={styles.label}>
          Contraseña *
        </label>
        <div className={styles.inputWrapper}>
          <input
            type={mostrarPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            className={`${styles.input} ${styles.passwordInput}`}
            required
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setMostrarPassword(!mostrarPassword)}
            aria-label={
              mostrarPassword
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
          >
            {mostrarPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
      </div>

      {/* RECORDARME Y OLVIDASTE CONTRASEÑA */}
      <div className={styles.rememberForgotRow}>
        <label className={styles.rememberLabel}>
          <input
            type="checkbox"
            checked={recordarme}
            onChange={(e) => setRecordarme(e.target.checked)}
            className={styles.rememberCheckbox}
          />
          <span>Recordarme en este dispositivo</span>
        </label>

        <button
          type="button"
          className={styles.linkBtn}
          onClick={() => onSwitchVista("forgot")}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {/* BOTÓN SUBMIT */}
      <button
        type="submit"
        className={styles.submitBtn}
        disabled={loading}
      >
        {loading ? "Iniciando..." : "Iniciar Sesión"}
      </button>

      {/* PROMPT DE REGISTRO */}
      <div className={styles.registerPrompt}>
        <span>¿No tienes una cuenta?</span>
        <button
          type="button"
          className={styles.registerLink}
          onClick={() => onSwitchVista("register")}
        >
          Crear Cuenta
        </button>
      </div>
    </form>
  );
}