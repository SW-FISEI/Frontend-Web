"use client";

import Tabla from '@/components/tabla';
import TituloPagina from '@/components/titulo-pagina';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface Software {
  id: number;
  nombre: string;
  version: string;
  descripcion: string;
}

const columnas = [
  { uid: "nombre", name: "Nombre", sortable: true },
  { uid: "version", name: "Versión", sortable: true },
  { uid: "descripcion", name: "Descripción", sortable: true },
  { uid: "actions", name: "Acciones" }
];

const Software = () => {
  const { data: session } = useSession();
  const [software, setSoftware] = useState<Software[]>([]);
  const router = useRouter();

  const obtenerSoftwares = async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/softwares/buscar`, { nombre },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        });
      setSoftware(response.data);
    } catch (error) {
      console.error('Error al obtener carreras:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      obtenerSoftwares();
    }
  }, [session]);

  const handleAñadir = () => {
    router.push('/admin/gestion-equipos/software/software-form');
  };

  const handleEdit = (row: Software) => {
    router.push(`/admin/gestion-equipos/software/software-form?id=${row.id}`);
  };

  const eliminarSoftware = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/softwares/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        }
      );
      obtenerSoftwares("");
    } catch (error) {
      console.error("Error al eliminar el título:", error);
    }
  };

  const handleEliminar = (row: Software) => {
    eliminarSoftware(row.id);
  };

  return (
    <section className=''>
      <TituloPagina title="Softwares" />
      <Tabla
        columns={columnas}
        data={software}
        onEdit={handleEdit}
        onDelete={handleEliminar}
        onAddNew={handleAñadir}
      />
    </section>
  );
}

export default Software;