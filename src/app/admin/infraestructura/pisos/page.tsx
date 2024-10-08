"use client"

import Tabla from '@/components/tabla';
import TituloPagina from '@/components/titulo-pagina';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'

interface Piso {
  id: number;
  nombre: string;
}

const columnas = [
  { uid: "nombre", name: "Piso", sortable: true },
  { uid: "actions", name: "Acciones" },
];

const Pisos = () => {
  const { data: session } = useSession();
  const [piso, setPiso] = useState<Piso[]>([]);
  const router = useRouter();

  const obtenerPisos = useCallback(async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pisos/buscar`, { nombre }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      setPiso(response.data);
    } catch (error) {
      console.error('Error al obtener pisos:', error);
    }
  }, [session?.user?.token]);

  useEffect(() => {
    if (session?.user?.token) {
      obtenerPisos("");
    }
  }, [session?.user?.token, obtenerPisos]);

  const handleAñadir = () => {
    router.push('/admin/infraestructura/pisos/pisos-form');
  }

  const handleEditar = (row: Piso) => {
    router.push(`/admin/infraestructura/pisos/pisos-form?id=${row.id}`);
  }

  const eliminarPiso = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pisos/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        }
      );
      obtenerPisos("");
    } catch (error) {
      console.error("Error al eliminar el título:", error);
    }
  };

  const handleEliminar = (row: Piso) => {
    eliminarPiso(row.id);
  };

  return (
    <section className=''>
      <TituloPagina title="Pisos" />
      <Tabla
        columns={columnas}
        data={piso}
        onEdit={handleEditar}
        onDelete={handleEliminar}
        onAddNew={handleAñadir}
      />
    </section>
  )
}

export default Pisos