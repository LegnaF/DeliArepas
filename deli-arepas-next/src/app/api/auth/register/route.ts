import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, email, password, rol } = body

    if (!nombre || !email || !password) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    })

    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'El correo electrónico ya está registrado' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        rol: rol || 'USUARIO',
      },
    })

    return NextResponse.json(
      { message: 'Usuario registrado exitosamente' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error detallado en registro:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}