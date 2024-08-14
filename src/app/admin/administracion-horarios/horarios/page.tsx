"use client"

import Tabla from '@/components/tabla';
import TituloPagina from '@/components/titulo-pagina';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface Periodo {
  id: number;
  nombre: string;
}

interface Horario {
  id: number;
  inicio: string;
  fin: string;
  dia: string;
  periodo: Periodo;
  periodoId: Periodo;
}

const columnas = [
  { uid: "inicio", name: "Inicio", sortable: true },
  { uid: "fin", name: "Fin", sortable: true },
  { uid: "dia", name: "Dia", sortable: true },
  { uid: "periodo.nombre", name: "Periodo", sortable: true },
  { uid: "actions", name: "Acciones", sortable: true },
]

const horarios = () => {
  const { data: session } = useSession();
  const [horario, setHorario] = useState<Horario[]>([]);
  const router = useRouter();

  const obtenerHorarios = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/horarios`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        }
      );
      setHorario(response.data);
    } catch (error) {
      console.error('Error al obtener carreras:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      obtenerHorarios();
    }
  }, [session]);

  const handleAñadir = () => {
    router.push('/admin/administracion-horarios/horarios/horarios-form');
  };

  const handleEdit = (row: Horario) => {
    router.push(`/admin/administracion-horarios/horarios/horarios-form?id=${row.id}`);
  };

  const eliminarHorario = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/horarios/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        }
      );
      obtenerHorarios();
    } catch (error) {
      console.error("Error al eliminar el título:", error);
    }
  };

  const handleEliminar = (row: Horario) => {
    eliminarHorario(row.id);
  };

  return (
    <section className=''>
      <TituloPagina title="Horarios" />
      <Tabla
        columns={columnas}
        data={horario}
        onEdit={handleEdit}
        onDelete={handleEliminar}
        onAddNew={handleAñadir}
      />
    </section>
  )
}

export default horarios