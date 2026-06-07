import React, { useMemo } from 'react';
import { Employee } from '../types';

interface ActivityLogPageProps {
    employees: Employee[];
}

const ActivityLogPage: React.FC<ActivityLogPageProps> = ({ employees }) => {
    // Get all employees with an updatedAt field and sort by newest first
    const logs = useMemo(() => {
        return employees
            .filter(emp => emp.updatedAt)
            .sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime())
            .map(emp => ({
                id: emp.id,
                name: emp.name,
                nip: emp.nip,
                unitKerja: emp.unitKerja,
                updatedAt: new Date(emp.updatedAt!),
                submissionType: emp.submissionType
            }));
    }, [employees]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Log Aktivitas Pegawai</h1>
                <p className="mt-1 text-sm text-gray-500">Melihat riwayat pembaruan data talenta pegawai berdasarkan waktu.</p>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                {logs.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-500">
                        Belum ada aktivitas terekam.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Waktu Pembaruan
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pegawai
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Unit Kerja
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sumber
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {log.updatedAt.toLocaleString('id-ID', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{log.name}</div>
                                                    <div className="text-sm text-gray-500">{log.nip}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {log.unitKerja}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                log.submissionType === 'Admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {log.submissionType === 'Admin' ? 'Admin' : 'Mandiri'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityLogPage;
