"use client";

import React from 'react';

interface Caracteristicas {
  id: number;
  cantidad_pc: number;
  capacidad: number;
  proyector: number;
  aire: number;
  descripcion: string;
  id_aula?: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const columns = [
  { uid: "nombre", name: "Nombre", sortable: true },
  { uid: "descripcion", name: "Descripción", sortable: true },
  { uid: "cantidad_pc", name: "Descripción", sortable: true },
  { uid: "actions", name: "Actions" }
];

const caracteristicas_aulas = () => {
  return (
    <div>caracteristicas_aulas</div>
  )
}

export default caracteristicas_aulas