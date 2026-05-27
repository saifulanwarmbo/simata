import React from 'react';
import { Employee } from '../types';
import { CheckCircleIcon, XCircleIcon } from '../components/icons';

interface SubmissionReviewPageProps {
    submissions: Employee[];
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onApproveAll: () => void;
    onRejectAll: () => void;
}

const SubmissionReviewPage: React.FC<SubmissionReviewPageProps> = ({ submissions, onApprove, onReject, onApproveAll, onRejectAll }) => {
    if (submissions.length === 0) {
        return (
            <div className="text-center p-20 bg-white rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-gray-700">Tidak Ada Pengajuan Baru</h3>
                <p className="mt-2 text-gray-500">Saat ini tidak ada data mandiri dari pegawai yang menunggu persetujuan.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">Menunggu Persetujuan ({submissions.length})</h3>
                <div className="flex space-x-3">
                    <button onClick={onApproveAll} className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm" title="Setujui Semua Pengajuan">
                        <CheckCircleIcon className="h-5 w-5" />
                        <span>Setujui Semua</span>
                    </button>
                    <button onClick={onRejectAll} className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm" title="Tolak & Hapus Semua Pengajuan">
                        <XCircleIcon className="h-5 w-5" />
                        <span>Tolak Semua</span>
                    </button>
                </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pegawai</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jabatan & SKPD</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Detail Kontak</th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Aksi</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-11 w-11">
                                        <img className="h-11 w-11 rounded-full object-cover" src={employee.avatar} alt={employee.name} />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                                        <div className="text-sm text-gray-500">NIP: {employee.nip}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{employee.jabatan}</div>
                                <div className="text-sm text-gray-500">{employee.pangkatGolongan}</div>
                                <div className="text-sm text-gray-500 font-semibold mt-1">{employee.unitKerja}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div>{employee.email || '-'}</div>
                                <div>{employee.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                     <button onClick={() => onApprove(employee.id)} className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg transition-colors duration-200 shadow-sm" title="Setujui Pengajuan">
                                        <CheckCircleIcon className="h-5 w-5" />
                                        <span>Setujui</span>
                                    </button>
                                    <button onClick={() => onReject(employee.id)} className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition-colors duration-200 shadow-sm" title="Tolak & Hapus Pengajuan">
                                        <XCircleIcon className="h-5 w-5" />
                                        <span>Tolak</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubmissionReviewPage;
