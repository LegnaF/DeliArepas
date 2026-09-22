"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import "./admin.css";

interface Estadisticas {
  usuarios: number;
  productos: number;
  pedidos: number;
  ventas: number;
}

function Icono({ tipo }: { tipo: string }) {
  if (tipo === "usuarios") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20c.5-4 2.4-6 5.5-6s5 2 5.5 6" />
        <path d="M16 5.5a3 3 0 0 1 0 5.8" />
        <path d="M17 14c2.2.5 3.4 2.3 3.7 5" />
      </svg>
    );
  }

  if (tipo === "productos") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="M4.5 7.8 12 12l7.5-4.2" />
        <path d="M12 12v9" />
      </svg>
    );
  }

  if (tipo === "pedidos") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v14H4z" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </svg>
    );
  }

  if (tipo === "facturas") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 3h12v18l-2.5-1.7L13 21l-2.5-1.7L8 21l-2-1.7V3Z" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </svg>
    );
  }

  if (tipo === "ventas") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 4-4 3 2 5-6" />
      </svg>
    );
  }

  return null;
}

export default function AdminDashboardPage() {
  const [nombreUsuario, setNombreUsuario] = useState("Administrador");
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);

  const [stats, setStats] = useState<Estadisticas>({
    usuarios: 0,
    productos: 0,
    pedidos: 0,
    ventas: 0,
  });

  useEffect(() => {
    const raw =
      localStorage.getItem("user") ||
      localStorage.getItem("usuario");

    if (raw) {
      try {
        const parsed = JSON.parse(raw);

        setNombreUsuario(
          parsed?.nombre ||
            parsed?.email ||
            parsed?.usuario?.nombre ||
            "Administrador"
        );
      } catch {
        setNombreUsuario("Administrador");
      }
    }

    const tema = localStorage.getItem("admin-theme");

    if (tema === "dark") {
      setTemaOscuro(true);
    }

    cargarEstadisticas();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "admin-theme",
      temaOscuro ? "dark" : "light"
    );
  }, [temaOscuro]);

  async function cargarEstadisticas() {
    try {
      // Endpoint actualizado a la carpeta /api/stats
      const response = await fetch("/api/stats", {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setStats({
        usuarios: Number(data.usuarios) || 0,
        productos: Number(data.productos) || 0,
        pedidos: Number(data.pedidos) || 0,
        ventas: Number(data.ventas) || 0,
      });
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setCargando(false);
    }
  }

  async function actualizarPanel() {
    setActualizando(true);

    try {
      await cargarEstadisticas();
    } finally {
      setTimeout(() => {
        setActualizando(false);
      }, 500);
    }
  }

  function cerrarSesion() {
    localStorage.removeItem("user");
    localStorage.removeItem("usuario");

    sessionStorage.clear();

    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    window.location.href = "/login";
  }

  function volverArriba() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const dinero = (valor: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(valor);

  return (
    <div
      className={`admin-layout ${
        temaOscuro ? "theme-dark" : "theme-light"
      }`}
    >
      <Navbar />

      <div className="admin-shell">
        <main className="admin-main">
          {/* HEADER */}
          <header className="admin-top-header">
            <div className="admin-heading">
              <div className="admin-eyebrow-wrap">
                <span className="admin-eyebrow">
                  PANEL ADMINISTRATIVO
                </span>
                <span className="eyebrow-line" />
              </div>

              <h1>
                Panel de Control
                <span className="title-dot">.</span>
              </h1>

              <p>
                Supervisa la operación de{" "}
                <strong>Deli Arepas JD</strong> desde un solo lugar.
              </p>
            </div>

            <div className="admin-header-right">
              {/* ACTUALIZAR */}
              <button
                type="button"
                className="refresh-button"
                onClick={actualizarPanel}
                disabled={actualizando}
              >
                <span
                  className={
                    actualizando
                      ? "refresh-icon spinning"
                      : "refresh-icon"
                  }
                >
                  ↻
                </span>

                <span>
                  {actualizando ? "Actualizando..." : "Actualizar"}
                </span>
              </button>

              {/* TEMA */}
              <button
                type="button"
                className="theme-toggle"
                onClick={() => setTemaOscuro((valor) => !valor)}
              >
                <span className="theme-toggle-circle">
                  {temaOscuro ? "☀" : "☾"}
                </span>

                <span>
                  {temaOscuro ? "Modo día" : "Modo noche"}
                </span>
              </button>

              {/* PERFIL */}
              <div className="admin-user-area">
                <button
                  type="button"
                  className={`admin-user ${
                    perfilAbierto ? "user-open" : ""
                  }`}
                  onClick={() => setPerfilAbierto((valor) => !valor)}
                  aria-expanded={perfilAbierto}
                >
                  <div className="admin-user-avatar">
                    {nombreUsuario.charAt(0).toUpperCase()}
                  </div>

                  <div className="admin-user-data">
                    <span>Administrador</span>
                    <strong>{nombreUsuario}</strong>
                  </div>

                  <span className="user-chevron">⌄</span>
                </button>

                {perfilAbierto && (
                  <div className="admin-profile-menu">
                    <div className="profile-menu-top">
                      <div className="profile-menu-avatar">
                        {nombreUsuario.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <strong>{nombreUsuario}</strong>
                        <span>Administrador</span>
                      </div>
                    </div>

                    <div className="profile-divider" />

                    <button
                      type="button"
                      className="profile-logout"
                      onClick={cerrarSesion}
                    >
                      <span>↪</span>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* ESTADÍSTICAS */}
          <section className="admin-stat-section">
            <div className="admin-section-title">
              <div>
                <span>RESUMEN GENERAL</span>
                <h2>Vista general</h2>
              </div>

              <div className="system-status">
                <i />
                Sistema activo
              </div>
            </div>

            <div className="admin-stat-grid">
              {/* USUARIOS */}
              <article className="admin-stat">
                <div className="stat-glow" />

                <div className="stat-top-row">
                  <div className="stat-icon">
                    <Icono tipo="usuarios" />
                  </div>
                  <span className="stat-mini-label">CUENTAS</span>
                </div>

                <div className="stat-copy">
                  <span>Usuarios registrados</span>
                  <strong>
                    {cargando
                      ? "..."
                      : stats.usuarios.toLocaleString("es-CO")}
                  </strong>
                  <small>Cuentas del sistema</small>
                </div>

                <div className="stat-arrow">↗</div>
              </article>

              {/* PRODUCTOS */}
              <article className="admin-stat">
                <div className="stat-glow orange-glow" />

                <div className="stat-top-row">
                  <div className="stat-icon orange">
                    <Icono tipo="productos" />
                  </div>
                  <span className="stat-mini-label">CATÁLOGO</span>
                </div>

                <div className="stat-copy">
                  <span>Productos activos</span>
                  <strong>
                    {cargando
                      ? "..."
                      : stats.productos.toLocaleString("es-CO")}
                  </strong>
                  <small>Catálogo disponible</small>
                </div>

                <div className="stat-arrow">↗</div>
              </article>

              {/* PEDIDOS */}
              <article className="admin-stat">
                <div className="stat-glow gold-glow" />

                <div className="stat-top-row">
                  <div className="stat-icon gold">
                    <Icono tipo="pedidos" />
                  </div>
                  <span className="stat-mini-label">OPERACIÓN</span>
                </div>

                <div className="stat-copy">
                  <span>Pedidos registrados</span>
                  <strong>
                    {cargando
                      ? "..."
                      : stats.pedidos.toLocaleString("es-CO")}
                  </strong>
                  <small>Operaciones realizadas</small>
                </div>

                <div className="stat-arrow">↗</div>
              </article>

              {/* VENTAS */}
              <article className="admin-stat">
                <div className="stat-glow green-glow" />

                <div className="stat-top-row">
                  <div className="stat-icon green">
                    <Icono tipo="ventas" />
                  </div>
                  <span className="stat-mini-label">INGRESOS</span>
                </div>

                <div className="stat-copy">
                  <span>Ventas acumuladas</span>
                  <strong>
                    {cargando ? "..." : dinero(stats.ventas)}
                  </strong>
                  <small>Ingresos no cancelados</small>
                </div>

                <div className="stat-arrow">↗</div>
              </article>
            </div>
          </section>

          {/* MÓDULOS */}
          <section className="admin-modules">
            <div className="admin-section-title">
              <div>
                <span>ADMINISTRACIÓN</span>
                <h2>Módulos principales</h2>
              </div>
              <span className="module-count">04 módulos</span>
            </div>

            <div className="admin-module-grid">
              {/* PRODUCTOS */}
              <Link href="/productos" className="admin-module-card">
                <div className="module-shine" />
                <div className="module-line" />

                <div className="module-top">
                  <div className="module-icon">
                    <Icono tipo="productos" />
                  </div>
                  <span className="module-number">01</span>
                </div>

                <span className="module-category">CATÁLOGO</span>
                <h3>Gestión de productos</h3>
                <p>
                  Crea, modifica, activa, desactiva y elimina productos del catálogo.
                </p>

                <div className="module-action">
                  <span>Administrar módulo</span>
                  <b>→</b>
                </div>
              </Link>

              {/* USUARIOS */}
              <Link href="/usuarios" className="admin-module-card">
                <div className="module-shine" />
                <div className="module-line" />

                <div className="module-top">
                  <div className="module-icon">
                    <Icono tipo="usuarios" />
                  </div>
                  <span className="module-number">02</span>
                </div>

                <span className="module-category">ACCESOS</span>
                <h3>Usuarios y roles</h3>
                <p>Controla las cuentas, roles y permisos del sistema.</p>

                <div className="module-action">
                  <span>Administrar módulo</span>
                  <b>→</b>
                </div>
              </Link>

              {/* PEDIDOS */}
              <Link href="/gestion" className="admin-module-card">
                <div className="module-shine" />
                <div className="module-line" />

                <div className="module-top">
                  <div className="module-icon">
                    <Icono tipo="pedidos" />
                  </div>
                  <span className="module-number">03</span>
                </div>

                <span className="module-category">OPERACIÓN</span>
                <h3>Gestión de pedidos</h3>
                <p>Consulta pedidos y controla sus diferentes estados.</p>

                <div className="module-action">
                  <span>Administrar módulo</span>
                  <b>→</b>
                </div>
              </Link>

              {/* FACTURACIÓN */}
              <Link href="/facturacion" className="admin-module-card">
                <div className="module-shine" />
                <div className="module-line" />

                <div className="module-top">
                  <div className="module-icon">
                    <Icono tipo="facturas" />
                  </div>
                  <span className="module-number">04</span>
                </div>

                <span className="module-category">FINANZAS</span>
                <h3>Facturación</h3>
                <p>Consulta comprobantes y movimientos de venta.</p>

                <div className="module-action">
                  <span>Administrar módulo</span>
                  <b>→</b>
                </div>
              </Link>
            </div>
          </section>

          {/* PANEL INFORMATIVO */}
          <section className="admin-info-panel" id="inventario">
            <div className="info-decoration" />

            <div className="info-content">
              <span>CONTROL OPERATIVO</span>
              <h2>Deli Arepas JD</h2>
              <p>
                El panel está conectado a MySQL mediante Prisma ORM. Los indicadores superiores se obtienen directamente de la base de datos.
              </p>

              <div className="info-status">
                <i />
                Base de datos conectada
              </div>
            </div>

            <div className="admin-info-mark">DA</div>
          </section>

          {/* VOLVER ARRIBA */}
          <button
            type="button"
            className="back-top"
            onClick={volverArriba}
          >
            <span>↑</span>
            <small>Volver arriba</small>
          </button>
        </main>
      </div>

      <Footer />
    </div>
  );
}