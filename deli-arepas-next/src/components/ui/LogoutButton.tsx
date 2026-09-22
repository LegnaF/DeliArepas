"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Error al cerrar sesion:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        width: "100%",
        padding: "12px 16px",
        border: "1px solid rgba(255,255,255,0.35)",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.12)",
        color: "white",
        fontSize: "15px",
        fontWeight: 600,
        cursor: loading ? "wait" : "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "white";
        e.currentTarget.style.color = "#b91c1c";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          "rgba(255,255,255,0.12)";
        e.currentTarget.style.color = "white";
      }}
    >
      {loading ? "Cerrando sesion..." : "Cerrar sesion"}
    </button>
  );
}