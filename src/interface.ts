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
    pass: string;
    created_at: string;
    role?: string;
}

export interface FilterData {
    studentName?: string;
    idNumber?: string;
    gender?: string;
    grade?: string;
    career?: string;
    studentState?: string;
}

export interface UserErrors {
    id?: number;
    name?: string;
    email?: string;
    pass?: string;
    created_at?: string;
    role?: string;
}

export interface JwtPayload {
    id: string;
    email?: string;
    exp: number;
}