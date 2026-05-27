
export type SuccessionStatus = 'Siap Sekarang' | '1-2 Tahun' | 'Potensi Masa Depan' | 'Bukan Kandidat';
export type SubmissionType = 'Admin' | 'Mandiri';
export type SubmissionStatus = 'Disetujui' | 'Menunggu Persetujuan';

export interface EducationHistory {
  id: string;
  jenjang: string;
  jurusan: string;
  institusi: string;
  tahunLulus: string;
}

export interface PerformanceHistory {
  id: string;
  tahun: string;
  skp: string;
  predikat: string;
}

export interface CareerHistory {
  id: string;
  jabatan: string;
  unitKerja: string;
  tmt: string;
}

export interface DevelopmentHistory {
  id: string;
  namaPelatihan: string;
  penyelenggara: string;
  tahun: string;
  jenis: 'Klasikal' | 'Non-Klasikal';
}

export interface Employee {
  id: string;
  nip: string;
  name: string;
  // gelarAkademik removed
  jabatan: string;
  pangkatGolongan: string;
  pendidikan: string;
  jurusan: string;
  unitKerja: string;
  email?: string;
  phone: string;
  trainingAttended: string;
  avatar: string;
  eselon: string;
  // FIX: Added optional 'jenjang' property for Widyaiswara-specific data.
  jenjang?: string; // Functional level for positions like Widyaiswara
  performance: number; // Score 1-100. <70: Di Bawah, 70-89: Sesuai, >=90: Di Atas Ekspektasi
  potential: number;   // Score 1-100. <70: Rendah, 70-89: Menengah, >=90: Tinggi
  competency?: number;  // Score 1-100 for technical, managerial, and socio-cultural competencies.
  skills: string[];
  criticalPosition: string;
  developmentPlan: string;
  successionStatus: SuccessionStatus;
  birthDate?: string; // Menyimpan tanggal lahir dalam format ISO string
  
  educationHistory?: EducationHistory[];
  performanceHistory?: PerformanceHistory[];
  careerHistory?: CareerHistory[];
  developmentHistory?: DevelopmentHistory[];

  submissionType: SubmissionType;
  status: SubmissionStatus;
}

export interface CriticalJob {
  id: string;
  title: string;
  unitKerja: string;
  description: string;
  requiredEselon: string;
  requiredEducation: string[]; // Daftar kualifikasi jurusan yang relevan.
  requiredGelar?: string[]; // Daftar kualifikasi gelar akademik yang relevan.
  vacancies: number;
}

// FIX: Added CompetencyDetail and CompetencyStandard interfaces for Widyaiswara analysis.
export interface CompetencyDetail {
  name: string;
  level: number;
  description: string;
  indicators: string[];
}

export interface CompetencyStandard {
  level: string; // Corresponds to 'jenjang' in Employee
  manajerial: CompetencyDetail[];
  sosialKultural: CompetencyDetail[];
  teknis: CompetencyDetail[];
}
