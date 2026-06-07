
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Employee, EducationHistory, PerformanceHistory, CareerHistory, DevelopmentHistory } from '../types';
import { CloseIcon, UserCircleIcon, BriefcaseIcon, StarIcon, EditIcon, AcademicCapIcon, ClipboardListIcon, SparklesIcon } from './icons';
import MiniNineBoxGrid from './MiniNineBoxGrid';
import { getEmployeeBoxInfo, getRemainingRetirementTime, isOverRetirementAge, isApproachingRetirement, getTalentStatusPermenpan } from '../utils/talentUtils';

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
        <span className={`inline-flex items-center px-3 py-1 text-xs leading-5 font-semibold rounded-full ring-1 ring-inset ${style}`}>
            {status}
        </span>
    );
};

const SuccessionStatusBadge = ({ status }: { status: Employee['successionStatus'] }) => {
    const statusMap: { [key in Employee['successionStatus']]: { color: string; } } = {
        'Siap Sekarang': { color: 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20' },
        '1-2 Tahun': { color: 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-600/20' },
        'Potensi Masa Depan': { color: 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20' },
        'Bukan Kandidat': { color: 'bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-500/20' },
    };
    const { color } = statusMap[status];
    return <span className={`inline-flex items-center px-3 py-1 text-xs leading-5 font-semibold rounded-full ${color}`}>{status}</span>;
};

interface EmployeeDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: (employee: Employee) => void;
    employee: Employee;
    onGenerateDescription: (employee: Employee) => void;
}

type Tab = 'pendidikan' | 'karir' | 'kinerja' | 'pengembangan';

const DetailCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 h-full">
        <div className="flex items-center gap-2 mb-3 text-gray-500">
            {icon}
            <h4 className="font-bold text-sm uppercase tracking-wider">{title}</h4>
        </div>
        {children}
    </div>
);

const HistoryTable: React.FC<{ data: any[]; columns: { key: string; label: string }[] }> = ({ data, columns }) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-gray-500 py-4">Tidak ada data riwayat.</p>;
    }
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-left text-gray-600">
                    <tr>
                        {columns.map(col => <th key={col.key} className="p-3 font-semibold">{col.label}</th>)}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.map((item, index) => (
                        <tr key={item.id || index} className="hover:bg-gray-50">
                            {columns.map(col => <td key={col.key} className="p-3">{item[col.key] || '-'}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ isOpen, onClose, onEdit, employee, onGenerateDescription }) => {
    const [activeTab, setActiveTab] = useState<Tab>('pendidikan');
    const { boxNumber, category } = getEmployeeBoxInfo(employee);

    if (!isOpen) return null;

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: 'pendidikan', label: 'Pendidikan', icon: <AcademicCapIcon className="h-4 w-4 mr-2" /> },
        { id: 'karir', label: 'Riwayat Jabatan', icon: <BriefcaseIcon className="h-4 w-4 mr-2" /> },
        { id: 'kinerja', label: 'Riwayat Kinerja', icon: <StarIcon className="h-4 w-4 mr-2" /> },
        { id: 'pengembangan', label: 'Riwayat Pengembangan', icon: <ClipboardListIcon className="h-4 w-4 mr-2" /> },
    ];
    
    // Updated: Just use name directly
    const fullName = employee.name;


    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 flex justify-center items-start pt-10" onClick={onClose}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }} className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-5xl m-4 flex flex-col relative" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-5 border-b border-gray-200 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <img src={employee.avatar} alt={employee.name} className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-md"/>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
                            <p className="text-gray-500">NIP: {employee.nip}</p>
                            {(employee.birthDate || employee.nip) && getRemainingRetirementTime(employee) && (
                                <p className={`text-sm mt-1 font-medium ${isOverRetirementAge(employee) ? 'text-red-600' : isApproachingRetirement(employee) ? 'text-amber-600' : 'text-gray-500'}`}>
                                    {getRemainingRetirementTime(employee)}
                                </p>
                            )}
                            <div className="mt-2 flex gap-2">
                                <PermenpanBadge status={getTalentStatusPermenpan(boxNumber)} />
                                <SuccessionStatusBadge status={employee.successionStatus} />
                            </div>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 max-h-[75vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <DetailCard icon={<BriefcaseIcon className="h-5 w-5"/>} title="Info Jabatan">
                            <div className="space-y-1.5 text-sm">
                                <p><strong className="font-semibold text-gray-700">Jabatan:</strong> {employee.jabatan}</p>
                                <p><strong className="font-semibold text-gray-700">Pangkat:</strong> {employee.pangkatGolongan}</p>
                                <p><strong className="font-semibold text-gray-700">Unit Kerja:</strong> {employee.unitKerja}</p>
                                <p><strong className="font-semibold text-gray-700">Eselon:</strong> {employee.eselon}</p>
                            </div>
                        </DetailCard>
                        <DetailCard icon={<StarIcon className="h-5 w-5"/>} title="Penilaian Talenta">
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-1 text-sm">
                                    <p><strong className="font-semibold text-gray-700">Kinerja:</strong> {employee.performance}</p>
                                    <p><strong className="font-semibold text-gray-700">Potensi:</strong> {employee.potential}</p>
                                    <p><strong className="font-semibold text-gray-700">Kompetensi:</strong> {employee.competency ?? 'N/A'}</p>
                                    <p className="pt-1"><strong className="font-semibold text-gray-700">Kotak 9-Box:</strong> {boxNumber} ({category})</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <MiniNineBoxGrid candidates={[employee]} />
                                </div>
                            </div>
                        </DetailCard>
                         <DetailCard icon={<AcademicCapIcon className="h-5 w-5"/>} title="Kompetensi & Target">
                             <div className="space-y-3">
                                <div>
                                    <h5 className="font-semibold text-gray-700 text-sm mb-1.5">Keterampilan Utama</h5>
                                    <div className="flex flex-wrap gap-1.5">
                                        {employee.skills.length > 0 ? employee.skills.map(skill => (
                                            <span key={skill} className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">{skill}</span>
                                        )) : <span className="text-gray-400 italic text-sm">Belum terdata</span>}
                                    </div>
                                </div>
                                 <div>
                                    <h5 className="font-semibold text-gray-700 text-sm mb-1.5">Jabatan Kritikal Target</h5>
                                    <p className="text-sm text-gray-800">{employee.criticalPosition || 'Belum ditetapkan'}</p>
                                </div>
                             </div>
                        </DetailCard>
                    </div>

                    {/* History Section */}
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="border-b border-gray-200">
                             <nav className="-mb-px flex gap-x-1 sm:gap-x-4 px-4" aria-label="Tabs">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`${
                                            activeTab === tab.id
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                                    >
                                        {tab.icon} {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <div className="p-1">
                            {activeTab === 'pendidikan' && <HistoryTable data={employee.educationHistory} columns={[{key: 'jenjang', label: 'Jenjang'}, {key: 'jurusan', label: 'Jurusan'}, {key: 'institusi', label: 'Institusi'}, {key: 'tahunLulus', label: 'Tahun Lulus'}]} />}
                            {activeTab === 'karir' && <HistoryTable data={employee.careerHistory} columns={[{key: 'jabatan', label: 'Jabatan'}, {key: 'unitKerja', label: 'Unit Kerja'}, {key: 'tmt', label: 'TMT'}]} />}
                            {activeTab === 'kinerja' && <HistoryTable data={employee.performanceHistory} columns={[{key: 'tahun', label: 'Tahun'}, {key: 'skp', label: 'Nilai SKP'}, {key: 'predikat', label: 'Predikat'}]} />}
                            {activeTab === 'pengembangan' && <HistoryTable data={employee.developmentHistory} columns={[{key: 'namaPelatihan', label: 'Nama Pelatihan/Pengembangan'}, {key: 'penyelenggara', label: 'Penyelenggara'}, {key: 'tahun', label: 'Tahun'}, {key: 'jenis', label: 'Jenis'}]} />}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-100 rounded-b-xl flex justify-end space-x-3">
                     <button type="button" onClick={() => onGenerateDescription(employee)} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                        <SparklesIcon className="h-4 w-4 text-purple-600" />
                        <span>Buat Deskripsi Jabatan</span>
                    </button>
                    <button type="button" onClick={() => onEdit(employee)} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                        <EditIcon className="h-4 w-4" />
                        <span>Edit Data</span>
                    </button>
                    <button type="button" onClick={onClose} className="px-5 py-2.5 bg-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                        Tutup
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EmployeeDetailModal;
