import React from 'react';
import { Employee, SuccessionStatus, SubmissionType } from '../types';
import { EditIcon, DeleteIcon, SparklesIcon, AcademicCapIcon, WarningIcon } from './icons';
import { getPerformanceScale, getPotentialScale, isApproachingRetirement, isOverRetirementAge, isEducationBelowStandard, getRemainingRetirementTime, getTalentStatusPermenpan, getEmployeeBoxInfo } from '../utils/talentUtils';

interface EmployeeTableProps {
    employees: Employee[];
    onEdit: (employee: Employee) => void;
    onDelete: (id: string) => void;
    onGenerateDescription: (employee: Employee) => void;
    onGenerateDevelopmentPlan: (employee: Employee) => void;
    onShowDetails: (employee: Employee) => void;
    isAdmin?: boolean;
}

const Grid9Box = ({ performance, potential }: { performance: number; potential: number; }) => {
    const boxInfoMap: { [key: string]: { label: string; title: string; color: string; } } = {
        '33': { label: 'Kotak 9', title: 'Kinerja di atas ekspektasi dan potensial tinggi', color: 'bg-indigo-600 text-white' },
        '23': { label: 'Kotak 7', title: 'Kinerja di atas ekspektasi dan potensial menengah', color: 'bg-indigo-400 text-white' },
        '13': { label: 'Kotak 4', title: 'Kinerja di atas ekspektasi dan potensial rendah', color: 'bg-yellow-400 text-yellow-900' },
        '32': { label: 'Kotak 8', title: 'Kinerja sesuai ekspektasi dan potensial tinggi', color: 'bg-sky-600 text-white' },
        '22': { label: 'Kotak 5', title: 'Kinerja sesuai ekspektasi dan potensial menengah', color: 'bg-sky-400 text-white' },
        '12': { label: 'Kotak 2', title: 'Kinerja sesuai ekspektasi dan potensial rendah', color: 'bg-yellow-500 text-white' },
        '31': { label: 'Kotak 6', title: 'Kinerja di bawah ekspektasi dan potensial tinggi', color: 'bg-amber-500 text-white' },
        '21': { label: 'Kotak 3', title: 'Kinerja di bawah ekspektasi dan potensial menengah', color: 'bg-red-400 text-white' },
        '11': { label: 'Kotak 1', title: 'Kinerja di bawah ekspektasi dan potensial rendah', color: 'bg-red-600 text-white' },
    };
    
    const performanceScale = getPerformanceScale(performance);
    const potentialScale = getPotentialScale(potential);
    const key = `${potentialScale}${performanceScale}`;
    const classification = boxInfoMap[key] || { label: 'N/A', title: 'Tidak terklasifikasi', color: 'bg-gray-200 text-gray-800' };

    return (
        <span title={classification.title} className={`cursor-help px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${classification.color}`}>
            {classification.label}
        </span>
    );
};

const SuccessionStatusBadge = ({ status }: { status: SuccessionStatus }) => {
    const statusMap: { [key in SuccessionStatus]: { color: string; } } = {
        'Siap Sekarang': { color: 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20' },
        '1-2 Tahun': { color: 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-600/20' },
        'Potensi Masa Depan': { color: 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20' },
        'Bukan Kandidat': { color: 'bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-500/20' },
    };
    const { color } = statusMap[status];

    const sizeClasses = status === 'Potensi Masa Depan'
        ? 'px-4 py-1.5 text-sm' // Larger padding and text for distinction
        : 'px-3 py-1 text-xs'; // Default size

    return <span className={`inline-flex items-center leading-5 font-semibold rounded-full ${sizeClasses} ${color}`}>{status}</span>;
}

const SubmissionTypeBadge = ({ type }: { type: SubmissionType }) => {
    const badgeStyle = type === 'Admin' 
        ? 'bg-blue-100 text-blue-800 ring-blue-600/20' 
        : 'bg-purple-100 text-purple-800 ring-purple-600/20';

    return <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ring-inset ${badgeStyle}`}>{type}</span>;
}

const PermenpanBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        'Ready Now': 'bg-emerald-100 text-emerald-800 ring-emerald-600/20',
        'Potensial': 'bg-blue-100 text-blue-800 ring-blue-600/20',
        'Development Needed': 'bg-amber-100 text-amber-800 ring-amber-600/20',
        'Underperformer': 'bg-red-100 text-red-800 ring-red-600/20',
        'Belum Terpetakan': 'bg-gray-100 text-gray-800 ring-gray-600/20'
    };
    const style = styles[status] || styles['Belum Terpetakan'];
    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ring-inset ${style}`}>
            {status}
        </span>
    );
};

const getRowColorClasses = (eselon: string) => {
    if (!eselon) return 'bg-white hover:bg-gray-50';
    if (eselon.includes('JPT')) return 'bg-purple-50/60 hover:bg-purple-100/70';
    if (eselon.includes('Administrator')) return 'bg-blue-50/60 hover:bg-blue-100/70';
    if (eselon.includes('Pengawas')) return 'bg-emerald-50/60 hover:bg-emerald-100/70';
    if (eselon.includes('Fungsional')) return 'bg-orange-50/40 hover:bg-orange-100/50';
    return 'bg-white hover:bg-gray-50';
};

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onEdit, onDelete, onGenerateDescription, onGenerateDevelopmentPlan, onShowDetails, isAdmin }) => {
    if (employees.length === 0) {
        return <div className="text-center p-20 text-gray-500">Tidak ada data talenta ditemukan.</div>;
    }

    return (
        <div className="flex flex-col">
            <div className="px-6 py-3 bg-white border-b border-gray-200 flex flex-wrap items-center gap-4 text-xs">
                <span className="font-semibold text-gray-600">Legenda Jenjang (Eselon):</span>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-purple-200 border border-purple-300"></div><span>JPT (Eselon I & II)</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-200 border border-blue-300"></div><span>Administrator (Eselon III)</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-200 border border-emerald-300"></div><span>Pengawas (Eselon IV)</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-orange-100 border border-orange-200"></div><span>Fungsional</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200"></div><span>Pelaksana / Staf</span></div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pegawai</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jabatan & SKPD</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sumber</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Keterampilan</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Penilaian & Kotak Talent</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Talenta<br/><span className="text-[10px] lowercase font-normal">(PermenPANRB 3/2020)</span></th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Target Suksesi</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {employees.map((employee) => (
                            <tr key={employee.id} className={`transition-colors duration-200 ${getRowColorClasses(employee.eselon)}`}>
                                <td className="px-6 py-4 whitespace-nowrap">

                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-11 w-11">
                                        <img className="h-11 w-11 rounded-full object-cover ring-2 ring-white" src={employee.avatar} alt={employee.name} />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                            <button onClick={() => isAdmin ? onEdit(employee) : onShowDetails(employee)} className="text-left hover:text-indigo-600 focus:outline-none focus:underline transition-colors" title={isAdmin ? `Edit data ${employee.name}` : `Lihat detail untuk ${employee.name}`}>
                                                <span>{employee.name}</span>
                                            </button>
                                            {isOverRetirementAge(employee) ? (
                                                <span title="Pegawai ini telah melewati Batas Usia Pensiun (BUP)." className="cursor-help">
                                                    <WarningIcon className="h-5 w-5 text-red-600" />
                                                </span>
                                            ) : isApproachingRetirement(employee) ? (
                                                <span title="Pegawai ini akan memasuki masa pensiun dalam 1 tahun ke depan." className="cursor-help">
                                                    <WarningIcon className="h-5 w-5 text-amber-500" />
                                                </span>
                                            ) : isEducationBelowStandard(employee) ? (
                                                <span title={`Kualifikasi pendidikan (${employee.pendidikan}) di bawah S1/D4.`} className="cursor-help">
                                                    <AcademicCapIcon className="h-5 w-5 text-red-600" />
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="text-sm text-gray-500">NIP: {employee.nip}</div>
                                        {(employee.birthDate || employee.nip) && getRemainingRetirementTime(employee) && (
                                            <div className={`text-xs mt-0.5 ${isOverRetirementAge(employee) ? 'text-red-600 font-medium' : isApproachingRetirement(employee) ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
                                                {getRemainingRetirementTime(employee)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{employee.jabatan}</div>
                                <div className="text-sm text-gray-500">{employee.pangkatGolongan}</div>
                                <div className="text-xs text-gray-500">{employee.pendidikan} - {employee.jurusan}</div>
                                <div className="text-sm text-gray-500 font-semibold mt-1">{employee.unitKerja}</div>
                                <div className="text-xs text-gray-400 mt-1">Eselon: {employee.eselon}</div>
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                                <SubmissionTypeBadge type={employee.submissionType} />
                            </td>
                            <td className="px-6 py-4 max-w-xs">
                                <div className="flex flex-wrap gap-1.5">
                                    {employee.skills.length > 0 ? employee.skills.slice(0, 3).map(skill => (
                                        <span key={skill} className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">{skill}</span>
                                    )) : <span className="text-gray-400 italic text-sm">Belum ada</span>}
                                    {employee.skills.length > 3 && <span className="px-2.5 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-lg">+{employee.skills.length - 3}</span>}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <Grid9Box performance={employee.performance} potential={employee.potential} />
                                    </div>
                                    <div className="text-xs">
                                        <div><span className="font-semibold text-gray-700">Kinerja:</span> {employee.performance}</div>
                                        <div><span className="font-semibold text-gray-700">Potensi:</span> {employee.potential}</div>
                                        <div><span className="font-semibold text-gray-700">Kompetensi:</span> {employee.competency ?? 'N/A'}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap flex flex-col gap-2 justify-center h-full">
                                <div><PermenpanBadge status={getTalentStatusPermenpan(getEmployeeBoxInfo(employee).boxNumber)} /></div>
                                <div><SuccessionStatusBadge status={employee.successionStatus} /></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {isAdmin && (
                                    <div className="flex items-center justify-end space-x-1 md:space-x-2">
                                        <button onClick={() => onGenerateDevelopmentPlan(employee)} className="text-teal-600 hover:text-teal-900 p-3 md:p-2 rounded-full hover:bg-teal-100/60 transition-colors duration-200" title="Buat Rencana Pengembangan">
                                            <AcademicCapIcon className="h-5 w-5 md:h-5 md:w-5" />
                                        </button>
                                        <button onClick={() => onGenerateDescription(employee)} className="text-purple-600 hover:text-purple-900 p-3 md:p-2 rounded-full hover:bg-purple-100/60 transition-colors duration-200" title="Buat Deskripsi Pekerjaan">
                                            <SparklesIcon className="h-5 w-5 md:h-5 md:w-5" />
                                        </button>
                                        <button onClick={() => onEdit(employee)} className="text-indigo-600 hover:text-indigo-900 p-3 md:p-2 rounded-full hover:bg-indigo-100/60 transition-colors duration-200" title="Edit Talenta">
                                            <EditIcon className="h-5 w-5 md:h-5 md:w-5" />
                                        </button>
                                        <button onClick={() => onDelete(employee.id)} className="text-red-600 hover:text-red-900 p-3 md:p-2 rounded-full hover:bg-red-100/60 transition-colors duration-200" title="Hapus Talenta">
                                            <DeleteIcon className="h-5 w-5 md:h-5 md:w-5" />
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default EmployeeTable;