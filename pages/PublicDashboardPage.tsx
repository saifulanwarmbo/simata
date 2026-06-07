import React, { useState, useEffect, useMemo } from 'react';
import { Employee, CriticalJob } from '../types';
import { saveEmployeeToStorage, loadEmployeesFromStorage, loadCriticalJobsFromStorage } from '../utils/storage';
import { ClipboardListIcon, BrandIcon, HomeIcon, LogoutIcon, UsersIcon, StarIcon, BriefcaseIcon, WarningIcon, ChevronDoubleLeftIcon, MenuIcon, ArrowRightIcon } from '../components/icons';
import SelfServiceFormPage from './SelfServiceFormPage';
import DashboardCharts from '../components/DashboardCharts';
import { getEmployeeBoxInfo, isApproachingRetirement } from '../utils/talentUtils';
import CriticalJobDetailModal from '../components/CriticalJobDetailModal';

interface StatCardProps {
    icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
    label: string;
    value: string | number;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-5 border-l-4" style={{ borderColor: color }}>
        <div className="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
            {React.cloneElement(icon, { className: 'h-6 w-6', style: { color } })}
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm font-medium text-gray-500">{label}</p>
        </div>
    </div>
);

interface PublicDashboardPageProps {
    onGoToLogin: () => void;
}

const PublicDashboardPage: React.FC<PublicDashboardPageProps> = ({ onGoToLogin }) => {
    const [view, setView] = useState<'summary' | 'selfServiceForm'>('summary');
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [criticalJobs, setCriticalJobs] = useState<CriticalJob[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedJob, setSelectedJob] = useState<CriticalJob | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const employeesData = await loadEmployeesFromStorage();
            setEmployees(employeesData);
            const jobsData = await loadCriticalJobsFromStorage();
            setCriticalJobs(jobsData);
        };
        fetchData();
    }, [view]);

    const handleSaveFromSelfService = async (employee: Employee) => {
        try {
            await saveEmployeeToStorage(employee);
            setView('summary');
        } catch (error) {
            console.error("Failed to save employee:", error);
            alert("Terjadi kesalahan saat menyimpan data.");
        }
    };

    const summary = useMemo(() => {
        const approvedEmployees = employees.filter(e => e.status === 'Disetujui');
        const approachingRetirementCount = approvedEmployees.filter(emp => isApproachingRetirement(emp)).length;
        const readyNowCount = approvedEmployees.filter(emp => emp.successionStatus === 'Siap Sekarang').length;
        
        return {
            totalEmployees: approvedEmployees.length,
            approachingRetirementCount,
            readyNowCount,
            criticalJobsCount: criticalJobs.length
        };
    }, [employees, criticalJobs]);

    const navLinkClasses = "flex items-center px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors duration-200";
    const activeLinkClasses = "bg-slate-900 text-white font-semibold";

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full bg-slate-800 text-white flex flex-col p-4 shadow-2xl transition-transform duration-300 ease-in-out z-30 ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}`}>
                <div className="flex items-center justify-between gap-3 px-2 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-900 p-2 rounded-lg">
                            <BrandIcon className="h-8 w-8 text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight">SIM Talenta</h1>
                            <p className="text-xs text-gray-400">Publik</p>
                        </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 -mr-2 text-gray-400 rounded-lg hover:bg-slate-700 hover:text-white md:hidden">
                        <ChevronDoubleLeftIcon className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto">
                    <ul>
                        <li>
                            <button onClick={() => setView('summary')} className={`w-full ${navLinkClasses} ${view === 'summary' ? activeLinkClasses : ''}`}>
                                <HomeIcon className="h-5 w-5 mr-3" />
                                Dashboard
                            </button>
                        </li>
                        <li>
                            <button onClick={() => setView('selfServiceForm')} className={`w-full ${navLinkClasses} ${view === 'selfServiceForm' ? activeLinkClasses : ''}`}>
                                <ClipboardListIcon className="h-5 w-5 mr-3" />
                                Daftarkan Diri
                            </button>
                        </li>
                    </ul>
                </nav>

                <div className="mt-auto space-y-2">
                    <button onClick={onGoToLogin} className={`w-full ${navLinkClasses}`}>
                        <LogoutIcon className="h-5 w-5 mr-3" />
                        <span>Login Administrator</span>
                    </button>
                    <div className="px-4 py-3 bg-slate-900/50 rounded-lg text-center">
                        <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} BKPSDM Aceh Barat</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <header className="bg-white shadow-sm sticky top-0 z-20">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center">
                            {!isSidebarOpen && (
                                <button onClick={() => setIsSidebarOpen(true)} className="mr-4 text-gray-500 hover:text-gray-700 focus:outline-none">
                                    <MenuIcon className="h-6 w-6" />
                                </button>
                            )}
                            <h2 className="text-2xl font-bold text-gray-800">
                                {view === 'summary' ? 'Dashboard Publik' : 'Pendaftaran Data Talenta Mandiri'}
                            </h2>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-8">
                    {view === 'selfServiceForm' ? (
                        <div className="max-w-3xl mx-auto">
                            <SelfServiceFormPage onSave={handleSaveFromSelfService} />
                        </div>
                    ) : (
                        <div className="max-w-6xl mx-auto space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard icon={<UsersIcon />} label="Total Talenta Disetujui" value={summary.totalEmployees} color="#3b82f6" />
                                <StatCard icon={<BriefcaseIcon />} label="Jabatan Lowong/Kritikal" value={summary.criticalJobsCount} color="#a855f7" />
                                <StatCard icon={<WarningIcon />} label="Akan Pensiun (<1 Thn)" value={summary.approachingRetirementCount} color="#f59e0b" />
                                <StatCard icon={<StarIcon />} label="Kandidat Siap" value={summary.readyNowCount} color="#10b981" />
                            </div>

                            <DashboardCharts employees={employees} />

                            <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 md:p-8">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <BriefcaseIcon className="h-6 w-6 text-indigo-500" />
                                        Daftar Jabatan Lowong / Kritikal
                                    </h2>
                                </div>
                                
                                {criticalJobs.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {criticalJobs.map(job => (
                                            <div 
                                                key={job.id} 
                                                onClick={() => setSelectedJob(job)}
                                                className="group cursor-pointer bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-400 hover:shadow-md hover:ring-1 hover:ring-indigo-400 transition-all duration-200 flex flex-col h-full"
                                            >
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{job.title}</h3>
                                                    <p className="text-sm font-medium text-gray-500 mt-1 line-clamp-1">{job.unitKerja}</p>
                                                    <div className="mt-4 space-y-2">
                                                        <div className="flex items-center text-xs text-gray-600 bg-gray-50 w-fit px-2.5 py-1 rounded-md border border-gray-100">
                                                            <span className="font-semibold text-gray-700">Eselon:</span> <span className="ml-1">{job.requiredEselon}</span>
                                                        </div>
                                                        <div className="flex items-center text-xs text-gray-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-md border border-emerald-100">
                                                            <span className="font-semibold text-emerald-700">Terbuka:</span> <span className="ml-1 text-emerald-600 font-bold">{job.vacancies} Posisi</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-indigo-600">Lihat Detail</span>
                                                    <ArrowRightIcon className="h-4 w-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <BriefcaseIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">Saat ini tidak ada jabatan kritikal atau lowong yang dipublikasikan.</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-8 space-y-4 text-center max-w-3xl mx-auto">
                                <ClipboardListIcon className="h-16 w-16 mx-auto text-indigo-500" />
                                <h2 className="text-2xl font-bold text-gray-900">ASN Kabupaten Aceh Barat?</h2>
                                <p className="text-gray-500 text-md">Lengkapi dan daftarkan data talenta Anda untuk mendukung pengembangan karir dan perencanaan suksesi yang lebih baik.</p>
                                <div className="pt-4">
                                    <button
                                        onClick={() => setView('selfServiceForm')}
                                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Daftarkan Diri Sekarang
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
            {selectedJob && (
                <CriticalJobDetailModal 
                    job={selectedJob} 
                    onClose={() => setSelectedJob(null)} 
                />
            )}
        </div>
    );
};

export default PublicDashboardPage;
