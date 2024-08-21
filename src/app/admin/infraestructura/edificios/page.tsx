"use client";

import Tabla from '@/components/tabla';
import TituloPagina from '@/components/titulo-pagina';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Cambiado a next/navigation
import React, { useCallback, useEffect, useState } from 'react'

interface Edificio {
  id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const columns = [
  { uid: "nombre", name: "Nombre", sortable: true },
  { uid: "actions", name: "Actions" }
];

const Edificios = () => {
  const { data: session } = useSession();
  const [data, setData] = useState<Edificio[]>([]);
  const router = useRouter(); // Cambiado a la versión de next/navigation

  const obtenerEdificios = useCallback(async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/edificios/buscar`, { nombre }, {
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
      obtenerEdificios();
    }
  }, [session?.user?.token, obtenerEdificios]);

  const handleAdd = () => {
    router.push('/admin/infraestructura/edificios/edificios-form');
  };

  const handleEdit = (row: Edificio) => {
    router.push(`/admin/infraestructura/edificios/edificios-form?id=${row.id}`);
  };

  const eliminarEdificio = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/edificios/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        }
      });
      obtenerEdificios("")
    } catch (error) {
      console.error("Error al eliminar el título:", error);
    }
  }

  const handleDelete = (row: Edificio) => {
    eliminarEdificio(row.id);
  };

  return (
    <section className=''>
      <TituloPagina title="Edificios" />
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

export default Edificios;
