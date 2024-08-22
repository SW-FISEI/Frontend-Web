"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import TituloPagina from '@/components/titulo-pagina';
import { Input, Button, Autocomplete, AutocompleteItem, CircularProgress } from "@nextui-org/react";
import { useSession } from 'next-auth/react';
import '@/styles/formulario.scss';
import toast from 'react-hot-toast';

interface Laboratorista {
    cedula: string;
    laboratorista: string;
    titulo: Titulo;
    edificio: Edificio;
}

interface Titulo {
    id: number;
    nombre: string;
    abreviacion: string;
}

interface Edificio {
    id: number;
    nombre: string;
}

const LaboratoristasForm = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const cedula = searchParams.get('cedula');
    const [laboratorista, setLaboratorista] = useState<Laboratorista>({
        cedula: '',
        laboratorista: '',
        titulo: { id: 0, nombre: '', abreviacion: '' },
        edificio: { id: 0, nombre: '' },
    });
    const [titulos, setTitulos] = useState<Titulo[]>([]);
    const [edificios, setEdificios] = useState<Edificio[]>([]);
    const [loading, setLoading] = useState(true);
    const isEditMode = !!cedula;

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

    const obtenerEdificios = useCallback(async (nombre: string = "") => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/edificios/buscar`, { nombre }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user?.token}`,
                },
            });
            setEdificios(response.data);
        } catch (error) {
            console.error("Error al obtener los edificios:", error);
        }
    }, [session?.user?.token]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await obtenerTitulos();
                await obtenerEdificios();

                if (isEditMode) {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/laboratoristas/${cedula}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user?.token}`,
                        },
                    });

                    const data = response.data[0]; // Accede al primer elemento del array

                    setLaboratorista({
                        cedula: data.cedula,
                        laboratorista: data.laboratorista,
                        titulo: {
                            id: data.titulo.id,
                            nombre: data.titulo.nombre,
                            abreviacion: data.titulo.abreviacion,
                        },
                        edificio: {
                            id: data.edificio.id,
                            nombre: data.edificio.nombre,
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
    }, [cedula, isEditMode, session?.user?.token, obtenerEdificios, obtenerTitulos]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress label="Cargando..." />
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name !== 'cedula' || !isEditMode) { // Evita actualizar el campo 'cedula' si es modo edición
            setLaboratorista({ ...laboratorista, [name]: value });
        }
    };

    const handleTituloChange = (selected: string) => {
        const selectedTitulo = titulos.find(t => t.nombre === selected);
        if (selectedTitulo) {
            setLaboratorista({ ...laboratorista, titulo: selectedTitulo });
        }
    };

    const handleEdificioChange = (selected: string) => {
        const selectedEdificio = edificios.find(e => e.nombre === selected);
        if (selectedEdificio) {
            setLaboratorista({ ...laboratorista, edificio: selectedEdificio });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const laboratoristaDatos = {
                cedula: laboratorista.cedula,
                laboratorista: laboratorista.laboratorista,
                titulo: laboratorista.titulo.id,
                edificio: laboratorista.edificio.id,
            };

            if (isEditMode) {
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/laboratoristas/${cedula}`, laboratoristaDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                toast.success('Se actualizó correctamente');
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/laboratoristas`, laboratoristaDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                toast.success('Se creó correctamente');
            }
            router.push('/admin/gestion-personal/laboratoristas');
        } catch (error) {
            console.error('Error al guardar el laboratorista:', error);
            if (axios.isAxiosError(error) && error.response) {
                const { data } = error.response;
                if (Array.isArray(data.message)) {
                    data.message.forEach((errMsg: string) => toast.error(errMsg));
                } else {
                    toast.error(`Error: ${data.message || 'Error al guardar el laboratorista'}`);
                }
            } else {
                toast.error('Error al guardar el laboratorista');
            }
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <section className=''>
            <TituloPagina title="Laboratoristas" subtitle={isEditMode ? 'Editar laboratorista' : 'Agregar laboratorista'} />
            <div className="contenedorFormulario">
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input
                            variant="faded"
                            label="Cédula"
                            name="cedula"
                            value={laboratorista.cedula}
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
                            selectedKey={laboratorista.titulo.nombre}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handleTituloChange(selectedValue);
                            }}
                            isRequired
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
                            label="Nombre de laboratorista"
                            name="laboratorista"
                            value={laboratorista.laboratorista}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Edificio"
                            name="edificio"
                            selectedKey={laboratorista.edificio.nombre}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handleEdificioChange(selectedValue);
                            }}
                            isRequired
                        >
                            {edificios.map(edificio => (
                                <AutocompleteItem key={edificio.nombre} value={edificio.nombre}>
                                    {edificio.nombre}
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

export default LaboratoristasForm;