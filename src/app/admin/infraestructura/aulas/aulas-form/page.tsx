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
    nombre: string;
    edificio: Edificio;
}

interface Aula {
    id?: number;
    nombre: string;
    cantidad_pc: number;
    capacidad: number;
    proyector: string;
    aire: string;
    descripcion: string;
    piso: Piso;
}

const PisoForm = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [aula, setAula] = useState<Aula>({ nombre: '', cantidad_pc: 0, capacidad: 0, proyector: '', aire: '', descripcion: '', piso: { id: 0, nombre: '', edificio: { id: 0, nombre: '' } } });
    const [piso, setPiso] = useState<Piso[]>([]);
    const [edificio, setEdificio] = useState<Edificio[]>([]);
    const [filteredPisos, setFilteredPisos] = useState<Piso[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEdificioSelected, setIsEdificioSelected] = useState<boolean>(!!aula.piso.edificio.id);
    const isEditMode = !!id;

    useEffect(() => {
        const fetchData = async (nombre: string = "", nombreE: string = "") => {
            try {
                const edificioResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/edificios/buscar`, { nombreE }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    }
                });
                setEdificio(edificioResponse.data);

                const pisoResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pisos/buscarP`, { nombre }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                setPiso(pisoResponse.data);
                setFilteredPisos(pisoResponse.data);

                if (isEditMode) {
                    const maquinaResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/aulas/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user?.token}`,
                        },
                    });

                    setAula({
                        id: maquinaResponse.data.id,
                        nombre: maquinaResponse.data.nombre,
                        cantidad_pc: maquinaResponse.data.cantidad_pc,
                        capacidad: maquinaResponse.data.capacidad,
                        proyector: maquinaResponse.data.proyector,
                        aire: maquinaResponse.data.aire,
                        descripcion: maquinaResponse.data.descripcion,
                        piso: {
                            id: maquinaResponse.data.piso.id,
                            nombre: maquinaResponse.data.piso.nombre,
                            edificio: {
                                id: maquinaResponse.data.piso.edificio.id,
                                nombre: maquinaResponse.data.piso.edificio.nombre
                            }
                        }
                    });
                    setIsEdificioSelected(true)
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

    useEffect(() => {
        // Filtrar pisos cuando se seleccione un edificio
        if (aula.piso.edificio.id) {
            const filtered = piso.filter(p => p.edificio.id === aula.piso.edificio.id);
            setFilteredPisos(filtered);
        } else {
            setFilteredPisos(piso);
        }
    }, [aula.piso.edificio.id, piso]);

    useEffect(() => {
        setIsEdificioSelected(!!aula.piso.edificio.id);
    }, [aula.piso.edificio.id]);

    console.log("Is Edificio Selected:", isEdificioSelected);

    if (loading) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress label="Cargando..." />
          </div>
        );
      }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'cantidad_pc' || name === 'capacidad') {
            const parsedValue = parseInt(value, 10);
            setAula(prevAula => ({
                ...prevAula,
                [name]: isNaN(parsedValue) ? 0 : parsedValue
            }));
        } else {
            setAula(prevAula => ({
                ...prevAula,
                [name]: value
            }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setAula(prevAula => ({ ...prevAula, [name]: value }));
    };

    const handlePisoChange = (selected: string) => {
        const selectedPiso = filteredPisos.find(p => p.nombre === selected);
        if (selectedPiso) {
            setAula(prevAula => ({ ...prevAula, piso: selectedPiso }));
        }
    }

    const handleEdificioChange = (selected: string) => {
        const selectedEdificio = edificio.find(e => e.nombre === selected);
        if (selectedEdificio) {
            setAula(prevAula => ({
                ...prevAula,
                piso: { ...prevAula.piso, edificio: selectedEdificio }
            }));
            setIsEdificioSelected(true); // Actualizar el estado para mostrar el campo "Piso"
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const aulaDatos = {
                nombre: aula.nombre,
                cantidad_pc: aula.cantidad_pc,
                capacidad: aula.capacidad,
                proyector: aula.proyector,
                aire: aula.aire,
                descripcion: aula.descripcion,
                piso: aula.piso.id
            };

            if (isEditMode) {
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/aulas/${id}`, aulaDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/aulas`, aulaDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            }
            router.push('/admin/infraestructura/aulas');
        } catch (error) {
            console.error('Error al guardar el aula:', error);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <section className=''>
            <TituloPagina title="Aulas" subtitle={isEditMode ? 'Editar Aula' : 'Agregar Aula'} />
            <div className="contenedorFormulario">
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input
                            variant="faded"
                            type="text"
                            label="Aula"
                            name="nombre"
                            value={aula.nombre}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className='grid grid-cols-2'>
                        <div className='col-start-1'>
                            <Input
                                variant="faded"
                                type="number"
                                label="Cantidad PC"
                                name="cantidad_pc"
                                value={aula.cantidad_pc.toString()}
                                min={0}
                                max={50}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className='col-start-2'>
                            <Input
                                variant="faded"
                                type="number"
                                label="Capacidad"
                                name="capacidad"
                                value={aula.capacidad.toString()}
                                min={0}
                                max={60}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className='grid grid-cols-2'>
                        <div className='col-start-1'>
                            <Autocomplete
                                variant="faded"
                                label="Proyector"
                                placeholder="Proyector"
                                className="max-w-full"
                                name="proyector"
                                selectedKey={aula.proyector || ''}
                                onSelectionChange={(selected) => {
                                    const selectedValue = selected ? selected.toString() : '';
                                    handleSelectChange('proyector', selectedValue);
                                }}
                                required
                            >
                                <AutocompleteItem key={'Si'} value={'Si'} textValue="Si">
                                    Si
                                </AutocompleteItem>
                                <AutocompleteItem key={'No'} value={'No'} textValue="No">
                                    No
                                </AutocompleteItem>
                            </Autocomplete>
                        </div>
                        <div className='col-start-2'>
                            <Autocomplete
                                variant="faded"
                                label="Aire"
                                placeholder="Aire"
                                className="max-w-full"
                                name="aire"
                                selectedKey={aula.aire || ''}
                                onSelectionChange={(selected) => {
                                    const selectedValue = selected ? selected.toString() : '';
                                    handleSelectChange('aire', selectedValue);
                                }}
                                required
                            >
                                <AutocompleteItem key={'Si'} value={'Si'} textValue="Si">
                                    Si
                                </AutocompleteItem>
                                <AutocompleteItem key={'No'} value={'No'} textValue="No">
                                    No
                                </AutocompleteItem>
                            </Autocomplete>
                        </div>
                    </div>
                    <div>
                        <Input
                            variant="faded"
                            type="text"
                            label="Descripción"
                            name="descripcion"
                            value={aula.descripcion}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Edificio"
                            name="piso.edificio"
                            selectedKey={aula.piso.edificio.nombre}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handleEdificioChange(selectedValue);
                            }}
                            required
                        >
                            {edificio.map(e => (
                                <AutocompleteItem key={e.nombre} value={e.nombre}>
                                    {e.nombre}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>
                    {isEdificioSelected && (
                        <div>
                            <Autocomplete
                                variant="faded"
                                label="Piso"
                                name="piso"
                                selectedKey={aula.piso.nombre}
                                onSelectionChange={(selected) => {
                                    const selectedValue = selected ? selected.toString() : '';
                                    handlePisoChange(selectedValue);
                                }}
                                required
                            >
                                {filteredPisos.map(p => (
                                    <AutocompleteItem key={p.nombre} value={p.nombre}>
                                        {p.nombre}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                    )}
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
