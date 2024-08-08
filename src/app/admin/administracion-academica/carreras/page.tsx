"use client";

import React, { useEffect } from 'react'
import axios from 'axios'
import TitlePage from '@/components/title-page'

const Carreras = () => {
/*
  const obtenerCarreras = async () => {
    const response = await axios.get('http://localhost:3040/api/v2/carreras')
    console.log(response)
  }

  useEffect(() => {
    obtenerCarreras()
  }, [])
*/
  return (
    <section className='contenedorPrincipalPaginas'>
      <TitlePage title="Carreras" />
    </section>
  )
}

export default Carreras
