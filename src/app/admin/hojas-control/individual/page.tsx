"use client"

import React, { useState, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import PDF from '@/components/PDF';
import TituloPagina from '@/components/titulo-pagina';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Input, Button, Autocomplete, AutocompleteItem, CircularProgress } from "@nextui-org/react";
import '@/styles/formulario.scss';

interface Carrera {
  id: number;
  nombre: string;
}

interface Semestre {
  id: number;
  nombre: string;
}

interface Paralelo {
  id: number;
  nombre: string;
}

interface Aula {
  id: number;
  nombre: string;
}

interface Docente {
  cedula: string;
  docente: string;
}

interface Materia {
  id: number;
  nombre: string;
}

interface Laboratorista {
  cedula: string;
  laboratorista: string;
}

const individual = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [semestres, setSemestres] = useState<Semestre[]>([]);
  const [paralelos, setParalelos] = useState<Paralelo[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [laboratoristas, setLaboratoristas] = useState<Laboratorista[]>([]);
  const [fecha, setFecha] = useState<string>('');
  const [inicio, setInicio] = useState<string>('');
  const [fin, setFin] = useState<string>('');

  const [selectedCarrera, setSelectedCarrera] = useState<string | null>(null);
  const [selectedSemestre, setSelectedSemestre] = useState<string | null>(null);
  const [selectedParalelo, setSelectedParalelo] = useState<string | null>(null);
  const [selectedAula, setSelectedAula] = useState<string | null>(null);
  const [selectedDocente, setSelectedDocente] = useState<string | null>(null);
  const [selectedMateria, setSelectedMateria] = useState<string | null>(null);
  const [selectedLaboratorista, setSelectedLaboratorista] = useState<string | null>(null);
  const [selectedInicio, setSelectedInicio] = useState<string | null>(null);
  const [selectedFin, setSelectedFin] = useState<string | null>(null);

  const [selectedPeriodo, setSelectedPeriodo] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [showPDF, setShowPDF] = useState(false);

  useEffect(() => {
    const fetchData = async (carrera: string = '', semestre: string = '', paralelo: string = '', aula: string = '', docente: string = '', materia: string = '', laboratorista: string = '') => {
      try {
        const carreraResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/carreras/buscar`, { carrera }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        })
        setCarreras(carreraResponse.data);

        const semestreResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/semestres/buscar`, { semestre }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        })
        setSemestres(semestreResponse.data);

        const paraleloResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/paralelos/buscar`, { paralelo }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        })
        setParalelos(paraleloResponse.data);

        const aulaResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/aulas/buscar`, { aula }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        })
        setAulas(aulaResponse.data);

        const docenteResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/docentes/buscar`, { docente }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        })
        setDocentes(docenteResponse.data);

        const materiaResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/materias/buscar`, { materia }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          }
        })
        setMaterias(materiaResponse.data);

        const laboratoristaResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/laboratoristas/buscar`, { laboratorista }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        });
        setLaboratoristas(laboratoristaResponse.data);

        const fechaActual = new Date();
        const dia = String(fechaActual.getDate()).padStart(2, '0');
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const año = fechaActual.getFullYear();
        setFecha(`${dia}/${mes}/${año}`);
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

  const handleCarreraChange = (selected: string) => {
    setSelectedCarrera(selected);
  };

  const handleSemestreChange = (selected: string) => {
    setSelectedSemestre(selected);
  };

  const handleParaleloChange = (selected: string) => {
    setSelectedParalelo(selected);
  };

  const handleAulaChange = (selected: string) => {
    setSelectedAula(selected);
  };

  const handleDocenteChange = (selected: string) => {
    setSelectedDocente(selected);
  };

  const handleMateriaChange = (selected: string) => {
    setSelectedMateria(selected);
  };

  const handleLaboratoristaChange = (selected: string) => {
    setSelectedLaboratorista(selected);
  };

  const handleInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedInicio(e.target.value);
  };

  const handleFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFin(e.target.value);
  };

  const handlePeriodoChange = () => {
    setSelectedPeriodo("test");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPDF(true);
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
      <TituloPagina title="Hoja de control individual" subtitle={'Generar hoja'} />
      <div className="contenedorFormulario">
        {!showPDF ? (
          <form onSubmit={handleSubmit}>
            <div>
              <p>Fecha actual: {fecha}</p>
            </div>
            <div>
              <Autocomplete
                variant="faded"
                label="Semestre"
                name="semestre"
                onSelectionChange={(selected) => {
                  const selectedValue = selected ? selected.toString() : '';
                  handleSemestreChange(selectedValue);
                }}
                required
              >
                {semestres.map(semestre => (
                  <AutocompleteItem key={semestre.nombre} value={semestre.nombre}>
                    {semestre.nombre}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            <div className="contenedorDobleColumna">
              <div>
                <Autocomplete
                  variant="faded"
                  label="Carrera"
                  name="carrera"
                  onSelectionChange={(selected) => {
                    const selectedValue = selected ? selected.toString() : '';
                    handleCarreraChange(selectedValue);
                  }}
                  required
                >
                  {carreras.map(carrera => (
                    <AutocompleteItem key={carrera.nombre} value={carrera.nombre}>
                      {carrera.nombre}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
              <div>
                <Autocomplete
                  variant="faded"
                  label="Paralelo"
                  name="paralelo"
                  onSelectionChange={(selected) => {
                    const selectedValue = selected ? selected.toString() : '';
                    handleParaleloChange(selectedValue);
                  }}
                  required
                >
                  {paralelos.map(paralelo => (
                    <AutocompleteItem key={paralelo.nombre} value={paralelo.nombre}>
                      {paralelo.nombre}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
            </div>
            <div className="contenedorDobleColumna">
              <div>
                <Autocomplete
                  variant="faded"
                  label="Docente"
                  name="docente"
                  onSelectionChange={(selected) => {
                    const selectedValue = selected ? selected.toString() : '';
                    handleDocenteChange(selectedValue);
                  }}
                  required
                >
                  {docentes.map(docente => (
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
                  name="materia"
                  onSelectionChange={(selected) => {
                    const selectedValue = selected ? selected.toString() : '';
                    handleMateriaChange(selectedValue);
                  }}
                  required
                >
                  {materias.map(materia => (
                    <AutocompleteItem key={materia.nombre} value={materia.nombre}>
                      {materia.nombre}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
            </div>
            <div className="contenedorDobleColumna">
              <div>
                <Input
                  variant="faded"
                  type="time"
                  label="Inicio"
                  name="inicio"
                  onChange={handleInicioChange}
                  required
                />
              </div>
              <div>
                <Input
                  variant="faded"
                  type="time"
                  label="Fin"
                  name="fin"
                  onChange={handleFinChange}
                  required
                />
              </div>
            </div>
            <div className="contenedorDobleColumna">
            <div>
                <Autocomplete
                  variant="faded"
                  label="Laboratorista"
                  name="laboratorista"
                  onSelectionChange={(selected) => {
                    const selectedValue = selected ? selected.toString() : '';
                    handleLaboratoristaChange(selectedValue);
                    handlePeriodoChange();
                  }}
                  required
                >
                  {laboratoristas.map(laboratorista => (
                    <AutocompleteItem key={laboratorista.laboratorista} value={laboratorista.laboratorista}>
                      {laboratorista.laboratorista}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
              <div>
                <Autocomplete
                  variant="faded"
                  label="Laboratorio"
                  name="aula"
                  onSelectionChange={(selected) => {
                    const selectedValue = selected ? selected.toString() : '';
                    handleAulaChange(selectedValue);
                  }}
                  required
                >
                  {aulas.map(aula => (
                    <AutocompleteItem key={aula.nombre} value={aula.nombre}>
                      {aula.nombre}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
            </div>
            <div className="botonFormulario">
              <Button color="secondary" onPress={handleCancel}>Cancelar</Button>
              <Button color="primary" type="submit">
                {'Generar'}
              </Button>
            </div>
          </form>
        ) : (
          <PDFViewer width="100%" height="800px">
            <PDF
              periodo={selectedPeriodo}
              carrera={selectedCarrera}
              semestre={selectedSemestre}
              paralelo={selectedParalelo}
              aula={selectedAula}
              docente={selectedDocente}
              materia={selectedMateria}
              inicio={selectedInicio}
              fin={selectedFin}
              fecha={fecha}
              laboratorista={selectedLaboratorista}
            />
          </PDFViewer>
        )}
      </div>
    </section>
  );
};

export default individual;