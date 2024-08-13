"use client";

import Tabla from '@/components/tabla';
import TituloPagina from '@/components/titulo-pagina';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface Materia {
  id: number;
  nombre: string;
  descripcion: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const columns = [
  { uid: "nombre", name: "Nombre", sortable: true },
  { uid: "descripcion", name: "Descripción", sortable: true },
  { uid: "actions", name: "Actions" }
];

const materias = () => {
  const { data: session } = useSession();
  const [data, setData] = useState<Materia[]>([]);
  const router = useRouter();

  const obtenerMaterias = async (nombre:string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/materias/buscar`,{nombre}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error al obtener materias:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      obtenerMaterias();
    }
  }, [session]);

  const handleAdd = () => {
    router.push('/admin/administracion-academica/materias/materias-form');
  };

  const handleEdit = (row: Materia) => {
    router.push(`/admin/administracion-academica/materias/materias-form?id=${row.id}`);
  };

  const eliminarCarrera = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/materias/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      obtenerMaterias("")
    } catch (error) {
      console.error("Error al eliminar el título:", error);
    }
  }

  const handleDelete = (row: Materia) => {
    eliminarCarrera(row.id);
  };

  return (
    <section className=''>
      <TituloPagina title="Materias" />
      <Tabla
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAdd}
      />
    </section>
  )
}

export default materias