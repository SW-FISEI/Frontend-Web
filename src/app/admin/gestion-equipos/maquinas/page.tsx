"use client"

import Tabla from '@/components/tabla';
import TablaConFiltros from '@/components/tabla-filtros';
import TituloPagina from '@/components/titulo-pagina';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'

interface Edificio {
  id: number;
  nombre: string;
}

interface Piso {
  id: number;
  nombre: string;
}

interface DetallePiso {
  id: number;
  piso: Piso;
  edificio: Edificio;
}

interface Aula {
  id: number;
  nombre: string;
  detalle_piso: DetallePiso;
}

interface Maquina {
  id: number;
  nombre: string;
  aulaId: Aula;
  aula: Aula;
}

const columnas = [
  { uid: "nombre", name: "Maquina", sortable: true },
  { uid: "aula.detalle_piso.edificio.nombre", name: "Edificio", sortable: true, filterable: true },
  { uid: "aula.detalle_piso.piso.nombre", name: "Piso", sortable: true, filterable: true },
  { uid: "aula.nombre", name: "Aula", sortable: true, filterable: true },
  { uid: "actions", name: "Acciones", sortable: true },
];

const Maquinas = () => {
  const { data: session } = useSession();
  const [maquina, setMaquina] = useState<Maquina[]>([]);
  const router = useRouter();

  const obtenerMaquinas = useCallback(async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maquinas/buscarM`, { nombre },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
      setMaquina(response.data);
    } catch (error) {
      console.error('Error al obtener maquinas:', error);
    }
  }, [session?.user?.token]);

  useEffect(() => {
    if (session?.user?.token) {
      obtenerMaquinas("");
    }
  }, [session?.user?.token, obtenerMaquinas]);

  const handleAñadir = () => {
    router.push('/admin/gestion-equipos/maquinas/maquinas-form');
  };

  const handleEdit = (row: Maquina) => {
    router.push(`/admin/gestion-equipos/maquinas/maquinas-form?id=${row.id}`);
  }

  const eliminarMaquina = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maquinas/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        }
      );
      obtenerMaquinas();
    } catch (error) {
      console.error("Error al eliminar el título:", error);
    }
  };

  const handleEliminar = (row: Maquina) => {
    eliminarMaquina(row.id)
  }
  return (
    <section className=''>
      <TituloPagina title="Maquinas" />
      <TablaConFiltros
        columns={columnas}
        data={maquina}
        onEdit={handleEdit}
        onDelete={handleEliminar}
        onAddNew={handleAñadir}
      />
    </section>
  )
}

export default Maquinas