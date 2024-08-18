import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

/* IMPORTAR LOGOS */
const logoFISEI = '/logo.png';
const logoUTA = '/logoUTA.png';

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
    },
    header: {
        textAlign: 'center',
        marginBottom: 10,
    },
    logosContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    logo: {
        width: 50, // Ajusta el ancho del logo
        height: 50, // Ajusta la altura del logo
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    table: {
        display: "flex",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: '#000',
        marginTop: 10
    },
    tableRow: {
        flexDirection: "row",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: '#000'
    },
    tableColHeader: {
        width: "33.33%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: '#000',
        textAlign: "center",
        fontWeight: "bold"
    },
    tableCol: {
        width: "33.33%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: '#000',
        textAlign: "center"
    },
    tableCellHeader: {
        margin: 5,
        fontWeight: "bold"
    },
    tableCell: {
        margin: 5
    },
    signatureSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    signature: {
        textAlign: 'center',
        marginTop: 30,
        width: '30%',
        borderTop: '1px solid black',
    }
});

function PDF() {
    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.logosContainer}>
                    <Image src={logoUTA} style={styles.logo} />
                    <Image src={logoFISEI} style={styles.logo} />
                </View>

                {/* Encabezado */}
                <View style={styles.header}>
                    <Text>UNIVERSIDAD TÉCNICA DE AMBATO</Text>
                    <Text>FISEI</Text>
                    <Text>CARRERA DE TELECOMUNICACIONES</Text>
                </View>

                {/* Detalles del Laboratorio */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text>LABORATORIO: LABORATORIO 8</Text>
                        <Text>DOCENTE: ROBALINO PEÑA EDGAR FREDDY</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>AUXILIAR DE LABORATORIO: DIANA GARCÉS</Text>
                        <Text>PERIODO ACADÉMICO: MARZO - AGOSTO 2024</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>NIVEL: TERCERO A</Text>
                        <Text>FECHA: 8 de Abril de 2024</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>H.INGRESO: 11H00</Text>
                        <Text>H.SALIDA: 13H00</Text>
                        <Text>H.PRACTICAS: ____</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>MATERIA: PROGRAMACIÓN AVANZADA</Text>
                        <Text>TEMA DE LA PRÁCTICA: ___________________________</Text>
                    </View>
                </View>

                {/* Tabla de Registro de Prácticas */}
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeader}><Text>#MAQ</Text></View>
                        <View style={styles.tableColHeader}><Text>NÓMINA DE ESTUDIANTES</Text></View>
                        <View style={styles.tableColHeader}><Text>OBSERVACIONES</Text></View>
                    </View>
                    {[...Array(20)].map((_, i) => (
                        <View style={styles.tableRow} key={i}>
                            <View style={styles.tableCol}><Text>{i + 1}</Text></View>
                            <View style={styles.tableCol}><Text></Text></View>
                            <View style={styles.tableCol}><Text></Text></View>
                        </View>
                    ))}
                </View>

                {/* Sección de Firmas */}
                <View style={styles.signatureSection}>
                    <Text style={styles.signature}>FIRMA DEL DOCENTE</Text>
                    <Text style={styles.signature}>FIRMA DEL RESPONSABLE</Text>
                </View>
            </Page>
        </Document>
    );
}

export default PDF;
