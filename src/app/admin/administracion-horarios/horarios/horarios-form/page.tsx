"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import TituloPagina from '@/components/titulo-pagina';
import '@/styles/formulario.scss';
import { Input, Button, Autocomplete, AutocompleteItem, CircularProgress } from "@nextui-org/react";
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
    id: number;
    nombre: string;
    detalle_piso: DetallePiso;
}

interface Docente {
    cedula: string;
    docente: string;
}

interface Detalle_Materia {
    id: number;
    carrera: Carrera;
    semestre: Semestre;
    materia: Materia;
    paralelo: Paralelo;
}

interface Carrera {
    id: number;
    nombre: string;
}

interface Semestre {
    id: number;
    nombre: string
}

interface Materia {
    id: number;
    nombre: string;
}

interface Paralelo {
    id: number;
    nombre: string
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
        aula: {
            id: 0, nombre: '', detalle_piso: {
                id: 0, piso: { id: 0, nombre: '' }, edificio
                    : { id: 0, nombre: '' }
            }
        },
        detalle_materia: { id: 0, carrera: { id: 0, nombre: '' }, semestre: { id: 0, nombre: '' }, materia: { id: 0, nombre: '' }, paralelo: { id: 0, nombre: '' } },
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
                            detalle_piso: {
                                id: detalleResponse.data.aula.detalle_piso.id,
                                piso: {
                                    id: detalleResponse.data.aula.detalle_piso.piso.id,
                                    nombre: detalleResponse.data.aula.detalle_piso.piso.nombre,
                                },
                                edificio: {
                                    id: detalleResponse.data.aula.detalle_piso.edificio.id,
                                    nombre: detalleResponse.data.aula.detalle_piso.edificio.nombre,
                                },
                            },
                        },
                        detalle_materia: {
                            id: detalleResponse.data.materia.id,
                            carrera: {
                                id: detalleResponse.data.materia.carrera.id,
                                nombre: detalleResponse.data.materia.carrera.nombre,
                            },
                            semestre: {
                                id: detalleResponse.data.materia.semestre.id,
                                nombre: detalleResponse.data.materia.semestre.nombre,
                            },
                            materia: {
                                id: detalleResponse.data.materia.materia.id,
                                nombre: detalleResponse.data.materia.materia.nombre,
                            },
                            paralelo: {
                                id: detalleResponse.data.materia.paralelo.id,
                                nombre: detalleResponse.data.materia.paralelo.nombre,
                            }
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
        if (name === "inicio" || name === "fin") {
            const timeValue = value.substring(0, 5);
            setDetalle({ ...detalle, [name]: timeValue });
        } else {
            setDetalle({ ...detalle, [name]: value });
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setDetalle(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAulaChange = (selected: string) => {
        const selectedAula = aula.find(p => p.id.toString() === selected);
        if (selectedAula) {
            setDetalle(prevState => ({
                ...prevState,
                aula: selectedAula,
            }));
        }
    };

    const handleSelectAula = (selectedKey: string) => {
        handleAulaChange(selectedKey);
    };

    const handleMateriaChange = (selectedId: string) => {
        const selectedDetalleMateria = detalle_materia.find(dm => dm.id.toString() === selectedId);
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
                toast.success('Se actualizó correctamente');
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-horarios`, detalleDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                toast.success('Se creó correctamente');
            }
            router.push('/admin/administracion-horarios/horarios');
        } catch (error) {
            console.error('Error al guardar:', error);
            if (axios.isAxiosError(error) && error.response) {
                const { data } = error.response;
                if (Array.isArray(data.message)) {
                    data.message.forEach((errMsg: string) => toast.error(errMsg));
                } else {
                    toast.error(`Error: ${data.message || 'Error al guardar el horario'}`);
                }
            } else {
                toast.error('Error al guardar el horario');
            }
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
                            isRequired
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
                            label="Edificio, Piso y Aula"
                            name="aula"
                            selectedKey={detalle.aula.id ? detalle.aula.id.toString() : ''}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handleSelectAula(selectedValue);
                            }}
                            isRequired
                        >
                            {aula.map(aula => (
                                <AutocompleteItem key={aula.id} value={aula.id.toString()}>
                                    {`${aula.detalle_piso.edificio.nombre} - ${aula.detalle_piso.piso.nombre} - ${aula.nombre}`}
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
                            isRequired
                        >
                            <AutocompleteItem key={'Lunes'} value={'Lunes'} textValue="Lunes">
                                Lunes
                            </AutocompleteItem>
                            <AutocompleteItem key={'Martes'} value={'Martes'} textValue="Martes">
                                Martes
                            </AutocompleteItem>
                            <AutocompleteItem key={'Miércoles'} value={'Miércoles'} textValue="Miércoles">
                                Miércoles
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
                                isRequired
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
                                label="Carrera, Semestre, Materia y Paralelo"
                                name="materia"
                                selectedKey={detalle.detalle_materia.id ? detalle.detalle_materia.id.toString() : ''}
                                onSelectionChange={(selected) => {
                                    const selectedValue = selected ? selected.toString() : '';
                                    handleMateriaChange(selectedValue);
                                }}
                                isRequired
                            >
                                {detalle_materia.map(detalle => (
                                    <AutocompleteItem
                                        key={detalle.id}
                                        value={detalle.id.toString()}>
                                        {`${detalle.carrera.nombre} - ${detalle.semestre.nombre} - ${detalle.materia.nombre} - ${detalle.paralelo.nombre}`}
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
