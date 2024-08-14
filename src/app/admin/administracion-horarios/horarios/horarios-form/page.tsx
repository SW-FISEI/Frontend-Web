"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import TituloPagina from '@/components/titulo-pagina';
import '@/styles/formulario.scss';
import { Input, Button, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useSession } from 'next-auth/react';

interface Periodo {
    id: number;
    nombre: string;
}

interface Horario {
    id?: number;
    inicio: string;
    fin: string;
    dia: string;
    periodo: Periodo;
}

const HorarioForm = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [horario, setHorario] = useState<Horario>({ inicio: '', fin: '', dia: '', periodo: { id: 0, nombre: '' } });
    const [periodos, setPeriodos] = useState<Periodo[]>([]);
    const [loading, setLoading] = useState(true);
    const isEditMode = !!id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const periodoResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/periodos`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
                setPeriodos(periodoResponse.data);

                if (isEditMode) {
                    const horarioResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/horarios/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user?.token}`,
                        },
                    });

                    console.log('Datos del horario obtenidos:', horarioResponse.data);

                    setHorario({
                        id: horarioResponse.data.id,
                        inicio: horarioResponse.data.inicio,
                        fin: horarioResponse.data.fin,
                        dia: horarioResponse.data.dia,
                        periodo: {
                            id: horarioResponse.data.periodo.id,
                            nombre: horarioResponse.data.periodo.nombre,
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
        setHorario({ ...horario, [name]: value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setHorario({ ...horario, [name]: value });
    };

    const handlePeriodoChange = (selected: string) => {
        const selectedPeriodo = periodos.find(p => p.nombre === selected);
        if (selectedPeriodo) {
            setHorario({ ...horario, periodo: selectedPeriodo });
        }
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const horarioDatos = {
                inicio: formatTime(horario.inicio),
                fin: formatTime(horario.fin),
                dia: horario.dia,
                periodo: horario.periodo.id,
            };

            if (isEditMode) {
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/horarios/${id}`, horarioDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/horarios`, horarioDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            }
            router.push('/admin/administracion-horarios/horarios');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error al guardar el horario:', error.response?.data);
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
            <TituloPagina title="Horarios" subtitle={isEditMode ? 'Editar Horario' : 'Agregar Horario'} />
            <div className="contenedorFormulario">
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input
                            variant="faded"
                            type="time"
                            label="Inicio"
                            name="inicio"
                            value={horario.inicio}
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
                            value={horario.fin}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Día"
                            name="dia"
                            selectedKey={horario.dia}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handleSelectChange('dia', selectedValue);
                            }}
                            required
                        >
                            <AutocompleteItem key="Lunes" value="Lunes">Lunes</AutocompleteItem>
                            <AutocompleteItem key="Martes" value="Martes">Martes</AutocompleteItem>
                            <AutocompleteItem key="Miércoles" value="Miércoles">Miércoles</AutocompleteItem>
                            <AutocompleteItem key="Jueves" value="Jueves">Jueves</AutocompleteItem>
                            <AutocompleteItem key="Viernes" value="Viernes">Viernes</AutocompleteItem>
                        </Autocomplete>
                    </div>
                    <div>
                        <Autocomplete
                            variant="faded"
                            label="Periodo"
                            name="periodo"
                            selectedKey={horario.periodo.nombre}
                            onSelectionChange={(selected) => {
                                const selectedValue = selected ? selected.toString() : '';
                                handlePeriodoChange(selectedValue);
                            }}
                            required
                        >
                            {periodos.map(periodo => (
                                <AutocompleteItem key={periodo.nombre} value={periodo.nombre}>
                                    {periodo.nombre}
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

export default HorarioForm;
