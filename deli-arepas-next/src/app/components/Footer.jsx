"use client";

import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-contenido">
        {/* SECCIÓN SUPERIOR */}
        <div className="footer-top">
          {/* LOGO Y DESCRIPCIÓN */}
          <div className="footer-brand">
            <div className="footer-brand-header">
              <Image
                src="/logo.jpg"
                alt="Deli Arepas JD Logo"
                width={36}
                height={36}
                className="footer-logo"
              />
              <h3 className="footer-titulo">Deli Arepas JD</h3>
            </div>
            <p className="footer-subtitulo">
              Tradición y sabor en cada arepa. Recetas artesanales transmitidas de generación en generación.
            </p>
          </div>

          {/* HORARIOS */}
          <div className="footer-horarios">
            <h4 className="footer-horarios-titulo">HORARIOS</h4>
            <p className="footer-horarios-texto">
              Lunes a Viernes: 4:00 PM - 10:00 PM
            </p>
            <p className="footer-horarios-texto">
              Sábados y Domingos: 12:00 PM - 11:00 PM
            </p>
          </div>
        </div>

        <div className="footer-divider"></div>

        {/* SECCIÓN INFERIOR */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} Deli Arepas JD. Todos los derechos reservados.
          </p>

          <div className="footer-redes">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="footer-red-icon"
            >
              ⓕ
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="footer-red-icon"
            >
              📷
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="footer-red-icon"
            >
              𝕏
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}