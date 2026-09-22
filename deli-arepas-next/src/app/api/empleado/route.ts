import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        cliente: true,
        detallepedido: {
          include: { producto: true },
        },
      },
      orderBy: { id: "desc" },
    });

    const pedidosFormateados = pedidos.map((p) => ({
      id: p.id,
      cliente: p.cliente?.nombre || "Cliente sin nombre",
      direccion: p.cliente?.direccion || "Sin dirección",
      total: Number(p.total) || 0,
      estado: p.estado,
      fecha: p.createdAt || p.fecha || new Date().toISOString(),
      items: (p.detallepedido || []).map((det) => ({
        nombre: det.producto?.nombre || "Producto",
        cantidad: det.cantidad,
        precio: Number(det.precioUnitario || det.precio) || 0,
      })),
    }));

    return NextResponse.json(pedidosFormateados);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return NextResponse.json(
      { error: "Error interno al obtener los pedidos." },
      { status: 500 }
    );
  }
}