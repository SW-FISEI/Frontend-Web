"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Importa useSearchParams
import axios from 'axios';

interface Carrera {
  id?: number;
  nombre: string;
  descripcion: string;
}

const CarrerasForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [formData, setFormData] = useState<Carrera>({ nombre: '', descripcion: '' });
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      // Cargar los datos de la carrera si estamos en modo edición
      const obtenerCarrera = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/carreras/${id}`);
          setFormData(response.data);
        } catch (error) {
          console.error('Error al obtener la carrera:', error);
        }
      };
      obtenerCarrera();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Actualizar carrera existente
        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/carreras/${id}`, formData);
      } else {
        // Crear nueva carrera
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/carreras`, formData);
      }
      router.push('/admin/administracion-academica/carreras');
    } catch (error) {
      console.error('Error al guardar la carrera:', error);
    }
  };

  return (
    <section className='contenedorPrincipalPaginas'>
      <h1>{isEditMode ? 'Editar Carrera' : 'Agregar Carrera'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Descripción</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">{isEditMode ? 'Actualizar' : 'Agregar'}</button>
      </form>
    </section>
  );
};

export default CarrerasForm;
