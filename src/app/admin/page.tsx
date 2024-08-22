"use client";

import { useSession } from "next-auth/react";
import '@/styles/home.scss';
import { Button, Calendar, CircularProgress, DateValue, Image, Input, ScrollShadow } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import ClockLive from 'react-live-clock';
import { useCallback, useEffect, useState } from "react";
import 'react-clock/dist/Clock.css';
import React from "react";
import { today, getLocalTimeZone, isWeekend } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import axios from "axios";
import { useRouter, useSearchParams } from 'next/navigation';

const AdminHome = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  // Estado para el horario y la búsqueda
  const [detalleHorario, setDetalleHorario] = useState<any[]>([]);
  const [horariosFiltrados, setHorariosFiltrados] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Estados para los contadores
  const [totalCarreras, setTotalCarreras] = useState<number>(0);
  const [totalMaterias, setTotalMaterias] = useState<number>(0);
  const [totalDocentes, setTotalDocentes] = useState<number>(0);
  const [totalLaboratoristas, setTotalLaboratoristas] = useState<number>(0);
  const [totalAulas, setTotalAulas] = useState<number>(0);

  // Calendario
  let [date, setDate] = React.useState<DateValue>(today(getLocalTimeZone()));
  let { locale } = useLocale();
  let isInvalid = isWeekend(date, locale);

  // Relog Analogo
  const [time, setTime] = useState(new Date());

  const filtrarHorariosPorDia = useCallback((dia: string) => {
    const horarios = detalleHorario.filter((horario) => horario.dia.toLowerCase() === dia.toLowerCase());
    setHorariosFiltrados(horarios);
  }, [detalleHorario]);

  useEffect(() => {
    if (date) {
      const selectedDay = new Date(date.year, date.month - 1, date.day).toLocaleDateString('es-ES', { weekday: 'long' });
      filtrarHorariosPorDia(selectedDay);
    }
  }, [date, filtrarHorariosPorDia]);

  const obtenerDetalleHorario = useCallback(async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-horarios/buscarA`, { nombre }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        }
      });
      setDetalleHorario(response.data);
    } catch (error) {
      console.error('Error al obtener:', error);
    }
  }, [session?.user?.token]);

  //Total Carreras
  const obtenerCarreras = useCallback(async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/carreras/buscar`, { nombre }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      setTotalCarreras(response.data.length);
    } catch (error) {
      console.error('Error al obtener carreras:', error);
    }
  }, [session?.user?.token]);

  //Total Materias
  const obtenerMaterias = useCallback(async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/materias/buscar`, { nombre }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      setTotalMaterias(response.data.length);
    } catch (error) {
      console.error('Error al obtener materias:', error);
    }
  }, [session?.user?.token]);


  //Total Docentes
  const obtenerDocentes = useCallback(async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/docentes/buscar`, { nombre },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        }
      );
      setTotalDocentes(response.data.length);
    } catch (error) {
      console.error('Error al obtener docentes:', error);
    }
  }, [session?.user?.token]);


  //Total Laboratoristas
  const obtenerLaboratoristas = useCallback(async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/laboratoristas/buscar`, { nombre },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        }
      );
      setTotalLaboratoristas(response.data.length);
    } catch (error) {
      console.error('Error al obtener laboratoristas:', error);
    }
  }, [session?.user?.token]);


  //Total Aulas
  const obtenerAula = useCallback(async (nombre: string = "") => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/aulas/buscar`, { nombre }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        }
      });
      setTotalAulas(response.data.length);
    } catch (error) {
      console.error('Error al obtener aulas:', error);
    }
  }, [session?.user?.token]);

  const filtrarPorBusqueda = (horarios: any[], term: string) => {
    return horarios.filter((horario) =>
      horario.materia.materia.nombre.toLowerCase().includes(term.toLowerCase()) ||
      horario.docente.docente.toLowerCase().includes(term.toLowerCase()) ||
      horario.aula.nombre.toLowerCase().includes(term.toLowerCase()) ||
      horario.materia.carrera.nombre.toLowerCase().includes(term.toLowerCase()) ||
      horario.materia.semestre.nombre.toLowerCase().includes(term.toLowerCase()) ||
      horario.materia.paralelo.nombre.toLowerCase().includes(term.toLowerCase())
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  const horariosMostrados = filtrarPorBusqueda(horariosFiltrados, searchTerm);

  // Navegación
  const navigateTo = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    if (session?.user?.token) {
      obtenerDetalleHorario();
      obtenerCarreras();
      obtenerMaterias();
      obtenerDocentes();
      obtenerLaboratoristas();
      obtenerAula();
    }
  }, [session?.user?.token, obtenerAula, obtenerCarreras, obtenerDetalleHorario, obtenerDocentes, obtenerLaboratoristas, obtenerMaterias]);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [session?.user?.token, obtenerAula, obtenerCarreras, obtenerDetalleHorario, obtenerDocentes, obtenerLaboratoristas, obtenerMaterias]);

  useEffect(() => {
    if (date) {
      const selectedDay = new Date(date.year, date.month - 1, date.day).toLocaleDateString('es-ES', { weekday: 'long' });
      filtrarHorariosPorDia(selectedDay);
    }
  }, [session?.user?.token, date, filtrarHorariosPorDia]);

  if (status === "loading") {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress label="Cargando..." />
      </div>
    );
  }

  return (
    <div className="contenedorPagina">
      <div className="contenedorTarjetaPrincipal">
        <div className="encabezado">
          <div className="tituloEncabezado">
            <h1>FISEI</h1>
            <p>Facultad de ingeniería en sistemas, electrónica e industrial</p>
          </div>
          <div className="hora">
            <h2>
              <ClockLive format="HH:mm:ss" interval={1000} ticking={true} />
            </h2>
          </div>
        </div>
        <div className="contenedorSubtarjetas">
          <div className="subtarjeta">
            <p className="numero">{totalCarreras}</p>
            <p className="descripcion">Carreras</p>
          </div>
          <div className="subtarjeta">
            <p className="numero">{totalMaterias}</p>
            <p className="descripcion">Materias</p>
          </div>
          <div className="subtarjeta">
            <p className="numero">{totalDocentes}</p>
            <p className="descripcion">Docentes</p>
          </div>
          <div className="subtarjeta">
            <p className="numero">{totalLaboratoristas}</p>
            <p className="descripcion">Laboratoristas</p>
          </div>
          <div className="subtarjeta">
            <p className="numero">{totalAulas}</p>
            <p className="descripcion">Aulas</p>
          </div>
        </div>
      </div>
      <div className="contenedorTarjetas">
        <div className="contenedorTarjetasPrincipal">
          <div className="tarjetaAcciones">
            <div className="encabezadoTarjeta">
              <h2>Hojas de control</h2>
            </div>
            <div className="cuerpoTarjeta">
              <div className="botonTarjeta" onClick={() => navigateTo("/admin/hojas-control/individual")}>
                <Icon icon="lucide:clipboard-minus" width="40" height="40" />
                <p>Individual</p>
              </div>
              <div className="botonTarjeta" onClick={() => navigateTo("/admin/hojas-control/por-bloque")}>
                <Icon icon="lucide:clipboard-list" width="40" height="40" />
                <p>Por bloque</p>
              </div>
            </div>
          </div>
          <div className="tarjetaAcciones">
            <div className="encabezadoTarjeta">
              <h2>Consultas</h2>
            </div>
            <div className="cuerpoTarjeta">
              <div className="botonTarjeta" onClick={() => navigateTo("/admin/consultas/docentes")}>
                <Icon icon="lucide:users" width="40" height="40" />
                <p>Docentes</p>
              </div>
              <div className="botonTarjeta" onClick={() => navigateTo("/admin/consultas/laboratorios")}>
                <Icon icon="lucide:pc-case" width="40" height="40" />
                <p>Laboratorios</p>
              </div>
            </div>
          </div>
        </div>
        <div className="contenedorTarjetasPrincipal">
          <Calendar
            aria-label="Date (Invalid on weekends)"
            errorMessage={isInvalid ? "Cerrado los fines de semana" : undefined}
            isInvalid={isInvalid}
            value={date}
            onChange={setDate}
          />
        </div>
        <div className="contenedorTarjetasPrincipal">
          <div className="tarjeta">
            <ScrollShadow
              hideScrollBar
              offset={100}
              orientation="horizontal"
              className="max-h-[300px]"
            >
              <Input
                className="buscadorHorario"
                type="text"
                placeholder="Busque por cualquier campo"
                labelPlacement="outside"
                endContent={
                  <Icon icon="lucide:search" />
                }
                onChange={handleSearchChange}
                value={searchTerm}
              />
              {horariosMostrados.map((horario, index) => (
                <div key={index} className="contenedorHorario">
                  <h2 className="nombreMateria">{horario.materia.materia.nombre}</h2>
                  <p><strong>Docente:</strong> {horario.docente.docente}</p>
                  <p><strong>Aula:</strong> {horario.aula.nombre}</p>
                  <p><strong>Carrera:</strong> {horario.materia.carrera.nombre}</p>
                  <p><strong>Semestre:</strong> {horario.materia.semestre.nombre}</p>
                  <p><strong>Paralelo:</strong> {horario.materia.paralelo.nombre}</p>
                </div>
              ))}
            </ScrollShadow>
          </div>
        </div>
      </div>
    </div>
  );

}

export default AdminHome