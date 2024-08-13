"use client";

import TituloPagina from '@/components/titulo-pagina';
import { Button, Input } from '@nextui-org/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import '@/styles/formulario.scss';

interface Semestre {
    id?: number;
    nombre: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}

const semestresForm = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [formData, setFormData] = useState<Semestre>({ nombre: '' });
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            // Cargar los datos de la carrera si estamos en modo edición
            const obtenerSemestre = async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/semestres/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user?.token}`,
                        },
                    });
                    setFormData(response.data);
                } catch (error) {
                    console.error('Error al obtener el semestre:', error);
                }
            };
            obtenerSemestre();
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
                const datosSemestre = {
                    nombre: formData.nombre
                }
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/semestres/${id}`, datosSemestre, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            } else {
                // Crear nueva carrera
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/semestres`, formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            }
            router.push('/admin/administracion-academica/semestres');
        } catch (error) {
            console.error('Error al guardar el semestre:', error);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <section className=''>
            <TituloPagina title="Semestres" subtitle={isEditMode ? 'Editar semestre' : 'Agregar semestre'} />
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

export default semestresForm