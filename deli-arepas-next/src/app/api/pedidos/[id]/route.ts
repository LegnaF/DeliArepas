import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH: Actualizar datos o estado de la factura/pedido
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pedidoId = parseInt(id, 10);

    if (isNaN(pedidoId)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const body = await request.json();
    const { estado, clienteNombre, direccion } = body;

    const pedidoActualizado = await prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.findUnique({
        where: { id: pedidoId },
        include: { cliente: true },
      });

      if (!pedido) {
        throw new Error("Pedido no encontrado.");
      }

      // Actualizar cliente si se especificaron datos
      if (clienteNombre || direccion) {
        await tx.cliente.update({
          where: { id: pedido.clienteId },
          data: {
            ...(clienteNombre && { nombre: clienteNombre.trim() }),
            ...(direccion && { direccion: direccion.trim() }),
          },
        });
      }

      // Actualizar estado del pedido (PENDIENTE, ENTREGADO, CANCELADO)
      const resultado = await tx.pedido.update({
        where: { id: pedidoId },
        data: {
          ...(estado && { estado }),
        },
        include: {
          cliente: true,
          detallepedido: {
            include: { producto: true },
          },
        },
      });

      return resultado;
    });

    return NextResponse.json(pedidoActualizado);
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar la factura/pedido." },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar pedido y sus detalles
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pedidoId = parseInt(id, 10);

    if (isNaN(pedidoId)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Eliminar primero los detalles asociados
      await tx.detallepedido.deleteMany({
        where: { pedidoId },
      });

      // 2. Eliminar el pedido
      await tx.pedido.delete({
        where: { id: pedidoId },
      });
    });

    return NextResponse.json({ success: true, message: "Factura eliminada." });
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar la factura/pedido." },
      { status: 500 }
    );
  }
}