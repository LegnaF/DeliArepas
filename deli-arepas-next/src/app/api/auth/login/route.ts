import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Correo y contraseña requeridos",
        },
        {
          status: 400,
        }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        {
          error: "Credenciales inválidas",
        },
        {
          status: 401,
        }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: "Credenciales inválidas",
        },
        {
          status: 401,
        }
      );
    }

    const response = NextResponse.json(
      {
        message: "Login exitoso",
        user: {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          rol: (usuario as any).rol,
        },
      },
      {
        status: 200,
      }
    );

    response.cookies.set("auth_token", `token_demo_${usuario.id}`, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("ERROR LOGIN:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
      },
      {
        status: 500,
      }
    );
  }
}