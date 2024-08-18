import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

/* IMPORTAR LOGOS */
const logoFISEI = '/logo.png';
const logoUTA = '/logoUTA.png';

Font.register({
    family: 'Playfair Display',
    fonts: [
        { src: '/fonts/PlayfairDisplay-Regular.ttf', fontWeight: 'normal' },
        { src: '/fonts/PlayfairDisplay-Bold.ttf', fontWeight: 'bold' },
    ]
});

const styles = StyleSheet.create({
    page: {
        paddingVertical: 20,
        paddingHorizontal: 50,
        fontSize: 10,
        fontFamily: 'Playfair Display',
        textTransform: 'uppercase'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center',
        marginBottom: 10
    },
    logo: {
        width: 50,
        height: 50,
    },
    section: {
        marginBottom: 10,
    },
    row1: {
        flexDirection: 'row',
        width: '100%',
    },
    column1: {
        minWidth: '50%',
        flexDirection: 'row',
        marginBottom: 5
    },
    row2: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    column2: {
        flexDirection: 'row',
        marginBottom: 5
    },
    tableTitle: {
        justifyContent: 'center',
        textAlign: 'center',
    },
    table: {
        display: "flex",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: '#000',
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        borderBottomStyle: 'solid',
    },
    tableCustomRow: {
        flexDirection: "row",
    },
    tableCol1: {
        width: "10%",
        textAlign: "center",
        fontWeight: "bold",
        alignItems: "center"
    },
    tableCol2: {
        borderLeftWidth: 1,
        borderLeftColor: '#000',
        borderLeftStyle: 'solid',
        borderRightWidth: 1,
        borderRightColor: '#000',
        borderRightStyle: 'solid',
        width: "60%",
        textAlign: "center",
        fontWeight: "bold"
    },
    tableCol3: {
        width: "30%",
        textAlign: "center",
        fontWeight: "bold"
    },
    tableCenterCol: {
        width: "60%",
        height: 26,
        borderLeftWidth: 1,
        borderLeftColor: '#000',
        borderLeftStyle: 'solid',
        borderRightWidth: 1,
        borderRightColor: '#000',
        borderRightStyle: 'solid',
    },
    tableCenterRow: {
        height: 13
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

interface PDFProps {
    periodo: string | null;
    carrera: string | null;
    semestre: string | null;
    paralelo: string | null;
    aula: string | null;
    docente: string | null;
    materia: string | null;
    inicio: string | null;
    fin: string | null;
    fecha: string;
    laboratorista: string | null;
}

function PDF({ periodo, carrera, semestre, paralelo, aula, docente, materia, inicio, fin, fecha, laboratorista }: PDFProps) {
    return (
        <Document>
            <Page style={styles.page}>
                {/* Encabezado */}
                <View style={styles.header}>
                    <Image src={logoUTA} style={styles.logo} />
                    <View style={{ flex: 1, textAlign: 'center' }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>UNIVERSIDAD TÉCNICA DE AMBATO</Text>
                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>FISEI</Text>
                        <Text style={{ fontSize: 10, fontWeight: 'normal' }}>CARRERA DE {carrera}</Text>
                    </View>
                    <Image src={logoFISEI} style={styles.logo} />
                </View>

                {/* Detalles del Laboratorio */}
                <View style={styles.section}>
                    <View style={styles.row1}>
                        <View style={styles.column1}>
                            <Text style={{ marginRight: 10, fontWeight: 'bold' }}>LABORATORIO:</Text>
                            <Text>{aula}</Text>
                        </View>
                        <View style={styles.column1}>
                            <Text style={{ marginRight: 10, fontWeight: 'bold' }}>DOCENTE:</Text>
                            <Text>{docente}</Text>
                        </View>
                    </View>
                    <View style={styles.row1}>
                        <View style={styles.column1}>
                            <Text style={{ marginRight: 10, fontWeight: 'bold' }}>AUXILIAR DE LABORATORIO:</Text>
                            <Text>{laboratorista}</Text>
                        </View>
                        <View style={styles.column1}>
                            <Text style={{ marginRight: 10, fontWeight: 'bold' }}>PERIODO ACADÉMICO:</Text>
                            <Text>{periodo}</Text>
                        </View>
                    </View>
                    <View style={styles.row1}>
                        <View style={styles.column1}>
                            <Text style={{ marginRight: 10, fontWeight: 'bold' }}>NIVEL:</Text>
                            <Text>{semestre} {paralelo}</Text>
                        </View>
                        <View style={styles.column1}>
                            <Text style={{ marginRight: 10, fontWeight: 'bold' }}>FECHA:</Text>
                            <Text>{fecha}</Text>
                        </View>
                    </View>
                    <View style={styles.row2}>
                        <View style={styles.column2}>
                            <Text style={{ marginRight: 10, fontWeight: 'bold' }}>H.INGRESO:</Text>
                            <Text>{inicio}</Text>
                        </View>
                        <View style={styles.column2}>
                            <Text style={{ marginRight: 10, fontWeight: 'bold' }}>H.SALIDA:</Text>
                            <Text>{fin}</Text>
                        </View>
                        <View style={styles.column2}>
                            <Text style={{ marginRight: 10, fontWeight: 'bold' }}>H.PRACTICAS:</Text>
                            <Text>____</Text>
                        </View>
                    </View>
                    <View style={styles.row1}>
                        <View style={styles.column1}>
                            <Text style={{ marginRight: 10, fontWeight: 'bold' }}>MATERIA:</Text>
                            <Text>{materia}</Text>
                        </View>
                        <View style={styles.column1}>
                            <Text style={{ marginRight: 10, fontWeight: 'bold' }}>TEMA DE LA PRÁCTICA:</Text>
                            <Text>_____________________</Text>
                        </View>
                    </View>
                </View>

                {/* Tabla de Registro de Prácticas */}
                <View style={styles.tableTitle}>
                    <Text style={{ fontWeight: 'bold' }}>REGISTRO DE PRÁCTICAS DE LABORATORIO</Text>
                </View>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol1}><Text>#MAQ</Text></View>
                        <View style={styles.tableCol2}><Text>NÓMINA DE ESTUDIANTES</Text></View>
                        <View style={styles.tableCol3}><Text>OBSERVACIONES</Text></View>
                    </View>
                    {[...Array(19)].map((_, i) => (
                        <View style={styles.tableRow} key={i}>
                            <View style={styles.tableCol1}><Text>{i + 1}</Text></View>
                            <View style={styles.tableCenterCol}>
                                <View style={[styles.tableCenterRow, { borderBottomWidth: 1, borderBottomColor: '#000', borderBottomStyle: 'solid' }]}>
                                    <Text></Text>
                                </View>
                                <View style={styles.tableCenterRow}>
                                    <Text></Text>
                                </View>
                            </View>
                            <View style={styles.tableCol3}><Text></Text></View>
                        </View>
                    ))}
                    <View style={styles.tableCustomRow}>
                        <View style={styles.tableCol1}><Text>20</Text></View>
                        <View style={styles.tableCenterCol}>
                            <View style={[styles.tableCenterRow, { borderBottomWidth: 1, borderBottomColor: '#000', borderBottomStyle: 'solid' }]}>
                                <Text></Text>
                            </View>
                            <View style={styles.tableCenterRow}>
                                <Text></Text>
                            </View>
                        </View>
                        <View style={styles.tableCol3}><Text></Text></View>
                    </View>
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
