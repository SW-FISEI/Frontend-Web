"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import TituloPagina from '@/components/titulo-pagina';
import '@/styles/formulario.scss';
import { Input, Button, Textarea } from "@nextui-org/react";
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface Software {
    id?: number;
    nombre: string;
    version: string;
    descripcion: string;
}

const SoftwareForm = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [software, setSoftware] = useState<Software>({ nombre: '', version: '', descripcion: '' });
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            const obtenerSoftwares = async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/softwares/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user?.token}`,
                        },
                    });
                    setSoftware(response.data);
                } catch (error) {
                    console.error('Error al obtener el software:', error);
                }
            };
            obtenerSoftwares();
        }
    }, [id, isEditMode, session?.user?.token]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSoftware({ ...software, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                const softwareDatos = {
                    nombre: software.nombre,
                    version: software.version,
                    descripcion: software.descripcion
                }
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/softwares/${id}`, softwareDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                toast.success('Se actualizó correctamente');
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/softwares`, software, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                toast.success('Se creó correctamente');
            }
            router.push('/admin/gestion-equipos/software');
        } catch (error) {
            console.error('Error al guardar el software:', error);
            if (axios.isAxiosError(error) && error.response) {
                const { data } = error.response;
                if (Array.isArray(data.message)) {
                    data.message.forEach((errMsg: string) => toast.error(errMsg));
                } else {
                    toast.error(`Error: ${data.message || 'Error al guardar el software'}`);
                }
            } else {
                toast.error('Error al guardar el software');
            }
        }
    };


    const handleCancel = () => {
        router.back();
    };

    return (
        <section className=''>
            <TituloPagina title="Software" subtitle={isEditMode ? 'Editar Software' : 'Agregar Software'} />
            <div className="contenedorFormulario">
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input
                            variant="faded"
                            type="text"
                            label="Nombre"
                            name="nombre"
                            value={software.nombre}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Input
                            variant="faded"
                            type="text"
                            label="Versión"
                            name="version"
                            value={software.version}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Textarea
                            variant="faded"
                            type="text"
                            label="Descripción"
                            name="descripcion"
                            value={software.descripcion}
                            onChange={handleInputChange}
                            required
                            classNames={{
                                input: "resize-y min-h-[40px]",
                            }}
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

export default SoftwareForm;
