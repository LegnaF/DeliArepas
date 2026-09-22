"use client";

import { useState } from 'react';
import styles from '../styles/auth.module.css';

interface RegisterFormProps {
  onSwitchVista: (vista: 'login' | 'forgot' | 'reset' | 'register') => void;
}

export default function RegisterForm({ onSwitchVista }: RegisterFormProps) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('USUARIO');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, rol }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        throw new Error(data.error || 'Ocurrió un error al registrarse en el servidor.');
      }

      setSuccess('¡Cuenta creada con éxito! Redirigiendo al login...');
      setTimeout(() => {
        onSwitchVista('login');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && (
        <div style={{ padding: '10px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ padding: '10px', background: '#dcfce7', color: '#166534', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem' }}>
          {success}
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label}>Nombre completo</label>
        <input 
          type="text" 
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
          className={styles.input}
          required 
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Correo electrónico</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          className={styles.input}
          required 
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Contraseña</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={styles.input}
          required 
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Tipo de cuenta (Rol)</label>
        <select 
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          className={styles.input}
          required
        >
          <option value="USUARIO">Cliente (Usuario)</option>
          <option value="EMPLEADO">Empleado</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>

      <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
        ¿Ya tienes una cuenta?{' '}
        <button 
          type="button" 
          onClick={() => onSwitchVista('login')} 
          style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Inicia sesión aquí
        </button>
      </div>
    </form>
  );
}