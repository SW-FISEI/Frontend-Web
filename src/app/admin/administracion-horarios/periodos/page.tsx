"use client";

import Tabla from '@/components/tabla';
import TituloPagina from '@/components/titulo-pagina';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface Periodo {
  id: number;
  nombre: string;
  inicioMes: string;
  inicioAño: string;
  finMes: string;
  finAño: string;
}

const columnas = [
  { uid: "nombre", name: "Nombre", sortable: true },
  { uid: "inicioMes", name: "Mes de Inicio", sortable: true },
  { uid: "inicioAño", name: "Año de Inicio", sortable: true },
  { uid: "finMes", name: "Mes de Fin", sortable: true },
  { uid: "finAño", name: "Año de Fin", sortable: true },
  { uid: "actions", name: "Acciones" },
];

const periodos = () => {
  const { data: session } = useSession();
  const [periodo, setPeriodo] = useState<Periodo[]>([]);
  const router = useRouter();

  const obtenerPeriodo = async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/periodos/buscar`, { nombre },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      setPeriodo(response.data);
    } catch (error) {
      console.error('Error al obtener carreras:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      obtenerPeriodo("");
    }
  }, [session]);

  const handleAñadir = () => {
    router.push('/admin/administracion-horarios/periodos/periodos-form');
  }

  const handleEditar = (row: Periodo) => {
    router.push(`/admin/administracion-horarios/periodos/periodos-form?id=${row.id}`);
  }

  const eliminarPerido = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/periodos/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      obtenerPeriodo("");
    } catch (error) {
      console.error("Error al eliminar el título:", error);
    }
  };

  const handleEliminar = (row: Periodo) => {
    eliminarPerido(row.id);
  };

  return (
    <section className=''>
      <TituloPagina title="Periodos" />
      <Tabla
        columns={columnas}
        data={periodo}
        onEdit={handleEditar}
        onDelete={handleEliminar}
        onAddNew={handleAñadir}
      />
    </section>
  )
}

export default periodos