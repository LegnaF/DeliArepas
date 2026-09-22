import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          error: "La contraseña debe tener mínimo 6 caracteres",
        },
        { status: 400 }
      );
    }

    // Por ahora verificamos que se haya ingresado un código
    // La validación real del código la agregaremos después.
    if (code.length !== 6) {
      return NextResponse.json(
        {
          error: "El código debe tener 6 dígitos",
        },
        { status: 400 }
      );
    }

    // IMPORTANTE:
    // La nueva contraseña debe guardarse cifrada
    // igual que cuando se registra un usuario.
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.usuario.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("Error actualizando contraseña:", error);

    return NextResponse.json(
      { error: "Error actualizando la contraseña" },
      { status: 500 }
    );
  }
}