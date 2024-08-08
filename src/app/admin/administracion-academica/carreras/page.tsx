"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TitlePage from '@/components/title-page';
import DynamicTable from '@/components/DynamicTable';
import { useSession } from 'next-auth/react';

// Definir la interfaz Carrera aquí
interface Carrera {
  id: number;
  nombre: string;
  email: string;
  contrasenia: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  rol: 'admin' | 'laboratorista';
}

// Definir la interfaz Column aquí
interface Column {
  title: string;
  dataField: string;
  type?: string;
  sortable?: boolean;
  sort_direction?: 'asc' | 'desc';
}

const Carreras = () => {
  const { data: session } = useSession();
  const [data, setData] = useState<Carrera[]>([]);

  const obtenerCarreras = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/carreras`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      setData(response.data); // Aquí se actualiza el estado con los datos obtenidos
    } catch (error) {
      console.error('Error al obtener carreras:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      obtenerCarreras();
    }
  }, [session]);

  const columns: Column[] = [
    { title: "ID", dataField: "id", type: "number" },
    { title: "Nombre", dataField: "nombre", sortable: true, sort_direction: 'desc' },
  ];

  const rowActions = [
    { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "carrera.edit" },
    { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "carrera.destroy" }
  ];

  const handleAction = (action: string, rowData: Carrera) => {
    console.log(`Action: ${action}`, rowData);
  };

  return (
    <section className='contenedorPrincipalPaginas'>
      <TitlePage title="Carreras" />
      <DynamicTable columns={columns} data={data} rowActions={rowActions} onAction={handleAction} />
    </section>
  );
}

export default Carreras;
