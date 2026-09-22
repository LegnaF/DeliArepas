import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const EXTENSIONES_PERMITIDAS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
];

const TIPOS_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const archivo = formData.get("file");

    if (!archivo || !(archivo instanceof File)) {
      return NextResponse.json(
        { error: "No se recibió ninguna imagen o el formato no es válido." },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
      return NextResponse.json(
        { error: "Formato no permitido. Usa JPG, JPEG, PNG, WEBP o GIF." },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (archivo.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "La imagen no puede superar los 5 MB." },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const extensionOriginal = path.extname(archivo.name).toLowerCase();

    if (!EXTENSIONES_PERMITIDAS.includes(extensionOriginal)) {
      return NextResponse.json(
        { error: "La extensión de la imagen no está permitida." },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const nombreSeguro = `${crypto.randomUUID()}${extensionOriginal}`;
    const carpetaUploads = path.join(process.cwd(), "public", "uploads");

    await mkdir(carpetaUploads, { recursive: true });

    const rutaFisica = path.join(carpetaUploads, nombreSeguro);
    const bytes = await archivo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(rutaFisica, buffer);

    const url = `/uploads/${nombreSeguro}`;

    return NextResponse.json(
      {
        success: true,
        url,
        nombre: nombreSeguro,
      },
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error subiendo imagen:", error);

    return NextResponse.json(
      { error: "No se pudo subir la imagen en el servidor." },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}