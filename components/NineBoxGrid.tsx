import React from 'react';
import { Employee } from '../types';
import { getPerformanceScale, getPotentialScale, boxNumberMap, categoryMap, boxStyleMap } from '../utils/talentUtils';
import { ArrowUpIcon, ArrowRightIcon } from './icons';

interface NineBoxGridProps {
    employees: Employee[];
    selectedBox: number | null;
    onBoxSelect: (boxNumber: number) => void;
}

const potentialAxisLabels = [
    { p: 1, label: 'Rendah', color: 'bg-red-50 text-red-800' },
    { p: 2, label: 'Menengah', color: 'bg-sky-50 text-sky-800' },
    { p: 3, label: 'Tinggi', color: 'bg-indigo-50 text-indigo-800' },
];

const performanceAxisLabels = [
    { p: 3, label: 'Di Atas Ekspektasi', color: 'text-green-700' },
    { p: 2, label: 'Sesuai Ekspektasi', color: 'text-sky-700' },
    { p: 1, label: 'Di Bawah Ekspektasi', color: 'text-red-700' },
];


const NineBoxGrid: React.FC<NineBoxGridProps> = ({ employees, selectedBox, onBoxSelect }) => {
    const grid: { [key: string]: Employee[] } = {};

    for (let p = 1; p <= 3; p++) {
        for (let k = 1; k <= 3; k++) {
            grid[`${p}${k}`] = [];
        }
    }

    employees.forEach(emp => {
        const performanceScale = getPerformanceScale(emp.performance);
        const potentialScale = getPotentialScale(emp.potential);
        const key = `${potentialScale}${performanceScale}`;
        if (grid[key]) {
            grid[key].push(emp);
        }
    });

    return (
        <div>
            <div className="flex items-center justify-center gap-2 mb-2">
                <span className="font-bold text-gray-600 uppercase tracking-wider text-sm">Potensi</span>
                <ArrowRightIcon className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-[auto,1fr,1fr,1fr] gap-2 items-stretch">
                <div className="col-start-1 row-start-2 flex items-center justify-center">
                    <div className="flex items-center gap-2 transform -rotate-90">
                         <span className="font-bold text-gray-600 uppercase tracking-wider text-sm whitespace-nowrap">Kinerja</span>
                         <ArrowUpIcon className="h-5 w-5 text-gray-400" />
                    </div>
                </div>

                {potentialAxisLabels.map((pot, potIndex) => (
                    <div key={`label-${pot.p}`} className={`col-start-${potIndex + 2} row-start-1 text-center font-bold text-sm p-2 rounded-md ${pot.color}`}>
                        {pot.label}
                    </div>
                ))}
                
                {performanceAxisLabels.map((perf, perfIndex) => (
                    <React.Fragment key={`row-${perf.p}`}>
                        <div className={`row-start-${perfIndex + 2} col-start-1 font-bold ${perf.color} flex items-center justify-end pr-3 text-right text-sm`}>
                            <span>{perf.label}</span>
                        </div>
                        {potentialAxisLabels.map((pot, potIndex) => {
                            const key = `${pot.p}${perf.p}`;
                            const boxNumber = boxNumberMap[key];
                            const category = categoryMap[boxNumber];
                            const styles = boxStyleMap[boxNumber] || { color: 'bg-gray-200 text-gray-800', bgColor: 'bg-gray-100' };
                            const cellEmployees = grid[key] || [];
                            const isSelected = selectedBox === boxNumber;

                            return (
                                <div key={key} className={`col-start-${potIndex + 2} row-start-${perfIndex + 2}`}>
                                    <button
                                        onClick={() => onBoxSelect(boxNumber)}
                                        className={`w-full h-full text-left rounded-lg flex flex-col min-h-[170px] overflow-hidden ${styles.bgColor} transition-all duration-200 ${isSelected ? 'ring-2 ring-offset-2 ring-indigo-500 shadow-xl' : 'border border-gray-200 hover:shadow-lg hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400'}`}
                                        aria-pressed={isSelected}
                                        aria-label={`Kotak ${boxNumber}: ${category}. ${cellEmployees.length} pegawai.`}
                                    >
                                        <div className={`flex justify-between items-start p-3 ${styles.color}`}>
                                            <h3 className="font-extrabold text-2xl">{boxNumber}</h3>
                                            <span className="text-2xl font-bold opacity-90">{cellEmployees.length}</span>
                                        </div>
                                        
                                        <div className="p-3 flex flex-col flex-grow">
                                            <p className="text-xs font-semibold text-gray-700 mb-3 flex-grow">{category}</p>
                                            
                                            <div className="flex flex-wrap items-end gap-1 mt-auto h-9">
                                                {cellEmployees.length > 0 ? cellEmployees.slice(0, 5).map(emp => (
                                                    <img key={emp.id} src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" title={emp.name} />
                                                )) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-xs text-gray-400">Kosong</span>
                                                    </div>
                                                )}
                                                {cellEmployees.length > 5 && (
                                                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 text-gray-600 text-xs font-bold border-2 border-white shadow-sm" title={`${cellEmployees.length - 5} pegawai lainnya`}>
                                                       +{cellEmployees.length - 5}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default NineBoxGrid;