"use client";

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
    nombre: string
}

interface DetallePiso {
    id?: number;
    piso: Piso;
    edificio: Edificio;
}

const PisoForm = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [detallePiso, setDetallePiso] = useState<DetallePiso>({ piso: { id: 0, nombre: '' }, edificio: { id: 0, nombre: '' } });
    const [edificio, setEdificio] = useState<Edificio[]>([]);
    const [piso, setPiso] = useState<Piso[]>([]);
    const [loading, setLoading] = useState(true);
    const isEditMode = !!id;

    useEffect(() => {
        const fetchData = async (nombre: string = "") => {
            try {
                const pisoResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pisos/buscar`, { nombre }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                setPiso(pisoResponse.data);

                const edificioResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/edificios/buscar`, { nombre }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                setEdificio(edificioResponse.data);

                if (isEditMode) {
                    const detallePisoResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-pisos/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user?.token}`,
                        },
                    });

                    setDetallePiso({
                        id: detallePisoResponse.data.id,
                        piso: {
                            id: detallePisoResponse.data.piso.id,
                            nombre: detallePisoResponse.data.piso.nombre,
                        },
                        edificio: {
                            id: detallePisoResponse.data.edificio.id,
                            nombre: detallePisoResponse.data.edificio.nombre,
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
        setDetallePiso({ ...detallePiso, [name]: value ?? '' });
    };

    const handleSelectChange = (name: string, value: string) => {
        setPiso({ ...piso, [name]: value });
    };

    const handlePisoChange = (selected: string) => {
        const selectedPiso = piso.find(p => p.nombre === selected);
        if (selectedPiso) {
            setDetallePiso({ ...detallePiso, piso: selectedPiso });
        }
    }

    const handleEdificioChange = (selected: string) => {
        const selectedEdificio = edificio.find(p => p.nombre === selected);
        if (selectedEdificio) {
            setDetallePiso({ ...detallePiso, edificio: selectedEdificio });
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const detallePisoDatos = {
                piso: detallePiso.piso.id,
                edificio: detallePiso.edificio.id
            };

            if (isEditMode) {
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-pisos/${id}`, detallePisoDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-pisos`, detallePisoDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            }
            router.push('/admin/infraestructura/distribucion-pisos');
        } catch (error) {
            console.error('Error al guardar el detalle:', error);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <section className=''>
            <TituloPagina title="Pisos" subtitle={isEditMode ? 'Editar piso' : 'Agregar piso'} />
            <div className="contenedorFormulario">
                <form onSubmit={handleSubmit}>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Piso"
                            name="piso"
                            selectedKey={detallePiso.piso.nombre}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handlePisoChange(selectedValue);
                            }}
                            isRequired
                        >
                            {piso.map(piso => (
                                <AutocompleteItem key={piso.nombre} value={piso.nombre}>
                                    {piso.nombre}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Edificio"
                            name="edificio"
                            selectedKey={detallePiso.edificio.nombre}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handleEdificioChange(selectedValue);
                            }}
                            isRequired
                        >
                            {edificio.map(edificio => (
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

export default PisoForm;
