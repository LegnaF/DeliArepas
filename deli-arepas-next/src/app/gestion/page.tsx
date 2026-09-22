"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import "./gestion.css";

type EstadoPedido =
  | "PENDIENTE"
  | "EN_PREPARACION"
  | "ENTREGADO"
  | "CANCELADO";

type Filtro =
  | "TODOS"
  | "PENDIENTE"
  | "EN_PREPARACION"
  | "LISTOS"
  | "ENTREGADO";

type ItemPedido = {
  nombre: string;
  cantidad: number;
  precio: number;
};

type Pedido = {
  id: number;
  cliente: string;
  direccion: string;
  total: number;
  estado: EstadoPedido;
  fecha: string;
  items: ItemPedido[];
};

const estadoTexto: Record<EstadoPedido, string> = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  ENTREGADO: "Listo",
  CANCELADO: "Cancelado",
};

export default function EmpleadoPedidosPage() {
  const router = useRouter();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("TODOS");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [actualizando, setActualizando] = useState<number | null>(null);

  const [modoNoche, setModoNoche] = useState(false);
  const [mostrarArriba, setMostrarArriba] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const tema = localStorage.getItem("tema-panel");
    if (tema === "noche") {
      setModoNoche(true);
    }

    cargarPedidos();

    const manejarScroll = () => {
      setMostrarArriba(window.scrollY > 300);
    };

    window.addEventListener("scroll", manejarScroll);
    return () => window.removeEventListener("scroll", manejarScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem("tema-panel", modoNoche ? "noche" : "dia");
  }, [modoNoche]);

  const cargarPedidos = async () => {
    try {
      setCargando(true);
      setError("");

      // Corregida la URL de la API a /api/empleado
      const respuesta = await fetch("/api/empleado", {
        method: "GET",
        cache: "no-store",
      });

      const texto = await respuesta.text();

      if (!respuesta.ok) {
        let mensajeError = "No se pudieron cargar los pedidos.";
        try {
          const errorJson = JSON.parse(texto);
          mensajeError = errorJson?.error || mensajeError;
        } catch {
          // Si la respuesta no es JSON (ej. HTML de error 500)
        }
        throw new Error(mensajeError);
      }

      let datos;
      try {
        datos = JSON.parse(texto);
      } catch {
        throw new Error("El servidor devolvió una respuesta inválida.");
      }

      setPedidos(Array.isArray(datos) ? datos : datos.pedidos || []);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "No se pudieron cargar los pedidos."
      );
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstado = async (id: number, estado: EstadoPedido) => {
    try {
      setActualizando(id);

      const respuesta = await fetch(`/api/empleado/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });

      const texto = await respuesta.text();

      // Validar si la respuesta no es OK antes de intentar parsear
      if (!respuesta.ok) {
        let mensajeError = "No se pudo actualizar el pedido.";
        try {
          const errorJson = JSON.parse(texto);
          mensajeError = errorJson?.error || errorJson?.message || mensajeError;
        } catch {
          // Si el servidor devolvió HTML (500/404), mantener el mensaje descriptivo
          console.error("Respuesta no-JSON del servidor:", texto);
        }
        throw new Error(mensajeError);
      }

      // Validar que el texto no esté vacío antes de parsear
      let datos = {};
      if (texto.trim().length > 0) {
        try {
          datos = JSON.parse(texto);
        } catch {
          throw new Error("Respuesta inválida del servidor.");
        }
      }

      setPedidos((anteriores) =>
        anteriores.map((p) => (p.id === id ? { ...p, estado, ...datos } : p))
      );

      setToast("Estado del pedido actualizado");
      setTimeout(() => setToast(""), 2500);
    } catch (err) {
      console.error(err);
      setToast(
        err instanceof Error ? err.message : "No se pudo actualizar el pedido."
      );
      setTimeout(() => setToast(""), 3000);
    } finally {
      setActualizando(null);
    }
  };

  const pedidosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return pedidos.filter((pedido) => {
      const coincideFiltro =
        filtro === "TODOS"
          ? true
          : filtro === "LISTOS"
          ? pedido.estado === "ENTREGADO"
          : pedido.estado === filtro;

      const productos = (pedido.items || [])
        .map((item) => item.nombre)
        .join(" ")
        .toLowerCase();

      const coincideBusqueda =
        !texto ||
        pedido.cliente.toLowerCase().includes(texto) ||
        String(pedido.id).includes(texto) ||
        productos.includes(texto);

      return coincideFiltro && coincideBusqueda;
    });
  }, [pedidos, filtro, busqueda]);

  const pendientes = pedidos.filter((p) => p.estado === "PENDIENTE").length;
  const preparacion = pedidos.filter((p) => p.estado === "EN_PREPARACION").length;
  const entregados = pedidos.filter((p) => p.estado === "ENTREGADO").length;
  const cancelados = pedidos.filter((p) => p.estado === "CANCELADO").length;

  const ingresos = pedidos
    .filter((p) => p.estado !== "CANCELADO")
    .reduce((total, pedido) => total + Number(pedido.total || 0), 0);

  const productosPopulares = useMemo(() => {
    const cantidades: Record<string, number> = {};

    pedidos.forEach((pedido) => {
      (pedido.items || []).forEach((item) => {
        cantidades[item.nombre] =
          (cantidades[item.nombre] || 0) + Number(item.cantidad || 0);
      });
    });

    return Object.entries(cantidades)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [pedidos]);

  const maxProducto =
    productosPopulares.length > 0
      ? Math.max(...productosPopulares.map(([, cantidad]) => cantidad))
      : 1;

  const formatoPrecio = (valor: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(valor);

  const formatoHora = (fecha: string) => {
    const fechaPedido = new Date(fecha);
    if (Number.isNaN(fechaPedido.getTime())) return "--:--";
    return fechaPedido.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const scrollA = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const volverAlInicio = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`page-wrapper ${modoNoche ? "tema-noche" : ""}`}>
      {/* 1. Navbar General del Sitio */}
      <Navbar />

      {/* 2. Sub-Barra de Gestión del Empleado */}
      <div className="panel-subbar" style={{ padding: "1rem 0" }}>
        <div 
          className="subbar-container"
          style={{ 
            maxWidth: "1350px", 
            margin: "0 auto", 
            width: "100%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            padding: "0 1.5rem"
          }}
        >
          <div className="subbar-titulo">
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
              Panel de Gestión de Pedidos
            </h1>
          </div>

          <div className="subbar-acciones" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className="buscador">
              <span className="buscar-icono">⌕</span>
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por cliente, # o producto..."
              />
            </div>

            <button
              className="tema-boton"
              onClick={() => setModoNoche(!modoNoche)}
            >
              {modoNoche ? "☀️ Modo Día" : "🌙 Modo Noche"}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Contenedor Principal Centrado */}
      <main 
        className="main-content-gestion"
        style={{ maxWidth: "1350px", margin: "0 auto", width: "100%", padding: "1.5rem 1.5rem 3rem" }}
      >
        {/* HERO / HEADER DEL PANEL */}
        <section id="inicio" className="hero-panel">
          <div>
            <span className="hero-etiqueta">CONTROL DE PEDIDOS</span>
            <h2>Todo bajo control,<br />pedido por pedido.</h2>
            <p>
              Consulta clientes, productos, cantidades, estados y valores de cada
              pedido desde un solo lugar.
            </p>
            
            {/* BOTÓN REAJUSTADO Y DESTACADO */}
            <button 
              className="boton-principal" 
              onClick={() => scrollA("pedidos")}
              style={{
                marginTop: "1.5rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.85rem 1.75rem",
                backgroundColor: "#ffffff",
                color: "#c0392b",
                fontWeight: "700",
                fontSize: "1rem",
                borderRadius: "50px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
                transition: "all 0.2s ease-in-out"
              }}
            >
              <span>Ver pedidos</span>
              <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>→</span>
            </button>
          </div>

          <div className="hero-decoracion">
            <div className="hero-circulo grande" />
            <div className="hero-circulo pequeno" />
            <div className="hero-mini-card">
              <span>Pedidos activos</span>
              <strong>{pendientes + preparacion}</strong>
              <small>En proceso</small>
            </div>
          </div>
        </section>

        {/* METRICAS Y CARDS DE ESTADO */}
        <section className="estadisticas-grid">
          <article className="stat-card">
            <div className="stat-cabecera">
              <span>Total pedidos</span>
              <b>01</b>
            </div>
            <strong>{pedidos.length}</strong>
            <p>Pedidos registrados</p>
            <div className="stat-linea"><span style={{ width: "100%" }} /></div>
          </article>

          <article className="stat-card">
            <div className="stat-cabecera">
              <span>Pendientes</span>
              <b>02</b>
            </div>
            <strong>{pendientes}</strong>
            <p>Esperando preparación</p>
            <div className="stat-linea pendiente">
              <span style={{ width: `${Math.min(pendientes * 12 + 8, 100)}%` }} />
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-cabecera">
              <span>En preparación</span>
              <b>03</b>
            </div>
            <strong>{preparacion}</strong>
            <p>Pedidos activos</p>
            <div className="stat-linea preparacion">
              <span style={{ width: `${Math.min(preparacion * 15 + 10, 100)}%` }} />
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-cabecera">
              <span>Ingresos</span>
              <b>04</b>
            </div>
            <strong className="precio-stat">{formatoPrecio(ingresos)}</strong>
            <p>Pedidos no cancelados</p>
            <div className="stat-linea ingresos"><span style={{ width: "86%" }} /></div>
          </article>
        </section>

        {/* GRÁFICAS DE ESTADO Y PRODUCTOS */}
        <section id="estadisticas" className="graficas-grid">
          <article className="grafica-card">
            <div className="seccion-cabecera">
              <div>
                <span>ANÁLISIS</span>
                <h3>Pedidos por estado</h3>
              </div>
              <span className="grafica-periodo">Actual</span>
            </div>

            <div className="barras-estado">
              {[
                { nombre: "Pendientes", valor: pendientes, clase: "barra-roja" },
                { nombre: "Preparación", valor: preparacion, clase: "barra-naranja" },
                { nombre: "Listos", valor: entregados, clase: "barra-verde" },
                { nombre: "Cancelados", valor: cancelados, clase: "barra-gris" },
              ].map((item) => {
                const max = Math.max(pendientes, preparacion, entregados, cancelados, 1);
                return (
                  <div className="barra-columna" key={item.nombre}>
                    <div className="barra-valor">{item.valor}</div>
                    <div className="barra-fondo">
                      <div
                        className={`barra ${item.clase}`}
                        style={{ height: `${(item.valor / max) * 100}%` }}
                      />
                    </div>
                    <span>{item.nombre}</span>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="grafica-card">
            <div className="seccion-cabecera">
              <div>
                <span>PRODUCTOS</span>
                <h3>Más solicitados</h3>
              </div>
              <span className="grafica-periodo">Top 5</span>
            </div>

            <div className="productos-grafica">
              {productosPopulares.length === 0 ? (
                <div className="sin-datos">
                  Todavía no hay productos registrados.
                </div>
              ) : (
                productosPopulares.map(([nombre, cantidad], index) => (
                  <div className="producto-barra" key={nombre}>
                    <div className="producto-barra-info">
                      <span><b>0{index + 1}</b> {nombre}</span>
                      <strong>{cantidad}</strong>
                    </div>
                    <div className="linea-producto">
                      <span style={{ width: `${(cantidad / maxProducto) * 100}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>

        {/* TABLA / LISTA DE PEDIDOS */}
        <section id="pedidos" className="pedidos-section">
          <div className="pedidos-cabecera">
            <div>
              <span>PEDIDOS</span>
              <h2>Gestión de pedidos</h2>
              <p>Consulta toda la información de cada compra y actualiza su estado.</p>
            </div>
            <button className="actualizar-boton" onClick={cargarPedidos}>
              Actualizar
            </button>
          </div>

          <div className="filtros">
            {[
              ["TODOS", "Todos"],
              ["PENDIENTE", "Pendientes"],
              ["EN_PREPARACION", "En preparación"],
              ["LISTOS", "Listos"],
              ["ENTREGADO", "Entregados"],
            ].map(([valor, texto]) => (
              <button
                key={valor}
                className={filtro === valor ? "filtro activo" : "filtro"}
                onClick={() => setFiltro(valor as Filtro)}
              >
                {texto}
                <span>
                  {valor === "TODOS"
                    ? pedidos.length
                    : valor === "PENDIENTE"
                    ? pendientes
                    : valor === "EN_PREPARACION"
                    ? preparacion
                    : entregados}
                </span>
              </button>
            ))}
          </div>

          {error && (
            <div className="mensaje-error">
              <strong>No se pudieron cargar los pedidos</strong>
              <p>{error}</p>
              <button onClick={cargarPedidos}>Intentar nuevamente</button>
            </div>
          )}

          <div className="tabla-contenedor">
            {cargando ? (
              <div className="cargando">
                <div className="loader" />
                <strong>Cargando pedidos...</strong>
                <span>Estamos consultando la información.</span>
              </div>
            ) : pedidosFiltrados.length === 0 ? (
              <div className="sin-pedidos">
                <div className="sin-pedidos-numero">00</div>
                <h3>No encontramos pedidos</h3>
                <p>Prueba con otro filtro o cambia la búsqueda.</p>
              </div>
            ) : (
              <>
                <div className="tabla-head">
                  <span>Pedido</span>
                  <span>Cliente</span>
                  <span>Productos</span>
                  <span>Total</span>
                  <span>Estado</span>
                  <span>Hora</span>
                </div>

                <div className="tabla-body">
                  {pedidosFiltrados.map((pedido, index) => (
                    <article
                      className="pedido-fila"
                      key={pedido.id}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="pedido-numero">
                        <strong>#{pedido.id}</strong>
                        <small>Pedido</small>
                      </div>

                      <div className="cliente-info">
                        <div className="cliente-avatar">
                          {pedido.cliente.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{pedido.cliente}</strong>
                          <small>{pedido.direccion || "Sin dirección"}</small>
                        </div>
                      </div>

                      <div className="productos-info">
                        {(pedido.items || []).map((item, itemIndex) => (
                          <div
                            key={`${item.nombre}-${itemIndex}`}
                            className="producto-linea"
                          >
                            <span>{item.cantidad}x</span>
                            <strong>{item.nombre}</strong>
                          </div>
                        ))}
                      </div>

                      <div className="total-info">
                        {formatoPrecio(Number(pedido.total || 0))}
                      </div>

                      <div className="estado-columna">
                        <span className={`estado estado-${pedido.estado.toLowerCase()}`}>
                          <i />
                          {estadoTexto[pedido.estado]}
                        </span>

                        <select
                          value={pedido.estado}
                          disabled={actualizando === pedido.id}
                          onChange={(e) =>
                            cambiarEstado(pedido.id, e.target.value as EstadoPedido)
                          }
                        >
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="EN_PREPARACION">En preparación</option>
                          <option value="ENTREGADO">Listo / Entregado</option>
                          <option value="CANCELADO">Cancelado</option>
                        </select>
                      </div>

                      <div className="hora-info">
                        {formatoHora(pedido.fecha)}
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {toast && <div className="toast">{toast}</div>}

      {mostrarArriba && (
        <button
          className="boton-arriba"
          onClick={volverAlInicio}
          title="Volver arriba"
        >
          ↑
        </button>
      )}

      <Footer />
    </div>
  );
}