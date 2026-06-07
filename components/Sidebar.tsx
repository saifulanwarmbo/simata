
import React from 'react';
import { UsersIcon, ViewGridIcon, DownloadIcon, LogoutIcon, BriefcaseIcon, HomeIcon, ClipboardListIcon, BrandIcon, ClipboardCheckIcon, AcademicCapIcon, ChevronDoubleLeftIcon, TrashIcon, CogIcon } from './icons';

type ViewMode = 'summary' | 'list' | 'talentPool' | 'criticalJobs' | 'submissionReview' | 'activityLog' | 'deepAnalysis';

interface SidebarProps {
    viewMode: ViewMode;
    setViewMode: (view: ViewMode) => void;
    onExportData: () => void;
    onLogout: () => void;
    onAddEmployee: () => void;
    onClearAllData?: () => void;
    onOpenSettings?: () => void;
    pendingSubmissionsCount: number;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    isAdmin: boolean;
    onGoToLogin?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ viewMode, setViewMode, onExportData, onLogout, onAddEmployee, onClearAllData, onOpenSettings, pendingSubmissionsCount, isSidebarOpen, setIsSidebarOpen, isAdmin, onGoToLogin }) => {
    
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

            <nav className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden pr-2">
                <h2 className="px-4 pt-4 pb-2 text-xs font-bold uppercase text-gray-500 tracking-wider">Manajemen Talenta</h2>
                <ul>
                    <li>
                        <button onClick={() => setViewMode('summary')}
                           className={`${navLinkClasses} ${viewMode === 'summary' ? activeLinkClasses : ''} w-full text-left`}
                           aria-current={viewMode === 'summary' ? 'page' : undefined}>
                            <HomeIcon className="h-5 w-5 mr-3" />
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setViewMode('list')}
                           className={`${navLinkClasses} ${viewMode === 'list' ? activeLinkClasses : ''} w-full text-left`}
                           aria-current={viewMode === 'list' ? 'page' : undefined}>
                            <UsersIcon className="h-5 w-5 mr-3" />
                            Daftar Talenta
                        </button>
                    </li>
                    {isAdmin && (
                        <li>
                            <button onClick={() => setViewMode('submissionReview')}
                            className={`${navLinkClasses} ${viewMode === 'submissionReview' ? activeLinkClasses : ''} justify-between w-full text-left`}
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
                            </button>
                        </li>
                    )}
                    <li>
                        <button onClick={() => setViewMode('talentPool')}
                           className={`${navLinkClasses} ${viewMode === 'talentPool' ? activeLinkClasses : ''} w-full text-left`}
                           aria-current={viewMode === 'talentPool' ? 'page' : undefined}>
                           <ViewGridIcon className="h-5 w-5 mr-3" />
                            Peta Talent Pool
                        </button>
                    </li>
                     <li>
                        <button onClick={() => setViewMode('criticalJobs')}
                           className={`${navLinkClasses} ${viewMode === 'criticalJobs' ? activeLinkClasses : ''} w-full text-left`}
                           aria-current={viewMode === 'criticalJobs' ? 'page' : undefined}>
                           <BriefcaseIcon className="h-5 w-5 mr-3" />
                            Jabatan Kritikal
                        </button>
                    </li>
                     <li>
                        <button onClick={() => onAddEmployee()}
                           className={`${navLinkClasses} w-full text-left`}
                           title="Tambah data talenta baru sebagai Admin">
                           <ClipboardListIcon className="h-5 w-5 mr-3" />
                            Isi Data Mandiri
                        </button>
                    </li>
                </ul>

                {isAdmin && (
                    <>
                        <h2 className="px-4 pt-6 pb-2 text-xs font-bold uppercase text-gray-500 tracking-wider">Laporan</h2>
                        <ul>
                            <li>
                                <button onClick={() => setViewMode('deepAnalysis')}
                                   className={`${navLinkClasses} ${viewMode === 'deepAnalysis' ? activeLinkClasses : ''} w-full text-left`}
                                   aria-current={viewMode === 'deepAnalysis' ? 'page' : undefined}>
                                    <ClipboardCheckIcon className="h-5 w-5 mr-3" />
                                    Analisis Suksesi Mendalam
                                </button>
                            </li>
                            <li>
                                <button onClick={() => onExportData()}
                                   className={`${navLinkClasses} w-full text-left`}>
                                    <DownloadIcon className="h-5 w-5 mr-3" />
                                    Ekspor PDF
                                </button>
                            </li>
                        </ul>

                        <h2 className="px-4 pt-6 pb-2 text-xs font-bold uppercase text-gray-500 tracking-wider">Sistem</h2>
                        <ul>
                            <li>
                                <button onClick={() => setViewMode('activityLog')}
                                   className={`${navLinkClasses} ${viewMode === 'activityLog' ? activeLinkClasses : ''} w-full text-left`}
                                   aria-current={viewMode === 'activityLog' ? 'page' : undefined}>
                                    <ClipboardListIcon className="h-5 w-5 mr-3" />
                                    Log Aktivitas
                                </button>
                            </li>
                            <li>
                                <button onClick={() => onOpenSettings && onOpenSettings()}
                                   className={`${navLinkClasses} w-full text-left`}>
                                    <CogIcon className="h-5 w-5 mr-3" />
                                    Pengaturan Akses Publik
                                </button>
                            </li>
                        </ul>
                        <h2 className="px-4 pt-6 pb-2 text-xs font-bold uppercase text-red-500/80 tracking-wider">Berbahaya</h2>
                        <ul>
                            <li>
                                <button onClick={() => onClearAllData && onClearAllData()}
                                   className="flex items-center px-4 py-3 text-red-400 hover:bg-red-900/40 hover:text-red-300 rounded-lg transition-colors duration-200 w-full text-left">
                                    <TrashIcon className="h-5 w-5 mr-3" />
                                    Hapus Semua Data
                                </button>
                            </li>
                        </ul>
                    </>
                )}
            </nav>

                    <div className="mt-auto space-y-2">
                {isAdmin ? (
                    <button 
                        onClick={() => onLogout()}
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors duration-200 w-full text-left"
                        title="Logout dari aplikasi"
                    >
                        <LogoutIcon className="h-5 w-5 mr-3" />
                        <span>Logout</span>
                    </button>
                ) : (
                    <button 
                        onClick={() => onGoToLogin && onGoToLogin()}
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors duration-200 w-full text-left"
                        title="Login Administrator"
                    >
                        <LogoutIcon className="h-5 w-5 mr-3" />
                        <span>Login Administrator</span>
                    </button>
                )}
                <div className="px-4 py-3 bg-slate-900/50 rounded-lg text-center">
                    <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} BKPSDM Aceh Barat</p>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
