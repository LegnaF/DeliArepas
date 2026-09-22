"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import "./facturacion.css";

type Estado = "Pagada" | "Pendiente" | "Anulada";

interface ProductoDetalle {
  nombre: string;
  cantidad: number;
  precio: number;
}

interface Factura {
  id: string;
  dbId: number;
  cliente: string;
  fecha: string;
  total: number;
  metodo: string;
  estado: Estado;
  productos: ProductoDetalle[];
}

interface DetallePedidoDB {
  id: number;
  cantidad: number;
  precioUnit: number;
  producto?: {
    nombre: string;
  };
}

interface PedidoDB {
  id: number;
  total: number;
  estado: string;
  createdAt: string;
  cliente: {
    nombre: string;
  };
  detallepedido: DetallePedidoDB[];
}

/* =========================================================
   ICONOS
========================================================= */

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function BanIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
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

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function PrinterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 9V3h12v6" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v7H6z" />
      <path d="M18 12h.01" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />
    </svg>
  );
}

/* =========================================================
   DINERO
========================================================= */

const dinero = (valor: number) =>
  `$${Number(valor || 0).toLocaleString("es-CO")}`;

/* =========================================================
   COMPONENTE
========================================================= */

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [cargando, setCargando] = useState(true);

  const [facturaSeleccionada, setFacturaSeleccionada] =
    useState<Factura | null>(null);

  const [filtro, setFiltro] = useState<
    "Todas" | "Pagadas" | "Pendientes" | "Anuladas"
  >("Todas");

  const [busqueda, setBusqueda] = useState("");

  const [facturaEditando, setFacturaEditando] =
    useState<Factura | null>(null);

  const [editCliente, setEditCliente] = useState("");
  const [editEstado, setEditEstado] =
    useState<Estado>("Pendiente");

  const [temaOscuro, setTemaOscuro] = useState(false);

  /* =========================================================
     TEMA
  ========================================================= */

  useEffect(() => {
    const temaGuardado = localStorage.getItem("admin-theme");
    const oscuro = temaGuardado === "dark";

    setTemaOscuro(oscuro);

    document.body.classList.toggle(
      "facturacion-dark-body",
      oscuro
    );
  }, []);

  const cambiarTema = () => {
    setTemaOscuro((actual) => {
      const nuevoTema = !actual;

      localStorage.setItem(
        "admin-theme",
        nuevoTema ? "dark" : "light"
      );

      document.body.classList.toggle(
        "facturacion-dark-body",
        nuevoTema
      );

      return nuevoTema;
    });
  };

  /* =========================================================
     CARGAR PEDIDOS
  ========================================================= */

  useEffect(() => {
    cargarPedidos();
  }, []);

  async function cargarPedidos() {
    try {
      setCargando(true);

      const res = await fetch("/api/pedidos", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Error al obtener los pedidos.");
      }

      const data: PedidoDB[] = await res.json();

      const facturasMapeadas: Factura[] = data.map((p) => {
        let estadoMapped: Estado = "Pendiente";

        if (p.estado === "ENTREGADO") {
          estadoMapped = "Pagada";
        }

        if (p.estado === "CANCELADO") {
          estadoMapped = "Anulada";
        }

        return {
          id: `FAC-${String(p.id).padStart(3, "0")}`,
          dbId: p.id,
          cliente: p.cliente?.nombre || "Cliente General",
          fecha: new Date(
            p.createdAt
          ).toLocaleDateString("es-CO"),
          total: Number(p.total || 0),
          metodo: "Efectivo",
          estado: estadoMapped,
          productos: (p.detallepedido || []).map((d) => ({
            nombre: d.producto?.nombre || "Producto",
            cantidad: d.cantidad,
            precio: Number(d.precioUnit || 0),
          })),
        };
      });

      setFacturas(facturasMapeadas);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  }

  /* =========================================================
     FILTROS
  ========================================================= */

  const filtradas = useMemo(() => {
    return facturas.filter((factura) => {
      let coincideEstado = true;

      if (filtro === "Pagadas") {
        coincideEstado = factura.estado === "Pagada";
      }

      if (filtro === "Pendientes") {
        coincideEstado = factura.estado === "Pendiente";
      }

      if (filtro === "Anuladas") {
        coincideEstado = factura.estado === "Anulada";
      }

      const texto = busqueda.toLowerCase().trim();

      const coincideBusqueda =
        !texto ||
        factura.id.toLowerCase().includes(texto) ||
        factura.cliente.toLowerCase().includes(texto);

      return coincideEstado && coincideBusqueda;
    });
  }, [facturas, filtro, busqueda]);

  const pagadas = facturas.filter(
    (f) => f.estado === "Pagada"
  ).length;

  const pendientes = facturas.filter(
    (f) => f.estado === "Pendiente"
  ).length;

  const anuladas = facturas.filter(
    (f) => f.estado === "Anulada"
  ).length;

  const totalFacturado = facturas
    .filter((f) => f.estado === "Pagada")
    .reduce((sum, f) => sum + f.total, 0);

  /* =========================================================
     EDITAR
  ========================================================= */

  const abrirEdicion = (factura: Factura) => {
    setFacturaEditando(factura);
    setEditCliente(factura.cliente);
    setEditEstado(factura.estado);
  };

  const guardarEdicion = async () => {
    if (!facturaEditando) return;

    if (!editCliente.trim()) {
      alert("El nombre del cliente es obligatorio.");
      return;
    }

    try {
      let estadoDb = "PENDIENTE";

      if (editEstado === "Pagada") {
        estadoDb = "ENTREGADO";
      }

      if (editEstado === "Anulada") {
        estadoDb = "CANCELADO";
      }

      const res = await fetch(
        `/api/pedidos/${facturaEditando.dbId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clienteNombre: editCliente.trim(),
            estado: estadoDb,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Error al actualizar.");
      }

      setFacturas((actuales) =>
        actuales.map((factura) =>
          factura.dbId === facturaEditando.dbId
            ? {
                ...factura,
                cliente: editCliente.trim(),
                estado: editEstado,
              }
            : factura
        )
      );

      if (
        facturaSeleccionada?.dbId ===
        facturaEditando.dbId
      ) {
        setFacturaSeleccionada({
          ...facturaEditando,
          cliente: editCliente.trim(),
          estado: editEstado,
        });
      }

      setFacturaEditando(null);
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar la factura.");
    }
  };

  /* =========================================================
     ELIMINAR
  ========================================================= */

  const eliminarFactura = async (factura: Factura) => {
    const confirmar = window.confirm(
      `¿Deseas eliminar permanentemente la factura ${factura.id}?`
    );

    if (!confirmar) return;

    try {
      const res = await fetch(
        `/api/pedidos/${factura.dbId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Error al eliminar.");
      }

      setFacturas((actuales) =>
        actuales.filter(
          (f) => f.dbId !== factura.dbId
        )
      );

      if (
        facturaSeleccionada?.dbId === factura.dbId
      ) {
        setFacturaSeleccionada(null);
      }
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar la factura.");
    }
  };

  const imprimirFactura = () => {
    window.print();
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className={`facturas-page-container ${
        temaOscuro ? "tema-oscuro" : ""
      }`}
    >
      <Navbar />

      <main className="facturas-page">
        <div className="facturas-decoracion decoracion-1" />
        <div className="facturas-decoracion decoracion-2" />
        <div className="facturas-decoracion decoracion-3" />
        <div className="facturas-decoracion decoracion-4" />

        <section className="contenido">

          <header className="titulo">
            <div className="titulo-copy">
              <span className="eyebrow">
                <span className="eyebrow-line" />
                GESTIÓN FINANCIERA
              </span>

              <h1>
                Facturación
                <span className="titulo-punto">.</span>
              </h1>

              <p>
                Consulta, administra y controla las facturas
                generadas automáticamente a partir de los
                pedidos de Deli Arepas JD.
              </p>
            </div>

            <div className="titulo-lado">
              <div className="estado-sistema">
                <span className="estado-sistema-punto" />

                <div>
                  <strong>Sistema activo</strong>
                  <span>Facturación automática</span>
                </div>

                <span className="estado-check">
                  <CheckIcon />
                </span>
              </div>
            </div>
          </header>

          <section className="estadisticas">

            <article className="stat-card stat-total">
              <div className="stat-glow" />

              <div className="stat-icon">
                <FileIcon />
              </div>

              <div className="stat-content">
                <span className="stat-label">
                  Facturas generadas
                </span>

                <strong>{facturas.length}</strong>

                <p>
                  Documentos registrados en el sistema.
                </p>
              </div>

              <span className="stat-number-bg">
                01
              </span>
            </article>

            <article className="stat-card stat-pagadas">
              <div className="stat-glow" />

              <div className="stat-icon">
                <CheckIcon />
              </div>

              <div className="stat-content">
                <span className="stat-label">
                  Facturas pagadas
                </span>

                <strong>{pagadas}</strong>

                <p>
                  Cobros confirmados correctamente.
                </p>
              </div>

              <span className="stat-number-bg">
                02
              </span>
            </article>

            <article className="stat-card stat-pendientes">
              <div className="stat-glow" />

              <div className="stat-icon">
                <ClockIcon />
              </div>

              <div className="stat-content">
                <span className="stat-label">
                  Facturas pendientes
                </span>

                <strong>{pendientes}</strong>

                <p>
                  Facturas que esperan confirmación.
                </p>
              </div>

              <span className="stat-number-bg">
                03
              </span>
            </article>

            <article className="stat-card stat-anuladas">
              <div className="stat-glow" />

              <div className="stat-icon">
                <BanIcon />
              </div>

              <div className="stat-content">
                <span className="stat-label">
                  Facturas anuladas
                </span>

                <strong>{anuladas}</strong>

                <p>
                  Documentos cancelados del sistema.
                </p>
              </div>

              <span className="stat-number-bg">
                04
              </span>
            </article>

          </section>

          <section className="resumen-superior">

            <div className="resumen-item resumen-dinero">
              <span>Total recaudado</span>
              <strong>{dinero(totalFacturado)}</strong>
            </div>

            <div className="resumen-separador" />

            <div className="resumen-item">
              <span>Registros visibles</span>
              <strong>{filtradas.length}</strong>
            </div>

            <div className="resumen-separador" />

            <div className="resumen-info">
              <span className="resumen-punto" />

              <span>
                Datos sincronizados con pedidos
              </span>
            </div>

          </section>

          <section className="panel-filtros">

            <div className="filtros-principal">
              <div className="buscador">
                <SearchIcon />

                <input
                  value={busqueda}
                  onChange={(e) =>
                    setBusqueda(e.target.value)
                  }
                  placeholder="Buscar factura o cliente..."
                />

                {busqueda && (
                  <button
                    className="limpiar-busqueda"
                    onClick={() => setBusqueda("")}
                    aria-label="Limpiar búsqueda"
                  >
                    ×
                  </button>
                )}
              </div>

              <span className="encontradas">
                <strong>{filtradas.length}</strong>
                <span> resultados encontrados</span>
              </span>
            </div>

            <div className="filtros">
              {(
                [
                  "Todas",
                  "Pagadas",
                  "Pendientes",
                  "Anuladas",
                ] as const
              ).map((opcion) => (
                <button
                  key={opcion}
                  className={
                    filtro === opcion
                      ? "filtro-activo"
                      : ""
                  }
                  onClick={() => setFiltro(opcion)}
                >
                  {opcion}

                  <span>
                    {opcion === "Todas"
                      ? facturas.length
                      : opcion === "Pagadas"
                      ? pagadas
                      : opcion === "Pendientes"
                      ? pendientes
                      : anuladas}
                  </span>
                </button>
              ))}
            </div>

          </section>

          <section className="tabla">

            <div className="tabla-header">

              <div className="tabla-heading">
                <span className="tabla-eyebrow">
                  REGISTRO DE FACTURACIÓN
                </span>

                <h2>Facturas registradas</h2>

                <p>
                  Administra todos los documentos
                  generados por los pedidos.
                </p>
              </div>

              <span className="tabla-contador">
                <span className="contador-dot" />
                {filtradas.length} registros
              </span>

            </div>

            {cargando ? (
              <div className="loading-container">
                <div className="spinner" />

                <h3>Cargando facturas</h3>

                <p>
                  Estamos consultando la información
                  de tus pedidos...
                </p>
              </div>
            ) : filtradas.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <FileIcon />
                </div>

                <h3>No encontramos facturas</h3>

                <p>
                  No existen registros que coincidan
                  con los filtros seleccionados.
                </p>

                {(busqueda || filtro !== "Todas") && (
                  <button
                    className="btn-limpiar-filtros"
                    onClick={() => {
                      setBusqueda("");
                      setFiltro("Todas");
                    }}
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="tabla-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>N.º FACTURA</th>
                      <th>CLIENTE</th>
                      <th>FECHA</th>
                      <th>TOTAL</th>
                      <th>MÉTODO</th>
                      <th>ESTADO</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtradas.map(
                      (factura, index) => (
                        <tr
                          key={factura.id}
                          style={{
                            animationDelay: `${
                              index * 45
                            }ms`,
                          }}
                        >
                          <td>
                            <div className="factura-numero">
                              <span className="mini-file">
                                <FileIcon />
                              </span>

                              <strong>
                                {factura.id}
                              </strong>
                            </div>
                          </td>

                          <td>
                            <div className="cliente-cell">
                              <span className="cliente-avatar">
                                {factura.cliente
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>

                              <strong>
                                {factura.cliente}
                              </strong>
                            </div>
                          </td>

                          <td>
                            <span className="fecha-cell">
                              {factura.fecha}
                            </span>
                          </td>

                          <td>
                            <strong className="total-cell">
                              {dinero(factura.total)}
                            </strong>
                          </td>

                          <td>
                            <span className="metodo-cell">
                              {factura.metodo}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`estado ${factura.estado.toLowerCase()}`}
                            >
                              <i />
                              {factura.estado}
                            </span>
                          </td>

                          <td>
                            <div className="acciones-tabla">

                              <button
                                className="accion accion-ver"
                                onClick={() =>
                                  setFacturaSeleccionada(
                                    factura
                                  )
                                }
                                title="Ver factura"
                              >
                                <EyeIcon />
                                <span>Ver</span>
                              </button>

                              <button
                                className="accion accion-editar"
                                onClick={() =>
                                  abrirEdicion(factura)
                                }
                                title="Editar factura"
                              >
                                <EditIcon />
                                <span>Editar</span>
                              </button>

                              <button
                                className="accion accion-eliminar"
                                onClick={() =>
                                  eliminarFactura(
                                    factura
                                  )
                                }
                                title="Eliminar factura"
                              >
                                <TrashIcon />
                                <span>Eliminar</span>
                              </button>

                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </section>
        </section>

        <button
          className="tema-flotante"
          onClick={cambiarTema}
          aria-label={
            temaOscuro
              ? "Activar modo día"
              : "Activar modo noche"
          }
          title={
            temaOscuro
              ? "Cambiar a modo día"
              : "Cambiar a modo noche"
          }
        >
          <span className="tema-icono">
            <span className="tema-icono-dia">
              <SunIcon />
            </span>

            <span className="tema-icono-noche">
              <MoonIcon />
            </span>
          </span>

          <span className="tema-texto">
            {temaOscuro ? "Modo día" : "Modo noche"}
          </span>
        </button>

        {facturaSeleccionada && (
          <div
            className="overlay"
            onClick={() =>
              setFacturaSeleccionada(null)
            }
          >
            <div
              className="modal-factura"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <button
                className="cerrar"
                onClick={() =>
                  setFacturaSeleccionada(null)
                }
                aria-label="Cerrar"
              >
                <CloseIcon />
              </button>

              <div className="modal-top">
                <div className="modal-document-icon">
                  <FileIcon />
                </div>

                <div>
                  <span className="modal-overline">
                    DOCUMENTO DE VENTA
                  </span>

                  <h2>
                    {facturaSeleccionada.id}
                  </h2>

                  <p>
                    Detalle completo de la factura
                  </p>
                </div>
              </div>

              <div className="modal-cliente">
                <div>
                  <span>CLIENTE</span>

                  <strong>
                    {facturaSeleccionada.cliente}
                  </strong>
                </div>

                <div>
                  <span>FECHA</span>

                  <strong>
                    {facturaSeleccionada.fecha}
                  </strong>
                </div>

                <span
                  className={`estado-modal ${facturaSeleccionada.estado.toLowerCase()}`}
                >
                  <i />
                  {facturaSeleccionada.estado}
                </span>
              </div>

              <div className="modal-section-title">
                <span>DETALLE DEL PEDIDO</span>
              </div>

              <div className="productos">
                {facturaSeleccionada.productos.length >
                0 ? (
                  facturaSeleccionada.productos.map(
                    (producto, index) => (
                      <div
                        className="producto"
                        key={index}
                      >
                        <div className="producto-info">
                          <span className="producto-index">
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <div>
                            <strong>
                              {producto.nombre}
                            </strong>

                            <span>
                              Cantidad:{" "}
                              {producto.cantidad}
                            </span>
                          </div>
                        </div>

                        <strong>
                          {dinero(
                            producto.precio *
                              producto.cantidad
                          )}
                        </strong>
                      </div>
                    )
                  )
                ) : (
                  <p className="sin-productos">
                    No hay productos registrados.
                  </p>
                )}
              </div>

              <div className="resumen-factura">
                <div>
                  <span>Subtotal</span>

                  <strong>
                    {dinero(
                      facturaSeleccionada.total
                    )}
                  </strong>
                </div>

                <div>
                  <span>Método de pago</span>

                  <strong>
                    {facturaSeleccionada.metodo}
                  </strong>
                </div>

                <div className="total-final">
                  <span>Total</span>

                  <strong>
                    {dinero(
                      facturaSeleccionada.total
                    )}
                  </strong>
                </div>
              </div>

              <button
                className="btn-imprimir"
                onClick={imprimirFactura}
              >
                <PrinterIcon />
                Imprimir factura
              </button>
            </div>
          </div>
        )}

        {facturaEditando && (
          <div
            className="overlay"
            onClick={() =>
              setFacturaEditando(null)
            }
          >
            <div
              className="modal-nueva"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <button
                className="cerrar"
                onClick={() =>
                  setFacturaEditando(null)
                }
                aria-label="Cerrar"
              >
                <CloseIcon />
              </button>

              <div className="modal-form-header">
                <span className="modal-overline">
                  ADMINISTRACIÓN
                </span>

                <h2>
                  Editar factura
                </h2>

                <p>
                  Actualiza la información de{" "}
                  <strong>
                    {facturaEditando.id}
                  </strong>
                </p>
              </div>

              <div className="form-group">
                <label>
                  Nombre del cliente
                </label>

                <input
                  type="text"
                  value={editCliente}
                  onChange={(e) =>
                    setEditCliente(
                      e.target.value
                    )
                  }
                  placeholder="Nombre del cliente"
                />
              </div>

              <div className="form-group">
                <label>
                  Estado de la factura
                </label>

                <select
                  value={editEstado}
                  onChange={(e) =>
                    setEditEstado(
                      e.target.value as Estado
                    )
                  }
                >
                  <option value="Pendiente">
                    Pendiente
                  </option>

                  <option value="Pagada">
                    Pagada
                  </option>

                  <option value="Anulada">
                    Anulada
                  </option>
                </select>
              </div>

              <div className="modal-form-actions">
                <button
                  className="btn-cancelar"
                  onClick={() =>
                    setFacturaEditando(null)
                  }
                >
                  Cancelar
                </button>

                <button
                  className="crear-factura"
                  onClick={guardarEdicion}
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}