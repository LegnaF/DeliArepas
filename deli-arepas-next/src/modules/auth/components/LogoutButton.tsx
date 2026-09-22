"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      // Llamada a la API para destruir la cookie de sesión
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        // Redirigir al usuario al login tras cerrar sesión
        router.push('/login');
        router.refresh();
      } else {
        throw new Error('No se pudo cerrar sesión');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
        border: '1px solid #fecaca',
        padding: '10px 16px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#fecaca';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '#fee2e2';
      }}
    >
      {/* Icono SVG de salida */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
      {loading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
    </button>
  );
}