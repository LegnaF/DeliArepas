'use client'

import { useState } from 'react'
import Link from 'next/link'
import LoginForm from '@/modules/auth/components/LoginForm'
import ForgotPasswordForm from '@/modules/auth/components/ForgotPasswordForm'
import ResetPasswordForm from '@/modules/auth/components/ResetPasswordForm'
import RegisterForm from '@/modules/auth/components/RegisterForm'
import styles from '@/modules/auth/styles/auth.module.css'

type VistaType = 'login' | 'forgot' | 'reset' | 'register'

export default function LoginPage() {
  const [vista, setVista] = useState<VistaType>('login')
  const [savedEmail, setSavedEmail] = useState('')

  const handleSwitchVista = (nextVista: VistaType, email?: string) => {
    if (email) setSavedEmail(email)
    setVista(nextVista)
  }

  return (
    <div className={styles.splitContainer}>
      {/* LADO IZQUIERDO: BANNER PUBLICITARIO */}
      <div 
        className={styles.brandSide}
        style={{ backgroundImage: "url('/inicio.jpg')" }}
      >
        <div className={styles.brandOverlay} />
        <div className={styles.brandContent}>
          <div className={styles.badgeSabor}>Sabor 100% Auténtico</div>

          <div className={styles.bannerFooter}>
            <h1 className={styles.bannerTitle}>
              Las arepas más <br />
              calientitas y sabrosas.
            </h1>
            <p className={styles.bannerText}>
              Inicia sesión para pedir tu arepa favorita directo a casa en minutos.
              Acumula puntos Deli, obtén envíos gratis y consiéntete con el
              auténtico sabor latino.
            </p>
          </div>
        </div>
      </div>

      {/* LADO DERECHO: VISTAS Y FORMULARIOS */}
      <div className={styles.formSide}>
        {/* NAVEGACIÓN SUPERIOR */}
        <header className={styles.loginNav}>
          <div className={styles.loginBrand}>
            <img 
              src="/logo.jpg" 
              alt="Deli Arepas Logo" 
              className={styles.loginBrandLogo} 
            />
            <span>Deliarepas JD</span>
          </div>
          <Link href="/" className={styles.btnVolverInicio}>
            Volver al inicio →
          </Link>
        </header>

        {/* TARJETA DINÁMICA DE FORMULARIOS */}
        <div className={styles.card}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              {vista === 'login' && 'Iniciar Sesión'}
              {vista === 'forgot' && 'Recuperar Contraseña'}
              {vista === 'reset' && 'Restablecer Contraseña'}
              {vista === 'register' && 'Crear Cuenta'}
            </h2>
            <p className={styles.subtitle}>
              {vista === 'login' && '¡Qué bueno verte de nuevo! Ingresa tus credenciales para disfrutar de tus arepas favoritas.'}
              {vista === 'forgot' && 'Ingresa tu correo registrado para enviarte un enlace de recuperación.'}
              {vista === 'reset' && 'Crea una contraseña segura para tu cuenta.'}
              {vista === 'register' && 'Regístrate para realizar tus pedidos de forma rápida y sencilla.'}
            </p>
          </div>

          {vista === 'login' && <LoginForm onSwitchVista={handleSwitchVista} />}
          {vista === 'forgot' && <ForgotPasswordForm onSwitchVista={handleSwitchVista} />}
          {vista === 'reset' && <ResetPasswordForm initialEmail={savedEmail} onSwitchVista={handleSwitchVista} />}
          {vista === 'register' && <RegisterForm onSwitchVista={handleSwitchVista} />}
        </div>

        {/* PIE DE PÁGINA DE LA SECCIÓN */}
        <footer className={styles.footerCopy}>
          © 2026 Deliarepas JD. Todos los derechos reservados. Hecho con sabor de nuestra tierra.
        </footer>
      </div>
    </div>
  )
}