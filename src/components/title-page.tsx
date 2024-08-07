"use client";

import React from 'react'
import '@/styles/title-page.scss';

interface TitlePageProps {
  title: string;
}

const TitlePage: React.FC<TitlePageProps> = ({ title }) => {
  return (
    <div className='contenedorTituloPagina'>
        <h1 className='tituloPagina'>{title}</h1>
    </div>
  )
}

export default TitlePage
