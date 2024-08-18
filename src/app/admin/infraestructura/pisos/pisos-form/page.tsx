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
    id?: number;
    nombre: string;
    edificio: Edificio;
}

const PisoForm = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [piso, setPiso] = useState<Piso>({ nombre: '', edificio: { id: 0, nombre: '' } });
    const [edificio, setEdificio] = useState<Edificio[]>([]);
    const [loading, setLoading] = useState(true);
    const isEditMode = !!id;

    useEffect(() => {
        const fetchData = async (nombre: string = "") => {
            try {
                const edificioResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/edificios/buscar`, { nombre }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                setEdificio(edificioResponse.data);

                if (isEditMode) {
                    const maquinaResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pisos/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user?.token}`,
                        },
                    });

                    setPiso({
                        id: maquinaResponse.data.id,
                        nombre: maquinaResponse.data.nombre,
                        edificio: {
                            id: maquinaResponse.data.edificio.id,
                            nombre: maquinaResponse.data.edificio.nombre,
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
        setPiso({ ...piso, [name]: value ?? '' });
    };

    const handleSelectChange = (name: string, value: string) => {
        setPiso({ ...piso, [name]: value });
    };

    const handleEdificioChange = (selected: string) => {
        const selectedEdificio = edificio.find(p => p.nombre === selected);
        if (selectedEdificio) {
            setPiso({ ...piso, edificio: selectedEdificio });
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const pisoDatos = {
                nombre: piso.nombre,
                edificio: piso.edificio.id
            };

            if (isEditMode) {
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pisos/${id}`, pisoDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pisos`, pisoDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            }
            router.push('/admin/infraestructura/pisos');
        } catch (error) {
            console.error('Error al guardar el piso:', error);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <section className=''>
            <TituloPagina title="Pisos" subtitle={isEditMode ? 'Editar Piso' : 'Agregar Piso'} />
            <div className="contenedorFormulario">
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input
                            variant="faded"
                            type="text"
                            label="Piso"
                            name="nombre"
                            value={piso.nombre}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Edificio"
                            name="edificio"
                            selectedKey={piso.edificio.nombre}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handleEdificioChange(selectedValue);
                            }}
                            required
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
