"use client"

import Tabla from '@/components/tabla';
import TituloPagina from '@/components/titulo-pagina';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import TablaConFiltros from '@/components/tabla-filtros';

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
  piso: Piso
}

interface Software {
  id: number;
  nombre: string;
  version: string;
  descripcion: string;
}

interface Software_Aulas {
  id: number;
  aula: Aula;
  software: Software;
}

const columnas = [
  { uid: "software.nombre", name: "Software", sortable: true, filterable: true },
  { uid: "software.version", name: "Versión", sortable: true },
  { uid: "aula.nombre", name: "Aula", sortable: true, filterable: true },
  { uid: "aula.piso.nombre", name: "Piso", sortable: true },
  { uid: "aula.piso.edificio.nombre", name: "Edificio", sortable: true },
  { uid: "actions", name: "Acciones" },
]

const gestionEquipos = () => {
  const { data: session } = useSession();
  const [software_aulas, setSoftwareAula] = useState<Software_Aulas[]>([]);
  const router = useRouter();

  const obtenerSoftwareAulas = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/software-aulas`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      setSoftwareAula(response.data);
    } catch (error) {
      console.error('Error al obtener software de aulas:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      obtenerSoftwareAulas();
    }
  }, [session]);

  const handleAñadir = () => {
    router.push('/admin/gestion-equipos/distribucion-software/distribucion-software-form');
  }

  const handleEditar = (row: Software_Aulas) => {
    router.push(`/admin/gestion-equipos/distribucion-software/distribucion-software-form?id=${row.id}`);
  }

  const eliminarPiso = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/software-aulas/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        }
      );
      obtenerSoftwareAulas();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const handleEliminar = (row: Software_Aulas) => {
    eliminarPiso(row.id);
  };

  return (
    <section className=''>
      <TituloPagina title="Distribución de software" />
      <TablaConFiltros
        columns={columnas}
        data={software_aulas}
        onEdit={handleEditar}
        onDelete={handleEliminar}
        onAddNew={handleAñadir}
      />
    </section>
  )
}

export default gestionEquipos