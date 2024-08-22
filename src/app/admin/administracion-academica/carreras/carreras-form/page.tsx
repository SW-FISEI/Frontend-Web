"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import TituloPagina from '@/components/titulo-pagina';
import '@/styles/formulario.scss';
import { Input, Button } from "@nextui-org/react";
import { useSession } from 'next-auth/react';

interface Carrera {
  id?: number;
  nombre: string;
  descripcion: string;
}

const CarrerasForm = () => {
  const { data: session } = useSession();
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
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/carreras/${id}`,{
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.token}`,
            },
          });
          setFormData(response.data);
        } catch (error) {
          console.error('Error al obtener la carrera:', error);
        }
      };
      obtenerCarrera();
    }
  }, [id, isEditMode, session?.user?.token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Actualizar carrera existente
        const carreraDatos = {
          nombre: formData.nombre,
          descripcion: formData.descripcion
        }
        await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/carreras/${id}`, carreraDatos, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        });
      } else {
        // Crear nueva carrera
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/carreras`, formData,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        });
      }
      router.push('/admin/administracion-academica/carreras');
    } catch (error) {
      console.error('Error al guardar la carrera:', error);
    }
  };


  const handleCancel = () => {
    router.back(); // Navegar hacia atrás en el historial
  };

  return (
    <section className=''>
      <TituloPagina title="Carreras" subtitle={isEditMode ? 'Editar carrera' : 'Agregar carrera'} />
      <div className="contenedorFormulario">
        <form onSubmit={handleSubmit}>
          <div>
            <Input 
              variant="faded" 
              type="text" 
              label="Nombre" 
              name="nombre"  // Agrega el nombre al input
              value={formData.nombre}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div>
            <Input 
              variant="faded" 
              type="text" 
              label="Descripción" 
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="botonFormulario">
            <Button color="secondary" onPress={handleCancel}>Cancelar</Button>
            <Button color="primary" type="submit">
              {isEditMode ? 'Actualizar' : 'Agregar'}
            </Button>
            
          </div>
        </form>
      </div>
    </section>
  );
};

export default CarrerasForm;
