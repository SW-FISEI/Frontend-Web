"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import TituloPagina from '@/components/titulo-pagina';
import '@/styles/formulario.scss';
import { Input, Button, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useSession } from 'next-auth/react';

interface Carrera {
    id: number;
    nombre: string;
    descripcion: string;
}

interface Semestre {
    id: number;
    nombre: string;
}

interface Materia {
    id: number;
    nombre: string;
    descripcion: string;
}

interface Paralelo {
    id: number;
    nombre: string;
}

interface Detalle_Materia {
    id?: number;
    carrera: Carrera;
    semestre: Semestre;
    materia: Materia;
    paralelo: Paralelo;
}

const DetalleMateriaForm = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [detalle, setDetalle] = useState<Detalle_Materia>({
        carrera: { id: 0, nombre: '', descripcion: '' }, semestre: {
            id: 0, nombre: ''
        }, materia: { id: 0, nombre: '', descripcion: '' }, paralelo: { id: 0, nombre: '' }
    });
    const [carrera, setCarrera] = useState<Carrera[]>([]);
    const [semestre, setSemestre] = useState<Semestre[]>([]);
    const [materia, setMateria] = useState<Materia[]>([]);
    const [paralelo, setParalelo] = useState<Paralelo[]>([]);
    const [loading, setLoading] = useState(true);
    const isEditMode = !!id;

    useEffect(() => {
        const fetchData = async (nombre: string = "") => {
            try {
                const carreraResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/carreras/buscar`, { nombre }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                setCarrera(carreraResponse.data);

                const semestreResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/semestres/buscar`, { nombre }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                setSemestre(semestreResponse.data);

                const materiaResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/materias/buscar`, { nombre }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                setMateria(materiaResponse.data);

                const paraleloResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/paralelos/buscar`, { nombre }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                setParalelo(paraleloResponse.data);

                if (isEditMode) {
                    const detalleResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-materias/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user?.token}`,
                        },
                    });

                    setDetalle({
                        id: detalleResponse.data.id,
                        carrera: {
                            id: detalleResponse.data.carrera.id,
                            nombre: detalleResponse.data.carrera.nombre,
                            descripcion: detalleResponse.data.carrera.descripcion
                        },
                        semestre: {
                            id: detalleResponse.data.semestre.id,
                            nombre: detalleResponse.data.semestre.nombre
                        },
                        materia: {
                            id: detalleResponse.data.materia.id,
                            nombre: detalleResponse.data.materia.nombre,
                            descripcion: detalleResponse.data.materia.descripcion
                        },
                        paralelo: {
                            id: detalleResponse.data.paralelo.id,
                            nombre: detalleResponse.data.paralelo.nombre
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
        return <p>Cargando...</p>;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDetalle({ ...detalle, [name]: value ?? '' });
    };

    const handleSelectChange = (name: string, value: string) => {
        setDetalle({ ...detalle, [name]: value });
    };

    const handleCarreraChange = (selected: string) => {
        const selectedCarrera = carrera.find(p => p.nombre === selected);
        if (selectedCarrera) {
            setDetalle({ ...detalle, carrera: selectedCarrera });
        }
    }

    const handleSemestreChange = (selected: string) => {
        const selectedSemestre = semestre.find(p => p.nombre === selected);
        if (selectedSemestre) {
            setDetalle({ ...detalle, semestre: selectedSemestre });
        }
    }

    const handleMateriaChange = (selected: string) => {
        const selectedMateria = materia.find(p => p.nombre === selected);
        if (selectedMateria) {
            setDetalle({ ...detalle, materia: selectedMateria });
        }
    }

    const handleParaleloChange = (selected: string) => {
        const selectedParalelo = paralelo.find(p => p.nombre === selected);
        if (selectedParalelo) {
            setDetalle({ ...detalle, paralelo: selectedParalelo });
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const detalleDatos = {
                carrera: detalle.carrera.id,
                semestre: detalle.semestre.id,
                materia: detalle.materia.id,
                paralelo: detalle.paralelo.id
            };

            if (isEditMode) {
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-materias/${id}`, detalleDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-materias`, detalleDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            }
            router.push('/admin/administracion-academica');
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <section className=''>
            <TituloPagina title="Detalle Materia" subtitle={isEditMode ? 'Editar Detalle Materia' : 'Agregar Detalle Materia'} />
            <div className="contenedorFormulario">
                <form onSubmit={handleSubmit}>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Carrera"
                            name="carrera"
                            selectedKey={detalle.carrera.nombre}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handleCarreraChange(selectedValue);
                            }}
                            required
                        >
                            {carrera.map(carrera => (
                                <AutocompleteItem key={carrera.nombre} value={carrera.nombre}>
                                    {carrera.nombre}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Semestre"
                            name="semestre"
                            selectedKey={detalle.semestre.nombre}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handleSemestreChange(selectedValue);
                            }}
                            required
                        >
                            {semestre.map(semestre => (
                                <AutocompleteItem key={semestre.nombre} value={semestre.nombre}>
                                    {semestre.nombre}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Materia"
                            name="materia"
                            selectedKey={detalle.materia.nombre}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handleMateriaChange(selectedValue);
                            }}
                            required
                        >
                            {materia.map(materia => (
                                <AutocompleteItem key={materia.nombre} value={materia.nombre}>
                                    {materia.nombre}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Paralelo"
                            name="paralelo"
                            selectedKey={detalle.paralelo.nombre}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handleParaleloChange(selectedValue);
                            }}
                            required
                        >
                            {paralelo.map(paralelo => (
                                <AutocompleteItem key={paralelo.nombre} value={paralelo.nombre}>
                                    {paralelo.nombre}
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

export default DetalleMateriaForm;
