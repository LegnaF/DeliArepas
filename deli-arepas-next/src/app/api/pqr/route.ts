import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Obtener todos los registros de PQR ordenados del más reciente al más antiguo
export async function GET() {
  try {
    const pqrs = await prisma.pqr.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(pqrs, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los PQRs:", error);
    return NextResponse.json(
      { error: "Error interno al obtener los PQRs" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo registro de PQR desde el formulario de la página principal
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, contacto, mensaje } = body;

    if (!nombre || !contacto || !mensaje) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const nuevoPqr = await prisma.pqr.create({
      data: {
        nombre,
        contacto,
        mensaje,
      },
    });

    return NextResponse.json(nuevoPqr, { status: 201 });
  } catch (error) {
    console.error("Error al guardar el PQR:", error);
    return NextResponse.json(
      { error: "Error interno al guardar la PQR" },
      { status: 500 }
    );
  }
}