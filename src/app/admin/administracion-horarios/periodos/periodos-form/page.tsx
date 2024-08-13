"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import TitlePage from '@/components/title-page';
import '@/styles/formulario.scss';
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { useSession } from 'next-auth/react';

interface Periodo {
    id?: number;
    nombre: string;
    inicioMes: string;
    inicioAño: string;
    finMes: string;
    finAño: string;
}

const meses = [
    { name: 'Enero', value: "01" },
    { name: 'Febrero', value: "02" },
    { name: 'Marzo', value: "03" },
    { name: 'Abril', value: "04" },
    { name: 'Mayo', value: "05" },
    { name: 'Junio', value: "06" },
    { name: 'Julio', value: "07" },
    { name: 'Agosto', value: "08" },
    { name: 'Septiembre', value: "09" },
    { name: 'Octubre', value: "10" },
    { name: 'Noviembre', value: "11" },
    { name: 'Diciembre', value: "12" },
];

const generarAnios = (startYear: number, endYear: number) => {
    let years = [];
    for (let year = startYear; year <= endYear; year++) {
        years.push(year);
    }
    return years;
};

const anios = generarAnios(2023, 2030);

const PeriodoForm = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [periodo, setPeriodo] = useState<Periodo>({ nombre: '', inicioMes: '', inicioAño: '', finMes: '', finAño: '' });
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            const obtenerPeriodo = async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/periodos/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.user?.token}`,
                        },
                    });
                    setPeriodo(response.data);
                } catch (error) {
                    console.error('Error al obtener el periodo:', error);
                }
            };
            obtenerPeriodo();
        }
    }, [id, isEditMode, session]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPeriodo({ ...periodo, [name]: value ?? '' });
    };

    const handleSelectChange = (name: string, value: string) => {
        setPeriodo({ ...periodo, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const periodoDatos = {
                nombre: periodo.nombre || '',
                inicioMes: periodo.inicioMes || '',
                inicioAño: periodo.inicioAño || '',
                finMes: periodo.finMes || '',
                finAño: periodo.finAño || ''
            };

            if (isEditMode) {
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/periodos/${id}`, periodoDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/periodos`, periodoDatos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                });
            }
            router.push('/admin/administracion-horarios/periodos');
        } catch (error) {
            console.error('Error al guardar el periodo:', error);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    const añosDisponiblesFin = anios.filter(anio => anio >= parseInt(periodo.inicioAño || '0'));

    const mesesDisponiblesFin = (parseInt(periodo.inicioAño || '0') === parseInt(periodo.finAño || '0'))
        ? meses.filter(mes => parseInt(mes.value) >= parseInt(periodo.inicioMes || '0'))
        : meses;

    return (
        <section className=''>
            <TitlePage title="Periodos" subtitle={isEditMode ? 'Editar Periodo' : 'Agregar Periodo'} />
            <div className="contenedorFormulario">
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input
                            variant="faded"
                            type="text"
                            label="Nombre"
                            name="nombre"
                            value={periodo.nombre}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className='grid grid-cols-2'>
                        <div className='col-start-1 px-2'>
                            <Select
                                variant="faded"
                                label="Mes de Inicio"
                                placeholder="Seleccione un mes"
                                name="inicioMes"
                                selectedKeys={periodo.inicioMes ? [periodo.inicioMes] : ['']}
                                onSelectionChange={(selected) => handleSelectChange('inicioMes', selected.currentKey || '')}
                                className="max-w-full"
                            >
                                {meses.map((mes) => (
                                    <SelectItem key={mes.value} value={mes.value} textValue={mes.name}>
                                        {mes.name}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className='col-start-2 px-2'>
                            <Select
                                variant="faded"
                                label="Mes de Fin"
                                placeholder="Seleccione un mes"
                                name="finMes"
                                selectedKeys={periodo.finMes ? [periodo.finMes] : ['']}
                                onSelectionChange={(selected) => handleSelectChange('finMes', selected.currentKey || '')}
                                className="max-w-full"
                            >
                                {mesesDisponiblesFin.map((mes) => (
                                    <SelectItem key={mes.value} value={mes.value} textValue={mes.name}>
                                        {mes.name}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className='grid grid-cols-2'>
                        <div className='col-start-1 px-2'>
                            <Select
                                variant="faded"
                                label="Inicio Año"
                                placeholder="Seleccione un año"
                                name="inicioAño"
                                selectedKeys={periodo.inicioAño ? [periodo.inicioAño] : ['']}
                                onSelectionChange={(selected) => handleSelectChange('inicioAño', selected.currentKey || '')}
                                className="max-w-full"
                            >
                                {anios.map((anio) => (
                                    <SelectItem key={anio.toString()} value={anio.toString()} textValue={anio.toString()}>
                                        {anio}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className='col-start-2 px-2'>
                            <Select
                                variant="faded"
                                label="Fin Año"
                                placeholder="Seleccione un año"
                                name="finAño"
                                selectedKeys={periodo.finAño ? [periodo.finAño] : ['']}
                                onSelectionChange={(selected) => handleSelectChange('finAño', selected.currentKey || '')}
                                className="max-w-full"
                            >
                                {añosDisponiblesFin.map((anio) => (
                                    <SelectItem key={anio.toString()} value={anio.toString()} textValue={anio.toString()}>
                                        {anio}
                                    </SelectItem>
                                ))}
                            </Select>
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

export default PeriodoForm;
