"use client"

import Tabla from '@/components/tabla';
import TituloPagina from '@/components/titulo-pagina';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface Edificio {
  id: number;
  nombre: string;
}

interface Piso {
  id: number;
  nombre: string;
  edificio: Edificio;
}

const columnas = [
  { uid: "nombre", name: "Piso", sortable: true },
  { uid: "edificio.nombre", name: "Edificio", sortable: true },
  { uid: "actions", name: "Acciones" },
];

const pisos = () => {
  const { data: session } = useSession();
  const [piso, setPiso] = useState<Piso[]>([]);
  const router = useRouter();

  const obtenerPisos = async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pisos/buscarP`, { nombre }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      setPiso(response.data);
    } catch (error) {
      console.error('Error al obtener pisos:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      obtenerPisos("");
    }
  }, [session]);

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

export default pisos