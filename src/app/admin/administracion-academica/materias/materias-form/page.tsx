"use client";

import TituloPagina from '@/components/titulo-pagina';
import { Button, Input } from '@nextui-org/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import '@/styles/formulario.scss';

interface Materia {
    id?: number;
    nombre: string;
    descripcion: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}

const materiasForm = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [formData, setFormData] = useState<Materia>({ nombre: '', descripcion: '' });
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            // Cargar los datos de la carrera si estamos en modo edición
            const obtenerMateria = async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/materias/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user?.token}`,
                        },
                    });
                    setFormData(response.data);
                } catch (error) {
                    console.error('Error al obtener la materia:', error);
                }
            };
            obtenerMateria();
        }
    }, [id, isEditMode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                // Actualizar carrera existente
                const carreraDatos = {
                    nombre: formData.nombre,
                    descripcion: formData.descripcion
                }
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/materias/${id}`, carreraDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            } else {
                // Crear nueva carrera
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/materias`, formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            }
            router.push('/admin/administracion-academica/materias');
        } catch (error) {
            console.error('Error al guardar la materia:', error);
        }
    };


    const handleCancel = () => {
        router.back(); // Navegar hacia atrás en el historial
    };

    return (
        <section className=''>
            <TituloPagina title="Materias" subtitle={isEditMode ? 'Editar materia' : 'Agregar materia'} />
            <div className="contenedorFormulario">
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input
                            variant="faded"
                            type="text"
                            label="Nombre"
                            name="nombre"  // Agrega el nombre al input
                            value={formData.nombre}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Input
                            variant="faded"
                            type="text"
                            label="Descripción"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="botonFormulario">
                        <Button color="secondary" onPress={handleCancel}>Cancelar</Button>
                        <Button color="primary" type="submit">
                            {isEditMode ? 'Actualizar' : 'Agregar'}
                        </Button>

                    </div>
                </form>
            </div>
        </section>
    )
}

export default materiasForm