"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import TituloPagina from '@/components/titulo-pagina';
import '@/styles/formulario.scss';
import { Input, Button, Autocomplete, AutocompleteItem, CircularProgress } from "@nextui-org/react";
import { useSession } from 'next-auth/react';

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

interface Aula {
    id: number;
    nombre: string;
    detalle_piso: DetallePiso;
}

interface Maquina {
    id?: number;
    nombre: string;
    aula: Aula;
}

const MaquinaForm = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [maquina, setMaquina] = useState<Maquina>({ nombre: '', aula: { id: 0, nombre: '', detalle_piso: { id: 0, piso: { id: 0, nombre: '' }, edificio: { id: 0, nombre: '' } } } });
    const [aula, setAula] = useState<Aula[]>([]);
    const [piso, setPiso] = useState<Piso[]>([]);
    const [edificio, setEdificio] = useState<Edificio[]>([]);
    const [loading, setLoading] = useState(true);
    const isEditMode = !!id;

    useEffect(() => {
        const fetchData = async (nombre: string = "") => {
            try {
                const aulaResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/aulas/buscar`, { nombre }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                setAula(aulaResponse.data);

                if (isEditMode) {
                    const maquinaResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maquinas/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user?.token}`,
                        },
                    });

                    setMaquina({
                        id: maquinaResponse.data.id,
                        nombre: maquinaResponse.data.nombre,
                        aula: {
                            id: maquinaResponse.data.aula.id,
                            nombre: maquinaResponse.data.aula.nombre,
                            detalle_piso: {
                                id: maquinaResponse.data.aula.detalle_piso.id,
                                piso: {
                                    id: maquinaResponse.data.aula.detalle_piso.piso.id,
                                    nombre: maquinaResponse.data.aula.detalle_piso.piso.nombre,
                                },
                                edificio: {
                                    id: maquinaResponse.data.aula.detalle_piso.edificio.id,
                                    nombre: maquinaResponse.data.aula.detalle_piso.edificio.nombre,
                                }
                            },
                        }
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
        setMaquina({ ...maquina, [name]: value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setMaquina({ ...maquina, [name]: value });
    };

    const handleAulaChange = (selected: string) => {
        const selectedAula = aula.find(dm => dm.id.toString() === selected);
        if (selectedAula) {
            setMaquina(prevMaquina => ({
                ...prevMaquina,
                aula: selectedAula
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const maquinaDatos = {
                nombre: maquina.nombre,
                aula: maquina.aula.id,
            };

            if (isEditMode) {
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maquinas/${id}`, maquinaDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maquinas`, maquinaDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            }
            router.push('/admin/gestion-equipos/maquinas');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error al guardar la maquina:', error.response?.data);
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
            <TituloPagina title="Maquinas" subtitle={isEditMode ? 'Editar Maquina' : 'Agregar Maquina'} />
            <div className="contenedorFormulario">
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input
                            variant="faded"
                            type="text"
                            label="Nombre"
                            name="nombre"
                            value={maquina.nombre}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Aula"
                            name="aula"
                            selectedKey={maquina.aula.id ? maquina.aula.id.toString() : ''}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handleAulaChange(selectedValue);
                            }}
                            required
                        >
                            {aula.map((aula) => (
                                <AutocompleteItem
                                    key={aula.id}
                                    value={aula.id.toString()}>
                                    {`${aula.detalle_piso.edificio.nombre} - ${aula.detalle_piso.piso.nombre} - ${aula.nombre}`}
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
            </div >
        </section >
    );
};

export default MaquinaForm;
