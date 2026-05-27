import React, { useState, useMemo } from 'react';
import { Employee } from '../types';
import NineBoxGrid from '../components/NineBoxGrid';
import TalentAnalysis from '../components/TalentAnalysis';
import TalentBoxDetailPanel from '../components/TalentBoxDetailPanel';
import { getEmployeeBoxInfo } from '../utils/talentUtils';

interface TalentPoolPageProps {
    employees: Employee[];
    analysis: string;
    isLoading: boolean;
    error: string | null;
    onShowDetails: (employee: Employee) => void;
    onEdit: (employee: Employee) => void;
    isAdmin?: boolean;
}

const TalentPoolPage: React.FC<TalentPoolPageProps> = ({ employees, analysis, isLoading, error, onShowDetails, onEdit, isAdmin }) => {
    // Default to selecting box 9 (top talent) on initial load for immediate insight.
    const [selectedBox, setSelectedBox] = useState<number | null>(9);

    const employeesInSelectedBox = useMemo(() => {
        if (!selectedBox) return [];
        return employees.filter(emp => getEmployeeBoxInfo(emp).boxNumber === selectedBox);
    }, [selectedBox, employees]);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            <section className="bg-white p-6 rounded-xl shadow-lg xl:col-span-2">
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Peta Talent Pool Interaktif (9-Box Matrix)</h2>
                <NineBoxGrid 
                    employees={employees} 
                    selectedBox={selectedBox} 
                    onBoxSelect={setSelectedBox} 
                />
            </section>
            
            <div className="xl:col-span-1 space-y-8">
                <section className="bg-white p-6 rounded-xl shadow-lg">
                    <TalentBoxDetailPanel
                        boxNumber={selectedBox}
                        employees={employeesInSelectedBox}
                        onShowDetails={onShowDetails}
                        onEdit={onEdit}
                        isAdmin={isAdmin}
                    />
                </section>
                <section className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Analisis & Rekomendasi (AI)</h2>
                    <TalentAnalysis analysis={analysis} isLoading={isLoading} error={error} />
                </section>
            </div>
        </div>
    );
};

export default TalentPoolPage;