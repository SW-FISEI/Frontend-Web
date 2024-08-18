"use client";

import TituloPagina from '@/components/titulo-pagina';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input, Button, Autocomplete, AutocompleteItem, CircularProgress } from "@nextui-org/react";
import '@/styles/formulario.scss';

interface Docente {
    id?: number;
    cedula: any;
    docente: string;
    titulo: Titulo;
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
    const id = searchParams.get('id');
    const [docente, setDocente] = useState<Docente>({ cedula: '', docente: '', titulo: { id: 0, nombre: '', abreviacion: '' } });
    const [titulos, setTitulos] = useState<Titulo[]>([]);
    const [loading, setLoading] = useState(true);
    const isEditMode = !!id;

    const obtenerTitulos = async (nombre: string = "") => {
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
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener los títulos
                await obtenerTitulos();

                if (isEditMode) {
                    const docenteResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/docentes/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user?.token}`,
                        },
                    });

                    setDocente({
                        id: docenteResponse.data.id,
                        cedula: docenteResponse.data.cedula,
                        docente: docenteResponse.data.docente,
                        titulo: {
                            id: docenteResponse.data.titulo.id,
                            nombre: docenteResponse.data.titulo.nombre,
                            abreviacion: docenteResponse.data.titulo.abreviacion,
                        },
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
    }, [id, isEditMode, session?.user?.token]);

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

    const handleTituloChange = (selected: string) => {
        const selectedTitulo = titulos.find(t => t.nombre === selected);
        if (selectedTitulo) {
            setDocente({ ...docente, titulo: selectedTitulo });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const docenteDatos = {
                cedula: docente.cedula,
                docente: docente.docente,
                titulo: docente.titulo.id,
            };

            if (isEditMode) {
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/docentes/${id}`, docenteDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            } else {
                console.log(docenteDatos)
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/docentes`, docenteDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            }
            router.push('/admin/gestion-personal/docentes');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error al guardar el docente:', error.response?.data);
            } else {
                console.error('Error inesperado:', error);
            }
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <section className=''>
            <TituloPagina title="Docentes" subtitle={isEditMode ? 'Editar Docente' : 'Agregar Docente'} />
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
                        />
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
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Titulo"
                            name="titulo"
                            selectedKey={docente.titulo.nombre}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handleTituloChange(selectedValue);
                            }}
                            required
                        >
                            {titulos.map(titulo => (
                                <AutocompleteItem key={titulo.nombre} value={titulo.nombre}>
                                    {titulo.nombre}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
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
