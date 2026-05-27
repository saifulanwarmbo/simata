import React from 'react';
import { Employee } from '../types';
import { categoryMap, recommendationMap } from '../utils/talentUtils';
import { EditIcon } from './icons';

interface TalentBoxDetailPanelProps {
    boxNumber: number | null;
    employees: Employee[];
    onShowDetails: (employee: Employee) => void;
    onEdit: (employee: Employee) => void;
    isAdmin?: boolean;
}

const TalentBoxDetailPanel: React.FC<TalentBoxDetailPanelProps> = ({ boxNumber, employees, onShowDetails, onEdit, isAdmin }) => {
    if (boxNumber === null) {
        return (
            <div className="text-center p-8">
                <h3 className="font-bold text-lg text-gray-800">Pilih Sebuah Kotak</h3>
                <p className="text-gray-500 mt-2">Klik salah satu kotak pada Peta Talent Pool untuk melihat daftar pegawai di dalamnya.</p>
            </div>
        );
    }

    const title = categoryMap[boxNumber] || 'Kategori Tidak Dikenal';
    const recommendation = recommendationMap[boxNumber] || 'Tidak ada rekomendasi.';

    return (
        <div>
            <div className="border-b pb-4 mb-4">
                 <h2 className="text-xl font-bold text-gray-800">{`Kotak ${boxNumber}: ${title}`}</h2>
                 <p className="text-sm text-gray-600 mt-1">{`(${employees.length} Pegawai)`}</p>
                 <p className="text-xs text-indigo-700 font-semibold bg-indigo-50 p-2 rounded-md mt-3">{`Rekomendasi: ${recommendation}`}</p>
            </div>
            
            {employees.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {employees.map(employee => (
                        <div key={employee.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm hover:border-indigo-200 transition-all duration-200">
                            <img src={employee.avatar} alt={employee.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0"/>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-800 truncate">{employee.name}</p>
                                <p className="text-sm text-gray-500 truncate">{employee.jabatan}</p>
                                <div className="text-xs text-gray-500 mt-1">
                                    <span>Kinerja: <strong className="text-gray-700">{employee.performance}</strong></span>
                                    <span className="mx-1.5">|</span>
                                    <span>Potensi: <strong className="text-gray-700">{employee.potential}</strong></span>
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-x-1">
                                {isAdmin && (
                                    <button
                                        onClick={() => onEdit(employee)}
                                        className="p-2 text-indigo-600 hover:text-indigo-900 rounded-full hover:bg-indigo-100/60 transition-colors"
                                        title="Edit Talenta"
                                    >
                                        <EditIcon className="h-4 w-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => onShowDetails(employee)}
                                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors"
                                >
                                    Detail
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-8">
                    <p className="text-gray-500">Tidak ada pegawai dalam kategori ini.</p>
                </div>
            )}
        </div>
    );
};

export default TalentBoxDetailPanel;
