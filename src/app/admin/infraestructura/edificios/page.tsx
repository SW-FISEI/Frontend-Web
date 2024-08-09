"use client";

import DynamicTable from '@/components/DynamicTable';
import TitlePage from '@/components/title-page'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Cambiado a next/navigation
import React, { useEffect, useState } from 'react'

interface Edificios {
  id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const columns = [
  { uid: "nombre", name: "Nombre", sortable: true },
  { uid: "actions", name: "Actions" }
];

const edificios = () => {
  const { data: session } = useSession();
  const [data, setData] = useState<Edificios[]>([]);
  const router = useRouter(); // Cambiado a la versión de next/navigation

  const obtenerEdificios = async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/edificios/buscar`, { nombre }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error al obtener carreras:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      obtenerEdificios();
    }
  }, [session]);

  const handleAdd = () => {
    router.push('/admin/infraestructura/edificios/edificios-form');
  };
  
  const handleEdit = (row: Edificios) => {
    router.push(`/admin/infraestructura/edificios/edificios-form?id=${row.id}`);
  };

  const handleDelete = (row: Edificios) => {
    //eliminarCarrera(row.id);
  };
  
  return (
    <section className=''>
      <TitlePage title="Edificios" />
      <DynamicTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAdd}
      />
    </section>
  )
}

export default edificios;
