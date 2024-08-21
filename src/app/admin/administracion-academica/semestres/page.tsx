"use client";

import Tabla from '@/components/tabla';
import TituloPagina from '@/components/titulo-pagina';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

interface Semestre {
  id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const columns = [
  { uid: "nombre", name: "Nombre", sortable: true },
  { uid: "actions", name: "Acciones" }
];

const Semestres = () => {
  const { data: session } = useSession();
  const [data, setData] = useState<Semestre[]>([]);
  const router = useRouter();

  const obtenerSemestres = useCallback(async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/semestres/buscar`, { nombre }, {
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
      obtenerSemestres();
    }
  }, [session?.user?.token, obtenerSemestres]);

  const handleAdd = () => {
    router.push('/admin/administracion-academica/semestres/semestres-form');
  };

  const handleEdit = (row: Semestre) => {
    router.push(`/admin/administracion-academica/semestres/semestres-form?id=${row.id}`);
  };

  const handleDelete = (row: Semestre) => {
    eliminarCarrera(row.id);
  };

  const eliminarCarrera = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/semestres/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      obtenerSemestres("")
    } catch (error) {
      console.error("Error al eliminar el título:", error);
    }
  }

  return (
    <section className=''>
      <TituloPagina title="Semestres" />
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

export default Semestres