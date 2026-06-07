
import { Employee, CriticalJob } from '../types';
import { 
    loadEmployeesFromStorage, 
    saveEmployeeToStorage, 
    deleteEmployeeFromStorage,
    loadCriticalJobsFromStorage, 
    saveCriticalJobToStorage,
    deleteCriticalJobFromStorage
} from '../utils/storage';
import { 
    generateJobDescription as geminiJobDesc, 
    generateDevelopmentPlan as geminiDevPlan, 
    generateTalentPoolAnalysis as geminiAnalysis, 
    generateEmployeeData as geminiEmployeeData, 
    generateSuccessionInsight as geminiSuccession, 
    generateCandidateMatch as geminiMatch,
    generateDeepSuccessionAnalysis as geminiDeepAnalysis
} from './geminiService';

/**
 * SERVICES/APISERVICE.TS
 * Client-Side Adapter for Netlify/Static Hosting.
 * 
 * This service acts as a bridge between the UI and:
 * 1. Browser LocalStorage (for data persistence)
 * 2. Google Gemini API (called directly from the browser)
 * 
 * No backend server (Node.js) is required for this configuration.
 */

// --- Auth (Simulation) ---
export const login = async (username: string, password: string): Promise<boolean> => {
    // In a real serverless environment, you might use Firebase Auth, Auth0, or Supabase.
    // For this demo, we simulate a successful login for the admin.
    if (username === 'admin' && password === 'password') {
        return true;
    }
    return false;
};

// --- Employees (CRUD via LocalStorage) ---
export const getEmployees = async (): Promise<Employee[]> => {
    // Simulate network delay for realism if desired, but kept instant for performance
    return await loadEmployeesFromStorage();
};

export const saveEmployee = async (employee: Employee, isEditing: boolean): Promise<Employee> => {
    const newEmp = { ...employee, id: employee.id || crypto.randomUUID() };
    await saveEmployeeToStorage(newEmp);
    return newEmp;
};

export const deleteEmployee = async (id: string): Promise<void> => {
    await deleteEmployeeFromStorage(id);
};

// --- Critical Jobs (CRUD via LocalStorage) ---
export const getCriticalJobs = async (): Promise<CriticalJob[]> => {
    return await loadCriticalJobsFromStorage();
};

export const saveCriticalJob = async (job: CriticalJob): Promise<CriticalJob> => {
    const jobToSave = { ...job, id: job.id || `cj-${Date.now()}` };
    await saveCriticalJobToStorage(jobToSave);
    return jobToSave;
};

export const deleteCriticalJob = async (id: string): Promise<void> => {
    await deleteCriticalJobFromStorage(id);
};

// --- Gemini AI Services (Direct Frontend Integration) ---
// These functions call the Gemini SDK directly from the browser.
// The API Key must be configured in the Netlify Environment Variables.

export const generateJobDescription = async (title: string, unitKerja: string): Promise<string> => {
    return await geminiJobDesc(title, unitKerja);
};

export const generateDevelopmentPlan = async (employee: Employee): Promise<string> => {
    return await geminiDevPlan(employee);
};

export const generateTalentPoolAnalysis = async (employees: Employee[]): Promise<string> => {
    return await geminiAnalysis(employees);
};

export const generateEmployeeData = async (jabatan: string, unitKerja: string): Promise<Partial<Employee>> => {
    return await geminiEmployeeData(jabatan, unitKerja);
};

export const generateSuccessionInsight = async (job: CriticalJob, candidates: Employee[]): Promise<string> => {
    return await geminiSuccession(job, candidates);
};

export const generateCandidateMatch = async (job: CriticalJob, candidates: Employee[]) => {
    return await geminiMatch(job, candidates);
};

export const generateDeepSuccessionAnalysis = async (employees: Employee[], jobs: CriticalJob[]): Promise<string> => {
    return await geminiDeepAnalysis(employees, jobs);
};
