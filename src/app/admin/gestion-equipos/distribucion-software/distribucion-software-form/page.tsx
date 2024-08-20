"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import TituloPagina from '@/components/titulo-pagina';
import '@/styles/formulario.scss';
import { Button, Autocomplete, AutocompleteItem, CircularProgress } from "@nextui-org/react";
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
    id: number,
    piso: Piso;
    edificio: Edificio;
}

interface Aula {
    id: number;
    nombre: string;
    detalle_piso: DetallePiso
}

interface Software {
    id: number;
    nombre: string;
    version: string;
    descripcion: string;
}

interface Software_Aulas {
    id?: number;
    aula: Aula;
    software: Software;
}

const PisoForm = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    /*     const [software_aulas, setSoftwareAula] = useState<Software_Aulas>({ software: { id: 0, nombre: '', version: '', descripcion: '' }, aula: { id: 0, nombre: '', piso: { id: 0, nombre: '', edificio: { id: 0, nombre: '' } } } }); */
    const [software_aulas, setSoftwareAula] = useState<Software_Aulas>({ software: { id: 0, nombre: '', version: '', descripcion: '' }, aula: { id: 0, nombre: '', detalle_piso: { id: 0, piso: { id: 0, nombre: '' }, edificio: { id: 0, nombre: '' } } } });
    const [aula, setAula] = useState<Aula[]>([]);
    const [software, setSoftware] = useState<Software[]>([]);
    const [loading, setLoading] = useState(true);
    const isEditMode = !!id;

    useEffect(() => {
        const fetchData = async (nombre: string = "", nombreS: string = "") => {
            try {
                const aulaResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/aulas/buscar`, { nombre }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                setAula(aulaResponse.data);

                const softwareResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/softwares/buscar`, { nombreS }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                setSoftware(softwareResponse.data);

                if (isEditMode) {
                    const softwareAulaResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/software-aulas/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user?.token}`,
                        },
                    });

                    setSoftwareAula({
                        id: softwareAulaResponse.data.id,
                        software: {
                            id: softwareAulaResponse.data.software.id,
                            nombre: softwareAulaResponse.data.software.nombre,
                            version: softwareAulaResponse.data.software.version,
                            descripcion: softwareAulaResponse.data.software.descripcion,
                        },
                        aula: {
                            id: softwareAulaResponse.data.aula.id,
                            nombre: softwareAulaResponse.data.aula.nombre,
                            detalle_piso: {
                                id: softwareAulaResponse.data.aula.detalle_piso.id,
                                piso: {
                                    id: softwareAulaResponse.data.aula.detalle_piso.piso.id,
                                    nombre: softwareAulaResponse.data.aula.detalle_piso.piso.nombre,
                                },
                                edificio: {
                                    id: softwareAulaResponse.data.aula.detalle_piso.edificio.id,
                                    nombre: softwareAulaResponse.data.aula.detalle_piso.edificio.nombre,
                                },
                            }
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
        setSoftwareAula({ ...software_aulas, [name]: value ?? '' });
    };

    const handleSelectChange = (name: string, value: string) => {
        setSoftwareAula({ ...software_aulas, [name]: value });
    };

    const handleAulaChange = (selected: string) => {
        const selectedAula = aula.find(dm => dm.id.toString() === selected);
        if (selectedAula) {
            setSoftwareAula(prevSoftwareAula => ({
                ...prevSoftwareAula,
                aula: selectedAula
            }));
        }
    };

    const handleSoftwareChange = (selected: string) => {
        const selectedSoftware = software.find(p => p.nombre === selected);
        if (selectedSoftware) {
            setSoftwareAula({ ...software_aulas, software: selectedSoftware });
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const pisoDatos = {
                software: software_aulas.software.id,
                aula: software_aulas.aula.id
            };

            if (isEditMode) {
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/software-aulas/${id}`, pisoDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/software-aulas`, pisoDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            }
            router.push('/admin/gestion-equipos/distribucion-software');
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <section className=''>
            <TituloPagina title="Distribución de software" subtitle={isEditMode ? 'Editar' : 'Agregar'} />
            <div className="contenedorFormulario">
                <form onSubmit={handleSubmit}>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Software"
                            name="software"
                            selectedKey={software_aulas.software.nombre}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handleSoftwareChange(selectedValue);
                            }}
                            required
                        >
                            {software.map(software => (
                                <AutocompleteItem key={software.nombre} value={software.nombre}>
                                    {software.nombre}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Aula"
                            name="aula"
                            selectedKey={software_aulas.aula.id ? software_aulas.aula.id.toString() : ''}
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
            </div>
        </section>
    );
};

export default PisoForm;
