import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Employee, CriticalJob, SuccessionStatus, PublicAccessSettings } from '../types';
import { saveEmployeeToStorage, loadEmployeesFromStorage, loadCriticalJobsFromStorage } from '../utils/storage';
import { getPublicAccessSettings } from '../utils/settingsStorage';
import { ClipboardListIcon, BrandIcon, HomeIcon, LogoutIcon, UsersIcon, StarIcon, BriefcaseIcon, WarningIcon, ChevronDoubleLeftIcon, MenuIcon, ArrowRightIcon, ViewGridIcon } from '../components/icons';
import SelfServiceFormPage from './SelfServiceFormPage';
import DashboardCharts from '../components/DashboardCharts';
import { getEmployeeBoxInfo, isApproachingRetirement, getEselonRank } from '../utils/talentUtils';
import CriticalJobDetailModal from '../components/CriticalJobDetailModal';
import EmployeeTable from '../components/EmployeeTable';
import TalentPoolPage from './TalentPoolPage';
import CriticalJobsPage from './CriticalJobsPage';
import Header from '../components/Header';
import EmployeeDetailModal from '../components/EmployeeDetailModal';

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

type ViewMode = 'summary' | 'list' | 'talentPool' | 'criticalJobs' | 'selfServiceForm';

const PublicDashboardPage: React.FC<PublicDashboardPageProps> = ({ onGoToLogin }) => {
    const [view, setView] = useState<ViewMode>('summary');
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [criticalJobs, setCriticalJobs] = useState<CriticalJob[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [selectedJob, setSelectedJob] = useState<CriticalJob | null>(null);
    const [publicAccessSettings, setPublicAccessSettings] = useState<PublicAccessSettings>({ isOpen: true, startTime: '', endTime: '' });

    // List view states
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState('eselon-desc');
    const [successionStatusFilter, setSuccessionStatusFilter] = useState<SuccessionStatus | 'all'>('all');
    const [skpdFilter, setSkpdFilter] = useState<string>('all');
    
    const [detailedEmployee, setDetailedEmployee] = useState<Employee | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const employeesData = await loadEmployeesFromStorage();
            setEmployees(employeesData);
            const jobsData = await loadCriticalJobsFromStorage();
            setCriticalJobs(jobsData);
            const settings = await getPublicAccessSettings();
            setPublicAccessSettings(settings);
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

    const approvedEmployees = useMemo(() => employees.filter(e => e.status === 'Disetujui'), [employees]);

    const filteredEmployees = useMemo(() => {
        let processedEmployees = [...approvedEmployees];
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        if (searchTerm) {
            processedEmployees = processedEmployees.filter(emp =>
                emp.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                emp.jabatan.toLowerCase().includes(lowerCaseSearchTerm) ||
                emp.unitKerja.toLowerCase().includes(lowerCaseSearchTerm) ||
                (emp.email && emp.email.toLowerCase().includes(lowerCaseSearchTerm)) ||
                emp.nip.includes(lowerCaseSearchTerm)
            );
        }
        
        if (successionStatusFilter !== 'all') {
            processedEmployees = processedEmployees.filter(emp => emp.successionStatus === successionStatusFilter);
        }

        if (skpdFilter !== 'all') {
            processedEmployees = processedEmployees.filter(emp => emp.unitKerja === skpdFilter);
        }

        if (sortKey === 'default') return processedEmployees;

        const [key, direction] = sortKey.split('-');
        return processedEmployees.sort((a, b) => {
            let valA: string | number | undefined, valB: string | number | undefined;
            let sortDirection = direction; 

            switch (key) {
                case 'eselon': 
                    valA = getEselonRank(a.eselon); 
                    valB = getEselonRank(b.eselon);
                    sortDirection = direction === 'asc' ? 'desc' : 'asc';
                    break;
                case 'name': valA = a.name.toLowerCase(); valB = b.name.toLowerCase(); break;
                case 'performance': valA = a.performance; valB = b.performance; break;
                case 'potential': valA = a.potential; valB = b.potential; break;
                case 'competency': valA = a.competency ?? 0; valB = b.competency ?? 0; break;
                default: return 0;
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [approvedEmployees, searchTerm, sortKey, successionStatusFilter, skpdFilter]);

    const handleViewEmployeeDetails = useCallback((employee: Employee) => {
        setDetailedEmployee(employee);
        setIsDetailModalOpen(true);
    }, []);

    const checkIsPublicAccessAllowed = useCallback(() => {
        if (!publicAccessSettings.isOpen) return false;
        
        const now = new Date().getTime();
        const start = publicAccessSettings.startTime ? new Date(publicAccessSettings.startTime).getTime() : 0;
        const end = publicAccessSettings.endTime ? new Date(publicAccessSettings.endTime).getTime() : Infinity;
        
        if (start && now < start) return false;
        if (end && now > end) return false;
        
        return true;
    }, [publicAccessSettings]);

    const emptyHandler = () => {};
    const asyncEmptyHandler = async () => {};

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

    const getHeaderTitle = (): string => {
        switch (view) {
            case 'summary': return 'Dashboard Publik';
            case 'list': return 'Daftar Talenta ASN';
            case 'talentPool': return 'Peta Talent Pool';
            case 'criticalJobs': return 'Jabatan Kritikal & Suksesi';
            case 'selfServiceForm': return 'Pendaftaran Data Talenta Mandiri';
            default: return 'Akses Publik';
        }
    };

    const getHeaderSubtitle = (): string => {
        switch (view) {
            case 'summary': return 'Ringkasan data talenta, kinerja, dan potensi ASN.';
            case 'list': return `Total ${filteredEmployees.length} talenta tercatat.`;
            case 'talentPool': return 'Visualisasi dan analisis 9-Box Matrix.';
            case 'criticalJobs': return 'Informasi Jabatan Lowong dan posisi strategis.';
            case 'selfServiceForm': return 'Lengkapi data profil talenta Anda secara mandiri.';
            default: return '';
        }
    };

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
                            <button onClick={() => setView('list')} className={`w-full ${navLinkClasses} ${view === 'list' ? activeLinkClasses : ''}`}>
                                <UsersIcon className="h-5 w-5 mr-3" />
                                Daftar Talenta
                            </button>
                        </li>
                        <li>
                            <button onClick={() => setView('talentPool')} className={`w-full ${navLinkClasses} ${view === 'talentPool' ? activeLinkClasses : ''}`}>
                                <ViewGridIcon className="h-5 w-5 mr-3" />
                                Peta Talent Pool
                            </button>
                        </li>
                        <li>
                            <button onClick={() => setView('criticalJobs')} className={`w-full ${navLinkClasses} ${view === 'criticalJobs' ? activeLinkClasses : ''}`}>
                                <BriefcaseIcon className="h-5 w-5 mr-3" />
                                Jabatan Lowong/Kritikal
                            </button>
                        </li>
                        {checkIsPublicAccessAllowed() && (
                            <li>
                                <button onClick={() => setView('selfServiceForm')} className={`w-full ${navLinkClasses} ${view === 'selfServiceForm' ? activeLinkClasses : ''}`}>
                                    <ClipboardListIcon className="h-5 w-5 mr-3" />
                                    Daftarkan Diri
                                </button>
                            </li>
                        )}
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
                {/* Mobile overlay */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-gray-800 focus:outline-none bg-opacity-50 z-20 md:hidden" 
                        onClick={() => setIsSidebarOpen(false)}
                        aria-hidden="true"
                    ></div>
                )}
                
                {!isSidebarOpen && (
                     <button onClick={() => setIsSidebarOpen(true)} className="fixed top-4 left-4 z-40 bg-white text-gray-600 p-2 border border-gray-200 rounded-full shadow-lg hover:bg-gray-100" title="Buka Sidebar">
                        <MenuIcon className="h-6 w-6" />
                    </button>
                )}

                <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                    <Header 
                        title={getHeaderTitle()}
                        subtitle={getHeaderSubtitle()}
                        showControls={view === 'list'}
                        onAddEmployee={checkIsPublicAccessAllowed() ? () => setView('selfServiceForm') : undefined}
                        onSearchChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        sortKey={sortKey}
                        onSortKeyChange={setSortKey}
                        successionStatusFilter={successionStatusFilter}
                        onSuccessionStatusFilterChange={setSuccessionStatusFilter}
                        skpdFilter={skpdFilter}
                        onSkpdFilterChange={setSkpdFilter}
                        onImportData={emptyHandler}
                        onDownloadTemplate={emptyHandler}
                        isAdmin={false}
                    />
                    
                    <main className="mt-8">
                    {view === 'selfServiceForm' ? (
                        <div className="max-w-3xl mx-auto">
                            {checkIsPublicAccessAllowed() ? (
                                <SelfServiceFormPage onSave={handleSaveFromSelfService} />
                            ) : (
                                <div className="bg-white rounded-2xl shadow-lg p-10 text-center border-t-4 border-red-500">
                                    <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <WarningIcon className="h-10 w-10 text-red-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Akses Ditutup</h2>
                                    <p className="text-gray-600 text-lg">
                                        Mohon maaf, periode pengisian atau pembaruan data talenta mandiri saat ini sedang ditutup atau berada di luar batas waktu yang telah ditentukan oleh Administrator.
                                    </p>
                                    <button 
                                        onClick={() => setView('summary')}
                                        className="mt-8 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
                                    >
                                        Kembali ke Dashboard
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : view === 'list' ? (
                        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                            <EmployeeTable 
                                employees={filteredEmployees} 
                                onEdit={emptyHandler} 
                                onDelete={emptyHandler} 
                                onGenerateDescription={asyncEmptyHandler} 
                                onGenerateDevelopmentPlan={asyncEmptyHandler}
                                onShowDetails={handleViewEmployeeDetails}
                                isAdmin={false}
                            />
                        </div>
                    ) : view === 'talentPool' ? (
                        <TalentPoolPage 
                            employees={approvedEmployees} 
                            analysis={''} 
                            isLoading={false} 
                            error={null} 
                            onShowDetails={handleViewEmployeeDetails} 
                            onEdit={emptyHandler} 
                            isAdmin={false} 
                        />
                    ) : view === 'criticalJobs' ? (
                        <CriticalJobsPage 
                            criticalJobs={criticalJobs} 
                            employees={approvedEmployees} 
                            onAddJob={emptyHandler} 
                            onEditJob={emptyHandler} 
                            onDeleteJob={emptyHandler} 
                            onEditEmployee={emptyHandler} 
                            isAdmin={false} 
                        />
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

                            {checkIsPublicAccessAllowed() && (
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
                            )}
                        </div>
                    )}
                </main>
                </div>
            </div>
            {selectedJob && (
                <CriticalJobDetailModal 
                    job={selectedJob} 
                    onClose={() => setSelectedJob(null)} 
                />
            )}
            {isDetailModalOpen && detailedEmployee && (
                <EmployeeDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    employee={detailedEmployee}
                    onEdit={emptyHandler}
                    onGenerateDescription={asyncEmptyHandler}
                />
            )}
        </div>
    );
};

export default PublicDashboardPage;
