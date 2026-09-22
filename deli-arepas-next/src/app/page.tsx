"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";

export default function HomePage() {
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !contacto || !mensaje) return;

    setCargando(true);
    setError("");

    try {
      const res = await fetch("/api/pqr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, contacto, mensaje }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al registrar la PQR");
      }

      setEnviado(true);
      setNombre("");
      setContacto("");
      setMensaje("");

      setTimeout(() => setEnviado(false), 4000);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "No se pudo enviar el mensaje"
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className={styles.main}>
      <Navbar />

      {/* SECCIÓN HERO */}
      <section className={styles.hero}>
        <div className={styles.glassCard}>
          <span className={styles.badge}>100% Maíz Seleccionado</span>
          <h1 className={styles.title}>DELI AREPAS</h1>
          <h2 className={styles.subtitle}>Artesanal y Delicioso</h2>
          <p className={styles.description}>
            Disfruta de la auténtica tradición colombiana con arepas doradas,
            crujientes por fuera y generosamente rellenas por dentro. Hechas a
            mano con amor y el mejor maíz.
          </p>

          <div className={styles.heroButtons}>
            <Link href="/menu" className={styles.btnPrimary}>
              Ver Productos
            </Link>
            <a href="#nuestra-historia" className={styles.btnSecondary}>
              Nuestra Historia
            </a>
          </div>
        </div>
      </section>

      {/* SECCIÓN NUESTROS CIMIENTOS */}
      <section className={styles.cimientosSection} id="nuestra-historia">
        <div className={styles.subtag}>Nuestros Cimientos</div>
        <h2 className={styles.sectionTitle}>Tradición y Compromiso</h2>

        <div className={styles.cardsGrid}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconContainer}>◎</div>
              <h3 className={styles.cardTitle}>Misión</h3>
            </div>
            <p className={styles.cardText}>
              Ofrecer productos de excelente calidad, brindando a nuestros
              clientes una experiencia deliciosa y un servicio confiable.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconContainer}>👁</div>
              <h3 className={styles.cardTitle}>Visión</h3>
            </div>
            <p className={styles.cardText}>
              Ser reconocidos por nuestro sabor, calidad y excelente atención,
              creciendo junto a nuestros clientes para llevar la arepa a nuevos
              horizontes.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN PETICIONES, QUEJAS Y RECLAMOS (PQRS) */}
      <section className={styles.pqrSection} id="pqr">
        <div className={styles.pqrContainer}>
          {/* LADO IZQUIERDO: INFORMACIÓN */}
          <div className={styles.pqrInfo}>
            <div className={styles.pqrTag}>Peticiones, Quejas y Reclamos</div>
            <h2 className={styles.pqrTitle}>Contáctanos</h2>
            <p className={styles.pqrDesc}>
              Comunícate con nosotros para realizar tus pedidos, cotizar eventos especiales o hacer cualquier queja o reclamo que tengas con cualquiera de nuestros productos.
            </p>

            <div className={styles.contactoItem}>
              <div className={styles.contactoIcono}>📞</div>
              <div>
                <p className={styles.contactoLabel}>Llámanos o escríbenos</p>
                <p className={styles.contactoValor}>+57 312 456 7890</p>
              </div>
            </div>

            <div className={styles.contactoItem}>
              <div className={styles.contactoIcono}>📍</div>
              <div>
                <p className={styles.contactoLabel}>Dirección Principal</p>
                <p className={styles.contactoValor}>Calle 45 # 12 - 34, Soacha, Cundinamarca</p>
              </div>
            </div>
          </div>

          {/* LADO DERECHO: FORMULARIO */}
          <div className={styles.pqrCard}>
            <h3 className={styles.formTitle}>Envíanos un mensaje</h3>

            {enviado && (
              <div style={{ padding: "10px", background: "#dcfce7", color: "#16a34a", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.85rem" }}>
                ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
              </div>
            )}

            {error && (
              <div style={{ padding: "10px", background: "#fee2e2", color: "#dc2626", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.85rem" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.pqrForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nombre Completo</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Escribe tu nombre..."
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Correo Electrónico o Celular</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Escribe tu correo o número..."
                  value={contacto}
                  onChange={(e) => setContacto(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>¿Cómo podemos ayudarte?</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Escribe tu consulta o pedido aquí..."
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className={styles.btnContactar}
                disabled={cargando}
              >
                {cargando ? "Enviando..." : "Contactar"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}