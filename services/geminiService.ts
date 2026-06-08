
import { Employee, CriticalJob } from "../types";

/**
 * GEMINI SERVICE (Frontend Adapter)
 * 
 * This file replaces the direct @google/genai integration with calls to the backend API.
 * This ensures the API key remains secure on the server and bypasses client-side RPC errors.
 */

async function callBackend(endpoint: string, body: Record<string, unknown>): Promise<string> {
    try {
        const response = await fetch(`/api/generate/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: \${response.status}`);
        }

        const data = await response.json();
        return data.text || '';
    } catch (error) {
        console.error(`Error calling Gemini backend (${endpoint}):`, error);
        throw error;
    }
}

export async function generateJobDescription(title: string, unitKerja: string): Promise<string> {
    try {
        return await callBackend('job-description', { title, unitKerja });
    } catch (error) {
        return `Gagal menghasilkan konten: ${(error as Error).message}`;
    }
}

export async function generateDevelopmentPlan(employee: Employee): Promise<string> {
    try {
        const minimalEmployee = { ...employee, avatar: undefined };
        return await callBackend('development-plan', { employee: minimalEmployee });
    } catch (error) {
        return `<h3>Gagal Menghasilkan Rencana</h3><p>Terjadi kesalahan: ${(error as Error).message}</p>`;
    }
}

export async function generateTalentPoolAnalysis(employees: Employee[]): Promise<string> {
    try {
        const minimalEmployees = employees.map(e => ({ ...e, avatar: undefined }));
        return await callBackend('talent-pool-analysis', { employees: minimalEmployees });
    } catch (error) {
        return `<h3>Gagal Menghasilkan Analisis</h3><p>Terjadi kesalahan: ${(error as Error).message}</p>`;
    }
}

export async function generateEmployeeData(jabatan: string, unitKerja: string): Promise<Partial<Employee>> {
    try {
        const response = await fetch('/api/generate/employee-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jabatan, unitKerja })
        });

        if (!response.ok) throw new Error('Failed to generate employee data');

        const data = await response.json();
        let textResponse = data.text || "{}";
        textResponse = textResponse.replace(/^```json\n?/, '').replace(/```\n?$/, '').trim();
        const generatedData = JSON.parse(textResponse);
        
        if (typeof generatedData.skills === 'string') {
            generatedData.skills = generatedData.skills.split(',').map((s: string) => s.trim());
        }
        return generatedData;
    } catch (error) {
        console.error("Error generating employee data:", error);
        throw new Error(`Gagal menghasilkan data: ${(error as Error).message}`);
    }
}

export async function generateSuccessionInsight(job: CriticalJob, candidates: Employee[]): Promise<string> {
    try {
        const minimalCandidates = candidates.map(e => ({ ...e, avatar: undefined }));
        return await callBackend('succession-insight', { job, candidates: minimalCandidates });
    } catch (error) {
        return `<h3>Gagal Menghasilkan Analisis</h3><p>Terjadi kesalahan: ${(error as Error).message}</p>`;
    }
}

export interface CandidateMatchResult {
    id: string;
    score: number;
    reason: string;
}

export async function generateCandidateMatch(job: CriticalJob, candidates: Employee[]): Promise<CandidateMatchResult[]> {
    try {
        const minimalCandidates = candidates.map(e => ({ ...e, avatar: undefined }));
        const response = await fetch('/api/generate/match-candidates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ job, candidates: minimalCandidates })
        });

        if (!response.ok) throw new Error('Failed to match candidates');

        const data = await response.json();
        return data.matches;
    } catch (error) {
        console.error("Error generating candidate match:", error);
        throw new Error("Gagal melakukan analisis pencocokan kandidat.");
    }
}

export async function generateDeepSuccessionAnalysis(employees: Employee[], jobs: CriticalJob[]): Promise<string> {
    try {
        const minimalEmployees = employees.map(e => ({ ...e, avatar: undefined }));
        return await callBackend('deep-succession-analysis', { employees: minimalEmployees, jobs });
    } catch (error) {
        return `<h3>Gagal Menghasilkan Laporan</h3><p>Terjadi kesalahan: ${(error as Error).message}</p>`;
    }
}
