"use client";

import TituloPagina from '@/components/titulo-pagina';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Input, Button, Autocomplete, AutocompleteItem, CircularProgress } from "@nextui-org/react";
import '@/styles/formulario.scss';
import toast from 'react-hot-toast';

interface Docente {
    id?: number;
    cedula: any;
    docente: string;
    titulo?: Titulo | null;
}

interface Titulo {
    id: number;
    nombre: string;
    abreviacion: string;
}

const DocentesForm = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('cedula');
    const [docente, setDocente] = useState<Docente>({ cedula: '', docente: '', titulo: null });
    const [titulos, setTitulos] = useState<Titulo[]>([]);
    const [loading, setLoading] = useState(true);
    const isEditMode = !!id;

    const obtenerTitulos = useCallback(async (nombre: string = "") => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/titulos/buscarT`, { nombre }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user?.token}`,
                },
            });
            setTitulos(response.data);
        } catch (error) {
            console.error("Error al obtener los títulos:", error);
        }
    }, [session?.user?.token]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await obtenerTitulos();

                if (isEditMode) {
                    const docenteResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/docentes/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user?.token}`,
                        },
                    });

                    const docenteData = docenteResponse.data;

                    setDocente({
                        id: docenteData.cedula,
                        cedula: docenteData.cedula,
                        docente: docenteData.docente,
                        titulo: docenteData.titulo
                            ? {
                                id: docenteData.titulo.id,
                                nombre: docenteData.titulo.nombre,
                                abreviacion: docenteData.titulo.abreviacion,
                            }
                            : null, // Maneja el caso donde título es null
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        if (session?.user?.token) {
            fetchData();
        }
    }, [id, isEditMode, session?.user?.token, obtenerTitulos]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress label="Cargando..." />
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDocente({ ...docente, [name]: value });
    };

    const handleTituloChange = (selected: string | null) => {
        const selectedTitulo = titulos.find(t => t.nombre === selected) || null;
        setDocente({ ...docente, titulo: selectedTitulo });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const docenteDatos = {
                cedula: docente.cedula,
                docente: docente.docente,
                titulo: docente.titulo ? docente.titulo.id : null,
            };

            if (isEditMode) {
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/docentes/${id}`, docenteDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                toast.success('Se actualizó correctamente');
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/docentes`, docenteDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                toast.success('Se creó correctamente');
            }
            router.push('/admin/gestion-personal/docentes');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const { data } = error.response;
                if (Array.isArray(data.message)) {
                    data.message.forEach((errMsg: string) => toast.error(errMsg));
                } else {
                    toast.error(`Error: ${data.message || 'Error al guardar el docente'}`);
                }
            } else {
                toast.error('Error al guardar el docente');
            }
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <section className=''>
            <TituloPagina title="Docentes" subtitle={isEditMode ? 'Editar docente' : 'Agregar docente'} />
            <div className="contenedorFormulario">
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input
                            variant="faded"
                            label="Cédula"
                            name="cedula"
                            value={docente.cedula}
                            onChange={handleInputChange}
                            required
                            disabled={isEditMode}
                        />
                    </div>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Título"
                            name="titulo"
                            selectedKey={docente.titulo?.nombre || null}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : null;
                                handleTituloChange(selectedValue);
                            }}
                        >
                            {titulos.map(titulo => (
                                <AutocompleteItem key={titulo.nombre} value={titulo.nombre}>
                                    {titulo.nombre}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>
                    <div>
                        <Input
                            variant="faded"
                            label="Nombre del Docente"
                            name="docente"
                            value={docente.docente}
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

export default DocentesForm;
