"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import "./cliente.css";

interface ItemPedido {
  nombre: string;
  cantidad: number;
  precioUnitario?: number;
}

interface PedidoCliente {
  id: string;
  total: number;
  estado: "PENDIENTE" | "PREPARACION" | "COMPLETADO" | "CANCELADO";
  items: ItemPedido[];
  fecha: string;
  direccionEntrega?: string;
}

// Módulos del Cliente definidos según el Diagrama de Casos de Uso
const MODULOS_CLIENTE = [
  {
    id: "autenticacion",
    titulo: "Autenticación",
    descripcion: "Iniciar sesión, registrarse, actualizar datos o restablecer contraseña.",
    icono: "👤",
    link: "/login",
  },
  {
    id: "productos",
    titulo: "Productos",
    descripcion: "Consultar menú de productos y agregarlos al carrito.",
    icono: "🍽️",
    link: "/productos",
  },
  {
    id: "pedido",
    titulo: "Pedido",
    descripcion: "Consultar carrito, confirmar pedidos, cancelar o ver historial.",
    icono: "🛒",
    link: "/carrito",
  },
  {
    id: "pago",
    titulo: "Pago",
    descripcion: "Realizar pagos seleccionando el método de pago de tu preferencia.",
    icono: "💳",
    link: "/checkout",
  },
  {
    id: "pqrs",
    titulo: "PQRS",
    descripcion: "Crear y consultar peticiones, quejas, reclamos o sugerencias.",
    icono: "✉️",
    link: "/pqrs",
  },
];

export default function MisPedidosPage() {
  const [nombreCliente, setNombreCliente] = useState<string>("Cliente");
  const [pedidos, setPedidos] = useState<PedidoCliente[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  const cargarMisPedidos = async () => {
    setCargando(true);
    try {
      const res = await fetch("/api/cliente/pedidos");
      if (res.ok) {
        const data = await res.json();
        setPedidos(data);
      } else {
        setPedidos([]);
      }
    } catch (error) {
      console.error("Error al obtener el historial de pedidos:", error);
      setPedidos([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const rawData = localStorage.getItem("user") || localStorage.getItem("usuario");
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        setNombreCliente(parsed.nombre || parsed.email || "Cliente");
      } catch {
        setNombreCliente(rawData);
      }
    }

    cargarMisPedidos();
  }, []);

  return (
    <div className="cliente-layout">
      <Navbar />

      <main className="cliente-container">
        {/* TARJETA ENCABEZADO CON EL DISEÑO DE LA IMAGEN */}
        <header
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "1.8rem 2.2rem",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            border: "1px solid #f3f4f6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.8rem",
                color: "#6b7280",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "0.25rem",
              }}
            >
              GESTIÓN DEL CLIENTE
            </span>
            <h1
              style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                color: "#111827",
                margin: 0,
                letterSpacing: "-0.025em",
              }}
            >
              Panel de Cliente
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <span
              style={{
                backgroundColor: "#fef2f2",
                color: "#991b1b",
                fontSize: "0.85rem",
                fontWeight: 600,
                padding: "0.4rem 1rem",
                borderRadius: "9999px",
              }}
            >
              Rol: Cliente
            </span>
            <strong
              style={{
                fontSize: "1.1rem",
                color: "#111827",
                fontWeight: 700,
              }}
            >
              Bienvenido, {nombreCliente}
            </strong>
          </div>
        </header>

        {/* 1. MÓDULOS DE SERVICIO */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.3rem", color: "#371d10", marginBottom: "1rem" }}>
            Servicios del Cliente
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1rem",
            }}
          >
            {MODULOS_CLIENTE.map((modulo) => (
              <div
                key={modulo.id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  padding: "1.2rem",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
                    {modulo.icono}
                  </div>
                  <h3 style={{ margin: "0 0 0.4rem 0", fontSize: "1.1rem", color: "#111827" }}>
                    {modulo.titulo}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: "1.3", margin: 0 }}>
                    {modulo.descripcion}
                  </p>
                </div>
                <Link
                  href={modulo.link}
                  style={{
                    marginTop: "1rem",
                    padding: "0.5rem",
                    backgroundColor: "#ea580c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 600,
                    textAlign: "center",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  Ingresar →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 2. HISTORIAL DE PEDIDOS */}
        <h2 style={{ fontSize: "1.3rem", color: "#371d10", marginBottom: "1rem" }}>
          Mis Pedidos
        </h2>

        {cargando ? (
          <p style={{ textAlign: "center", color: "#6b7280" }}>
            Cargando historial de pedidos...
          </p>
        ) : pedidos.length === 0 ? (
          <div className="sin-pedidos">
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#371d10" }}>
              Aún no has realizado ningún pedido
            </h3>
            <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
              Explora nuestro menú y disfruta de las mejores arepas artesanales.
            </p>
            <Link
              href="/productos"
              style={{
                display: "inline-block",
                padding: "10px 20px",
                background: "#ea580c",
                color: "#ffffff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Ver Menú de Productos
            </Link>
          </div>
        ) : (
          <div className="pedidos-lista">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="tarjeta-pedido-cliente">
                <div className="tarjeta-cabecera">
                  <div>
                    <span className="pedido-codigo">Pedido #{pedido.id}</span>
                  </div>
                  <span className={`badge-cliente estado-${pedido.estado}`}>
                    {pedido.estado === "PREPARACION"
                      ? "EN PREPARACIÓN"
                      : pedido.estado}
                  </span>
                </div>

                <div className="items-cliente-lista">
                  {pedido.items?.map((item, idx) => (
                    <div key={idx} className="item-cliente-linea">
                      <span>
                        {item.cantidad}x {item.nombre}
                      </span>
                      {item.precioUnitario && (
                        <span>
                          ${(item.cantidad * item.precioUnitario).toLocaleString("es-CO")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {pedido.direccionEntrega && (
                  <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: "0.5rem 0 0 0" }}>
                    <strong>Dirección de entrega:</strong> {pedido.direccionEntrega}
                  </p>
                )}

                <div className="tarjeta-pie">
                  <span className="fecha-pedido">Fecha: {pedido.fecha}</span>
                  <span className="monto-total">
                    Total: ${pedido.total ? pedido.total.toLocaleString("es-CO") : 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}