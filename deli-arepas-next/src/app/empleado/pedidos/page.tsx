"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import "./empleado.css";

interface ItemPedido {
  nombre: string;
  cantidad: number;
}

interface Pedido {
  id: string;
  cliente: string;
  direccion: string;
  total: number;
  estado: "PENDIENTE" | "PREPARACION" | "COMPLETADO" | "CANCELADO";
  items: ItemPedido[];
  fecha: string;
}

const MODULOS_EMPLEADO = [
  {
    id: "productos",
    titulo: "Productos",
    descripcion:
      "Gestiona el catálogo, actualiza precios, existencias y disponibilidad.",
    ruta: "/productos",
    activo: true,
    tipo: "productos",
  },
  {
    id: "pedidos",
    titulo: "Pedidos",
    descripcion:
      "Consulta, actualiza y realiza seguimiento al estado de los pedidos.",
    ruta: "/gestion",
    activo: true,
    tipo: "pedidos",
  },
  {
    id: "facturacion",
    titulo: "Facturación",
    descripcion:
      "Genera facturas de venta y consulta los comprobantes de pago.",
    ruta: "/facturacion",
    activo: true,
    tipo: "facturacion",
  },
  {
    id: "ventas",
    titulo: "Reporte de Ventas",
    descripcion:
      "Consulta información general e informes relacionados con las ventas.",
    ruta: "/gestion",
    activo: true,
    tipo: "ventas",
  },
  {
    id: "pqrs",
    titulo: "Gestión de PQRS",
    descripcion:
      "Atiende, consulta y realiza seguimiento a peticiones y reclamos.",
    ruta: "/pqr",
    activo: true,
    tipo: "pqrs",
  },
];

function IconoModulo({ tipo }: { tipo: string }) {
  if (tipo === "productos") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 8.5 12 5l7 3.5v8L12 20l-7-3.5z" />
        <path d="M5 8.5 12 12l7-3.5M12 12v8" />
        <path d="M8.5 6.75 15.5 10.25" />
      </svg>
    );
  }

  if (tipo === "pedidos") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 7h12l1 13H5L6 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
        <path d="M9 12h.01M15 12h.01" />
      </svg>
    );
  }

  if (tipo === "facturacion") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8M8 11h8M8 15h3M14 15h2" />
      </svg>
    );
  }

  if (tipo === "stock") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 19V5M4 19h17" />
        <path d="m7 15 4-4 3 2 5-6" />
      </svg>
    );
  }

  if (tipo === "ventas") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 19V5M4 19h17" />
        <path d="M7 15v-3M11 15V8M15 15v-5M19 15v-8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function IconoRefresh() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11a8 8 0 0 0-14.9-4M4 5v5h5" />
      <path d="M4 13a8 8 0 0 0 14.9 4M20 19v-5h-5" />
    </svg>
  );
}

function IconoFlecha() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function IconoUsuario() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5" />
    </svg>
  );
}

function IconoUbicacion() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

function IconoReloj() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function IconoCaja() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5z" />
      <path d="M4 7.5 12 11l8-3.5M12 11v9" />
    </svg>
  );
}

function IconoFlechaArriba() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 14 6-6 6 6" />
      <path d="M12 8v10" />
    </svg>
  );
}

function IconoSol() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
    </svg>
  );
}

function IconoLuna() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z" />
    </svg>
  );
}

export default function EmpleadoPedidosPage() {
  const [nombreEmpleado, setNombreEmpleado] = useState<string>("Empleado");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [mostrarArriba, setMostrarArriba] = useState<boolean>(false);
  const [temaOscuro, setTemaOscuro] = useState<boolean>(false);

  const obtenerPedidos = async () => {
    setCargando(true);

    try {
      const res = await fetch("/api/empleado/pedidos");

      if (res.ok) {
        const data = await res.json();
        setPedidos(data);
      } else {
        setPedidos([]);
      }
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      setPedidos([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const rawData =
      localStorage.getItem("user") ||
      localStorage.getItem("usuario");

    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        setNombreEmpleado(
          parsed.nombre ||
            parsed.name ||
            parsed.email ||
            "Empleado"
        );
      } catch {
        setNombreEmpleado(rawData);
      }
    }

    const temaGuardado =
      localStorage.getItem("admin-theme");

    if (temaGuardado === "dark") {
      setTemaOscuro(true);
    }

    obtenerPedidos();
  }, []);

  useEffect(() => {
    const controlarScroll = () => {
      setMostrarArriba(window.scrollY > 450);
    };

    window.addEventListener("scroll", controlarScroll);

    return () => {
      window.removeEventListener(
        "scroll",
        controlarScroll
      );
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle(
      "empleado-dark-body",
      temaOscuro
    );

    return () => {
      document.body.classList.remove(
        "empleado-dark-body"
      );
    };
  }, [temaOscuro]);

  const cambiarTema = () => {
    const nuevoTema = !temaOscuro;

    setTemaOscuro(nuevoTema);

    localStorage.setItem(
      "admin-theme",
      nuevoTema ? "dark" : "light"
    );
  };

  const cambiarEstado = async (
    id: string,
    nuevoEstado: Pedido["estado"]
  ) => {
    const pedidosAnteriores = pedidos;

    setPedidos((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              estado: nuevoEstado,
            }
          : p
      )
    );

    try {
      const res = await fetch(
        `/api/empleado/pedidos/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado: nuevoEstado,
          }),
        }
      );

      if (!res.ok) {
        setPedidos(pedidosAnteriores);
      }
    } catch (error) {
      console.error(
        "Error al actualizar estado:",
        error
      );

      setPedidos(pedidosAnteriores);
    }
  };

  const estadisticas = useMemo(() => {
    return {
      total: pedidos.length,
      pendientes: pedidos.filter(
        (p) => p.estado === "PENDIENTE"
      ).length,
      preparacion: pedidos.filter(
        (p) => p.estado === "PREPARACION"
      ).length,
      completados: pedidos.filter(
        (p) => p.estado === "COMPLETADO"
      ).length,
    };
  }, [pedidos]);

  const volverArriba = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`empleado-layout ${
        temaOscuro ? "tema-oscuro" : "tema-claro"
      }`}
    >
      <Navbar />

      <main className="empleado-content">
        <section className="empleado-hero">
          <div className="hero-decoration hero-decoration-one" />
          <div className="hero-decoration hero-decoration-two" />
          <div className="hero-decoration hero-decoration-three" />

          <div className="hero-main">
            <span className="empleado-eyebrow">
              <span className="eyebrow-line" />
              GESTIÓN OPERATIVA
            </span>

            <h1 className="empleado-title">
              Panel de
              <span> Empleados</span>
            </h1>

            <p className="empleado-description">
              Administra las operaciones de Deli Arepas JD
              desde un solo lugar. Consulta productos,
              pedidos y las herramientas disponibles para
              tu jornada.
            </p>

            <div className="hero-actions">
              <a
                href="#modulos"
                className="hero-scroll-button"
              >
                Explorar módulos
                <IconoFlecha />
              </a>

              <button
                type="button"
                className="theme-toggle"
                onClick={cambiarTema}
                aria-label={
                  temaOscuro
                    ? "Cambiar a modo día"
                    : "Cambiar a modo noche"
                }
              >
                <span className="theme-toggle-icon">
                  {temaOscuro ? (
                    <IconoSol />
                  ) : (
                    <IconoLuna />
                  )}
                </span>

                <span>
                  {temaOscuro
                    ? "Modo día"
                    : "Modo noche"}
                </span>
              </button>
            </div>
          </div>

          <div className="empleado-profile">
            <div className="profile-glow" />

            <div className="profile-icon">
              <IconoUsuario />
            </div>

            <div className="profile-content">
              <span className="profile-label">
                Sesión activa
              </span>

              <strong>{nombreEmpleado}</strong>

              <span className="profile-role">
                <span className="role-dot" />
                Empleado
              </span>
            </div>
          </div>
        </section>

        <section
          className="estadisticas-grid"
          aria-label="Resumen de pedidos"
        >
          <article className="estadistica-card estadistica-total">
            <div className="estadistica-icon">
              <IconoCaja />
            </div>

            <div className="estadistica-info">
              <span>Total de pedidos</span>
              <strong>{estadisticas.total}</strong>
            </div>

            <div className="estadistica-linea" />
          </article>

          <article className="estadistica-card estadistica-pendiente">
            <div className="estadistica-icon">
              <IconoReloj />
            </div>

            <div className="estadistica-info">
              <span>Pendientes</span>
              <strong>{estadisticas.pendientes}</strong>
            </div>

            <div className="estadistica-linea" />
          </article>

          <article className="estadistica-card estadistica-preparacion">
            <div className="estadistica-icon">
              <IconoRefresh />
            </div>

            <div className="estadistica-info">
              <span>En preparación</span>
              <strong>{estadisticas.preparacion}</strong>
            </div>

            <div className="estadistica-linea" />
          </article>

          <article className="estadistica-card estadistica-completado">
            <div className="estadistica-icon">
              <IconoFlecha />
            </div>

            <div className="estadistica-info">
              <span>Completados</span>
              <strong>{estadisticas.completados}</strong>
            </div>

            <div className="estadistica-linea" />
          </article>
        </section>

        <section
          id="modulos"
          className="modulos-seccion"
        >
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                HERRAMIENTAS
              </span>

              <h2 className="seccion-titulo">
                Módulos del sistema
              </h2>
            </div>

            <p className="section-description">
              Accede rápidamente a las principales
              funciones disponibles para el equipo.
            </p>
          </div>

          <div className="modulos-grid">
            {MODULOS_EMPLEADO.map(
              (modulo, index) => (
                <article
                  key={modulo.id}
                  className={`modulo-card ${
                    !modulo.activo
                      ? "modulo-inactivo"
                      : ""
                  }`}
                  style={
                    {
                      "--animation-delay": `${index * 80}ms`,
                    } as React.CSSProperties
                  }
                >
                  <div className="modulo-top">
                    <div
                      className={`modulo-icono modulo-icono-${modulo.tipo}`}
                    >
                      <IconoModulo
                        tipo={modulo.tipo}
                      />
                    </div>

                    {!modulo.activo && (
                      <span className="proximamente-badge">
                        Próximamente
                      </span>
                    )}
                  </div>

                  <div className="modulo-body">
                    <h3 className="modulo-titulo">
                      {modulo.titulo}
                    </h3>

                    <p className="modulo-descripcion">
                      {modulo.descripcion}
                    </p>
                  </div>

                  {modulo.activo &&
                  modulo.ruta ? (
                    <Link
                      href={modulo.ruta}
                      className="btn-modulo btn-modulo-activo"
                    >
                      <span>
                        Gestionar módulo
                      </span>

                      <IconoFlecha />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="btn-modulo btn-modulo-disabled"
                      disabled
                    >
                      <span>
                        Disponible próximamente
                      </span>
                    </button>
                  )}
                </article>
              )
            )}
          </div>
        </section>

        <section className="pedidos-seccion">
          <div className="pedidos-header">
            <div className="pedidos-heading">
              <span className="section-kicker">
                OPERACIÓN
              </span>

              <div className="pedidos-title-row">
                <h2 className="seccion-titulo">
                  Pedidos en tiempo real
                </h2>

                <span className="live-indicator">
                  <span />
                  ACTIVO
                </span>
              </div>

              <p>
                Consulta y actualiza el estado de los
                pedidos registrados en el sistema.
              </p>
            </div>

            <button
              onClick={obtenerPedidos}
              className={`btn-actualizar ${
                cargando ? "actualizando" : ""
              }`}
              disabled={cargando}
              type="button"
            >
              <IconoRefresh />

              <span>
                {cargando
                  ? "Actualizando..."
                  : "Actualizar lista"}
              </span>
            </button>
          </div>

          {cargando ? (
            <div className="pedidos-loading">
              <div className="loading-card">
                <div className="loading-icon">
                  <IconoRefresh />
                </div>

                <div>
                  <strong>
                    Cargando pedidos
                  </strong>

                  <p>
                    Estamos consultando la
                    información más reciente.
                  </p>
                </div>
              </div>

              <div className="skeleton-grid">
                <div className="skeleton-card" />
                <div className="skeleton-card" />
              </div>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="pedidos-vacio">
              <div className="vacio-icon">
                <IconoCaja />
              </div>

              <h3>
                No hay pedidos registrados
              </h3>

              <p>
                Actualmente no existen pedidos
                disponibles para gestionar en el
                sistema.
              </p>

              <button
                type="button"
                className="btn-vacio"
                onClick={obtenerPedidos}
              >
                <IconoRefresh />
                Actualizar
              </button>
            </div>
          ) : (
            <div className="pedidos-grid">
              {pedidos.map(
                (pedido, index) => (
                  <article
                    key={pedido.id}
                    className="pedido-card"
                    style={
                      {
                        "--animation-delay": `${index * 70}ms`,
                      } as React.CSSProperties
                    }
                  >
                    <div className="pedido-card-top">
                      <div>
                        <span className="pedido-label">
                          PEDIDO
                        </span>

                        <strong className="pedido-id">
                          {pedido.id}
                        </strong>
                      </div>

                      <span
                        className={`badge-estado estado-${pedido.estado.toLowerCase()}`}
                      >
                        <span className="estado-dot" />

                        {pedido.estado ===
                        "PREPARACION"
                          ? "En preparación"
                          : pedido.estado ===
                            "COMPLETADO"
                          ? "Completado"
                          : pedido.estado ===
                            "CANCELADO"
                          ? "Cancelado"
                          : "Pendiente"}
                      </span>
                    </div>

                    <div className="pedido-separador" />

                    <div className="pedido-datos">
                      <div className="dato-pedido">
                        <div className="dato-icon">
                          <IconoUsuario />
                        </div>

                        <div>
                          <span>Cliente</span>
                          <strong>
                            {pedido.cliente}
                          </strong>
                        </div>
                      </div>

                      <div className="dato-pedido">
                        <div className="dato-icon">
                          <IconoUbicacion />
                        </div>

                        <div>
                          <span>Dirección</span>
                          <strong>
                            {pedido.direccion}
                          </strong>
                        </div>
                      </div>

                      <div className="dato-pedido">
                        <div className="dato-icon">
                          <IconoReloj />
                        </div>

                        <div>
                          <span>
                            Hora del pedido
                          </span>

                          <strong>
                            {pedido.fecha}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="items-container">
                      <div className="items-heading">
                        <span>
                          Detalle del pedido
                        </span>

                        <span>
                          {pedido.items
                            ?.length || 0}{" "}
                          {pedido.items
                            ?.length === 1
                            ? "producto"
                            : "productos"}
                        </span>
                      </div>

                      <div className="items-lista">
                        {pedido.items?.map(
                          (item, idx) => (
                            <div
                              key={idx}
                              className="item-row"
                            >
                              <span className="item-cantidad">
                                {item.cantidad}x
                              </span>

                              <span className="item-nombre">
                                {item.nombre}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="pedido-footer">
                      <div className="pedido-total">
                        <span>Total</span>

                        <strong>
                          $
                          {pedido.total
                            ? pedido.total.toLocaleString(
                                "es-CO"
                              )
                            : "0"}
                        </strong>
                      </div>

                      <div className="acciones-pedido">
                        <label
                          htmlFor={`estado-${pedido.id}`}
                        >
                          Actualizar estado
                        </label>

                        <select
                          id={`estado-${pedido.id}`}
                          className="select-estado"
                          value={pedido.estado}
                          onChange={(e) =>
                            cambiarEstado(
                              pedido.id,
                              e.target
                                .value as Pedido["estado"]
                            )
                          }
                        >
                          <option value="PENDIENTE">
                            Pendiente
                          </option>

                          <option value="PREPARACION">
                            En preparación
                          </option>

                          <option value="COMPLETADO">
                            Completado
                          </option>

                          <option value="CANCELADO">
                            Cancelado
                          </option>
                        </select>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </main>

      <button
        type="button"
        className={`volver-arriba ${
          mostrarArriba
            ? "volver-arriba-visible"
            : ""
        }`}
        onClick={volverArriba}
        aria-label="Volver arriba"
      >
        <IconoFlechaArriba />
      </button>

      <Footer />
    </div>
  );
}