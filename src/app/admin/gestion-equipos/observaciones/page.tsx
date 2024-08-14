"use client"

import Tabla from '@/components/tabla';
import TituloPagina from '@/components/titulo-pagina';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

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
    piso: Piso;
}

interface Maquina {
    id: number;
    nombre: string;
    aula: Aula;
}

interface Observacion {
    id: number;
    descripcion: string;
    maquina: Maquina;
}

const columnas = [
    { uid: "descripcion", name: "Descripcion", sortable: true },
    { uid: "maquina.nombre", name: "Maquina", sortable: true },
    { uid: "maquina.aula.nombre", name: "Aula", sortable: true },
    { uid: "maquina.aula.piso.nombre", name: "Piso", sortable: true },
    { uid: "maquina.aula.piso.edificio.nombre", name: "Edificio", sortable: true },
    { uid: "actions", name: "Acciones", sortable: true },
];

const observaciones = () => {
    const { data: session } = useSession();
    const [observacion, setObservacion] = useState<Observacion[]>([]);
    const router = useRouter();

    const obtenerObservaciones = async (descripcion: string = "") => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/observaciones/buscar`, { descripcion },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`
                    }
                }
            );
            setObservacion(response.data);
        } catch (error) {
            console.error('Error al obtener observaciones:', error);
        }
    };

    useEffect(() => {
        if (session?.user?.token) {
            obtenerObservaciones();
        }
    }, [session]);

    const eliminarObservacion = async (id: number) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/observaciones/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    }
                }
            );
            obtenerObservaciones();
        } catch (error) {
            console.error("Error al eliminar la observacion:", error);
        }
    };

    const handleEliminar = (row: Maquina) => {
        eliminarObservacion(row.id)
    }
    return (
        <section className=''>
            <TituloPagina title='Observaciones' />
            <Tabla
                columns={columnas}
                data={observacion}
                onDelete={handleEliminar}
            />
        </section>
    )
}

export default observaciones