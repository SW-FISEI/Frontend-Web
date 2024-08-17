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

interface Aula {
  id: number;
  nombre: string;
  cantidad_pc: number;
  capacidad: number;
  proyector: string;
  aire: string;
  descripcion: string;
  piso: Piso;
}

const columnas = [
  { uid: "nombre", name: "Aula", sortable: true },
  { uid: "cantidad_pc", name: "Cantidad PC", sortable: true },
  { uid: "capacidad", name: "Capacidad", sortable: true },
  { uid: "proyector", name: "Proyector", sortable: true },
  { uid: "aire", name: "Aire", sortable: true },
  { uid: "descripcion", name: "Descripcion", sortable: true },
  { uid: "piso.nombre", name: "Piso", sortable: true },
  { uid: "piso.edificio.nombre", name: "Edificio", sortable: true },
  { uid: "actions", name: "Acciones" },
];

const aulas = () => {
  const { data: session } = useSession();
  const [aula, setAula] = useState<Aula[]>([]);
  const router = useRouter();

  const obtenerAula = async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/aulas/buscar`, { nombre }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        }
      });
      setAula(response.data);
    } catch (error) {
      console.error('Error al obtener pisos:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      obtenerAula("");
    }
  }, [session]);

  const handleAñadir = () => {
    router.push('/admin/infraestructura/aulas/aulas-form');
  }

  const handleEditar = (row: Aula) => {
    router.push(`/admin/infraestructura/aulas/aulas-form?id=${row.id}`);
  }

  const eliminarAula = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/aulas/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        }
      });
      obtenerAula("");
    } catch (error) {
      console.error("Error al eliminar el título:", error);
    }
  };

  const handleEliminar = (row: Aula) => {
    eliminarAula(row.id);
  }
  return (
    <section className=''>
      <TituloPagina title="Aulas" />
      <Tabla
        columns={columnas}
        data={aula}
        onEdit={handleEditar}
        onDelete={handleEliminar}
        onAddNew={handleAñadir}
      />
    </section>
  )
}

export default aulas