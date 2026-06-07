import React from 'react';
import { CriticalJob } from '../types';
import { BriefcaseIcon, AcademicCapIcon, UserCircleIcon, XIcon, ShieldCheckIcon } from './icons';

interface CriticalJobDetailModalProps {
    job: CriticalJob;
    onClose: () => void;
}

const CriticalJobDetailModal: React.FC<CriticalJobDetailModalProps> = ({ job, onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
                        <p className="text-sm text-indigo-600 font-medium mt-1">{job.unitKerja}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {/* General Requirements */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg shrink-0">
                                <BriefcaseIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Tingkat Eselon</p>
                                <p className="text-lg font-semibold text-gray-900 mt-0.5">{job.requiredEselon}</p>
                            </div>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-3">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                                <UserCircleIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Kekosongan</p>
                                <p className="text-lg font-semibold text-gray-900 mt-0.5">{job.vacancies} Posisi</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                            Deskripsi Pekerjaan & Kompetensi Kunci
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed border border-gray-100">
                            {job.description || 'Tidak ada deskripsi spesifik.'}
                        </div>
                    </div>

                    {/* Qualifications */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                            Persyaratan Kualifikasi Pendidikan
                        </h3>
                        {job.requiredEducation && job.requiredEducation.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {job.requiredEducation.map((edu, idx) => (
                                    <span key={idx} className="bg-white border border-gray-200 text-gray-700 text-sm px-3 py-1.5 rounded-lg shadow-sm font-medium">
                                        {edu}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-xl border border-gray-100">Semua jurusan diperbolehkan / tidak ditentukan.</p>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50 rounded-b-2xl">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CriticalJobDetailModal;
