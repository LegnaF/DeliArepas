"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

import "./productos.css";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen: string;
  descuento: number;
  activo: boolean;
};

type Formulario = {
  nombre: string;
  descripcion: string;
  precio: string;
  stock: string;
  categoria: string;
  imagen: string;
  descuento: string;
  archivo: File | null;
};

const formularioInicial: Formulario = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "0",
  categoria: "Arepas",
  imagen: "/arepa3.jpg",
  descuento: "0",
  archivo: null,
};

const imagenesExistentes = [
  {
    nombre: "Arepa 3",
    ruta: "/arepa3.jpg",
  },
  {
    nombre: "Arepa 1",
    ruta: "/arepa1.jpg",
  },
  {
    nombre: "Arepa 2",
    ruta: "/arepa2.jpg",
  },
  {
    nombre: "Arepa 4",
    ruta: "/arepa4.jpg",
  },
  {
    nombre: "Arepa 5",
    ruta: "/arepa5.jpg",
  },
  {
    nombre: "Bebida 1",
    ruta: "/bebida1.jpg",
  },
  {
    nombre: "Bebida 2",
    ruta: "/bebida2.jpg",
  },
];

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

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);

  const [formulario, setFormulario] =
    useState<Formulario>(formularioInicial);

  const [productoEditando, setProductoEditando] =
    useState<number | null>(null);

  const [modalAbierto, setModalAbierto] =
    useState(false);

  const [cargando, setCargando] = useState(true);

  const [guardando, setGuardando] = useState(false);

  const [subiendoImagen, setSubiendoImagen] =
    useState(false);

  const [mensaje, setMensaje] = useState("");

  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");

  const [categoriaFiltro, setCategoriaFiltro] =
    useState("Todos");

  const [temaOscuro, setTemaOscuro] = useState(false);

  const [imagenPreview, setImagenPreview] =
    useState<string>("");

  const [archivoSeleccionado, setArchivoSeleccionado] =
    useState<File | null>(null);

  useEffect(() => {
    cargarProductos();

    const temaGuardado =
      localStorage.getItem("admin-theme");

    if (temaGuardado === "dark") {
      setTemaOscuro(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "admin-dark-mode",
      temaOscuro
    );

    localStorage.setItem(
      "admin-theme",
      temaOscuro ? "dark" : "light"
    );
  }, [temaOscuro]);

  async function cargarProductos() {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch(
        "/api/productos",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos?.error ||
            "No se pudieron cargar los productos."
        );
      }

      /*
       * La API devuelve:
       *
       * {
       *   ok: true,
       *   productos: [...]
       * }
       *
       * Por eso debemos utilizar
       * datos.productos.
       */
      const listaProductos = Array.isArray(datos)
        ? datos
        : Array.isArray(datos?.productos)
        ? datos.productos
        : [];

      setProductos(listaProductos);
    } catch (error) {
      console.error(
        "Error cargando productos:",
        error
      );

      setProductos([]);

      setError(
        error instanceof Error
          ? error.message
          : "No fue posible cargar los productos."
      );
    } finally {
      setCargando(false);
    }
  }

  function abrirNuevoProducto() {
    setProductoEditando(null);

    setFormulario({
      ...formularioInicial,
    });

    setImagenPreview("/arepa3.jpg");

    setArchivoSeleccionado(null);

    setMensaje("");

    setError("");

    setModalAbierto(true);
  }

  function abrirEditarProducto(
    producto: Producto
  ) {
    setProductoEditando(producto.id);

    setFormulario({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: String(producto.precio ?? ""),
      stock: String(producto.stock ?? 0),
      categoria:
        producto.categoria || "Arepas",
      imagen:
        producto.imagen || "/arepa3.jpg",
      descuento: String(
        producto.descuento ?? 0
      ),
      archivo: null,
    });

    setImagenPreview(
      producto.imagen || "/arepa3.jpg"
    );

    setArchivoSeleccionado(null);

    setMensaje("");

    setError("");

    setModalAbierto(true);
  }

  function cerrarModal() {
    if (guardando || subiendoImagen) {
      return;
    }

    setModalAbierto(false);

    setProductoEditando(null);

    setFormulario({
      ...formularioInicial,
    });

    setImagenPreview("");

    setArchivoSeleccionado(null);

    setMensaje("");

    setError("");
  }

  function cambiarCampo(
    campo: keyof Formulario,
    valor: string
  ) {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  }

  function seleccionarImagenExistente(
    evento: ChangeEvent<HTMLSelectElement>
  ) {
    const ruta = evento.target.value;

    setFormulario((actual) => ({
      ...actual,
      imagen: ruta,
      archivo: null,
    }));

    setArchivoSeleccionado(null);

    setImagenPreview(ruta);
  }

  function seleccionarArchivo(
    evento: ChangeEvent<HTMLInputElement>
  ) {
    const archivo =
      evento.target.files?.[0];

    if (!archivo) {
      return;
    }

    if (!archivo.type.startsWith("image/")) {
      setError(
        "El archivo seleccionado no es una imagen."
      );

      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      setError(
        "La imagen no puede superar los 5 MB."
      );

      return;
    }

    setError("");

    setArchivoSeleccionado(archivo);

    setFormulario((actual) => ({
      ...actual,
      archivo,
    }));

    const preview =
      URL.createObjectURL(archivo);

    setImagenPreview(preview);
  }

  async function subirImagen(): Promise<
    string | null
  > {
    if (!archivoSeleccionado) {
      return (
        formulario.imagen ||
        "/arepa3.jpg"
      );
    }

    try {
      setSubiendoImagen(true);

      const datos = new FormData();

      datos.append(
        "file",
        archivoSeleccionado
      );

      const respuesta = await fetch(
        "/api/productos/upload",
        {
          method: "POST",
          body: datos,
        }
      );

      const resultado =
        await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.error ||
            "No se pudo subir la imagen."
        );
      }

      return resultado.url;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo subir la imagen."
      );

      return null;
    } finally {
      setSubiendoImagen(false);
    }
  }

  async function guardarProducto(
    evento: FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    setMensaje("");
    setError("");

    if (!formulario.nombre.trim()) {
      setError(
        "El nombre del producto es obligatorio."
      );

      return;
    }

    if (
      formulario.precio === "" ||
      Number(formulario.precio) < 0 ||
      Number.isNaN(
        Number(formulario.precio)
      )
    ) {
      setError(
        "Ingresa un precio válido."
      );

      return;
    }

    if (
      formulario.stock === "" ||
      Number(formulario.stock) < 0 ||
      Number.isNaN(
        Number(formulario.stock)
      ) ||
      !Number.isInteger(
        Number(formulario.stock)
      )
    ) {
      setError(
        "Ingresa un stock válido."
      );

      return;
    }

    if (
      Number(formulario.descuento) < 0 ||
      Number(formulario.descuento) > 100 ||
      Number.isNaN(
        Number(formulario.descuento)
      )
    ) {
      setError(
        "El descuento debe estar entre 0 y 100."
      );

      return;
    }

    try {
      setGuardando(true);

      const imagenFinal =
        await subirImagen();

      if (!imagenFinal) {
        return;
      }

      const datosProducto = {
        nombre:
          formulario.nombre.trim(),

        descripcion:
          formulario.descripcion.trim(),

        precio:
          Number(formulario.precio),

        stock:
          Number(formulario.stock),

        categoria:
          formulario.categoria ||
          "Arepas",

        imagen:
          imagenFinal,

        descuento:
          Number(
            formulario.descuento || 0
          ),
      };

      let respuesta: Response;

      if (productoEditando !== null) {
        respuesta = await fetch(
          `/api/productos/${productoEditando}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              datosProducto
            ),
          }
        );
      } else {
        respuesta = await fetch(
          "/api/productos",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              datosProducto
            ),
          }
        );
      }

      const resultado =
        await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.error ||
            "No se pudo guardar el producto."
        );
      }

      /*
       * El producto ya fue guardado
       * correctamente en la base de datos.
       *
       * Ahora volvemos a consultar la API
       * para que React utilice los datos
       * reales de MySQL.
       */
      if (productoEditando !== null) {
        setMensaje(
          "Producto actualizado correctamente."
        );
      } else {
        setMensaje(
          "Producto creado correctamente."
        );
      }

      await cargarProductos();

      setTimeout(() => {
        cerrarModal();
      }, 700);
    } catch (error) {
      console.error(
        "Error guardando producto:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el producto."
      );
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarEstado(
    producto: Producto
  ) {
    try {
      setError("");

      const respuesta = await fetch(
        `/api/productos/${producto.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            activo:
              !producto.activo,
          }),
        }
      );

      const resultado =
        await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.error ||
            "No se pudo cambiar el estado."
        );
      }

      await cargarProductos();

      setMensaje(
        producto.activo
          ? "Producto desactivado correctamente."
          : "Producto activado correctamente."
      );

      setTimeout(() => {
        setMensaje("");
      }, 2500);
    } catch (error) {
      console.error(
        "Error cambiando estado:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el estado."
      );
    }
  }

  async function eliminarProducto(
    producto: Producto
  ) {
    const confirmar =
      window.confirm(
        `¿Deseas eliminar "${producto.nombre}"?`
      );

    if (!confirmar) {
      return;
    }

    try {
      setError("");

      const respuesta = await fetch(
        `/api/productos/${producto.id}`,
        {
          method: "DELETE",
        }
      );

      const resultado =
        await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.error ||
            "No se pudo eliminar el producto."
        );
      }

      await cargarProductos();

      setMensaje(
        "Producto eliminado correctamente."
      );

      setTimeout(() => {
        setMensaje("");
      }, 2500);
    } catch (error) {
      console.error(
        "Error eliminando producto:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el producto."
      );
    }
  }

  const productosFiltrados =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();

      return productos.filter(
        (producto) => {
          const coincideBusqueda =
            !texto ||
            producto.nombre
              .toLowerCase()
              .includes(texto) ||
            producto.descripcion
              .toLowerCase()
              .includes(texto);

          const coincideCategoria =
            categoriaFiltro ===
              "Todos" ||
            producto.categoria ===
              categoriaFiltro;

          return (
            coincideBusqueda &&
            coincideCategoria
          );
        }
      );
    }, [
      productos,
      busqueda,
      categoriaFiltro,
    ]);

  const totalProductos =
    productos.length;

  const productosActivos =
    productos.filter(
      (producto) =>
        producto.activo
    ).length;

  const productosAgotados =
    productos.filter(
      (producto) =>
        producto.stock <= 0
    ).length;

  const valorInventario =
    productos.reduce(
      (total, producto) =>
        total +
        Number(
          producto.precio || 0
        ) *
          Number(
            producto.stock || 0
          ),
      0
    );

  function volverArriba() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div
      className={`productos-page ${
        temaOscuro
          ? "theme-dark"
          : "theme-light"
      }`}
    >
      <Navbar />

      <main className="productos-main">
        <section className="productos-hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Administración de productos
            </div>

            <h1>
              Gestión de{" "}
              <span>Productos</span>
            </h1>

            <p>
              Administra el catálogo de
              Deli Arepas, controla el
              inventario y actualiza la
              información de cada
              producto.
            </p>
          </div>

          <div className="hero-actions">
            <button
              type="button"
              className="theme-button"
              onClick={() =>
                setTemaOscuro(
                  (actual) =>
                    !actual
                )
              }
              title={
                temaOscuro
                  ? "Activar modo claro"
                  : "Activar modo oscuro"
              }
            >
              {temaOscuro
                ? "☀"
                : "☾"}
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={
                abrirNuevoProducto
              }
            >
              <span>＋</span>
              Nuevo producto
            </button>
          </div>
        </section>

        {mensaje && (
          <div className="alert success-alert">
            <span>✓</span>
            {mensaje}
          </div>
        )}

        {error && (
          <div className="alert error-alert">
            <span>!</span>
            {error}

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              ×
            </button>
          </div>
        )}

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-icon">
              ◈
            </div>

            <div>
              <span>
                Total productos
              </span>

              <strong>
                {totalProductos}
              </strong>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon active">
              ✓
            </div>

            <div>
              <span>
                Productos activos
              </span>

              <strong>
                {productosActivos}
              </strong>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon warning">
              !
            </div>

            <div>
              <span>
                Agotados
              </span>

              <strong>
                {productosAgotados}
              </strong>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon money">
              $
            </div>

            <div>
              <span>
                Valor inventario
              </span>

              <strong>
                {dineroCOP.format(
                  valorInventario
                )}
              </strong>
            </div>
          </article>
        </section>

        <section className="catalog-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                Catálogo
              </span>

              <h2>
                Tus productos
              </h2>

              <p>
                Consulta, modifica o
                administra los
                productos registrados.
              </p>
            </div>

            <div className="results-count">
              {
                productosFiltrados.length
              }{" "}
              resultado
              {productosFiltrados.length !==
              1
                ? "s"
                : ""}
            </div>
          </div>

          <div className="filters-bar">
            <div className="search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(evento) =>
                  setBusqueda(
                    evento.target
                      .value
                  )
                }
              />

              {busqueda && (
                <button
                  type="button"
                  onClick={() =>
                    setBusqueda("")
                  }
                >
                  ×
                </button>
              )}
            </div>

            <div className="category-filter">
              <label>
                Categoría
              </label>

              <select
                value={
                  categoriaFiltro
                }
                onChange={(evento) =>
                  setCategoriaFiltro(
                    evento.target
                      .value
                  )
                }
              >
                {categorias.map(
                  (categoria) => (
                    <option
                      key={categoria}
                      value={
                        categoria
                      }
                    >
                      {categoria}
                    </option>
                  )
                )}
              </select>
            </div>

            <button
              type="button"
              className="refresh-button"
              onClick={
                cargarProductos
              }
              title="Actualizar productos"
            >
              ↻
              <span>
                Actualizar
              </span>
            </button>
          </div>

          {cargando ? (
            <div className="loading-container">
              <div className="loading-spinner" />

              <p>
                Cargando productos...
              </p>
            </div>
          ) : productosFiltrados.length ===
            0 ? (
            <div className="empty-container">
              <div className="empty-icon">
                ◫
              </div>

              <h3>
                No hay productos
              </h3>

              <p>
                No encontramos productos
                con los filtros
                seleccionados.
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  setBusqueda("");
                  setCategoriaFiltro(
                    "Todos"
                  );
                }}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {productosFiltrados.map(
                (
                  producto,
                  index
                ) => {
                  const precioFinal =
                    Number(
                      producto.precio
                    ) *
                    (1 -
                      Number(
                        producto.descuento ||
                          0
                      ) /
                        100);

                  return (
                    <article
                      className="product-card"
                      key={
                        producto.id
                      }
                      style={{
                        animationDelay: `${
                          Math.min(
                            index,
                            8
                          ) * 70
                        }ms`,
                      }}
                    >
                      <div className="product-image-wrapper">
                        <img
                          src={
                            producto.imagen ||
                            "/arepa3.jpg"
                          }
                          alt={
                            producto.nombre
                          }
                          className="product-image"
                          onError={(
                            evento
                          ) => {
                            evento.currentTarget.src =
                              "/arepa3.jpg";
                          }}
                        />

                        <div className="image-overlay">
                          <button
                            type="button"
                            onClick={() =>
                              abrirEditarProducto(
                                producto
                              )
                            }
                          >
                            Editar producto
                          </button>
                        </div>

                        <div className="product-category">
                          {
                            producto.categoria
                          }
                        </div>

                        {producto.descuento >
                          0 && (
                          <div className="discount-badge">
                            -
                            {
                              producto.descuento
                            }
                            %
                          </div>
                        )}

                        <div
                          className={`status-badge ${
                            producto.activo
                              ? "status-active"
                              : "status-inactive"
                          }`}
                        >
                          <span />
                          {producto.activo
                            ? "Activo"
                            : "Inactivo"}
                        </div>
                      </div>

                      <div className="product-info">
                        <div className="product-title-row">
                          <h3>
                            {
                              producto.nombre
                            }
                          </h3>

                          <span className="product-id">
                            #
                            {
                              producto.id
                            }
                          </span>
                        </div>

                        <p className="product-description">
                          {
                            producto.descripcion ||
                            "Sin descripción registrada."
                          }
                        </p>

                        <div className="price-row">
                          <div>
                            <strong>
                              {dineroCOP.format(
                                precioFinal
                              )}
                            </strong>

                            {producto.descuento >
                              0 && (
                              <del>
                                {dineroCOP.format(
                                  producto.precio
                                )}
                              </del>
                            )}
                          </div>

                          <span
                            className={`stock ${
                              producto.stock <=
                              0
                                ? "stock-empty"
                                : producto.stock <=
                                  5
                                ? "stock-low"
                                : "stock-ok"
                            }`}
                          >
                            {
                              producto.stock
                            }{" "}
                            unidades
                          </span>
                        </div>

                        <div className="product-actions">
                          <button
                            type="button"
                            className="edit-action"
                            onClick={() =>
                              abrirEditarProducto(
                                producto
                              )
                            }
                          >
                            ✎ Editar
                          </button>

                          <button
                            type="button"
                            className="state-action"
                            onClick={() =>
                              cambiarEstado(
                                producto
                              )
                            }
                          >
                            {producto.activo
                              ? "Desactivar"
                              : "Activar"}
                          </button>

                          <button
                            type="button"
                            className="delete-action"
                            onClick={() =>
                              eliminarProducto(
                                producto
                              )
                            }
                            title="Eliminar producto"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>

        <button
          type="button"
          className="back-top-button"
          onClick={volverArriba}
        >
          ↑
          <span>
            Volver arriba
          </span>
        </button>
      </main>

      <Footer />

      {modalAbierto && (
        <div
          className="modal-backdrop"
          onMouseDown={(evento) => {
            if (
              evento.target ===
              evento.currentTarget
            ) {
              cerrarModal();
            }
          }}
        >
          <div className="product-modal">
            <div className="modal-header">
              <div>
                <span className="modal-kicker">
                  {productoEditando !==
                  null
                    ? "Editar catálogo"
                    : "Nuevo registro"}
                </span>

                <h2>
                  {productoEditando !==
                  null
                    ? "Editar producto"
                    : "Agregar producto"}
                </h2>

                <p>
                  Completa la
                  información del
                  producto.
                </p>
              </div>

              <button
                type="button"
                className="close-modal"
                onClick={
                  cerrarModal
                }
              >
                ×
              </button>
            </div>

            <form
              className="product-form"
              onSubmit={
                guardarProducto
              }
            >
              <div className="form-layout">
                <div className="form-fields">
                  <div className="field-group full">
                    <label>
                      Nombre del
                      producto
                    </label>

                    <input
                      type="text"
                      value={
                        formulario.nombre
                      }
                      onChange={(
                        evento
                      ) =>
                        cambiarCampo(
                          "nombre",
                          evento
                            .target
                            .value
                        )
                      }
                      placeholder="Ej. Arepa Mixta"
                      required
                    />
                  </div>

                  <div className="field-group full">
                    <label>
                      Descripción
                    </label>

                    <textarea
                      value={
                        formulario.descripcion
                      }
                      onChange={(
                        evento
                      ) =>
                        cambiarCampo(
                          "descripcion",
                          evento
                            .target
                            .value
                        )
                      }
                      placeholder="Describe brevemente el producto..."
                      rows={4}
                    />
                  </div>

                  <div className="form-two-columns">
                    <div className="field-group">
                      <label>
                        Precio
                      </label>

                      <div className="input-prefix">
                        <span>
                          $
                        </span>

                        <input
                          type="number"
                          min="0"
                          value={
                            formulario.precio
                          }
                          onChange={(
                            evento
                          ) =>
                            cambiarCampo(
                              "precio",
                              evento
                                .target
                                .value
                            )
                          }
                          placeholder="0"
                          required
                        />
                      </div>
                    </div>

                    <div className="field-group">
                      <label>
                        Stock
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          formulario.stock
                        }
                        onChange={(
                          evento
                        ) =>
                          cambiarCampo(
                            "stock",
                            evento
                              .target
                              .value
                          )
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="form-two-columns">
                    <div className="field-group">
                      <label>
                        Categoría
                      </label>

                      <select
                        value={
                          formulario.categoria
                        }
                        onChange={(
                          evento
                        ) =>
                          cambiarCampo(
                            "categoria",
                            evento
                              .target
                              .value
                          )
                        }
                      >
                        {categorias
                          .filter(
                            (
                              item
                            ) =>
                              item !==
                              "Todos"
                          )
                          .map(
                            (
                              categoria
                            ) => (
                              <option
                                key={
                                  categoria
                                }
                                value={
                                  categoria
                                }
                              >
                                {
                                  categoria
                                }
                              </option>
                            )
                          )}
                      </select>
                    </div>

                    <div className="field-group">
                      <label>
                        Descuento
                        (%)
                      </label>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          formulario.descuento
                        }
                        onChange={(
                          evento
                        ) =>
                          cambiarCampo(
                            "descuento",
                            evento
                              .target
                              .value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="image-options">
                    <div className="field-group">
                      <label>
                        Imagen
                        existente
                      </label>

                      <select
                        value={
                          archivoSeleccionado
                            ? ""
                            : formulario.imagen
                        }
                        onChange={
                          seleccionarImagenExistente
                        }
                        disabled={
                          !!archivoSeleccionado
                        }
                      >
                        {imagenesExistentes.map(
                          (
                            imagen
                          ) => (
                            <option
                              key={
                                imagen.ruta
                              }
                              value={
                                imagen.ruta
                              }
                            >
                              {
                                imagen.nombre
                              }
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="upload-divider">
                      <span>
                        O
                      </span>
                    </div>

                    <div className="desktop-upload">
                      <label
                        htmlFor="imagen-escritorio"
                        className="upload-label"
                      >
                        <span className="upload-icon">
                          ↑
                        </span>

                        <strong>
                          Agregar
                          nueva
                          imagen
                        </strong>

                        <small>
                          Desde tu
                          escritorio
                        </small>

                        <input
                          id="imagen-escritorio"
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={
                            seleccionarArchivo
                          }
                        />
                      </label>

                      {archivoSeleccionado && (
                        <div className="selected-file">
                          <span>
                            ✓
                          </span>

                          <div>
                            <strong>
                              {
                                archivoSeleccionado.name
                              }
                            </strong>

                            <small>
                              Imagen
                              nueva
                              seleccionada
                            </small>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setArchivoSeleccionado(
                                null
                              );

                              setFormulario(
                                (
                                  actual
                                ) => ({
                                  ...actual,
                                  archivo:
                                    null,
                                })
                              );

                              setImagenPreview(
                                formulario.imagen ||
                                  "/arepa3.jpg"
                              );
                            }}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <aside className="image-preview">
                  <span>
                    Vista previa
                  </span>

                  <div className="preview-image-box">
                    {imagenPreview ? (
                      <img
                        src={
                          imagenPreview
                        }
                        alt="Vista previa"
                        onError={(
                          evento
                        ) => {
                          evento.currentTarget.src =
                            "/arepa3.jpg";
                        }}
                      />
                    ) : (
                      <div className="preview-empty">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  {archivoSeleccionado && (
                    <div className="new-image-note">
                      <span>
                        ●
                      </span>
                      Nueva imagen
                    </div>
                  )}
                </aside>
              </div>

              {(mensaje ||
                error) && (
                <div
                  className={`form-message ${
                    error
                      ? "form-message-error"
                      : "form-message-success"
                  }`}
                >
                  {error ||
                    mensaje}
                </div>
              )}

              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={
                    cerrarModal
                  }
                  disabled={
                    guardando ||
                    subiendoImagen
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="save-button"
                  disabled={
                    guardando ||
                    subiendoImagen
                  }
                >
                  {subiendoImagen ? (
                    <>
                      <span className="mini-spinner" />
                      Subiendo imagen...
                    </>
                  ) : guardando ? (
                    <>
                      <span className="mini-spinner" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      ✓{" "}
                      {productoEditando !==
                      null
                        ? "Guardar cambios"
                        : "Crear producto"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Link
        href="/"
        className="floating-home"
        title="Volver al inicio"
      >
        ⌂
      </Link>
    </div>
  );
}