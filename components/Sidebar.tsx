
import React from 'react';
import { UsersIcon, ViewGridIcon, DownloadIcon, LogoutIcon, BriefcaseIcon, HomeIcon, ClipboardListIcon, BrandIcon, ClipboardCheckIcon, AcademicCapIcon, ChevronDoubleLeftIcon } from './icons';

type ViewMode = 'summary' | 'list' | 'talentPool' | 'criticalJobs' | 'submissionReview';

interface SidebarProps {
    viewMode: ViewMode;
    setViewMode: (view: ViewMode) => void;
    onExportData: () => void;
    onLogout: () => void;
    onAddEmployee: () => void;
    pendingSubmissionsCount: number;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    isAdmin: boolean;
    onGoToLogin?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ viewMode, setViewMode, onExportData, onLogout, onAddEmployee, pendingSubmissionsCount, isSidebarOpen, setIsSidebarOpen, isAdmin, onGoToLogin }) => {
    
    const navLinkClasses = "flex items-center px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors duration-200";
    const activeLinkClasses = "bg-slate-900 text-white font-semibold";
    
    return (
        <aside className={`fixed top-0 left-0 h-full bg-slate-800 text-white flex flex-col p-4 shadow-2xl transition-transform duration-300 ease-in-out z-30 ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}`}>
            <div className="flex items-center justify-between gap-3 px-2 mb-8">
                 <div 
                    className="flex items-center gap-3 cursor-pointer group hover:opacity-80 transition-opacity"
                    onClick={() => setViewMode('summary')}
                 >
                    <div className="bg-slate-900 p-2 rounded-lg group-hover:bg-slate-950 transition-colors">
                        <BrandIcon className="h-8 w-8 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">SIM Talenta</h1>
                        <p className="text-xs text-gray-400">Kab. Aceh Barat</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="p-2 -mr-2 text-gray-400 rounded-lg hover:bg-slate-700 hover:text-white"
                    title="Tutup Sidebar"
                >
                    <ChevronDoubleLeftIcon className="h-6 w-6" />
                </button>
            </div>

            <nav className="flex-1 space-y-2">
                <h2 className="px-4 pt-4 pb-2 text-xs font-bold uppercase text-gray-500 tracking-wider">Manajemen Talenta</h2>
                <ul>
                    <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); setViewMode('summary'); }}
                           className={`${navLinkClasses} ${viewMode === 'summary' ? activeLinkClasses : ''}`}
                           aria-current={viewMode === 'summary' ? 'page' : undefined}>
                            <HomeIcon className="h-5 w-5 mr-3" />
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); setViewMode('list'); }}
                           className={`${navLinkClasses} ${viewMode === 'list' ? activeLinkClasses : ''}`}
                           aria-current={viewMode === 'list' ? 'page' : undefined}>
                            <UsersIcon className="h-5 w-5 mr-3" />
                            Daftar Talenta
                        </a>
                    </li>
                    {isAdmin && (
                        <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); setViewMode('submissionReview'); }}
                            className={`${navLinkClasses} ${viewMode === 'submissionReview' ? activeLinkClasses : ''} justify-between`}
                            aria-current={viewMode === 'submissionReview' ? 'page' : undefined}>
                            <div className="flex items-center">
                                <ClipboardCheckIcon className="h-5 w-5 mr-3" />
                                    <span>Pengajuan Mandiri</span>
                            </div>
                            {pendingSubmissionsCount > 0 && (
                                <span className="bg-indigo-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-slate-800">
                                    {pendingSubmissionsCount}
                                </span>
                            )}
                            </a>
                        </li>
                    )}
                    <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); setViewMode('talentPool'); }}
                           className={`${navLinkClasses} ${viewMode === 'talentPool' ? activeLinkClasses : ''}`}
                           aria-current={viewMode === 'talentPool' ? 'page' : undefined}>
                           <ViewGridIcon className="h-5 w-5 mr-3" />
                            Peta Talent Pool
                        </a>
                    </li>
                     <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); setViewMode('criticalJobs'); }}
                           className={`${navLinkClasses} ${viewMode === 'criticalJobs' ? activeLinkClasses : ''}`}
                           aria-current={viewMode === 'criticalJobs' ? 'page' : undefined}>
                           <BriefcaseIcon className="h-5 w-5 mr-3" />
                            Jabatan Kritikal
                        </a>
                    </li>
                     <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); onAddEmployee(); }}
                           className={navLinkClasses}
                           title="Tambah data talenta baru sebagai Admin">
                           <ClipboardListIcon className="h-5 w-5 mr-3" />
                            Isi Data Mandiri
                        </a>
                    </li>
                </ul>

                <h2 className="px-4 pt-6 pb-2 text-xs font-bold uppercase text-gray-500 tracking-wider">Laporan</h2>
                <ul>
                    <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); onExportData(); }}
                           className={navLinkClasses}>
                            <DownloadIcon className="h-5 w-5 mr-3" />
                            Ekspor PDF
                        </a>
                    </li>
                </ul>
            </nav>

                    <div className="mt-auto space-y-2">
                {isAdmin ? (
                    <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); onLogout(); }}
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors duration-200"
                        title="Logout dari aplikasi"
                    >
                        <LogoutIcon className="h-5 w-5 mr-3" />
                        <span>Logout</span>
                    </a>
                ) : (
                    <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); onGoToLogin && onGoToLogin(); }}
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors duration-200"
                        title="Login Administrator"
                    >
                        <LogoutIcon className="h-5 w-5 mr-3" />
                        <span>Login Administrator</span>
                    </a>
                )}
                <div className="px-4 py-3 bg-slate-900/50 rounded-lg text-center">
                    <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} BKPSDM Aceh Barat</p>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
