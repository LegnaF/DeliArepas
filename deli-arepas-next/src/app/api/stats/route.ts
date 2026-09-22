import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ajusta la ruta a tu cliente de Prisma

// FORZAR A QUE NEXT.JS NO GUARDE EN CACHÉ ESTA RUTA
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [usuarios, productos, pedidos, ventasResult] = await Promise.all([
      prisma.usuario.count(),
      prisma.producto.count(),
      prisma.pedido.count(),
      prisma.pedido.aggregate({
        _sum: {
          total: true,
        },
        where: {
          estado: {
            not: "CANCELADO",
          },
        },
      }),
    ]);

    const stats = {
      usuarios,
      productos,
      pedidos,
      ventas: ventasResult._sum.total || 0,
    };

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}