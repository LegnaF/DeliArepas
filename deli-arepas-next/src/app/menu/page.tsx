"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import {
  CartProvider,
  useCart,
  Producto,
  ItemCarrito,
} from "@/app/context/CartContext";
import "./menu.css";

const categorias = [
  "Todos",
  "Arepas",
  "Bebidas",
  "Combos",
  "Adicionales",
  "Otros",
];

const dineroCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function MenuContent() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [mensajeNotificacion, setMensajeNotificacion] = useState("");

  // Datos para finalizar pedido
  const [nombreCliente, setNombreCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");
  const [direccion, setDireccion] = useState("");
  const [observaciones, setObservaciones] = useState("");

  // Estado del proceso de compra
  const [enviando, setEnviando] = useState(false);
  const [pedidoExitoso, setPedidoExitoso] = useState<{
    id: number;
    total: number;
    cliente: string;
  } | null>(null);

  const {
    items,
    agregarAlCarrito,
    cambiarCantidad,
    removerDelCarrito,
    vaciarCarrito,
    totalItems,
    subtotal,
  } = useCart();

  useEffect(() => {
    cargarProductos();
  }, []);

  /**
   * Cargar productos directamente desde la base de datos.
   *
   * La API /api/productos devuelve:
   *
   * {
   *   ok: true,
   *   productos: [...]
   * }
   *
   * Por eso debemos utilizar data.productos.
   */
  async function cargarProductos() {
    try {
      setCargando(true);
      setError("");

      let res = await fetch("/api/productos", {
        cache: "no-store",
      });

      // Compatibilidad por si existe una API administrativa alternativa
      if (!res.ok) {
        res = await fetch("/api/admin/productos", {
          cache: "no-store",
        });
      }

      if (!res.ok) {
        throw new Error(
          "No se pudo obtener el catálogo de productos."
        );
      }

      const data = await res.json();

      /*
       * La API normalmente devuelve:
       *
       * {
       *   ok: true,
       *   productos: [...]
       * }
       *
       * También dejamos compatibilidad con una API
       * que pudiera devolver directamente [...].
       */
      const listaProductos = Array.isArray(data)
        ? data
        : Array.isArray(data?.productos)
        ? data.productos
        : [];

      setProductos(listaProductos);
    } catch (err) {
      console.error("Error cargando productos:", err);

      setProductos([]);

      setError(
        "Ocurrió un inconveniente al cargar el menú. Intenta de nuevo."
      );
    } finally {
      setCargando(false);
    }
  }

  /**
   * Filtrar productos:
   *
   * 1. Solo productos activos.
   * 2. Filtrar por categoría.
   * 3. Filtrar por nombre o descripción.
   */
  const productosVisibles = useMemo(() => {
    const textoBusqueda = busqueda.trim().toLowerCase();

    return productos
      .filter((p) => p.activo)
      .filter(
        (p) =>
          categoriaActiva === "Todos" ||
          p.categoria === categoriaActiva
      )
      .filter(
        (p) =>
          p.nombre.toLowerCase().includes(textoBusqueda) ||
          p.descripcion
            ?.toLowerCase()
            .includes(textoBusqueda)
      );
  }, [productos, categoriaActiva, busqueda]);

  /**
   * Calcular precio final teniendo en cuenta el descuento.
   */
  function precioConDescuento(producto: Producto) {
    if (!producto.descuento) {
      return producto.precio;
    }

    return Math.round(
      producto.precio *
        (1 - producto.descuento / 100)
    );
  }

  /**
   * Agregar producto al carrito.
   */
  function handleAgregar(producto: Producto) {
    if (producto.stock <= 0) {
      return;
    }

    agregarAlCarrito(producto);

    setMensajeNotificacion(
      `¡${producto.nombre} añadido al carrito!`
    );

    setTimeout(() => {
      setMensajeNotificacion("");
    }, 2500);
  }

  /**
   * Procesar pedido.
   */
  async function procesarPedidoLocal() {
    if (items.length === 0) {
      return;
    }

    if (!nombreCliente.trim() || !direccion.trim()) {
      alert(
        "Por favor ingresa tu nombre y dirección de entrega."
      );
      return;
    }

    try {
      setEnviando(true);

      // Guardar cliente y pedido en la base de datos
      const respuesta = await fetch("/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clienteNombre: nombreCliente.trim(),
          telefono:
            telefonoCliente.trim() || "Sin teléfono",
          direccion: direccion.trim(),
          observaciones: observaciones.trim(),
          items: items.map((item) => ({
            productoId: item.producto.id,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
          })),
        }),
      });

      const pedidoGuardado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          pedidoGuardado.error ||
            "Error al registrar el pedido."
        );
      }

      // Mostrar confirmación
      setPedidoExitoso({
        id: pedidoGuardado.id,
        total: pedidoGuardado.total,
        cliente: nombreCliente.trim(),
      });

      // Vaciar carrito
      vaciarCarrito();

      // Limpiar formulario
      setNombreCliente("");
      setTelefonoCliente("");
      setDireccion("");
      setObservaciones("");

      // Actualizar productos y stock
      await cargarProductos();
    } catch (err) {
      console.error("Error procesando pedido:", err);

      alert(
        err instanceof Error
          ? err.message
          : "No se pudo registrar el pedido en el sistema."
      );
    } finally {
      setEnviando(false);
    }
  }

  /**
   * Cerrar carrito.
   */
  function cerrarCarrito() {
    setCarritoAbierto(false);
    setPedidoExitoso(null);
  }

  return (
    <div className="menu-page">
      <Navbar />

      <main className="menu-container">
        {/* Encabezado */}
        <header className="menu-header">
          <h1>Nuestro Menú</h1>

          <p className="menu-subtitulo">
            Arepas artesanales hechas con amor y los mejores
            ingredientes
          </p>
        </header>

        {/* Notificación */}
        {mensajeNotificacion && (
          <div className="menu-toast-notificacion">
            <span>✓</span>
            {mensajeNotificacion}
          </div>
        )}

        {/* Buscador */}
        <div className="menu-toolbar">
          <div className="search-input-wrapper">
            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="Buscar arepas, bebidas, combos..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
            />

            {busqueda && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => setBusqueda("")}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Categorías */}
        <div className="menu-categorias">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              className={`cat-chip ${
                categoriaActiva === categoria
                  ? "activo"
                  : ""
              }`}
              onClick={() =>
                setCategoriaActiva(categoria)
              }
            >
              {categoria}
            </button>
          ))}
        </div>

        {/* Estado de carga */}
        {cargando ? (
          <div className="menu-cargando">
            <div className="spinner"></div>

            <p>
              Cargando productos deliciosos...
            </p>
          </div>
        ) : error ? (
          /* Error */
          <div className="menu-error">
            <p>{error}</p>

            <button
              type="button"
              onClick={cargarProductos}
              className="btn-reintentar"
            >
              Reintentar
            </button>
          </div>
        ) : productosVisibles.length === 0 ? (
          /* Sin productos */
          <div className="menu-vacio">
            <p>
              No encontramos productos en esta categoría
              o búsqueda.
            </p>

            <button
              type="button"
              onClick={() => {
                setBusqueda("");
                setCategoriaActiva("Todos");
              }}
              className="btn-limpiar-filtros"
            >
              Ver todo el menú
            </button>
          </div>
        ) : (
          /* Productos */
          <div className="menu-grid">
            {productosVisibles.map((producto) => (
              <div
                className="menu-card"
                key={producto.id}
              >
                {/* Imagen */}
                <div className="menu-card-imagen">
                  <img
                    src={
                      producto.imagen ||
                      "/arepa3.jpg"
                    }
                    alt={producto.nombre}
                    onError={(e) => {
                      e.currentTarget.src =
                        "/arepa3.jpg";
                    }}
                  />

                  {producto.descuento > 0 && (
                    <span className="menu-badge-descuento">
                      -{producto.descuento}%
                    </span>
                  )}

                  {producto.stock <= 0 && (
                    <span className="menu-badge-agotado">
                      Agotado
                    </span>
                  )}
                </div>

                {/* Información */}
                <div className="menu-card-info">
                  <h3>{producto.nombre}</h3>

                  <p className="menu-card-descripcion">
                    {producto.descripcion ||
                      "Arepa artesanal recién preparada."}
                  </p>

                  <div className="menu-card-footer">
                    {/* Precio */}
                    <div className="menu-card-precio">
                      {producto.descuento > 0 && (
                        <span className="precio-original">
                          {dineroCOP.format(
                            producto.precio
                          )}
                        </span>
                      )}

                      <span className="precio-final">
                        {dineroCOP.format(
                          precioConDescuento(
                            producto
                          )
                        )}
                      </span>
                    </div>

                    {/* Botón */}
                    <button
                      type="button"
                      className="btn-agregar"
                      disabled={
                        producto.stock <= 0
                      }
                      onClick={() =>
                        handleAgregar(producto)
                      }
                    >
                      {producto.stock <= 0
                        ? "Agotado"
                        : "+ Agregar"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Botón flotante del carrito */}
      <button
        type="button"
        className="btn-cart-float"
        onClick={() =>
          setCarritoAbierto(true)
        }
        aria-label="Ver Carrito"
      >
        <span className="cart-icon">🛒</span>

        <span className="cart-badge">
          {totalItems}
        </span>
      </button>

      {/* Drawer del carrito */}
      {carritoAbierto && (
        <div
          className="cart-overlay"
          onClick={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              cerrarCarrito();
            }
          }}
        >
          <div className="cart-drawer">
            {/* Encabezado carrito */}
            <div className="cart-header">
              <h2>
                {pedidoExitoso
                  ? "¡Pedido Confirmado!"
                  : `Tu Pedido (${totalItems})`}
              </h2>

              <button
                type="button"
                className="cart-close"
                onClick={cerrarCarrito}
              >
                ×
              </button>
            </div>

            {/* Pedido exitoso */}
            {pedidoExitoso ? (
              <div className="cart-empty-body">
                <span
                  className="cart-empty-icon"
                  style={{
                    color: "#10b981",
                  }}
                >
                  ✓
                </span>

                <h3>
                  ¡Gracias por tu compra,{" "}
                  {pedidoExitoso.cliente}!
                </h3>

                <p>
                  Tu pedido{" "}
                  <strong>
                    #{pedidoExitoso.id}
                  </strong>{" "}
                  se ha registrado exitosamente.
                </p>

                <p
                  style={{
                    marginTop: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Total:{" "}
                  {dineroCOP.format(
                    pedidoExitoso.total
                  )}
                </p>

                <button
                  type="button"
                  className="btn-limpiar-filtros"
                  style={{
                    marginTop: "20px",
                  }}
                  onClick={cerrarCarrito}
                >
                  Continuar comprando
                </button>
              </div>
            ) : items.length === 0 ? (
              /* Carrito vacío */
              <div className="cart-empty-body">
                <span className="cart-empty-icon">
                  🛒
                </span>

                <p>
                  Tu carrito está vacío
                </p>

                <button
                  type="button"
                  className="btn-limpiar-filtros"
                  onClick={cerrarCarrito}
                >
                  Explorar menú
                </button>
              </div>
            ) : (
              <>
                {/* Productos del carrito */}
                <div className="cart-items-list">
                  {items.map(
                    (
                      item: ItemCarrito
                    ) => (
                      <div
                        key={
                          item.producto.id
                        }
                        className="cart-item"
                      >
                        <img
                          src={
                            item.producto
                              .imagen ||
                            "/arepa3.jpg"
                          }
                          alt={
                            item.producto
                              .nombre
                          }
                          className="cart-item-img"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/arepa3.jpg";
                          }}
                        />

                        <div className="cart-item-details">
                          <h4>
                            {
                              item
                                .producto
                                .nombre
                            }
                          </h4>

                          <span className="cart-item-price">
                            {dineroCOP.format(
                              item.precioUnitario *
                                item.cantidad
                            )}
                          </span>

                          <div className="cart-item-controls">
                            <button
                              type="button"
                              onClick={() =>
                                cambiarCantidad(
                                  item
                                    .producto
                                    .id,
                                  item.cantidad -
                                    1
                                )
                              }
                            >
                              -
                            </button>

                            <span>
                              {
                                item.cantidad
                              }
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                cambiarCantidad(
                                  item
                                    .producto
                                    .id,
                                  item.cantidad +
                                    1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Eliminar */}
                        <button
                          type="button"
                          className="cart-remove-btn"
                          onClick={() =>
                            removerDelCarrito(
                              item.producto.id
                            )
                          }
                          title="Eliminar producto"
                        >
                          🗑
                        </button>
                      </div>
                    )
                  )}
                </div>

                {/* Checkout */}
                <div className="cart-checkout-section">
                  <div className="cart-summary-row">
                    <span>
                      Total:
                    </span>

                    <strong>
                      {dineroCOP.format(
                        subtotal
                      )}
                    </strong>
                  </div>

                  {/* Datos cliente */}
                  <div className="cart-form-fields">
                    <input
                      type="text"
                      placeholder="Tu Nombre completo *"
                      value={
                        nombreCliente
                      }
                      onChange={(e) =>
                        setNombreCliente(
                          e.target.value
                        )
                      }
                    />

                    <input
                      type="text"
                      placeholder="Teléfono / Celular"
                      value={
                        telefonoCliente
                      }
                      onChange={(e) =>
                        setTelefonoCliente(
                          e.target.value
                        )
                      }
                    />

                    <input
                      type="text"
                      placeholder="Dirección de entrega *"
                      value={direccion}
                      onChange={(e) =>
                        setDireccion(
                          e.target.value
                        )
                      }
                    />

                    <textarea
                      placeholder="Notas adicionales (Ej: Sin cebolla, extra salsa...)"
                      rows={2}
                      value={
                        observaciones
                      }
                      onChange={(e) =>
                        setObservaciones(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* Confirmar pedido */}
                  <button
                    type="button"
                    className="btn-confirmar-pedido"
                    onClick={
                      procesarPedidoLocal
                    }
                    disabled={enviando}
                  >
                    {enviando
                      ? "Procesando..."
                      : "Confirmar Pedido"}
                  </button>

                  {/* Vaciar */}
                  <button
                    type="button"
                    className="btn-vaciar"
                    onClick={
                      vaciarCarrito
                    }
                    disabled={enviando}
                  >
                    Vaciar Carrito
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function MenuPage() {
  return (
    <CartProvider>
      <MenuContent />
    </CartProvider>
  );
}