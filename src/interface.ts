export interface FormData {
    id: string;
    studentName: string;
    idNumber: string;
    idType: string;
    gender: string;
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
    qualifications: string[];
    studentCondition: string;
    studentState: string;
    studentRegistration: string;
    link: string;
}

export interface Errors {
    studentName?: string;
    idNumber?: string;
    idType?: string;
    gender?: string;
    grade?: string;
    career?: string;
    studentCondition?: string;
    studentState?: string;
    studentRegistration?: string;
}

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

export interface FilterData {
    studentName?: string;
    idNumber?: string;
    gender?: string;
    grade?: string;
    career?: string;
    studentState?: string;
}