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
                                        className={`relative w-full h-full text-left rounded-lg flex flex-col min-h-[170px] overflow-hidden ${styles.bgColor} transition-all duration-200 ${isSelected ? 'ring-2 ring-offset-2 ring-indigo-500 shadow-xl' : 'border border-gray-200 hover:shadow-lg hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400'}`}
                                        aria-pressed={isSelected}
                                        aria-label={`Kotak ${boxNumber}: ${category}. ${cellEmployees.length} pegawai.`}
                                    >
                                        {/* Box Number in Center */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                                            <span className="text-[8rem] font-bold opacity-[0.07] text-slate-900 pointer-events-none select-none">
                                                {boxNumber}
                                            </span>
                                        </div>

                                        <div className={`relative z-10 flex justify-between items-start p-3 ${styles.color}`}>
                                            <h3 className="font-extrabold text-2xl">{boxNumber}</h3>
                                        </div>
                                        
                                        <div className="relative z-10 px-3 pb-1">
                                            <p className="text-xs font-semibold text-gray-800 opacity-80 mix-blend-color-burn">{category}</p>
                                        </div>
                                        
                                        {/* Scatter Plot Layer */}
                                        <div className="absolute inset-x-2 top-[4.5rem] bottom-2 pointer-events-none z-20">
                                            {cellEmployees.map(emp => {
                                                const getRelativePos = (val: number, scale: number) => {
                                                    let min = 0; let max = 100;
                                                    if (scale === 1) { min = 0; max = 69.99; }
                                                    else if (scale === 2) { min = 70; max = 89.99; }
                                                    else if (scale === 3) { min = 90; max = 100; }
                                                    const pct = ((val - min) / (max - min)) * 100;
                                                    // Clamp between 10% and 90% to keep avatars safely inside
                                                    return Math.max(10, Math.min(90, pct));
                                                };

                                                const leftPos = getRelativePos(emp.potential, pot.p);
                                                // We invert performance because top is 0% and bottom is 100% in CSS
                                                const topPos = 100 - getRelativePos(emp.performance, perf.p);

                                                // Generates a simple repeatable jitter from the ID string, to prevent exact overlaps
                                                const hash = emp.id.split('').reduce((a, b) => {a = ((a << 5) - a) + b.charCodeAt(0); return a & a}, 0);
                                                const jitterX = (hash % 15) - 7;
                                                const jitterY = ((hash >> 3) % 15) - 7;

                                                return (
                                                    <div 
                                                        key={emp.id} 
                                                        className="absolute w-2.5 h-2.5 rounded-full border border-white shadow-sm bg-slate-800 hover:scale-150 hover:bg-indigo-600 hover:z-50 transition-all duration-200 pointer-events-auto"
                                                        style={{ 
                                                            left: `calc(${leftPos}% + ${jitterX}px)`, 
                                                            top: `calc(${topPos}% + ${jitterY}px)`,
                                                            transform: 'translate(-50%, -50%)',
                                                            zIndex: 20 + Math.abs(jitterX)
                                                        }}
                                                        title={`${emp.name}\nKinerja: ${emp.performance}\nPotensi: ${emp.potential}`}
                                                    />
                                                );
                                            })}
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