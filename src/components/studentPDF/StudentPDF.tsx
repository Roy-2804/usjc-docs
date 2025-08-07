import React, { useEffect, useState } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link
} from '@react-pdf/renderer';
import {FormData} from "../../interface"
import { generateQrBase64 } from '../../services/docsService';


const styles = StyleSheet.create({
  page: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    fontSize: 12
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 0,
    marginBottom: 40,
  },
  logo: {
    width: '30%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002E60',
    width: '40%'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002E60',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 30,
    textTransform: 'uppercase'
  },
  line: {
    width: 4,
    backgroundColor: '#002E60',
    height: 100,
  },
  general: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  cell: {
    padding: 6,
    border: '1pt solid white',
    backgroundColor: '#ddd',
    fontSize: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  wide: {
    flexBasis: '50%',
    flexGrow: 0,
    flexShrink: 0,
  },
  fullText: {
    flexBasis: '100%',
    flexGrow: 0,
    flexShrink: 0,
  },
  full: {
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#003c64',
    color: 'white',
    padding: 6,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 6,
  },
  checkboxWrapper: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
    width: '400'
  },
  checkboxLabel: {
    color: 'black',
    width: '350'
  },
  checkbox: {
    backgroundColor: '#ddd',
    height: 20,
    width: 20,
  },
  green: {
    backgroundColor: '#22c55e',
  },
  listItem: {
    flexBasis: '100%',
    width: '100%'
  },
  qrWrapper: {
    marginTop: 20
  },
  qrImage: {
    height: '100px',
    margin: '0 auto',
    width: '100px'
  }
});

interface Props {
    student: FormData;
}

const StudentPDF: React.FC<Props> = ({ student }) => {
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    if (student.link) {
      generateQrBase64(student.link).then(setQrCode);
    }
  }, [student.link]);

  const getValidLink = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <View style={styles.header}>
            <Image
              style={styles.logo}
              src="../../../public/logo.png"
            />
            <View style={styles.line}></View>
            <Text style={styles.title}>
              Expediente{'\n'}Académico{'\n'}Estudiantil
            </Text>
          </View>
          <Text style={styles.subtitle}>Datos generales</Text>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.wide]}>
              <Text style={styles.label}>Nombre del estudiante:</Text> {student.studentName}
            </Text>
            <Text style={[styles.cell, styles.wide]}>
              <Text style={styles.label}>Sexo:</Text> {student.gender}
            </Text>
          </View>
  
          <View style={styles.row}>
            <Text style={[styles.cell, styles.wide]}>
              <Text style={styles.label}>Identificación:</Text> {student.idNumber}
            </Text>
            <Text style={[styles.cell, styles.wide]}>
              <Text style={styles.label}>Tipo de documento:</Text> {student.idType}
            </Text>
          </View>
  
          <Text style={styles.full}>Condición del estudiante</Text>
  
          <View style={styles.row}>
            <Text style={[styles.cell, styles.wide]}>
              <Text style={styles.label}>Económica:</Text> {student.studentCondition}
            </Text>
            <Text style={[styles.cell, styles.wide]}>
              <Text style={styles.label}>Estatus:</Text> {student.studentState}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.wide]}>
              <Text style={styles.label}>Cantidad de carreras:</Text> {student.subjectCount}
            </Text>
            <Text style={[styles.cell, styles.wide]}>
              <Text style={styles.label}>Última Matrícula:</Text> {student.studentRegistration ? student.studentRegistration : "Sin registro"}
            </Text>
          </View>
          <Text style={styles.full}>Carreras</Text>
          {Array.from({ length: parseInt(student.subjectCount) || 0 }).map((_, idx) => (
            <View key={idx}>
              <Text style={[styles.label]}>Carrera: {student.career[idx] || "(Sin carrera)"} {"\n"}</Text>
              <Text style={[styles.label]}>Grado: {student.grade[idx] || "(Sin grado)"}</Text>
          </View>
          ))}
          <Text style={styles.subtitle}>DOCUMENTACIÓN</Text>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Copia del documento de identificación</Text>
            <Text style={ student.documentosAdjuntos.includes("Copia del documento de identificación") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Fotografía</Text>
            <Text style={ student.documentosAdjuntos.includes("Fotografía") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Título de secundaria</Text>
            <Text style={ student.documentosAdjuntos.includes("Título de secundaria") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Verificación plataforma del MEP</Text>
            <Text style={ student.documentosAdjuntos.includes("Verificación plataforma del MEP") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Certificación de estudios cursados en otras instituciones{'\n'}
            (aplica para convalidación de materias)</Text>
            <Text style={ student.documentosAdjuntos.includes("Certificación de estudios cursados en otras instituciones (aplica para convalidación de materias)") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Certificación de TCU (otra universidad)</Text>
            <Text style={ student.documentosAdjuntos.includes("Certificación de TCU (otra universidad)") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Documento de validación de títulos{'\n'}
            y apostillas en caso de estudios en el exterior</Text>
            <Text style={ student.documentosAdjuntos.includes("Documento de validación de títulos y apostillas en caso de estudios en el exterior") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Copia del título universitario requerido{'\n'}
              (aplica para matrícula en licenciatura o maestría)</Text>
            <Text style={ student.documentosAdjuntos.includes("Copia del título universitario requerido") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <Text style={styles.subtitle}>CONVALIDACIONES</Text>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Pre estudio de convalidación</Text>
            <Text style={ student.convalidaciones.includes("Pre estudio de convalidación") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Resolución de convalidación de estudios</Text>
            <Text style={ student.convalidaciones.includes("Resolución de convalidación de estudios") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>No registra / no posee</Text>
            <Text style={ student.convalidaciones.includes("No registra / no posee") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <Text style={styles.subtitle}>BOLETAS DE MATRÍCULA</Text>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Presentada</Text>
            <Text style={ student.boletasMatricula.includes("Presentada") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>No registra</Text>
            <Text style={ student.boletasMatricula.includes("No registra") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <Text style={styles.subtitle}>TRABAJO COMUNAL{'\n'} UNIVERSITARIO TCU</Text>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Carta de aprobación – solicitud</Text>
            <Text style={ student.tcu.includes("Carta de aprobación – solicitud") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Oficio de aprobación de la universidad</Text>
            <Text style={ student.tcu.includes("Oficio de aprobación de la universidad") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Oficio de aprobación de la institución u organización</Text>
            <Text style={ student.tcu.includes("Oficio de aprobación de la institución u organización") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Bitácora</Text>
            <Text style={ student.tcu.includes("Bitácora") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Informe final del estudiante</Text>
            <Text style={ student.tcu.includes("Informe final del estudiante") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Oficio de cierre de la universidad</Text>
            <Text style={ student.tcu.includes("Oficio de cierre de la universidad") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>No registra</Text>
            <Text style={ student.tcu.includes("No registra") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <Text style={styles.subtitle}>HISTORIAL ACADÉMICO</Text>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Historial académico de egreso</Text>
            <Text style={ student.historialAcademico.includes("Historial académico de egreso") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Sin referencia</Text>
            <Text style={ student.historialAcademico.includes("Sin referencia") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <Text style={styles.subtitle}>MODALIDAD DE GRADUACIÓN</Text>
          {student.modalidadGraduacion ? (
               <>
                <View style={styles.checkboxWrapper}>
                  <Text style={styles.checkboxLabel}>{student.modalidadGraduacion}</Text>
                  <Text style={[styles.checkbox, styles.green]}></Text>
                </View>
  
                {(() => {
                  const actasCalificacion = student.actasCalificacion as string | string[] | null;
                  let actas: string[] = [];

                  if (typeof actasCalificacion === "string" && actasCalificacion.trim() !== "") {
                    try {
                      let parsed = JSON.parse(actasCalificacion);

                      // Si sigue siendo string tras el primer parse, parsear de nuevo
                      if (typeof parsed === "string") {
                        parsed = JSON.parse(parsed);
                      }

                      if (Array.isArray(parsed)) {
                        actas = parsed;
                      } else {
                        console.error("actasCalificacion JSON parsed but is not an array:", parsed);
                      }
                    } catch (error) {
                      console.error("Error parsing actasCalificacion:", error);
                    }
                  } else if (Array.isArray(actasCalificacion)) {
                    actas = actasCalificacion;
                  }

                  return actas.map((acta: string, idx: number) => (
                    <View style={styles.checkboxWrapper} key={idx}>
                      <Text style={styles.checkboxLabel}>{acta}</Text>
                      <Text style={[styles.checkbox, styles.green]}></Text>
                    </View>
                  ));
                })()}
  
                {typeof student.qualifications === "string" &&
                  <View style={styles.checkboxWrapper}>
                    <Text style={styles.listItem}>Notas:</Text>
                    {(student.qualifications as string).split(",").map((q, idx, arr) => (
                      <Text style={styles.listItem} key={idx}>{q.trim().replace(/"/g, "")} {idx < arr.length - 1 ? ", " : ""}</Text>
                    ))}
                  </View>
                }
               </>
              ) : (
                <Text style={styles.checkboxLabel}>Modalidad de graduación no indicada</Text>
              )
            }
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Copia de títulos obtenidos</Text>
            <Text style={ student.documentacionAdicional.includes("Copia de títulos obtenidos") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>Otros</Text>
            <Text style={ student.documentacionAdicional.includes("Otros") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <Text style={styles.checkboxLabel}>No posee</Text>
            <Text style={ student.documentacionAdicional.includes("No posee") ? [styles.checkbox, styles.green] : styles.checkbox}></Text>
          </View>
  
          { student.link && 
            <View style={styles.qrWrapper}>
              <Link src={getValidLink(student.link)} style={styles.full}>Link proporcionado a los títulos</Link>
              <Image src={qrCode} style={styles.qrImage} />              
          </View>
          }
        </View>
      </Page>
    </Document>
  )
};

export default StudentPDF;
