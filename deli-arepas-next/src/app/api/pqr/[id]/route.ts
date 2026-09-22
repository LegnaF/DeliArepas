import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE: Eliminar PQR por ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pqrId = Number(id);

    if (isNaN(pqrId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    await prisma.pqr.delete({
      where: { id: pqrId },
    });

    return NextResponse.json(
      { message: "PQR eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el PQR:", error);
    return NextResponse.json(
      { error: "Error interno al eliminar la PQR" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar mensaje/contacto de PQR por ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pqrId = Number(id);

    if (isNaN(pqrId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const { nombre, contacto, mensaje } = await request.json();

    const pqrActualizado = await prisma.pqr.update({
      where: { id: pqrId },
      data: { nombre, contacto, mensaje },
    });

    return NextResponse.json(pqrActualizado, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar PQR:", error);
    return NextResponse.json(
      { error: "Error interno al actualizar la PQR" },
      { status: 500 }
    );
  }
}