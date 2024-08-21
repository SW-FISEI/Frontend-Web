"use client"

import React, { useState, useEffect } from 'react';
import { Document, Page, PDFViewer } from '@react-pdf/renderer';
import PDF from '@/components/PDF';
import TituloPagina from '@/components/titulo-pagina';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Button, Autocomplete, AutocompleteItem, CircularProgress } from "@nextui-org/react";
import { CalendarDate, CalendarDateTime, ZonedDateTime } from '@internationalized/date';
import '@/styles/formulario.scss';
import SelectorFecha from '@/components/selector-fecha';

interface Materia {
  id: number;
  nombre: string;
}

interface Paralelo {
  id: number;
  nombre: string;
}

interface Semestre {
  id: number;
  nombre: string;
}

interface Carrera {
  id: number;
  nombre: string;
}

interface Detalle_Materia {
  id: number;
  carrera: Carrera;
  semestre: Semestre;
  paralelo: Paralelo;
  materia: Materia;
}

interface Laboratorista {
  cedula: string;
  laboratorista: string;
}

interface Edificio {
  id: number;
  nombre: string;
}

interface Aula {
  id: number;
  nombre: string;
}

interface Docente {
  id: number;
  docente: string;
}

interface Periodo {
  id: number;
  nombre: string;
}

interface DetalleHorario {
  periodo: Periodo;
  materia: Detalle_Materia;
  aula: Aula;
  docente: Docente;
  inicio: string;
  fin: string;
  dia: string;
  fecha: string;
  laboratorista?: { laboratorista: string } | null;
}

const PorBloque = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [edificios, setEdificio] = useState<Edificio[]>([]);
  const [laboratoristas, setLaboratoristas] = useState<Laboratorista[]>([]);
  const [detalleHorarios, setDetalleHorarios] = useState<DetalleHorario[]>([]);

  const [selectedEdificio, setSelectedEdificio] = useState<string | null>(null);
  const [selectedLaboratoristaMañana, setSelectedLaboratoristaMañana] = useState<string | null>(null);
  const [selectedLaboratoristaTarde, setSelectedLaboratoristaTarde] = useState<string | null>(null);
  const [selectedFecha, setSelectedFecha] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [showPDF, setShowPDF] = useState(false);

  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha);
    date.setDate(date.getDate() + 1); // Sumar un día

    const dias = [
      "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
    ];
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const año = date.getFullYear();

    return `${dia} de ${mes} de ${año}`;
  };

  useEffect(() => {
    const fetchData = async (edificio: string = '', laboratorista: string = '') => {
      try {
        const carreraResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/edificios/buscar`, { edificio }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        });
        console.log("Datos de edificios:", carreraResponse.data);
        setEdificio(carreraResponse.data);

        const laboratoristaResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/laboratoristas/buscar`, { laboratorista }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        });
        console.log("Datos de laboratoristas:", laboratoristaResponse.data);
        setLaboratoristas(laboratoristaResponse.data);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.token) {
      fetchData();
    }
  }, [id, session?.user?.token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedFecha) {
      console.error("No se ha seleccionado una fecha.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/detalle-horarios/buscarE`, { edificio: selectedEdificio }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });

      if (response.data) {
        const fechaFormateada = formatearFecha(selectedFecha);
        console.log("Fecha formateada:", fechaFormateada);

        const selectedDate = new Date(selectedFecha);
        const dayOfWeekMap = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo',];
        const selectedDay = dayOfWeekMap[selectedDate.getDay()];
        console.log("Día seleccionado:", selectedDay);

        const filteredHorarios = response.data.filter((detalles: DetalleHorario) => {
          return detalles.dia.trim() === selectedDay.trim();
        });

        const updatedHorarios = filteredHorarios.map((detalles: DetalleHorario) => {
          detalles.fecha = fechaFormateada;

          const formatTime = (timeString: string) => {
            const [hours, minutes] = timeString.split(':');
            return `${hours}H${minutes}`;
          };

          detalles.inicio = formatTime(detalles.inicio);
          detalles.fin = formatTime(detalles.fin);

          const horaInicio = parseInt(detalles.inicio.split(':')[0], 10);

          let laboratoristaAsignado = null;

          if (horaInicio >= 14) {
            laboratoristaAsignado = laboratoristas.find(l => l.laboratorista === selectedLaboratoristaTarde) || null;
          } else {
            laboratoristaAsignado = laboratoristas.find(l => l.laboratorista === selectedLaboratoristaMañana) || null;
          }

          console.log("Laboratorista asignado:", laboratoristaAsignado);

          detalles.laboratorista = laboratoristaAsignado;

          console.log("Detalles del horario después de asignar laboratorista:", detalles);

          return detalles;
        });

        setDetalleHorarios(updatedHorarios);
        setShowPDF(true);
      }
    } catch (error) {
      console.error("Error al buscar los horarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdificioChange = async (selected: string) => {
    console.log("Edificio seleccionado:", selected);
    setSelectedEdificio(selected);

    const edificioSeleccionado = edificios.find(e => e.nombre === selected);
    if (edificioSeleccionado) {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/laboratoristas/edificio/${edificioSeleccionado.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        });
        console.log("Laboratoristas para el edificio:", response.data);
        setLaboratoristas(response.data);
      } catch (error) {
        console.error("Error al obtener los laboratoristas:", error);
      }
    }
  };

  const handleLaboratoristaMañanaChange = (selected: string) => {
    console.log("Laboratorista mañana seleccionado:", selected);
    setSelectedLaboratoristaMañana(selected);
  };

  const handleLaboratoristaTardeChange = (selected: string) => {
    console.log("Laboratorista tarde seleccionado:", selected);
    setSelectedLaboratoristaTarde(selected);
  };

  const handleFechaChange = (value: CalendarDate | CalendarDateTime | ZonedDateTime | null) => {
    if (value) {
      if (value instanceof CalendarDate) {
        const date = new Date(value.year, value.month - 1, value.day);
        const dateString = date.toISOString().split('T')[0];
        console.log("Fecha seleccionada (formato yyyy-MM-dd):", dateString);
        setSelectedFecha(dateString);

        const dayOfWeekMap = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const selectedDay = dayOfWeekMap[date.getDay()];
        console.log("Día seleccionado:", selectedDay);
      } else {
        console.error("El valor seleccionado no es una instancia de CalendarDate.");
      }
    } else {
      console.error("No se seleccionó una fecha.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress label="Cargando..." />
      </div>
    );
  }

  return (
    <section>
      <TituloPagina title="Hoja de control por bloque" subtitle={'Generar hoja'} />
      <div className="contenedorFormulario">
        {!showPDF ? (
          <form onSubmit={handleSubmit}>
            <div>
              <Autocomplete
                variant="faded"
                label="Bloque"
                name="edificio"
                onSelectionChange={(selected) => {
                  const selectedValue = selected ? selected.toString() : '';
                  handleEdificioChange(selectedValue);
                }}
                isRequired
              >
                {edificios.map((edificio) => (
                  <AutocompleteItem key={edificio.nombre} value={edificio.nombre}>
                    {edificio.nombre}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            <div>
              <SelectorFecha
                variant="faded"
                showMonthAndYearPickers
                label="Fecha"
                name="fecha"
                onChange={handleFechaChange}
              />
            </div>
            <div>
              <Autocomplete
                variant="faded"
                label="Laboratorista mañana"
                name="laboratoristaMañana"
                onSelectionChange={(selected) => {
                  const selectedValue = selected ? selected.toString() : '';
                  handleLaboratoristaMañanaChange(selectedValue);
                }}
                value={selectedLaboratoristaMañana || ''}
                isRequired
              >
                {laboratoristas.map((laboratorista) => (
                  <AutocompleteItem key={laboratorista.laboratorista} value={laboratorista.laboratorista}>
                    {laboratorista.laboratorista}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            <div>
              <Autocomplete
                variant="faded"
                label="Laboratorista tarde"
                name="laboratoristaTarde"
                onSelectionChange={(selected) => {
                  const selectedValue = selected ? selected.toString() : '';
                  handleLaboratoristaTardeChange(selectedValue);
                }}
                value={selectedLaboratoristaTarde || ''}
                isRequired
              >
                {laboratoristas.map((laboratorista) => (
                  <AutocompleteItem key={laboratorista.laboratorista} value={laboratorista.laboratorista}>
                    {laboratorista.laboratorista}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            <div className="botonFormulario">
              <Button color="secondary" onPress={handleCancel}>Cancelar</Button>
              <Button color="primary" type="submit">
                {'Generar'}
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="botonFormulario mb-5">
              <Button color="primary" onPress={() => setShowPDF(false)}>
                Volver al formulario
              </Button>
            </div>
            <PDFViewer width="100%" height="800px">
              <Document>
                {detalleHorarios.map((detalles: DetalleHorario, index: number) => (
                  <Page key={index}>
                    <PDF
                      periodo={detalles.periodo.nombre}
                      carrera={detalles.materia.carrera.nombre}
                      semestre={detalles.materia.semestre.nombre}
                      paralelo={detalles.materia.paralelo.nombre}
                      aula={detalles.aula.nombre}
                      docente={detalles.docente.docente}
                      materia={detalles.materia.materia.nombre}
                      inicio={detalles.inicio}
                      fin={detalles.fin}
                      fecha={detalles.fecha}
                      laboratorista={detalles.laboratorista ? detalles.laboratorista.laboratorista : null}
                    />
                  </Page>
                ))}
              </Document>
            </PDFViewer>
          </>
        )}
      </div>
    </section>
  );
};

export default PorBloque;