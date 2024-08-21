"use client";

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import TituloPagina from '@/components/titulo-pagina';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Tabla from '@/components/tabla';
import '@/styles/carreras.scss';

interface Carrera {
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

const Carreras = () => {
  const { data: session } = useSession();
  const [data, setData] = useState<Carrera[]>([]);
  const router = useRouter();

  const obtenerCarreras = useCallback(async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/carreras/buscar`, { nombre }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error al obtener carreras:', error);
    }
  }, [session?.user?.token]);

  useEffect(() => {
    if (session?.user?.token) {
      obtenerCarreras();
    }
  }, [session?.user?.token, obtenerCarreras]);

  const handleAdd = () => {
    router.push('/admin/administracion-academica/carreras/carreras-form');
  };

  const handleEdit = (row: Carrera) => {
    router.push(`/admin/administracion-academica/carreras/carreras-form?id=${row.id}`);
  };

  const eliminarCarrera = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/carreras/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      obtenerCarreras("")
    } catch (error) {
      console.error("Error al eliminar el título:", error);
    }
  }

  const handleDelete = (row: Carrera) => {
    eliminarCarrera(row.id);
  };

  return (
    <section className=''>
      <TituloPagina title="Carreras" />
      <Tabla
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAdd}
      />
    </section>
  );
}

export default Carreras;
