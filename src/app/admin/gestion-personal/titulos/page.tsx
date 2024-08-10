"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TitlePage from '@/components/title-page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DynamicTable from '@/components/DynamicTable';

interface Titulo {
  id: number;
  nombre: string;
  abreviacion: string;
}

const columnas = [
  { uid: "nombre", name: "Titulo", sortable: true },
  { uid: "abreviacion", name: "Abreviación", sortable: true },
  { uid: "actions", name: "Acciones" }
];

const TitulosPage = () => {
  const { data: session } = useSession();
  const [titulos, setTitulos] = useState<Titulo[]>([]);
  const router = useRouter();

  const obtenerTitulos = async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/titulos/buscarT`, { nombre }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      setTitulos(response.data);
    } catch (error) {
      console.error("Error al obtener los títulos:", error);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      obtenerTitulos();
    }
  }, [session]);

  const handleAñadir = () => {
    router.push('/admin/gestion-personal/titulos/titulos-form');
  }

  const handleEditar = (row: Titulo) => {
    router.push(`/admin/gestion-personal/titulos/titulos-form?id=${row.id}`);
  }

  const eliminarTitulo = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/titulos/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        }
      );
      obtenerTitulos("")
    } catch (error) {
      console.error("Error al eliminar el título:", error);
    }
  }

  const handleEliminar = (row: Titulo) => {
    eliminarTitulo(row.id);
  }

  return (
    <section className=''>
      <TitlePage title="Titulos" />
      <DynamicTable
        columns={columnas}
        data={titulos}
        onEdit={handleEditar}
        onDelete={handleEliminar}
        onAddNew={handleAñadir}
      />
    </section>
  );
}

export default TitulosPage;
