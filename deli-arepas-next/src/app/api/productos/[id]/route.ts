import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Contexto = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: Contexto
) {
  try {
    const { id } = await context.params;

    const productoId = Number(id);

    if (!Number.isInteger(productoId)) {
      return NextResponse.json(
        {
          error: "ID de producto inválido",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const {
      nombre,
      descripcion,
      precio,
      stock,
      categoria,
      imagen,
      descuento,
      activo,
    } = body;

    const data: Record<string, unknown> = {};

    if (nombre !== undefined) {
      data.nombre = String(nombre).trim();
    }

    if (descripcion !== undefined) {
      data.descripcion = String(descripcion).trim();
    }

    if (precio !== undefined) {
      const valor = Number(precio);

      if (Number.isNaN(valor) || valor < 0) {
        return NextResponse.json(
          {
            error: "Precio inválido",
          },
          {
            status: 400,
          }
        );
      }

      data.precio = valor;
    }

    if (stock !== undefined) {
      const valor = Number(stock);

      if (
        Number.isNaN(valor) ||
        valor < 0 ||
        !Number.isInteger(valor)
      ) {
        return NextResponse.json(
          {
            error: "Stock inválido",
          },
          {
            status: 400,
          }
        );
      }

      data.stock = valor;
    }

    if (categoria !== undefined) {
      data.categoria = String(categoria);
    }

    if (imagen !== undefined) {
      data.imagen = String(imagen);
    }

    if (descuento !== undefined) {
      const valor = Number(descuento);

      if (
        Number.isNaN(valor) ||
        valor < 0 ||
        valor > 100
      ) {
        return NextResponse.json(
          {
            error: "Descuento inválido",
          },
          {
            status: 400,
          }
        );
      }

      data.descuento = valor;
    }

    if (activo !== undefined) {
      data.activo = Boolean(activo);
    }

    const producto =
      await prisma.producto.update({
        where: {
          id: productoId,
        },
        data,
      });

    return NextResponse.json(producto);
  } catch (error) {
    console.error("Error PATCH producto:", error);

    return NextResponse.json(
      {
        error: "No se pudo actualizar el producto",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  context: Contexto
) {
  try {
    const { id } = await context.params;

    const productoId = Number(id);

    if (!Number.isInteger(productoId)) {
      return NextResponse.json(
        {
          error: "ID inválido",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.producto.delete({
      where: {
        id: productoId,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error("Error DELETE producto:", error);

    return NextResponse.json(
      {
        error:
          "No se puede eliminar este producto porque puede estar relacionado con pedidos existentes. Puedes desactivarlo.",
      },
      {
        status: 409,
      }
    );
  }
}