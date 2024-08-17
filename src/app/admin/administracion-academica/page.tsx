"use client"

import Tabla from '@/components/tabla';
import TituloPagina from '@/components/titulo-pagina';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface Carrera {
  id: number;
  nombre: string;
  descripcion: string;
}

interface Semestre {
  id: number;
  nombre: string;
}

interface Materia {
  id: number;
  nombre: string;
  descripcion: string;
}

interface Paralelo {
  id: number;
  nombre: string;
}

interface Detalle_Materia {
  id: number;
  carrera: Carrera;
  semestre: Semestre;
  materia: Materia;
  paralelo: Paralelo;
}

const columnas = [
  { uid: "carrera.nombre", name: "Carrera", sortable: true },
  { uid: "semestre.nombre", name: "Semestre", sortable: true },
  { uid: "materia.nombre", name: "Materia", sortable: true },
  { uid: "paralelo.nombre", name: "Paralelo", sortable: true },
  { uid: "actions", name: "Acciones" },
]

const administracionAcademica = () => {
  const { data: session } = useSession();
  const [detalle_materia, setDetalleMateria] = useState<Detalle_Materia[]>([]);
  const router = useRouter();

  const obtenerDetalleMateria = async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-materias/buscar`, { nombre }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        }
      });
      setDetalleMateria(response.data);
    } catch (error) {
      console.error('Error al obtener pisos:', error);
    }
  }

  useEffect(() => {
    if (session?.user?.token) {
      obtenerDetalleMateria("");
    }
  }, [session]);

  const handleAñadir = () => {
    router.push('/admin/administracion-academica/administracion-academica-form');
  }

  const handleEditar = (row: Detalle_Materia) => {
    router.push(`/admin/administracion-academica/administracion-academica-form?id=${row.id}`)
  }

  const eliminarDetalle = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-materias/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        }
      });
      obtenerDetalleMateria("");
    } catch (error) {
      console.error("Error al eliminar el título:", error);
    }
  };

  const handleEliminar = (row: Detalle_Materia) => {
    eliminarDetalle(row.id);
  }

  return (
    <section className=''>
      <TituloPagina title="Detalle Materias" />
      <Tabla
        columns={columnas}
        data={detalle_materia}
        onEdit={handleEditar}
        onDelete={handleEliminar}
        onAddNew={handleAñadir}
      />
    </section>
  )
}

export default administracionAcademica