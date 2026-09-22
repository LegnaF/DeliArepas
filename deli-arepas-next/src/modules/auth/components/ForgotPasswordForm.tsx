'use client'

import { useState } from 'react'
import styles from '../styles/auth.module.css'

interface Props {
  onSwitchVista: (vista: 'login' | 'reset', email?: string) => void
}

export default function ForgotPasswordForm({ onSwitchVista }: Props) {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMensaje('')
    setCargando(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al solicitar código')
      } else {
        setMensaje('Código de verificación enviado.')
        setTimeout(() => {
          onSwitchVista('reset', email)
        }, 1000)
      }
    } catch {
      setError('Error de conexión.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      {error && <div className={styles.alertError}>{error}</div>}
      {mensaje && <div className={styles.alertSuccess}>{mensaje}</div>}

      <form onSubmit={handleForgot} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Tu Correo Registrado</label>
          <input
          type="email"
          required
          autoComplete="off"
          placeholder="correo@ejemplo.com"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        </div>

        <button type="submit" disabled={cargando} className={styles.submitBtn}>
          {cargando ? 'Enviando...' : 'Enviar Código'}
        </button>
      </form>

      <button
        type="button"
        className={styles.linkBtn}
        onClick={() => onSwitchVista('login')}
      >
        ← Volver al Login
      </button>
    </>
  )
}