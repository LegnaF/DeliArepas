"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<{
    nombre?: string;
    rol?: string;
  } | null>(null);

  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    function obtenerSesion() {
      const rawData =
        localStorage.getItem("user") ||
        localStorage.getItem("usuario");

      if (rawData) {
        try {
          const parsed = JSON.parse(rawData);
          const usuarioObjeto = parsed.usuario || parsed;

          const rolDetectado = usuarioObjeto.rol
            ? String(usuarioObjeto.rol).toUpperCase()
            : "CLIENTE";

          setUser({
            nombre:
              usuarioObjeto.nombre ||
              usuarioObjeto.name ||
              usuarioObjeto.email ||
              "Cliente",
            rol: rolDetectado,
          });
        } catch {
          setUser({
            nombre: "Cliente",
            rol: "CLIENTE",
          });
        }
      } else {
        setUser(null);
      }

      setCargado(true);
    }

    obtenerSesion();

    window.addEventListener("storage", obtenerSesion);

    return () => {
      window.removeEventListener("storage", obtenerSesion);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("user");

    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    document.cookie =
      "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    setUser(null);

    router.push("/login");
  };

  const handlePqrClick = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();

    if (pathname === "/") {
      const elemento = document.getElementById("pqr");

      if (elemento) {
        elemento.scrollIntoView({
          behavior: "smooth",
        });
      }
    } else {
      router.push("/#pqr");
    }
  };

  const rol = user?.rol;

  const esActivo = (ruta: string) => {
    if (ruta === "/") {
      return pathname === "/";
    }

    return (
      pathname === ruta ||
      pathname.startsWith(`${ruta}/`)
    );
  };

  const navLink = (
    ruta: string,
    texto: string
  ) => {
    const activo = esActivo(ruta);

    return (
      <Link
        href={ruta}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: "42px",
          padding: "0 13px",
          borderRadius: "10px",
          color: activo ? "#f6a15a" : "#ffffff",
          background: activo
            ? "rgba(230, 126, 34, 0.12)"
            : "transparent",
          textDecoration: "none",
          fontSize: "0.9rem",
          fontWeight: 650,
          whiteSpace: "nowrap",
          transition: "all 0.28s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#f6a15a";
          e.currentTarget.style.background =
            "rgba(255,255,255,0.08)";
          e.currentTarget.style.transform =
            "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 6px 18px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = activo
            ? "#f6a15a"
            : "#ffffff";

          e.currentTarget.style.background =
            activo
              ? "rgba(230,126,34,0.12)"
              : "transparent";

          e.currentTarget.style.transform =
            "translateY(0)";

          e.currentTarget.style.boxShadow =
            "none";
        }}
      >
        {texto}

        <span
          style={{
            position: "absolute",
            left: "50%",
            bottom: "5px",
            width: activo ? "45%" : "0%",
            height: "2px",
            borderRadius: "20px",
            background:
              "linear-gradient(90deg,#e67e22,#f6a15a)",
            transform: "translateX(-50%)",
            transition: "width 0.3s ease",
          }}
        />
      </Link>
    );
  };

  return (
    <nav
      className="navbar"
      style={{
        position: "relative",
        zIndex: 1000,
        width: "100%",
        minHeight: "76px",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        boxSizing: "border-box",
        color: "#ffffff",
      }}
    >
      {/* =====================================================
          MARCA
         ===================================================== */}

      <div
        className="navbar-brand"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexShrink: 0,
          minWidth: "190px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            padding: "3px",
            flexShrink: 0,
            borderRadius: "14px",
            background:
              "linear-gradient(145deg,#ffffff,#f2e5d9)",
            boxShadow:
              "0 5px 18px rgba(0,0,0,0.2)",
            transition:
              "transform 0.35s ease, box-shadow 0.35s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-3px) rotate(-2deg) scale(1.04)";

            e.currentTarget.style.boxShadow =
              "0 10px 26px rgba(230,126,34,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0) rotate(0) scale(1)";

            e.currentTarget.style.boxShadow =
              "0 5px 18px rgba(0,0,0,0.2)";
          }}
        >
          <img
            src="/logo.jpg"
            alt="Deli Arepas JD"
            className="navbar-logo-img"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "11px",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            lineHeight: "1",
          }}
        >
          <span
            className="navbar-titulo"
            style={{
              color: "#ffffff",
              fontSize: "1.08rem",
              fontWeight: 850,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            Deli Arepas
          </span>

          <span
            style={{
              marginTop: "6px",
              color: "#f6a15a",
              fontSize: "0.58rem",
              fontWeight: 750,
              letterSpacing: "0.14em",
              whiteSpace: "nowrap",
              textTransform: "uppercase",
            }}
          >
            JD · Sabor tradicional
          </span>
        </div>
      </div>

      {/* =====================================================
          NAVEGACIÓN
         ===================================================== */}

      <div
        className="navbar-links"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "3px",
          flex: "1 1 auto",
          minWidth: 0,
        }}
      >
        {navLink("/", "Inicio")}

        {/* PQR */}
        <a
          href="/#pqr"
          onClick={handlePqrClick}
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: "42px",
            padding: "0 13px",
            borderRadius: "10px",
            color: "#ffffff",
            background: "transparent",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 650,
            whiteSpace: "nowrap",
            transition: "all 0.28s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#f6a15a";
            e.currentTarget.style.background =
              "rgba(255,255,255,0.08)";
            e.currentTarget.style.transform =
              "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 6px 18px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.background =
              "transparent";
            e.currentTarget.style.transform =
              "translateY(0)";
            e.currentTarget.style.boxShadow =
              "none";
          }}
        >
          PQR
          <span
            style={{
              position: "absolute",
              left: "50%",
              bottom: "5px",
              width: "0%",
              height: "2px",
              borderRadius: "20px",
              background:
                "linear-gradient(90deg,#e67e22,#f6a15a)",
              transform: "translateX(-50%)",
              transition: "width 0.3s ease",
            }}
          />
        </a>

        {/* PRODUCTOS */}
        {navLink("/menu", "Productos")}

        {/* ADMIN */}
        {cargado && user && rol === "ADMIN" && (
          <>
            {navLink(
              "/admin/dashboard",
              "Panel Admin"
            )}

            {navLink(
              "/empleado/pedidos",
              "Empleados"
            )}

            {navLink(
              "/gestion",
              "Gestión Pedidos"
            )}

            {navLink(
              "/facturacion",
              "Facturas"
            )}

            {navLink(
              "/usuarios",
              "Usuarios"
            )}
          </>
        )}

        {/* EMPLEADO */}
        {cargado &&
          user &&
          rol === "EMPLEADO" && (
            <>
              {navLink(
                "/empleado/pedidos",
                "Empleados"
              )}

              {navLink(
                "/gestion",
                "Gestión Pedidos"
              )}

              {navLink(
                "/facturas",
                "Facturas"
              )}
            </>
          )}

        {/* CLIENTE */}
        {cargado &&
          user &&
          (rol === "CLIENTE" ||
            rol === "USUARIO") &&
          navLink("/cliente", "Mis Pedidos")}
      </div>

      {/* =====================================================
          USUARIO
         ===================================================== */}

      <div
        className="navbar-login"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flexShrink: 0,
          minWidth: "205px",
        }}
      >
        {cargado && user ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "9px",
              width: "100%",
            }}
          >
            {/* PERFIL */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                minWidth: 0,
                padding: "6px 9px",
                borderRadius: "11px",
                background:
                  "rgba(255,255,255,0.07)",
                border:
                  "1px solid rgba(255,255,255,0.1)",
                transition:
                  "all 0.28s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.12)";
                e.currentTarget.style.transform =
                  "translateY(-2px)";
                e.currentTarget.style.borderColor =
                  "rgba(246,161,90,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.07)";
                e.currentTarget.style.transform =
                  "translateY(0)";
                e.currentTarget.style.borderColor =
                  "rgba(255,255,255,0.1)";
              }}
            >
              <div
                style={{
                  width: "31px",
                  height: "31px",
                  flexShrink: 0,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg,#e67e22,#f6a15a)",
                  color: "#ffffff",
                  fontSize: "0.78rem",
                  fontWeight: 850,
                  boxShadow:
                    "0 4px 12px rgba(230,126,34,0.25)",
                }}
              >
                {(user.nombre || "C")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "3px",
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    color: "#bdbdbd",
                    fontSize: "0.57rem",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  Sesión activa
                </span>

                <span
                  style={{
                    color: "#ffffff",
                    fontSize: "0.76rem",
                    fontWeight: 750,
                    maxWidth: "100px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.nombre}
                </span>
              </div>
            </div>

            {/* CERRAR SESIÓN */}
            <button
              type="button"
              onClick={handleLogout}
              className="btn-login"
              style={{
                flexShrink: 0,
                minWidth: "112px",
                height: "40px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 14px",
                boxSizing: "border-box",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                background:
                  "linear-gradient(135deg,#dc2626,#b91c1c)",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "0.76rem",
                fontWeight: 750,
                whiteSpace: "nowrap",
                transition:
                  "transform 0.28s ease, box-shadow 0.28s ease, filter 0.28s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 9px 22px rgba(220,38,38,0.3)";
                e.currentTarget.style.filter =
                  "brightness(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow =
                  "none";
                e.currentTarget.style.filter =
                  "brightness(1)";
              }}
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="btn-login"
            style={{
              minWidth: "125px",
              height: "42px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              padding: "0 17px",
              borderRadius: "11px",
              background:
                "linear-gradient(135deg,#e67e22,#d96f17)",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "0.82rem",
              fontWeight: 800,
              whiteSpace: "nowrap",
              boxShadow:
                "0 7px 20px rgba(230,126,34,0.22)",
              transition:
                "transform 0.28s ease, box-shadow 0.28s ease, filter 0.28s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-2px) scale(1.03)";
              e.currentTarget.style.boxShadow =
                "0 11px 27px rgba(230,126,34,0.34)";
              e.currentTarget.style.filter =
                "brightness(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 7px 20px rgba(230,126,34,0.22)";
              e.currentTarget.style.filter =
                "brightness(1)";
            }}
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  );
}