import React, { useState, useMemo } from 'react';
import { Employee, CompetencyStandard } from '../types';
import { SparklesIcon, LoadingIcon, AcademicCapIcon, UserCircleIcon } from '../components/icons';

interface WidyaiswaraAnalysisPageProps {
    employees: Employee[];
    standards: CompetencyStandard[];
    onGenerateAnalysis: (employee: Employee) => void;
    analysisResult: string;
    isLoading: boolean;
}

const CompetencyStandardDisplay: React.FC<{ standard: CompetencyStandard }> = ({ standard }) => {
    return (
        <div className="space-y-4">
            <div>
                <h4 className="font-semibold text-gray-800 mb-2">Kompetensi Manajerial</h4>
                <ul className="space-y-1 text-sm list-disc list-inside text-gray-600">
                    {standard.manajerial.map(c => <li key={c.name}>{c.name} (Level {c.level})</li>)}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-gray-800 mb-2">Kompetensi Sosial Kultural</h4>
                <ul className="space-y-1 text-sm list-disc list-inside text-gray-600">
                    {standard.sosialKultural.map(c => <li key={c.name}>{c.name} (Level {c.level})</li>)}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-gray-800 mb-2">Kompetensi Teknis</h4>
                <ul className="space-y-1 text-sm list-disc list-inside text-gray-600">
                    {standard.teknis.map(c => <li key={c.name}>{c.name} (Level {c.level})</li>)}
                </ul>
            </div>
        </div>
    );
};

const WidyaiswaraAnalysisPage: React.FC<WidyaiswaraAnalysisPageProps> = ({ employees, standards, onGenerateAnalysis, analysisResult, isLoading }) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id || '');

    const selectedEmployee = useMemo(() => {
        return employees.find(e => e.id === selectedEmployeeId);
    }, [selectedEmployeeId, employees]);

    const correspondingStandard = useMemo(() => {
        if (!selectedEmployee) return null;
        return standards.find(s => s.level === selectedEmployee.jenjang);
    }, [selectedEmployee, standards]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedEmployeeId(e.target.value);
    };

    if (employees.length === 0) {
        return (
            <div className="text-center p-20 bg-white rounded-xl shadow-lg">
                <AcademicCapIcon className="h-16 w-16 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-bold text-gray-700">Tidak Ada Data Widyaiswara</h3>
                <p className="mt-2 text-gray-500">Sistem tidak menemukan data pegawai dengan jabatan Widyaiswara untuk dianalisis.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-1">Pilih Widyaiswara</h3>
                <p className="text-sm text-gray-500 mb-4">Pilih pegawai untuk melihat profil dan menganalisis kesenjangan kompetensi.</p>
                <select
                    value={selectedEmployeeId}
                    onChange={handleSelectChange}
                    className="w-full max-w-lg p-3 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
                >
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                            {emp.name} - {emp.jabatan}
                        </option>
                    ))}
                </select>
            </div>

            {selectedEmployee && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Column 1: Profile & Standard */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4">Profil Pegawai</h3>
                             <div className="flex items-center gap-4 mb-4">
                                <img src={selectedEmployee.avatar} alt={selectedEmployee.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-offset-2 ring-indigo-200" />
                                <div>
                                    <p className="font-bold text-gray-900">{selectedEmployee.name}</p>
                                    <p className="text-sm text-gray-500">{selectedEmployee.nip}</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <p><strong className="font-semibold text-gray-700">Jabatan:</strong> {selectedEmployee.jabatan}</p>
                                <p><strong className="font-semibold text-gray-700">Jenjang:</strong> {selectedEmployee.jenjang}</p>
                                <p><strong className="font-semibold text-gray-700">Pangkat:</strong> {selectedEmployee.pangkatGolongan}</p>
                                <p><strong className="font-semibold text-gray-700">Unit Kerja:</strong> {selectedEmployee.unitKerja}</p>
                            </div>
                        </div>

                        {correspondingStandard ? (
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4">Standar Kompetensi Jabatan (SKJ)</h3>
                                <CompetencyStandardDisplay standard={correspondingStandard} />
                            </div>
                        ) : (
                            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg border border-yellow-200">
                                <p className="font-semibold">Standar kompetensi untuk jenjang "{selectedEmployee.jenjang}" tidak ditemukan.</p>
                            </div>
                        )}
                    </div>

                    {/* Column 2: AI Analysis */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                             <h3 className="text-lg font-bold text-gray-800">Analisis Kesenjangan & Rekomendasi (AI)</h3>
                             <button 
                                onClick={() => onGenerateAnalysis(selectedEmployee)} 
                                disabled={isLoading || !correspondingStandard}
                                className="flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                             >
                                <SparklesIcon className="h-5 w-5" />
                                <span>{isLoading ? "Menganalisis..." : "Buat Analisis Kesenjangan"}</span>
                            </button>
                        </div>
                        
                        <div className="min-h-[400px]">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <LoadingIcon className="h-12 w-12 text-indigo-500 animate-spin" />
                                    <p className="mt-4 text-gray-600 font-semibold">AI sedang membandingkan profil dengan SKJ...</p>
                                    <p className="text-sm text-gray-400">Mohon tunggu sebentar.</p>
                                </div>
                            ) : analysisResult ? (
                                <div 
                                    className="prose prose-sm max-w-none text-gray-600 prose-headings:text-gray-900 prose-h4:font-bold prose-h4:border-b prose-h4:pb-2 prose-h4:mb-2 prose-strong:text-gray-800 prose-ul:list-disc prose-ul:pl-5 marker:text-indigo-500"
                                    dangerouslySetInnerHTML={{ __html: analysisResult }} 
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                                     <UserCircleIcon className="h-16 w-16 text-gray-300" />
                                    <p className="mt-4 font-semibold">Analisis Belum Dibuat</p>
                                    <p className="max-w-xs">Klik tombol "Buat Analisis Kesenjangan" untuk mendapatkan rekomendasi pengembangan dari AI.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WidyaiswaraAnalysisPage;
