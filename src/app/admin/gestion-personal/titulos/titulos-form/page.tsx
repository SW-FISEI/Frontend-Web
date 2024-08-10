"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import TitlePage from '@/components/title-page';
import '@/styles/formulario.scss';
import { Input, Button } from "@nextui-org/react";
import { useSession } from 'next-auth/react';

interface Titulo {
  id?: number;
  nombre: string;
  abreviacion: string;
}

const TitulosForm = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [titulos, setTitulo] = useState<Titulo>({ nombre: '', abreviacion: '' });
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      const obtenerTitulo = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/titulos/${id}`,{
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.token}`,
            },
          });
          setTitulo(response.data);
        } catch (error) {
          console.error('Error al obtener el titulo:', error);
        }
      };
      obtenerTitulo();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTitulo({ ...titulos, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        const tituloDatos = {
          nombre: titulos.nombre,
          abreviacion: titulos.abreviacion
        }
        await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/titulos/${id}`, tituloDatos, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        });
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/titulos`, titulos,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        });
      }
      router.push('/admin/gestion-personal/titulos');
    } catch (error) {
      console.error('Error al guardar el titulo:', error);
    }
  };


  const handleCancel = () => {
    router.back();
  };

  return (
    <section className=''>
      <TitlePage title="Titulos" subtitle={isEditMode ? 'Editar Titulo' : 'Agregar Titulo'} />
      <div className="contenedorFormulario">
        <form onSubmit={handleSubmit}>
          <div>
            <Input 
              variant="faded" 
              type="text" 
              label="Nombre" 
              name="nombre"
              value={titulos.nombre}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div>
            <Input 
              variant="faded" 
              type="text" 
              label="Abreviacion" 
              name="abreviacion"
              value={titulos.abreviacion}
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

export default TitulosForm;
