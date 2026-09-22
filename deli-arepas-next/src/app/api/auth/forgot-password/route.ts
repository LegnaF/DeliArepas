import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    console.log("=================================");
    console.log("SOLICITUD DE RECUPERACIÓN");
    console.log("Correo recibido:", email);
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log(
      "EMAIL_PASS configurado:",
      process.env.EMAIL_PASS ? "SI" : "NO"
    );
    console.log("=================================");

    if (!email) {
      return NextResponse.json(
        { error: "El correo es obligatorio" },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    console.log("Usuario encontrado:", usuario ? "SI" : "NO");

    if (!usuario) {
      return NextResponse.json(
        {
          error: "El correo no está registrado en Deli Arepas",
        },
        { status: 404 }
      );
    }

    const code = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    console.log("Código generado:", code);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("Verificando conexión con Gmail...");

    await transporter.verify();

    console.log("Conexión con Gmail correcta");

    const info = await transporter.sendMail({
      from: `"Deli Arepas JD" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Código de recuperación - Deli Arepas",
      text: `
Hola ${usuario.nombre}.

Tu código de verificación para recuperar tu contraseña es:

${code}

Si no solicitaste este cambio, ignora este mensaje.

Deli Arepas JD
      `,
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 30px auto;
          padding: 30px;
          background: #fff7ed;
          border-radius: 20px;
        ">

          <div style="
            background: white;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
          ">

            <h1 style="color: #ea580c;">
              Deli Arepas JD
            </h1>

            <h2>
              Recuperación de contraseña
            </h2>

            <p>
              Hola ${usuario.nombre}.
            </p>

            <p>
              Utiliza el siguiente código para continuar:
            </p>

            <div style="
              margin: 25px 0;
              padding: 20px;
              background: #fff7ed;
              border: 2px solid #fed7aa;
              border-radius: 15px;
            ">

              <strong style="
                font-size: 36px;
                letter-spacing: 8px;
                color: #ea580c;
              ">
                ${code}
              </strong>

            </div>

            <p style="color: #777;">
              Si no solicitaste recuperar tu contraseña,
              puedes ignorar este correo.
            </p>

            <p style="color: #999;">
              Deli Arepas JD
            </p>

          </div>

        </div>
      `,
    });

    console.log("Correo enviado correctamente");
    console.log("Message ID:", info.messageId);
    console.log("Respuesta:", info.response);

    return NextResponse.json({
      message: "Código de verificación enviado correctamente",
    });

  } catch (error: any) {

    console.error("=================================");
    console.error("ERROR ENVIANDO CORREO");
    console.error(error);
    console.error("Código:", error?.code);
    console.error("Comando:", error?.command);
    console.error("Respuesta:", error?.response);
    console.error("=================================");

    return NextResponse.json(
      {
        error:
          "No se pudo enviar el correo de verificación. Revisa la consola del servidor.",
      },
      { status: 500 }
    );
  }
}