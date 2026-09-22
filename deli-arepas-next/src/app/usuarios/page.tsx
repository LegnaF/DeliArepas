"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import "./usuarios.css";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: "ADMIN" | "EMPLEADO" | "CLIENTE";
  createdAt?: string;
}

type FiltroRol = "TODOS" | "ADMIN" | "EMPLEADO" | "CLIENTE";

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle
        cx="9"
        cy="7"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconAdmin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3l7 3v5c0 4.55-2.93 8.58-7 10-4.07-1.42-7-5.45-7-10V6l7-3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconEmployee() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="8"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4 21a8 8 0 0 1 16 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconClient() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20 21a8 8 0 0 0-16 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="7"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="11"
        cy="11"
        r="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M20 20l-4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20h9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSun() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21 15.5A9 9 0 0 1 8.5 3a9 9 0 1 0 12.5 12.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function GestionUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editUser, setEditUser] = useState<Usuario | null>(null);

  const [temaOscuro, setTemaOscuro] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState<FiltroRol>("TODOS");

  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/usuarios", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al obtener usuarios");
      }

      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al cargar los usuarios");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();

    const temaGuardado = localStorage.getItem("admin-theme");

    if (temaGuardado === "dark") {
      setTemaOscuro(true);
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle("usuarios-dark-body", temaOscuro);

    localStorage.setItem("admin-theme", temaOscuro ? "dark" : "light");

    return () => {
      document.body.classList.remove("usuarios-dark-body");
    };
  }, [temaOscuro]);

  useEffect(() => {
    if (!editUser) return;

    const manejarEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !guardando) {
        setEditUser(null);
      }
    };

    document.addEventListener("keydown", manejarEscape);

    return () => {
      document.removeEventListener("keydown", manejarEscape);
    };
  }, [editUser, guardando]);

  const usuariosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return usuarios.filter((usuario) => {
      const coincideBusqueda =
        !termino ||
        usuario.nombre.toLowerCase().includes(termino) ||
        usuario.email.toLowerCase().includes(termino);

      const coincideRol =
        filtroRol === "TODOS" || usuario.rol === filtroRol;

      return coincideBusqueda && coincideRol;
    });
  }, [usuarios, busqueda, filtroRol]);

  const estadisticas = useMemo(() => {
    return {
      total: usuarios.length,
      admins: usuarios.filter((u) => u.rol === "ADMIN").length,
      empleados: usuarios.filter((u) => u.rol === "EMPLEADO").length,
      clientes: usuarios.filter((u) => u.rol === "CLIENTE").length,
    };
  }, [usuarios]);

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      return;
    }

    try {
      setEliminandoId(id);

      const res = await fetch(`/api/usuarios?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || "No se pudo eliminar el usuario"
        );
      }

      setUsuarios((prev) => prev.filter((usr) => usr.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setEliminandoId(null);
    }
  };

  const handleGuardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editUser) return;

    try {
      setGuardando(true);

      const res = await fetch("/api/usuarios", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editUser),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || "Error al actualizar la información"
        );
      }

      setUsuarios((prev) =>
        prev.map((usr) =>
          usr.id === editUser.id ? editUser : usr
        )
      );

      setEditUser(null);
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? err.message
          : "Error al guardar los cambios"
      );
    } finally {
      setGuardando(false);
    }
  };

  const obtenerIniciales = (nombre: string) => {
    const partes = nombre
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (partes.length === 0) return "U";

    if (partes.length === 1) {
      return partes[0].slice(0, 2).toUpperCase();
    }

    return (
      partes[0][0] + partes[partes.length - 1][0]
    ).toUpperCase();
  };

  return (
    <div className={`usuarios-page ${temaOscuro ? "tema-oscuro" : ""}`}>
      <Navbar />

      <main className="usuarios-container">
        <section className="usuarios-hero">
          <div className="hero-decoration hero-decoration-one" />
          <div className="hero-decoration hero-decoration-two" />

          <div className="usuarios-hero-content">
            <div className="usuarios-kicker">
              <span className="kicker-line" />
              <span>ADMINISTRACIÓN · DELI AREPAS JD</span>
            </div>

            <h1>
              Gestión de
              <span> Usuarios</span>
            </h1>

            <p>
              Administra las cuentas del sistema, controla los roles
              y mantén organizada la comunidad de Deli Arepas.
            </p>
          </div>

          <div className="hero-theme-area">
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setTemaOscuro((prev) => !prev)}
              aria-label={
                temaOscuro
                  ? "Activar modo día"
                  : "Activar modo noche"
              }
            >
              <span className="theme-toggle-icon">
                {temaOscuro ? <IconSun /> : <IconMoon />}
              </span>

              <span>
                {temaOscuro ? "Modo día" : "Modo noche"}
              </span>

              <span className="theme-switch">
                <span
                  className={`theme-switch-dot ${
                    temaOscuro ? "active" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </section>

        <section className="usuarios-stats">
          <article className="stat-card stat-total">
            <div className="stat-icon">
              <IconUsers />
            </div>

            <div>
              <span className="stat-label">Usuarios registrados</span>
              <strong>{estadisticas.total}</strong>
              <small>Total del sistema</small>
            </div>
          </article>

          <article className="stat-card stat-admin">
            <div className="stat-icon">
              <IconAdmin />
            </div>

            <div>
              <span className="stat-label">Administradores</span>
              <strong>{estadisticas.admins}</strong>
              <small>Acceso administrativo</small>
            </div>
          </article>

          <article className="stat-card stat-empleado">
            <div className="stat-icon">
              <IconEmployee />
            </div>

            <div>
              <span className="stat-label">Empleados</span>
              <strong>{estadisticas.empleados}</strong>
              <small>Personal operativo</small>
            </div>
          </article>

          <article className="stat-card stat-cliente">
            <div className="stat-icon">
              <IconClient />
            </div>

            <div>
              <span className="stat-label">Clientes</span>
              <strong>{estadisticas.clientes}</strong>
              <small>Usuarios clientes</small>
            </div>
          </article>
        </section>

        <section className="usuarios-panel">
          <div className="panel-heading">
            <div>
              <span className="section-eyebrow">
                CONTROL DE CUENTAS
              </span>

              <h2>Usuarios del sistema</h2>

              <p>
                Consulta, filtra y administra las cuentas registradas.
              </p>
            </div>

            <button
              type="button"
              className="btn-recargar"
              onClick={cargarUsuarios}
              disabled={loading}
            >
              <span className={loading ? "spin" : ""}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M20 11a8 8 0 0 0-14.9-4M4 5v4h4M4 13a8 8 0 0 0 14.9 4M20 19v-4h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Actualizar
            </button>
          </div>

          <div className="usuarios-toolbar">
            <div className="search-box">
              <span>
                <IconSearch />
              </span>

              <input
                type="search"
                placeholder="Buscar por nombre o correo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="filtro-rol">Filtrar por rol</label>

              <select
                id="filtro-rol"
                value={filtroRol}
                onChange={(e) =>
                  setFiltroRol(e.target.value as FiltroRol)
                }
              >
                <option value="TODOS">Todos los roles</option>
                <option value="ADMIN">Administradores</option>
                <option value="EMPLEADO">Empleados</option>
                <option value="CLIENTE">Clientes</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="usuarios-error">
              <strong>Se produjo un problema</strong>
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="usuarios-loading-box">
              <div className="loading-spinner" />
              <strong>Cargando usuarios</strong>
              <span>Estamos preparando la información...</span>
            </div>
          ) : (
            <>
              <div className="table-info">
                <span>
                  Mostrando{" "}
                  <strong>{usuariosFiltrados.length}</strong>{" "}
                  de <strong>{usuarios.length}</strong> usuarios
                </span>

                {(busqueda || filtroRol !== "TODOS") && (
                  <button
                    type="button"
                    onClick={() => {
                      setBusqueda("");
                      setFiltroRol("TODOS");
                    }}
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>

              <div className="usuarios-table-wrapper">
                <table className="usuarios-table">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Correo electrónico</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {usuariosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={4}>
                          <div className="empty-state">
                            <div className="empty-icon">
                              <IconUsers />
                            </div>

                            <h3>
                              {usuarios.length === 0
                                ? "No hay usuarios registrados"
                                : "No encontramos resultados"}
                            </h3>

                            <p>
                              {usuarios.length === 0
                                ? "Cuando existan cuentas registradas aparecerán aquí."
                                : "Prueba con otro nombre, correo o filtro de rol."}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      usuariosFiltrados.map((usr, index) => (
                        <tr
                          key={usr.id}
                          className="usuario-row"
                          style={
                            {
                              "--row-delay": `${index * 60}ms`,
                            } as React.CSSProperties
                          }
                        >
                          <td>
                            <div className="usuario-info">
                              <div className="usuario-avatar">
                                {obtenerIniciales(usr.nombre)}
                              </div>

                              <div className="usuario-name">
                                <strong>{usr.nombre}</strong>
                                <span>ID #{usr.id}</span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="usuario-email">
                              {usr.email}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`badge-rol badge-${usr.rol.toLowerCase()}`}
                            >
                              <span className="badge-dot" />
                              {usr.rol}
                            </span>
                          </td>

                          <td>
                            <div className="acciones-td">
                              <button
                                type="button"
                                className="btn-accion btn-editar"
                                onClick={() =>
                                  setEditUser({ ...usr })
                                }
                              >
                                <IconEdit />
                                <span>Editar</span>
                              </button>

                              <button
                                type="button"
                                className="btn-accion btn-eliminar"
                                onClick={() =>
                                  handleEliminar(usr.id)
                                }
                                disabled={eliminandoId === usr.id}
                              >
                                <IconTrash />
                                <span>
                                  {eliminandoId === usr.id
                                    ? "Eliminando..."
                                    : "Eliminar"}
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>

      {editUser && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !guardando
            ) {
              setEditUser(null);
            }
          }}
        >
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="editar-usuario-title"
          >
            <div className="modal-top">
              <div className="modal-heading">
                <div className="modal-icon">
                  <IconEdit />
                </div>

                <div>
                  <span>GESTIÓN DE CUENTA</span>
                  <h2 id="editar-usuario-title">
                    Editar usuario
                  </h2>
                </div>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => setEditUser(null)}
                disabled={guardando}
                aria-label="Cerrar"
              >
                <IconClose />
              </button>
            </div>

            <div className="modal-user-preview">
              <div className="modal-avatar">
                {obtenerIniciales(editUser.nombre)}
              </div>

              <div>
                <strong>{editUser.nombre}</strong>
                <span>{editUser.email}</span>
              </div>
            </div>

            <form onSubmit={handleGuardarEdicion}>
              <div className="form-field">
                <label htmlFor="nombre-usuario">
                  Nombre completo
                </label>

                <input
                  id="nombre-usuario"
                  type="text"
                  value={editUser.nombre}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      nombre: e.target.value,
                    })
                  }
                  required
                  autoComplete="name"
                />
              </div>

              <div className="form-field">
                <label htmlFor="email-usuario">
                  Correo electrónico
                </label>

                <input
                  id="email-usuario"
                  type="email"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      email: e.target.value,
                    })
                  }
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-field">
                <label htmlFor="rol-usuario">
                  Rol de usuario
                </label>

                <select
                  id="rol-usuario"
                  value={editUser.rol}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      rol: e.target.value as Usuario["rol"],
                    })
                  }
                >
                  <option value="CLIENTE">CLIENTE</option>
                  <option value="EMPLEADO">EMPLEADO</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setEditUser(null)}
                  disabled={guardando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-guardar"
                  disabled={guardando}
                >
                  {guardando ? (
                    <>
                      <span className="button-spinner" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar cambios"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}