"use client";

import DynamicTable from '@/components/DynamicTable';
import TitlePage from '@/components/title-page';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface Paralelos {
  id: number;
  nombre: string;
}

const columnas = [
  { uid: "nombre", name: "Nombre", sortable: true },
  { uid: "actions", name: "Acciones" }
]

const Paralelos = () => {
  const { data: session } = useSession();
  const [paralelos, setParalelos] = useState<Paralelos[]>([]);
  const router = useRouter();

  const obtenerParalelos = async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/paralelos/buscar`, { nombre },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        });
      setParalelos(response.data);
    } catch (error) {
      console.error('Error al obtener carreras:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      obtenerParalelos();
    }
  }, [session]);

  const handleAñadir = () => {
    router.push('/admin/administracion-academica/paralelos/paralelos-form');
  };

  const handleEditar = (row: Paralelos) => {
    router.push(`/admin/administracion-academica/paralelos/paralelos-form?id=${row.id}`);
  };

  const eliminarParalelos = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/paralelos/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        }
      );
      obtenerParalelos("")
    } catch (error) {
      console.error("Error al eliminar el título:", error);
    }
  };

  const handleEliminar = (row: Paralelos) => {
    eliminarParalelos(row.id);
  };

  return (
    <section className=''>
      <TitlePage title="Paralelos" />
      <DynamicTable
        columns={columnas}
        data={paralelos}
        onEdit={handleEditar}
        onDelete={handleEliminar}
        onAddNew={handleAñadir}
      />
    </section>
  )
}

export default Paralelos