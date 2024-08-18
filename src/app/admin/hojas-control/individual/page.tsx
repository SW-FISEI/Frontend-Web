"use client"

import PDF from '@/components/PDF';
import React from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';

const Individual = () => {
  return (
    <div>
      <PDFDownloadLink document={<PDF />} fileName='registro_practicas.pdf'>
        {({ loading }) => loading ? <button>Cargando</button> : <button>Descargar</button>}
      </PDFDownloadLink>
      <PDFViewer style={{ width: '100%', height: '600px' }}>
        <PDF />
      </PDFViewer>
    </div>
  );
}

export default Individual;
