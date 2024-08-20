"use client"

import Tabla from '@/components/tabla';
import TablaConFiltros from '@/components/tabla-filtros';
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
}

interface DetallePiso {
    id: number;
    piso: Piso;
    edificio: Edificio;
}

const columnas = [
    { uid: "piso.nombre", name: "Piso", sortable: true, filterable: true },
    { uid: "edificio.nombre", name: "Edificio", sortable: true, filterable: true },
    { uid: "actions", name: "Acciones" },
];

const DestribucionPisos = () => {
    const { data: session } = useSession();
    const [detallePiso, setDetallePiso] = useState<DetallePiso[]>([]);
    const router = useRouter();

    const obtenerDetallePisos = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-pisos`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user?.token}`,
                },
            });
            setDetallePiso(response.data);
        } catch (error) {
            console.error('Error al obtener pisos:', error);
        }
    };

    useEffect(() => {
        if (session?.user?.token) {
            obtenerDetallePisos();
        }
    }, [session]);

    const handleAñadir = () => {
        router.push('/admin/infraestructura/distribucion-pisos/distribucion-pisos-form');
    }

    const handleEditar = (row: DetallePiso) => {
        router.push(`/admin/infraestructura/distribucion-pisos/distribucion-pisos-form?id=${row.id}`);
    }

    const eliminarDetallePiso = async (id: number) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pisos/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    }
                }
            );
            obtenerDetallePisos();
        } catch (error) {
            console.error("Error al eliminar el detalle:", error);
        }
    };

    const handleEliminar = (row: DetallePiso) => {
        eliminarDetallePiso(row.id);
    };

    return (
        <section className=''>
            <TituloPagina title="Distribución de pisos" />
            <TablaConFiltros
                columns={columnas}
                data={detallePiso}
                onEdit={handleEditar}
                onDelete={handleEliminar}
                onAddNew={handleAñadir}
            />
        </section>
    )
}

export default DestribucionPisos;