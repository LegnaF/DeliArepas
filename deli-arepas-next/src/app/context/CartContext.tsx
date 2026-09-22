"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Producto = {
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

export type ItemCarrito = {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
};

type CartContextType = {
  items: ItemCarrito[];
  agregarAlCarrito: (producto: Producto) => void;
  removerDelCarrito: (productoId: number) => void;
  cambiarCantidad: (productoId: number, cantidad: number) => void;
  vaciarCarrito: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);

  // Cargar carrito previo desde localStorage
  useEffect(() => {
    try {
      const guardado = localStorage.getItem("deli-arepas-cart");
      if (guardado) {
        setItems(JSON.parse(guardado));
      }
    } catch (e) {
      console.error("Error al cargar carrito desde localStorage", e);
    }
  }, []);

  // Guardar en localStorage cuando cambie el carrito
  useEffect(() => {
    try {
      localStorage.setItem("deli-arepas-cart", JSON.stringify(items));
    } catch (e) {
      console.error("Error al guardar carrito en localStorage", e);
    }
  }, [items]);

  function calcularPrecioUnitario(producto: Producto): number {
    if (!producto.descuento) return producto.precio;
    return Math.round(producto.precio * (1 - producto.descuento / 100));
  }

  function agregarAlCarrito(producto: Producto) {
    setItems((actuales) => {
      const indice = actuales.findIndex(
        (item) => item.producto.id === producto.id
      );

      if (indice > -1) {
        const itemExistente = actuales[indice];
        if (itemExistente.cantidad >= producto.stock) {
          alert(`Solo hay ${producto.stock} unidades disponibles.`);
          return actuales;
        }

        const copia = [...actuales];
        copia[indice] = {
          ...itemExistente,
          cantidad: itemExistente.cantidad + 1,
        };
        return copia;
      }

      return [
        ...actuales,
        {
          producto,
          cantidad: 1,
          precioUnitario: calcularPrecioUnitario(producto),
        },
      ];
    });
  }

  function cambiarCantidad(productoId: number, nuevaCantidad: number) {
    if (nuevaCantidad <= 0) {
      removerDelCarrito(productoId);
      return;
    }

    setItems((actuales) =>
      actuales.map((item) => {
        if (item.producto.id === productoId) {
          if (nuevaCantidad > item.producto.stock) {
            alert(`Solo hay ${item.producto.stock} unidades disponibles.`);
            return item;
          }
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      })
    );
  }

  function removerDelCarrito(productoId: number) {
    setItems((actuales) =>
      actuales.filter((item) => item.producto.id !== productoId)
    );
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  const subtotal = items.reduce(
    (acc, item) => acc + item.precioUnitario * item.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        agregarAlCarrito,
        removerDelCarrito,
        cambiarCantidad,
        vaciarCarrito,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
}