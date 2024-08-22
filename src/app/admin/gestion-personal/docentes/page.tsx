"use client";

import Tabla from '@/components/tabla';
import TituloPagina from '@/components/titulo-pagina';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

interface Docente {
  cedula: number;
  docente: string;
  titulo: Titulo;
}

interface Titulo {
  id: number;
  nombre: string;
  abreviacion: string;
}

const columnas = [
  { uid: "cedula", name: "Cédula", sortable: true },
  { uid: "titulo.nombre", name: "Título", sortable: true },
  { uid: "docente", name: "Nombre", sortable: true },
  { uid: "actions", name: "Acciones" }
];

const Docentes = () => {
  const { data: session } = useSession();
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const router = useRouter();

  const obtenerDocentes = useCallback(async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/docentes/buscar`, { nombre },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        }
      );
      setDocentes(response.data);
    } catch (error) {
      console.error('Error al obtener docentes:', error);
    }
  }, [session?.user?.token]);

  useEffect(() => {
    if (session?.user?.token) {
      obtenerDocentes();
    }
  }, [session?.user?.token, obtenerDocentes]);

  const handleAñadir = () => {
    router.push('/admin/gestion-personal/docentes/docentes-form');
  };

  const handleEdit = (row: Docente) => {
    router.push(`/admin/gestion-personal/docentes/docentes-form?cedula=${row.cedula}`);
  };

  const handleEliminar = (row: Docente) => {
    eliminarDocente(row.cedula);
  };

  const eliminarDocente = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/docentes/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        }
      );
      obtenerDocentes();
    } catch (error) {
      console.error("Error al eliminar el docente:", error);
    }
  };

  // Mapeo para agregar 'id' como alias de 'cedula'
  const docentesConId = docentes.map(docente => ({
    ...docente,
    id: docente.cedula
  }));

  return (
    <section className=''>
      <TituloPagina title="Docentes" />
      <Tabla
        columns={columnas}
        data={docentesConId}
        onEdit={handleEdit}
        onDelete={handleEliminar}
        onAddNew={handleAñadir}
      />
    </section>
  );
}

export default Docentes;
