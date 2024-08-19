"use client";

import TituloPagina from '@/components/titulo-pagina';
import Tabla from '@/components/tabla';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Laboratorista {
  cedula: number;
  laboratorista: string;
  titulo: Titulo;
  edificio: Edificio;
}

interface Titulo {
  id: number;
  nombre: string;
  abreviacion: string;
}

interface Edificio {
  id: number;
  nombre: string;
}

const columnas = [
  { uid: "cedula", name: "Cédula", sortable: true },
  { uid: "titulo.nombre", name: "Título", sortable: true },
  { uid: "laboratorista", name: "Nombre", sortable: true },
  { uid: "edificio.nombre", name: "Edificio", sortable: true },
  { uid: "actions", name: "Acciones" }
];

const Laboratoristas = () => {
  const { data: session } = useSession();
  const [laboratoristas, setLaboratoristas] = useState<Laboratorista[]>([]);
  const router = useRouter();

  const obtenerLaboratoristas = async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/laboratoristas/buscar`, { nombre },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        }
      );
      setLaboratoristas(response.data);
    } catch (error) {
      console.error('Error al obtener laboratoristas:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      obtenerLaboratoristas();
    }
  }, [session]);

  const handleAñadir = () => {
    router.push('/admin/gestion-personal/laboratoristas/laboratoristas-form');
  };

  const handleEdit = (row: Laboratorista) => {
    router.push(`/admin/gestion-personal/laboratoristas/laboratoristas-form?cedula=${row.cedula}`);
  };
  
  const handleEliminar = (row: Laboratorista) => {
    eliminarLaboratorista(row.cedula);
  };

  const eliminarLaboratorista = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/laboratoristas/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        }
      );
      obtenerLaboratoristas();
    } catch (error) {
      console.error("Error al eliminar el laboratorista:", error);
    }
  };

  // Mapeo para agregar 'id' como alias de 'cedula' y concatenar abreviación del título con el nombre del laboratorista
  const laboratoristasConId = laboratoristas.map(laboratorista => ({
    ...laboratorista,
    id: laboratorista.cedula,
    laboratorista: `${laboratorista.laboratorista}` // Concatenación de abreviación y nombre
  }));

  return (
    <section className=''>
      <TituloPagina title="Laboratoristas" />
      <Tabla
        columns={columnas}
        data={laboratoristasConId}
        onEdit={handleEdit}
        onDelete={handleEliminar}
        onAddNew={handleAñadir}
      />
    </section>
  );
}

export default Laboratoristas;
