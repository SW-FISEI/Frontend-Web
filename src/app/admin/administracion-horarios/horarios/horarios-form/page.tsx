"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import TituloPagina from '@/components/titulo-pagina';
import '@/styles/formulario.scss';
import { Input, Button, Autocomplete, AutocompleteItem, CircularProgress } from "@nextui-org/react";
import { useSession } from 'next-auth/react';

interface Aula {
    id: number;
    nombre: string;
}

interface Docente {
    cedula: string;
    docente: string;
}

interface Detalle_Materia {
    id: number;
    materia: Materia;
}

interface Materia {
    id: number;
    nombre: string;
}

interface Periodo {
    id: number;
    nombre: string;
}

interface Detalle_Horario {
    id?: number;
    inicio: string;
    fin: string;
    dia: string;
    aula: Aula;
    detalle_materia: Detalle_Materia;
    docente: Docente;
    periodo: Periodo;
}

const DetalleHorarioForm = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [detalle, setDetalle] = useState<Detalle_Horario>({
        inicio: '',
        fin: '',
        dia: '',
        aula: { id: 0, nombre: '' },
        detalle_materia: { id: 0, materia: { id: 0, nombre: '' } },
        docente: { cedula: '', docente: '' },
        periodo: { id: 0, nombre: '' }
    });
    const [aula, setAula] = useState<Aula[]>([]);
    const [detalle_materia, setDetalleMateria] = useState<Detalle_Materia[]>([]);
    const [materia, setMateria] = useState<Materia[]>([]);
    const [docente, setDocente] = useState<Docente[]>([]);
    const [periodo, setPeriodo] = useState<Periodo[]>([]);
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

                const detalleMateriaResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-materias/buscar`, { nombre }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                setDetalleMateria(detalleMateriaResponse.data);

                const materiaResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/materias/buscar`, { nombre }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                setMateria(materiaResponse.data);

                const docenteResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/docentes/buscar`, { nombre }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                setDocente(docenteResponse.data);

                const periodoResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/periodos/buscar`, { nombre }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                setPeriodo(periodoResponse.data);

                if (isEditMode) {
                    const detalleResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-horarios/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user?.token}`,
                        },
                    });

                    // Asegúrate de que el formato de las horas es correcto
                    const inicio = detalleResponse.data.inicio.slice(0, 5); // Formato HH:mm
                    const fin = detalleResponse.data.fin.slice(0, 5); // Formato HH:mm

                    setDetalle({
                        id: detalleResponse.data.id,
                        inicio: inicio,
                        fin: fin,
                        dia: detalleResponse.data.dia,
                        aula: {
                            id: detalleResponse.data.aula.id,
                            nombre: detalleResponse.data.aula.nombre,
                        },
                        detalle_materia: {
                            id: detalleResponse.data.materia.id,
                            materia: {
                                id: detalleResponse.data.materia.materia.id,
                                nombre: detalleResponse.data.materia.materia.nombre,
                            },
                        },
                        docente: {
                            cedula: detalleResponse.data.docente.cedula,
                            docente: detalleResponse.data.docente.docente,
                        },
                        periodo: {
                            id: detalleResponse.data.periodo.id,
                            nombre: detalleResponse.data.periodo.nombre,
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
        setDetalle(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setDetalle(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAulaChange = (selected: string) => {
        const selectedAula = aula.find(p => p.nombre === selected);
        if (selectedAula) {
            setDetalle(prevState => ({
                ...prevState,
                aula: selectedAula,
            }));
        }
    }

    const handleMateriaChange = (selected: string) => {
        const selectedDetalleMateria = detalle_materia.find(dm => dm.materia.nombre === selected);
        if (selectedDetalleMateria) {
            setDetalle(prevState => ({
                ...prevState,
                detalle_materia: selectedDetalleMateria,
            }));
        }
    };

    const handleDocenteChange = (selected: string) => {
        const selectedDocente = docente.find(p => p.docente === selected);
        if (selectedDocente) {
            setDetalle(prevState => ({
                ...prevState,
                docente: selectedDocente,
            }));
        }
    }

    const handlePeriodoChange = (selected: string) => {
        const selectedPeriodo = periodo.find(p => p.nombre === selected);
        if (selectedPeriodo) {
            setDetalle(prevState => ({
                ...prevState,
                periodo: selectedPeriodo,
            }));
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const detalleDatos = {
                inicio: detalle.inicio,
                fin: detalle.fin,
                dia: detalle.dia,
                aula: detalle.aula.id,
                detalle_materia: detalle.detalle_materia.id,
                docente: detalle.docente.cedula,
                periodo: detalle.periodo.id
            };

            if (isEditMode) {
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-horarios/${id}`, detalleDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-horarios`, detalleDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            }
            router.push('/admin/administracion-horarios/horarios');
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <section className=''>
            <TituloPagina title="Horarios" subtitle={isEditMode ? 'Editar horario' : 'Agregar horario'} />
            <div className="contenedorFormulario">
                <form onSubmit={handleSubmit}>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Período"
                            name="periodo"
                            selectedKey={detalle.periodo.nombre}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handlePeriodoChange(selectedValue);
                            }}
                            required
                        >
                            {periodo.map(periodo => (
                                <AutocompleteItem key={periodo.nombre} value={periodo.nombre}>
                                    {periodo.nombre}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Aula"
                            name="aula"
                            selectedKey={detalle.aula.nombre}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handleAulaChange(selectedValue);
                            }}
                            required
                        >
                            {aula.map(aula => (
                                <AutocompleteItem key={aula.nombre} value={aula.nombre}>
                                    {aula.nombre}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Día"
                            placeholder="Dia"
                            className="max-w-full"
                            name="dia"
                            selectedKey={detalle.dia || ''}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handleSelectChange('dia', selectedValue);
                            }}
                            required
                        >
                            <AutocompleteItem key={'Lunes'} value={'Lunes'} textValue="Lunes">
                                Lunes
                            </AutocompleteItem>
                            <AutocompleteItem key={'Martes'} value={'Martes'} textValue="Martes">
                                Martes
                            </AutocompleteItem>
                            <AutocompleteItem key={'Miercoles'} value={'Miercoles'} textValue="Miercoles">
                                Miercoles
                            </AutocompleteItem>
                            <AutocompleteItem key={'Jueves'} value={'Jueves'} textValue="Jueves">
                                Jueves
                            </AutocompleteItem>
                            <AutocompleteItem key={'Viernes'} value={'Viernes'} textValue="Viernes">
                                Viernes
                            </AutocompleteItem>
                        </Autocomplete>
                    </div>
                    <div className="contenedorDobleColumna">
                        <div>
                            <Input
                                variant="faded"
                                type="time"
                                label="Inicio"
                                name="inicio"
                                value={detalle.inicio}
                                min={0}
                                max={60}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Input
                                variant="faded"
                                type="time"
                                label="Fin"
                                name="fin"
                                value={detalle.fin}
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
                                label="Docente"
                                name="docente"
                                selectedKey={detalle.docente.docente}
                                onSelectionChange={(selected) => {
                                    const selectedValue = selected ? selected.toString() : '';
                                    handleDocenteChange(selectedValue);
                                }}
                                required
                            >
                                {docente.map(docente => (
                                    <AutocompleteItem key={docente.docente} value={docente.docente}>
                                        {docente.docente}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>
                        </div>
                        <div>
                            <Autocomplete
                                variant="faded"
                                label="Materia"
                                name="semestre"
                                selectedKey={detalle.detalle_materia.materia.nombre}
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

export default DetalleHorarioForm;
