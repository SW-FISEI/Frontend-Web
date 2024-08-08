"use client";

import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import TitlePage from '@/components/title-page';
import DynamicTable from '@/components/DynamicTable';
import { permission } from 'process';

interface Titulo {
  id: number;
  nombre: string;
  abreviacion: string;
}

interface Column {
  title: string;
  dataField: string;
  type?: string;
  sortable?: boolean;
  sort_direction?: 'asc' | 'desc';
}

const TitulosPage = () => {
  const { data: session, status } = useSession();
  const [titulos, setTitulos] = useState<Titulo[]>([]);

  const obtenerTitulos = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/titulos`, {
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

  const columnas: Column[] = [
    { title: "Nombre", dataField: "nombre", type: "string", sortable: true, sort_direction: 'desc' },
    { title: "Abreviación", dataField: "abreviacion", type: "string" }
  ];

  const Acciones = [
    { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "titulo.edit" },
    { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "titulo.destroy" }
  ];

  const handleAccion = (action: string, rowData: Titulo) => {
    console.log(`Accion: ${action}`, rowData);
  }

  return (
    <div className='h-screen'>
      <div className='grid grid-cols-4 grid-rows-8 w-full h-full'>
        <div className='row-start-1 col-start-1 col-span-4 flex items-center ml-[10%]'>
          <TitlePage title="Títulos" />
        </div>
        <div className='row-start-2 col-start-1 col-span-3 relative ml-[4%] flex items-center justify-center'>
          <input className='border border-[#d2cdd2] rounded-xl placeholder:text-[#d2cdd2] pl-10 w-full py-2 shadow-md' type="text" placeholder='Buscar' />
          <Icon icon="lucide:search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d2cdd2]" />
        </div>
        <div className='row-start-2 col-start-4 flex items-center justify-center'>
          <button className='rounded-2xl px-5 py-2 text-white bg-[#450a0a] inline-block shadow-md shadow-[#4c2626]'>Nuevo <Icon className='inline-block' icon="lucide:plus" /></button>
        </div>
        <div className="row-start-3 row-span-4 col-start-1 col-span-4">
          <DynamicTable columns={columnas} data={titulos} rowActions={Acciones} onAction={handleAccion}/>
        </div>
      </div>
    </div>
  );
}

export default TitulosPage;
