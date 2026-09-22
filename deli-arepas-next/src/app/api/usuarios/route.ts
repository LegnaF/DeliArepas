import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Obtener lista de usuarios
export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar usuario
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, nombre, email, rol } = body;

    if (!id) {
      return NextResponse.json(
        { error: "El ID del usuario es requerido" },
        { status: 400 }
      );
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: Number(id) }, // Convertir a número
      data: { nombre, email, rol },
      select: { id: true, nombre: true, email: true, rol: true },
    });

    return NextResponse.json(usuarioActualizado);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar usuario
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID no proporcionado" },
        { status: 400 }
      );
    }

    await prisma.usuario.delete({
      where: { id: Number(id) }, // Convertir a número
    });

    return NextResponse.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar usuario" },
      { status: 500 }
    );
  }
}