export interface FormData {
    studentName: string;
    idNumber: string;
    idType: string;
    grade: string;
    career: string;
    modalidadGraduacion: string;
    documentosAdjuntos: string[];
    convalidaciones: string[];
    boletasMatricula: string[];
    tcu: string[];
    historialAcademico: string[];
    documentacionAdicional: string[];
    actasCalificacion: string[];
}

export interface Errors {
    studentName?: string;
    idNumber?: string;
    idType?: string;
    grade?: string;
    career?: string;
}