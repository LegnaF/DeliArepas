import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const busqueda = searchParams.get("q")?.trim() || "";
    const categoria = searchParams.get("categoria")?.trim() || "";
    const soloActivos = searchParams.get("activos");

    const productos = await prisma.producto.findMany({
      where: {
        ...(busqueda
          ? {
              OR: [
                {
                  nombre: {
                    contains: busqueda,
                  },
                },
                {
                  descripcion: {
                    contains: busqueda,
                  },
                },
              ],
            }
          : {}),

        ...(categoria && categoria !== "Todos"
          ? {
              categoria,
            }
          : {}),

        ...(soloActivos === "true"
          ? {
              activo: true,
            }
          : {}),
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 100,
    });

    return NextResponse.json(
      {
        ok: true,
        productos,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("ERROR API PRODUCTOS:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "No se pudieron cargar los productos.",
        productos: [],
      },
      {
        status: 503,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      nombre,
      descripcion,
      precio,
      stock,
      categoria,
      imagen,
      descuento,
    } = body;

    const nombreTexto = String(nombre || "").trim();
    const precioNumero = Number(precio);

    if (!nombreTexto || precio === undefined || precio === null) {
      return NextResponse.json(
        {
          error: "El nombre y el precio son obligatorios",
        },
        {
          status: 400,
        }
      );
    }

    if (Number.isNaN(precioNumero) || precioNumero < 0) {
      return NextResponse.json(
        {
          error: "El precio debe ser un número válido mayor o igual a 0",
        },
        {
          status: 400,
        }
      );
    }

    const stockNumero = Number(stock ?? 0);
    if (
      Number.isNaN(stockNumero) ||
      stockNumero < 0 ||
      !Number.isInteger(stockNumero)
    ) {
      return NextResponse.json(
        {
          error: "El stock debe ser un número entero mayor o igual a 0",
        },
        {
          status: 400,
        }
      );
    }

    const descuentoNumero = Number(descuento ?? 0);
    if (
      Number.isNaN(descuentoNumero) ||
      descuentoNumero < 0 ||
      descuentoNumero > 100
    ) {
      return NextResponse.json(
        {
          error: "El descuento debe estar entre 0 y 100",
        },
        {
          status: 400,
        }
      );
    }

    const descripcionTexto = String(descripcion || "").trim();
    const categoriaTexto = String(categoria || "Arepas").trim();
    const imagenTexto = String(imagen || "/arepa3.jpg").trim();

    const producto = await prisma.producto.create({
      data: {
        nombre: nombreTexto,
        descripcion: descripcionTexto,
        precio: precioNumero,
        stock: stockNumero,
        categoria: categoriaTexto || "Arepas",
        imagen: imagenTexto || "/arepa3.jpg",
        descuento: Math.round(descuentoNumero),
        activo: true,
      },
    });

    return NextResponse.json(producto, {
      status: 201,
    });
  } catch (error) {
    console.error("Error POST producto:", error);

    return NextResponse.json(
      {
        error: "No se pudo crear el producto",
      },
      {
        status: 500,
      }
    );
  }
}