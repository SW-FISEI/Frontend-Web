"use client";

import React from 'react';
import '@/styles/titulo-pagina.scss';

interface TituloPaginaProps {
  title: string;
  subtitle?: string; // El subtítulo es opcional
}

const TituloPagina: React.FC<TituloPaginaProps> = ({ title, subtitle }) => {
  return (
    <div className='contenedorTituloPagina'>
        <h1 className='tituloPagina'>{title}</h1>
        {subtitle && <h2 className='subtituloPagina'>{subtitle}</h2>} {/* Renderiza el subtítulo solo si existe */}
    </div>
  )
}

export default TituloPagina;
