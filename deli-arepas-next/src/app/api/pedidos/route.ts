import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clienteNombre, telefono, direccion, items } = body;

    if (!clienteNombre || !direccion || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Nombre, dirección e ítems son obligatorios." },
        { status: 400 }
      );
    }

    const total = items.reduce(
      (sum: number, item: { precioUnitario: number; cantidad: number }) =>
        sum + Number(item.precioUnitario) * Number(item.cantidad),
      0
    );

    const nuevoPedido = await prisma.$transaction(async (tx) => {
      // 1. Crear el cliente
      const nuevoCliente = await tx.cliente.create({
        data: {
          nombre: clienteNombre.trim(),
          telefono: telefono?.trim() || "Sin teléfono",
          direccion: direccion.trim(),
        },
      });

      // 2. Crear el pedido
      const pedidoCreado = await tx.pedido.create({
        data: {
          clienteId: nuevoCliente.id,
          total,
          estado: "PENDIENTE",
          detallepedido: {
            create: items.map(
              (item: { productoId: number; cantidad: number; precioUnitario: number }) => ({
                productoId: Number(item.productoId),
                cantidad: Number(item.cantidad),
                precioUnit: Number(item.precioUnitario),
              })
            ),
          },
        },
        include: {
          cliente: true,
          detallepedido: true,
        },
      });

      // 3. Descontar stock
      for (const item of items) {
        await tx.producto.update({
          where: { id: Number(item.productoId) },
          data: {
            stock: {
              decrement: Number(item.cantidad),
            },
          },
        });
      }

      return pedidoCreado;
    });

    return NextResponse.json(nuevoPedido, { status: 201 });
  } catch (error) {
    console.error("Error al registrar pedido:", error);
    return NextResponse.json(
      { error: "No se pudo registrar el pedido en el sistema." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        cliente: true,
        detallepedido: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(pedidos);
  } catch (error) {
    console.error("Error obteniendo pedidos:", error);
    return NextResponse.json(
      { error: "No se pudieron obtener los pedidos." },
      { status: 500 }
    );
  }
}