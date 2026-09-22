"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import "./pqr.css";

interface PqrItem {
  id: number;
  nombre: string;
  contacto: string;
  mensaje: string;
  createdAt: string;
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11a8.1 8.1 0 0 0-14.9-3.9L3 10" />
      <path d="M3 5v5h5" />
      <path d="M4 13a8.1 8.1 0 0 0 14.9 3.9L21 14" />
      <path d="M21 19v-5h-5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-3.4-.7L4 20l1.7-4.1A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4h12l2 2v14H5Z" />
      <path d="M8 4v6h8V4" />
      <path d="M8 20v-6h8v6" />
    </svg>
  );
}

export default function GestionPqrPage() {
  const [pqrs, setPqrs] = useState<PqrItem[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [actualizando, setActualizando] = useState<boolean>(false);

  const [pqrEditando, setPqrEditando] = useState<PqrItem | null>(null);
  const [guardando, setGuardando] = useState<boolean>(false);

  const cargarPqrs = async () => {
    try {
      setActualizando(true);
      setCargando(true);
      setError("");

      const res = await fetch("/api/pqr");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al obtener la lista de PQRs");
      }

      setPqrs(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar los registros"
      );
    } finally {
      setCargando(false);
      setActualizando(false);
    }
  };

  const eliminarPqr = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este PQR?")) return;

    try {
      const res = await fetch(`/api/pqr/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo eliminar el registro");
      }

      setPqrs((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error al eliminar");
    }
  };

  const guardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pqrEditando) return;

    try {
      setGuardando(true);

      const res = await fetch(`/api/pqr/${pqrEditando.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: pqrEditando.nombre,
          contacto: pqrEditando.contacto,
          mensaje: pqrEditando.mensaje,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Error al actualizar la PQR");
      }

      setPqrs((prev) =>
        prev.map((item) =>
          item.id === pqrEditando.id ? pqrEditando : item
        )
      );

      setPqrEditando(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setGuardando(false);
    }
  };

  useEffect(() => {
    cargarPqrs();
  }, []);

  useEffect(() => {
    if (!pqrEditando) return;

    const manejarEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPqrEditando(null);
      }
    };

    document.addEventListener("keydown", manejarEscape);

    return () => {
      document.removeEventListener("keydown", manejarEscape);
    };
  }, [pqrEditando]);

  const estadisticas = useMemo(() => {
    return {
      total: pqrs.length,
      recientes: pqrs.filter((item) => {
        const fecha = new Date(item.createdAt).getTime();
        const semana = 7 * 24 * 60 * 60 * 1000;

        return Date.now() - fecha <= semana;
      }).length,
    };
  }, [pqrs]);

  return (
    <div className="pqr-page">
      <Navbar />

      <main className="pqr-main">
        <section className="pqr-hero">
          <div className="pqr-hero-content">
            <div className="pqr-title-area">
              <span className="pqr-eyebrow">
                CENTRO DE ATENCIÓN
              </span>

              <h1>Gestión de PQRS</h1>

              <p>
                Administra las peticiones, quejas, reclamos y sugerencias
                recibidas por Deli Arepas JD.
              </p>
            </div>

            <button
              type="button"
              className={`pqr-refresh-btn ${
                actualizando ? "is-loading" : ""
              }`}
              onClick={cargarPqrs}
              disabled={actualizando}
            >
              <RefreshIcon />
              <span>
                {actualizando ? "Actualizando..." : "Actualizar lista"}
              </span>
            </button>
          </div>

          <div className="pqr-hero-decoration">
            <span />
            <span />
            <span />
          </div>
        </section>

        <section className="pqr-stats">
          <article className="pqr-stat-card">
            <div className="pqr-stat-icon">
              <MessageIcon />
            </div>

            <div>
              <span className="pqr-stat-label">
                Solicitudes registradas
              </span>

              <strong>{estadisticas.total}</strong>
            </div>
          </article>

          <article className="pqr-stat-card pqr-stat-card-green">
            <div className="pqr-stat-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v18" />
                <path d="M3 12h18" />
                <path d="M5 5l14 14" />
                <path d="M19 5 5 19" />
              </svg>
            </div>

            <div>
              <span className="pqr-stat-label">
                Recibidas últimos 7 días
              </span>

              <strong>{estadisticas.recientes}</strong>
            </div>
          </article>

          <article className="pqr-stat-card pqr-stat-card-orange">
            <div className="pqr-stat-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 8v4l2.5 2" />
              </svg>
            </div>

            <div>
              <span className="pqr-stat-label">
                Gestión disponible
              </span>

              <strong>Activa</strong>
            </div>
          </article>
        </section>

        {error && (
          <div className="pqr-error">
            <div className="pqr-error-icon">!</div>

            <div>
              <strong>No fue posible cargar las PQRS</strong>
              <span>{error}</span>
            </div>

            <button type="button" onClick={cargarPqrs}>
              Intentar nuevamente
            </button>
          </div>
        )}

        {cargando ? (
          <section className="pqr-loading-card">
            <div className="pqr-spinner" />

            <h3>Cargando solicitudes</h3>

            <p>
              Estamos consultando los registros de PQRS...
            </p>

            <div className="pqr-skeleton-list">
              <span />
              <span />
              <span />
            </div>
          </section>
        ) : pqrs.length === 0 ? (
          <section className="pqr-empty">
            <div className="pqr-empty-icon">
              <MessageIcon />
            </div>

            <span className="pqr-eyebrow">SIN REGISTROS</span>

            <h2>No hay solicitudes de PQRS</h2>

            <p>
              Actualmente no existen peticiones, quejas, reclamos o
              sugerencias registradas en el sistema.
            </p>

            <button
              type="button"
              className="pqr-empty-button"
              onClick={cargarPqrs}
            >
              <RefreshIcon />
              Actualizar
            </button>
          </section>
        ) : (
          <section className="pqr-table-section">
            <div className="pqr-table-header">
              <div>
                <span className="pqr-section-label">
                  REGISTROS
                </span>

                <h2>Solicitudes recibidas</h2>

                <p>
                  Consulta y administra cada solicitud registrada.
                </p>
              </div>

              <div className="pqr-count">
                <strong>{pqrs.length}</strong>
                <span>
                  {pqrs.length === 1 ? "registro" : "registros"}
                </span>
              </div>
            </div>

            <div className="pqr-table-wrapper">
              <table className="pqr-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Contacto</th>
                    <th>Mensaje</th>
                    <th className="pqr-actions-heading">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pqrs.map((item, index) => (
                    <tr
                      key={item.id}
                      style={
                        {
                          "--pqr-delay": `${index * 55}ms`,
                        } as React.CSSProperties
                      }
                    >
                      <td>
                        <span className="pqr-id">
                          #{item.id}
                        </span>
                      </td>

                      <td>
                        <div className="pqr-date">
                          <strong>
                            {new Date(item.createdAt).toLocaleDateString(
                              "es-CO",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </strong>

                          <span>
                            {new Date(item.createdAt).toLocaleTimeString(
                              "es-CO",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="pqr-client">
                          <div className="pqr-avatar">
                            {item.nombre
                              .trim()
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>{item.nombre}</strong>
                            <span>Cliente</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="pqr-contact">
                          {item.contacto}
                        </span>
                      </td>

                      <td>
                        <div className="pqr-message">
                          {item.mensaje}
                        </div>
                      </td>

                      <td className="pqr-actions">
                        <button
                          type="button"
                          className="pqr-action-btn pqr-edit-btn"
                          onClick={() => setPqrEditando(item)}
                          title="Editar PQR"
                        >
                          <EditIcon />
                          <span>Editar</span>
                        </button>

                        <button
                          type="button"
                          className="pqr-action-btn pqr-delete-btn"
                          onClick={() => eliminarPqr(item.id)}
                          title="Eliminar PQR"
                        >
                          <DeleteIcon />
                          <span>Eliminar</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className="pqr-bottom-info">
          <span className="pqr-bottom-dot" />
          Sistema de gestión de PQRS · Deli Arepas JD
        </div>
      </main>

      {pqrEditando && (
        <div
          className="pqr-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPqrEditando(null);
            }
          }}
        >
          <section
            className="pqr-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pqr-modal-title"
          >
            <div className="pqr-modal-header">
              <div>
                <span className="pqr-section-label">
                  ACTUALIZACIÓN
                </span>

                <h2 id="pqr-modal-title">
                  Editar solicitud #{pqrEditando.id}
                </h2>

                <p>
                  Modifica la información registrada por el cliente.
                </p>
              </div>

              <button
                type="button"
                className="pqr-modal-close"
                onClick={() => setPqrEditando(null)}
                aria-label="Cerrar"
              >
                <CloseIcon />
              </button>
            </div>

            <form
              onSubmit={guardarEdicion}
              className="pqr-form"
            >
              <div className="pqr-form-grid">
                <label className="pqr-field">
                  <span>Nombre completo</span>

                  <input
                    type="text"
                    value={pqrEditando.nombre}
                    onChange={(e) =>
                      setPqrEditando({
                        ...pqrEditando,
                        nombre: e.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label className="pqr-field">
                  <span>Contacto</span>

                  <input
                    type="text"
                    value={pqrEditando.contacto}
                    onChange={(e) =>
                      setPqrEditando({
                        ...pqrEditando,
                        contacto: e.target.value,
                      })
                    }
                    required
                  />
                </label>
              </div>

              <label className="pqr-field">
                <span>Mensaje de la solicitud</span>

                <textarea
                  value={pqrEditando.mensaje}
                  onChange={(e) =>
                    setPqrEditando({
                      ...pqrEditando,
                      mensaje: e.target.value,
                    })
                  }
                  required
                />
              </label>

              <div className="pqr-modal-footer">
                <button
                  type="button"
                  className="pqr-cancel-btn"
                  onClick={() => setPqrEditando(null)}
                  disabled={guardando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="pqr-save-btn"
                  disabled={guardando}
                >
                  <SaveIcon />

                  <span>
                    {guardando
                      ? "Guardando..."
                      : "Guardar cambios"}
                  </span>
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      <Footer />
    </div>
  );
}