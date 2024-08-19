"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import TablaConFiltros from '@/components/tabla-filtros';
import TituloPagina from '@/components/titulo-pagina';

interface Aula {
  id: number;
  nombre: string;
}

interface Docente {
  cedula: string;
  docente: string;
}

interface Detalle_Materia {
  id: number;
  materia: Materia;
}

interface Materia {
  id: number;
  nombre: string;
}

interface Periodo {
  id: number;
  nombre: string;
}

interface Detalle_Horario {
  id: number;
  inicio: string;
  fin: string;
  dia: string;
  aula: Aula;
  materia: Detalle_Materia;
  docente: Docente;
  periodo: Periodo;
}

const columnas = [
  { uid: "aula.nombre", name: "Aula", sortable: true, filterable: true },
  { uid: "inicio", name: "Inicio", sortable: true, filterable: true },
  { uid: "fin", name: "Fin", sortable: true, filterable: true },
  { uid: "dia", name: "Día", sortable: true, filterable: true },
  { uid: "materia.materia.nombre", name: "Materia", sortable: true, filterable: true },
  { uid: "docente.docente", name: "Docente", sortable: true, filterable: true },
  { uid: "periodo.nombre", name: "Período", sortable: true, filterable: true }
];


const Consultas = () => {
  const { data: session } = useSession();
  const [detalle_horario, setDetalleHorario] = useState<Detalle_Horario[]>([]);
  const router = useRouter();

  const obtenerDetalleHorario = async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-horarios/buscarA`, { nombre }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        }
      });
      setDetalleHorario(response.data);
    } catch (error) {
      console.error('Error al obtener:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      obtenerDetalleHorario("");
    }
  }, [session]);

  const handleAñadir = () => {
  };

  const handleEditar = (row: Detalle_Horario) => {
  };

  const eliminarDetalle = async (id: number) => {
  };

  const handleEliminar = (row: Detalle_Horario) => {
    eliminarDetalle(row.id);
  };

  return (
    <section className=''>
      <TituloPagina title="Consultas" />
      <TablaConFiltros
        columns={columnas}
        data={detalle_horario}
        onEdit={handleEditar}
        onDelete={handleEliminar}
        onAddNew={handleAñadir}
      />
    </section>
  );
};

export default Consultas;
