"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import TituloPagina from '@/components/titulo-pagina';
import '@/styles/formulario.scss';
import { Input, Button, Autocomplete, AutocompleteItem, CircularProgress, Textarea } from "@nextui-org/react";
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

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
    id?: number;
    nombre: string;
    cantidad_pc: number;
    capacidad: number;
    proyector: string;
    aire: string;
    descripcion: string;
    detalle_piso: DetallePiso;
}

const PisoForm = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [aula, setAula] = useState<Aula>({
        nombre: '',
        cantidad_pc: 0,
        capacidad: 0,
        proyector: '',
        aire: '',
        descripcion: '',
        detalle_piso: {
            id: 0,
            piso: { id: 0, nombre: '' },
            edificio: { id: 0, nombre: '' }
        }
    });
    const [detallePiso, setDetallePiso] = useState<DetallePiso[]>([]);
    const [piso, setPiso] = useState<Piso[]>([]);
    const [edificio, setEdificio] = useState<Edificio[]>([]);
    const [filteredPisos, setFilteredPisos] = useState<Piso[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEdificioSelected, setIsEdificioSelected] = useState<boolean>(!!aula.detalle_piso.edificio.id);
    const isEditMode = !!id;

    useEffect(() => {
        const fetchData = async (edificio: string = '', piso: string = '') => {
            try {
                const detallePisoResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-pisos`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    }
                });
                setDetallePiso(detallePisoResponse.data);

                const edificioResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/edificios/buscar`, { nombre: edificio }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    }
                });
                setEdificio(edificioResponse.data);

                if (isEditMode) {
                    const aulaResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/aulas/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user?.token}`,
                        },
                    });

                    const selectedEdificioId = aulaResponse.data.detalle_piso.edificio.id;
                    const filteredPisos = detallePisoResponse.data
                        .filter((dp: DetallePiso) => dp.edificio.id === selectedEdificioId)
                        .map((dp: DetallePiso) => dp.piso);

                    setFilteredPisos(filteredPisos);

                    setAula({
                        id: aulaResponse.data.id,
                        nombre: aulaResponse.data.nombre,
                        cantidad_pc: aulaResponse.data.cantidad_pc,
                        capacidad: aulaResponse.data.capacidad,
                        proyector: aulaResponse.data.proyector,
                        aire: aulaResponse.data.aire,
                        descripcion: aulaResponse.data.descripcion,
                        detalle_piso: {
                            id: aulaResponse.data.detalle_piso.id,
                            piso: {
                                id: aulaResponse.data.detalle_piso.piso.id,
                                nombre: aulaResponse.data.detalle_piso.piso.nombre
                            },
                            edificio: {
                                id: aulaResponse.data.detalle_piso.edificio.id,
                                nombre: aulaResponse.data.detalle_piso.edificio.nombre
                            }
                        }
                    });

                    setIsEdificioSelected(true);
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

    const handleEdificioChange = async (selected: string) => {
        const selectedEdificio = edificio.find(e => e.nombre === selected);
        const selectedEdificioId = selectedEdificio?.id;

        console.log('Edificio seleccionado:', selectedEdificio); // Agrega esta línea para depurar

        const filteredPisos = detallePiso
            .filter(dp => dp.edificio.id === selectedEdificioId)
            .map(dp => dp.piso);

        setFilteredPisos(filteredPisos);

        setAula(prevAula => ({
            ...prevAula,
            detalle_piso: {
                ...prevAula.detalle_piso,
                edificio: {
                    id: selectedEdificioId ?? 0,
                    nombre: selectedEdificio?.nombre ?? ''
                },
                piso: {
                    id: 0,
                    nombre: ''
                }
            }
        }));

        if (selectedEdificioId) {
            const detallePisoResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-pisos/buscarPorEdificioYPiso`, {
                edificioId: selectedEdificioId,
                pisoId: aula.detalle_piso.piso.id
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user?.token}`,
                }
            });

            if (detallePisoResponse.data) {
                setAula(prevAula => ({
                    ...prevAula,
                    detalle_piso: {
                        ...prevAula.detalle_piso,
                        id: detallePisoResponse.data.id
                    }
                }));
            }
        }
    };

    const handlePisoChange = async (selected: string) => {
        const selectedPiso = filteredPisos.find(p => p.nombre === selected);

        console.log('Piso seleccionado:', selectedPiso); // Para depurar

        if (aula.detalle_piso.edificio.id && selectedPiso?.id) {
            const detallePisoResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-pisos/buscarPorEdificioYPiso`, {
                edificioId: aula.detalle_piso.edificio.id,
                pisoId: selectedPiso.id
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user?.token}`,
                }
            });

            if (detallePisoResponse.data) {
                setAula(prevAula => ({
                    ...prevAula,
                    detalle_piso: {
                        id: detallePisoResponse.data.id,
                        piso: {
                            id: selectedPiso.id,
                            nombre: selectedPiso.nombre
                        },
                        edificio: prevAula.detalle_piso.edificio
                    }
                }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const { id, detalle_piso, ...restoAulaData } = aula;

            const aulaData = {
                ...restoAulaData,
                detalle_piso: detalle_piso.id
            };

            console.log('Datos enviados:', aulaData);

            if (isEditMode) {
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/aulas/${id}`, aulaData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                toast.success('Se actualizó correctamente');
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/aulas`, aulaData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                toast.success('Se creó correctamente');
            }
            router.push('/admin/infraestructura/aulas');
        } catch (error: any) {
            console.error('Error al guardar el aula:', error.response?.data || error.message);
            if (axios.isAxiosError(error) && error.response) {
                const { data } = error.response;
                if (Array.isArray(data.message)) {
                    data.message.forEach((errMsg: string) => toast.error(errMsg));
                } else {
                    toast.error(`Error: ${data.message || 'Error al guardar el aula'}`);
                }
            } else {
                toast.error('Error al guardar el aula');
            }
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <section className=''>
            <TituloPagina title="Aulas" subtitle={isEditMode ? 'Editar aula' : 'Agregar aula'} />
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
                    <div className="contenedorDobleColumna">
                        <div>
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
                        <div>
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
                    <div className="contenedorDobleColumna">
                        <div>
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
                                isRequired
                            >
                                <AutocompleteItem key={'Si'} value={'Si'} textValue="Si">
                                    Si
                                </AutocompleteItem>
                                <AutocompleteItem key={'No'} value={'No'} textValue="No">
                                    No
                                </AutocompleteItem>
                            </Autocomplete>
                        </div>
                        <div>
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
                                isRequired
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
                        <Textarea
                            variant="faded"
                            type="text"
                            label="Descripción"
                            name="descripcion"
                            value={aula.descripcion}
                            onChange={handleInputChange}
                            required
                            classNames={{
                                input: "resize-y min-h-[40px]",
                            }}
                        />
                    </div>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Edificio"
                            name="detalle_piso.edificio"
                            selectedKey={aula.detalle_piso.edificio.nombre}
                            onSelectionChange={(selected) => handleEdificioChange(selected ? selected.toString() : '')}
                            isRequired
                        >
                            {edificio.map(e => (
                                <AutocompleteItem key={e.nombre} value={e.nombre}>
                                    {e.nombre}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Piso"
                            name="detalle_piso.piso"
                            selectedKey={aula.detalle_piso.piso.nombre}
                            onSelectionChange={(selected) => handlePisoChange(selected ? selected.toString() : '')}
                            disabled={!isEdificioSelected}
                            isRequired
                        >
                            {filteredPisos.map(p => (
                                <AutocompleteItem key={p.nombre} value={p.nombre}>
                                    {p.nombre}
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
