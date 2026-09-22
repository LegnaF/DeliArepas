import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Obtener todos los clientes
export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { id: 'desc' },
    })
    return NextResponse.json(clientes)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener los clientes' },
      { status: 500 }
    )
  }
}

// POST: Crear un nuevo cliente
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, telefono, direccion } = body

    if (!nombre || !telefono || !direccion) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      )
    }

    const nuevoCliente = await prisma.cliente.create({
      data: {
        nombre,
        telefono,
        direccion,
      },
    })

    return NextResponse.json(nuevoCliente, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al registrar el cliente' },
      { status: 500 }
    )
  }
}