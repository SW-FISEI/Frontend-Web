"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import TituloPagina from '@/components/titulo-pagina';
import '@/styles/formulario.scss';
import { Input, Button } from "@nextui-org/react";
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface Paralelo {
    id?: number;
    nombre: string;
}

const ParalelosForm = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [paralelo, setParalelo] = useState<Paralelo>({ nombre: '' });
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            const obtenerParalelo = async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/paralelos/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user?.token}`,
                        },
                    });
                    setParalelo(response.data);
                } catch (error) {
                    console.error('Error al obtener el paralelo:', error);
                }
            };
            obtenerParalelo();
        }
    }, [id, isEditMode, session?.user?.token]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setParalelo({ ...paralelo, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                const paraleloDatos = {
                    nombre: paralelo.nombre
                }
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/paralelos/${id}`, paraleloDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                toast.success('Se actualizó correctamente');
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/paralelos`, paralelo, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                toast.success('Se creó correctamente');
            }
            router.push('/admin/administracion-academica/paralelos');
        } catch (error) {
            console.error('Error al guardar el paralelo:', error);
            if (axios.isAxiosError(error) && error.response) {
                const { data } = error.response;
                if (Array.isArray(data.message)) {
                    data.message.forEach((errMsg: string) => toast.error(errMsg));
                } else {
                    toast.error(`Error: ${data.message || 'Error al guardar el paralelo'}`);
                }
            } else {
                toast.error('Error al guardar el paralelo');
            }
        }
    };


    const handleCancel = () => {
        router.back(); // Navegar hacia atrás en el historial
    };

    return (
        <section className=''>
            <TituloPagina title="Paralelos" subtitle={isEditMode ? 'Editar paralelo' : 'Agregar paralelo'} />
            <div className="contenedorFormulario">
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input
                            variant="faded"
                            type="text"
                            label="Nombre"
                            name="nombre"
                            value={paralelo.nombre}
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
    );
};

export default ParalelosForm;
