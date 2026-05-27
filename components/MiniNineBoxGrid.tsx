
import React from 'react';
import { Employee } from '../types';
import { getPerformanceScale, getPotentialScale } from '../utils/talentUtils';

interface MiniNineBoxGridProps {
    candidates: Employee[];
}

const boxInfoMap: { [key: string]: { label: string; title: string; color: string; bgColor: string } } = {
    '33': { label: '9', title: 'Kotak 9: Bintang Masa Depan', color: 'bg-indigo-600 text-white', bgColor: 'bg-indigo-50' },
    '23': { label: '7', title: 'Kotak 7: Potensi Tinggi', color: 'bg-indigo-400 text-white', bgColor: 'bg-indigo-50' },
    '13': { label: '4', title: 'Kotak 4: Berlian Kasar', color: 'bg-yellow-400 text-yellow-900', bgColor: 'bg-yellow-50' },
    '32': { label: '8', title: 'Kotak 8: Performer Tinggi', color: 'bg-sky-600 text-white', bgColor: 'bg-sky-50' },
    '22': { label: '5', title: 'Kotak 5: Pekerja Inti', color: 'bg-sky-400 text-white', bgColor: 'bg-sky-50' },
    '12': { label: '2', title: 'Kotak 2: Dilema', color: 'bg-yellow-500 text-white', bgColor: 'bg-yellow-50' },
    '31': { label: '6', title: 'Kotak 6: Teka-teki', color: 'bg-amber-500 text-white', bgColor: 'bg-amber-50' },
    '21': { label: '3', title: 'Kotak 3: Performer Rata-rata', color: 'bg-red-400 text-white', bgColor: 'bg-red-50' },
    '11': { label: '1', title: 'Kotak 1: Risiko Tinggi', color: 'bg-red-600 text-white', bgColor: 'bg-red-50' },
};


const MiniNineBoxGrid: React.FC<MiniNineBoxGridProps> = ({ candidates }) => {
    const grid: { [key: string]: Employee[] } = {};

    // Initialize grid
    for (let p = 1; p <= 3; p++) {
        for (let k = 1; k <= 3; k++) {
            grid[`${p}${k}`] = [];
        }
    }

    // Populate grid with candidates
    candidates.forEach(emp => {
        const performanceScale = getPerformanceScale(emp.performance);
        const potentialScale = getPotentialScale(emp.potential);
        const key = `${potentialScale}${performanceScale}`;
        if (grid[key]) {
            grid[key].push(emp);
        }
    });

    return (
        <div className="grid grid-cols-3 grid-rows-3 gap-1.5 p-2 bg-gray-100 rounded-lg border">
            {/* Grid Cells: Render from top-left (box 4) to bottom-right (box 8) */}
            {/* The axes are inverted visually: Performance rows (3,2,1), Potential cols (1,2,3) */}
            {[3, 2, 1].map(perfScale => (
                [1, 2, 3].map(potScale => {
                    const key = `${potScale}${perfScale}`;
                    const boxInfo = boxInfoMap[key];
                    const cellEmployees = grid[key] || [];

                    return (
                        <div 
                            key={key} 
                            className={`rounded border border-gray-200 p-2 min-h-[70px] ${boxInfo.bgColor}`}
                            title={boxInfo.title}
                        >
                            <div className="flex justify-between items-center mb-1.5">
                                <h4 className={`text-xs font-bold ${boxInfo.color} rounded-full px-1.5 py-0.5`}>{boxInfo.label}</h4>
                                {cellEmployees.length > 0 && 
                                    <span className="text-xs font-bold text-gray-500">{cellEmployees.length}</span>
                                }
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {cellEmployees.map(emp => (
                                    <img 
                                        key={emp.id} 
                                        src={emp.avatar} 
                                        alt={emp.name} 
                                        className="w-6 h-6 rounded-full object-cover border-2 border-white shadow-sm"
                                        title={emp.name}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })
            ))}
        </div>
    );
};

export default MiniNineBoxGrid;
