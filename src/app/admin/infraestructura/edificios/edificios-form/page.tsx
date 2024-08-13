"use client";

import TitlePage from '@/components/title-page';
import { Button, Input } from '@nextui-org/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import '@/styles/formulario.scss';

interface Edificios {
  id?: number;
  nombre: string;
}


const edificiosForm = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [formData, setFormData] = useState<Edificios>({ nombre: '' });
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      // Cargar los datos de la carrera si estamos en modo edición
      const obtenerEdificios = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/edificios/${id}`, {
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
      obtenerEdificios();
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
        const datosEdificios = {
          nombre: formData.nombre
        }
        await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/edificios/${id}`, datosEdificios, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        });
      } else {
        // Crear nueva carrera
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/edificios`, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        });
      }
      router.push('/admin/infraestructura/edificios');
    } catch (error) {
      console.error('Error al guardar el edificio:', error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <section className=''>
      <TitlePage title="Edificios" subtitle={isEditMode ? 'Editar edificio' : 'Agregar edificio'} />
      <div className="contenedorFormulario">
        <form onSubmit={handleSubmit}>
        <div>
            <Input 
              variant="faded" 
              type="text" 
              label="Nombre" 
              name="nombre"
              value={formData.nombre}
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
  )
}

export default edificiosForm