"use client"

import Tabla from '@/components/tabla';
import TituloPagina from '@/components/titulo-pagina';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface Aula {
  id: number;
  nombre: string;
}

interface Maquina {
  id: number;
  nombre: string;
  aulaId: Aula;
  aula: Aula;
}

const columnas = [
  { uid: "nombre", name: "Nombre", sortable: true },
  { uid: "aula.nombre", name: "Aula", sortable: true },
  { uid: "actions", name: "Acciones", sortable: true },
];

const maquinas = () => {
  const { data: session } = useSession();
  const [maquina, setMaquina] = useState<Maquina[]>([]);
  const router = useRouter();

  const obtenerMaquinas = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maquinas`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
      setMaquina(response.data);
    } catch (error) {
      console.error('Error al obtener maquinas:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      obtenerMaquinas();
    }
  }, [session]);

  const handleAñadir = () => {
    router.push('/admin/gestion-equipos/maquinas/maquinas-form');
  };

  const handleEdit = (row: Maquina) => {
    router.push(`/admin/gestion-equipos/maquinas/maquinas-form?id=${row.id}`);
  }

  const eliminarMaquina = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maquinas/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        }
      );
      obtenerMaquinas();
    } catch (error) {
      console.error("Error al eliminar el título:", error);
    }
  };

  const handleEliminar = (row: Maquina) => {
    eliminarMaquina(row.id)
  }
  return (
    <section className=''>
      <TituloPagina title="Maquinas" />
      <Tabla
        columns={columnas}
        data={maquina}
        onEdit={handleEdit}
        onDelete={handleEliminar}
        onAddNew={handleAñadir}
      />
    </section>
  )
}

export default maquinas