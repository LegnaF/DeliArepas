import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const ESTADOS_VALIDOS = [
  "PENDIENTE",
  "EN_PREPARACION",
  "ENTREGADO",
  "CANCELADO",
] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pedidoId = Number(id);

    if (!Number.isInteger(pedidoId)) {
      return NextResponse.json(
        { error: "ID de pedido inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const estado = body.estado;

    if (!ESTADOS_VALIDOS.includes(estado)) {
      return NextResponse.json(
        { error: "Estado de pedido inválido" },
        { status: 400 }
      );
    }

    const pedidoActualizado = await prisma.pedido.update({
      where: {
        id: pedidoId,
      },
      data: {
        estado,
      },
    });

    return NextResponse.json(pedidoActualizado);
  } catch (error) {
    console.error("Error al actualizar pedido:", error);

    return NextResponse.json(
      { error: "No se pudo actualizar el pedido" },
      { status: 500 }
    );
  }
}