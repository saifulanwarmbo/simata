
import React, { useMemo, useState } from 'react';
import { CriticalJob, Employee, SuccessionStatus } from '../types';
import { UserCircleIcon, BriefcaseIcon, StarIcon, EditIcon, DeleteIcon, AddIcon, CheckCircleIcon, ClipboardCheckIcon, WarningIcon, XCircleIcon, ChevronDownIcon, SparklesIcon, LoadingIcon, AcademicCapIcon } from '../components/icons';
import MiniNineBoxGrid from '../components/MiniNineBoxGrid';
import { generateSuccessionInsight, generateCandidateMatch, CandidateMatchResult } from '../services/geminiService';
import { findSuitableCandidates, findPotentialCandidates, isEducationRelevant, getEselonRank, isOverRetirementAge } from '../utils/talentUtils';


type PipelineStatus = 'Sehat' | 'Cukup' | 'Perlu Perhatian' | 'Berisiko';

const SuccessionStatusBadge = ({ status }: { status: SuccessionStatus }) => {
    const statusMap: { [key in SuccessionStatus]: { color: string; } } = {
        'Siap Sekarang': { color: 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20' },
        '1-2 Tahun': { color: 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-600/20' },
        'Potensi Masa Depan': { color: 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20' },
        'Bukan Kandidat': { color: 'bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-500/20' },
    };
    const { color } = statusMap[status] || { color: 'bg-gray-100 text-gray-600' };
    const sizeClasses = 'px-3 py-1 text-xs';

    return <span className={`inline-flex items-center leading-5 font-semibold rounded-full ${sizeClasses} ${color}`}>{status}</span>;
}

const PipelineHealthIndicator = ({ candidates, vacancies }: { candidates: Employee[]; vacancies: number }) => {
    const { message, icon, colorClasses } = useMemo(() => {
        const readyNowCount = candidates.filter(c => c.successionStatus === 'Siap Sekarang').length;
        
        const readinessRatio = vacancies > 0 ? readyNowCount / vacancies : readyNowCount > 0 ? 1 : 0;

        if (readinessRatio >= 1) {
            return {
                message: `${readyNowCount} kandidat siap sekarang untuk ${vacancies} lowongan.`,
                icon: <CheckCircleIcon className="h-5 w-5" />,
                colorClasses: 'bg-green-100 text-green-800 border-green-300'
            };
        }
        
        const next1To2YearsCount = candidates.filter(c => c.successionStatus === '1-2 Tahun').length;
        if (readyNowCount + next1To2YearsCount >= vacancies) {
             return {
                message: `Ada ${readyNowCount + next1To2YearsCount} kandidat siap dalam 2 tahun.`,
                icon: <ClipboardCheckIcon className="h-5 w-5" />,
                colorClasses: 'bg-blue-100 text-blue-800 border-blue-300'
            };
        }
        
        if (candidates.length > 0) {
            return {
                message: 'Kandidat siap kurang dari jumlah lowongan. Perlu akselerasi.',
                icon: <WarningIcon className="h-5 w-5" />,
                colorClasses: 'bg-yellow-100 text-yellow-800 border-yellow-300'
            };
        }

        return {
            message: 'Tidak ada kandidat suksesor yang teridentifikasi.',
            icon: <XCircleIcon className="h-5 w-5" />,
            colorClasses: 'bg-red-100 text-red-800 border-red-300'
        };
    }, [candidates, vacancies]);
    
    return (
        <div className={`flex items-center gap-3 p-3 rounded-lg border ${colorClasses}`}>
            <div className="flex-shrink-0">{icon}</div>
            <div>
                <p className="text-sm font-bold">{message}</p>
            </div>
        </div>
    );
};

interface CandidateCardProps {
    key?: React.Key | string | number | null;
    employee: Employee | (Employee & { matchReason?: string; score?: number });
    matchReason?: string;
    requiredEducation?: string[];
    requiredGelar?: string[];
    aiScore?: number;
    onEdit: (employee: Employee | (Employee & { matchReason?: string; score?: number })) => void;
    isAdmin?: boolean;
}

const CandidateCard = ({ employee, matchReason, requiredEducation, requiredGelar, aiScore, onEdit, isAdmin }: CandidateCardProps) => {
    const educationMatch = isEducationRelevant(employee.jurusan, requiredEducation || []);
    // Gelar check removed as employee no longer has title data
    const fullName = employee.name;


    return (
        <div className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-indigo-200 transition-all duration-200 relative overflow-hidden">
            {aiScore !== undefined && (
                <div className={`absolute top-0 right-0 px-2 py-1 rounded-bl-lg text-xs font-bold text-white ${aiScore >= 85 ? 'bg-green-600' : aiScore >= 70 ? 'bg-indigo-500' : aiScore >= 50 ? 'bg-yellow-500' : 'bg-gray-400'}`}>
                    {aiScore}% Match
                </div>
            )}
            <div className="flex items-center gap-4">
                <img src={employee.avatar} alt={employee.name} className="w-12 h-12 rounded-full object-cover"/>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                         {isAdmin ? (
                             <button 
                                onClick={(e) => { e.stopPropagation(); onEdit(employee); }} 
                                className="font-bold text-gray-800 truncate hover:text-indigo-600 hover:underline text-left focus:outline-none flex items-center gap-1 group" 
                                title="Klik untuk mengedit data talenta"
                             >
                                {fullName}
                                <EditIcon className="h-4 w-4 text-gray-400 group-hover:text-indigo-500" />
                             </button>
                         ) : (
                            <span className="font-bold text-gray-800 truncate text-left flex items-center gap-1 group">
                                {fullName}
                            </span>
                         )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{employee.jabatan}</p>
                     <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500 truncate" title={employee.jurusan}>
                            <AcademicCapIcon className="h-4 w-4 inline-block mr-1.5 align-text-bottom text-gray-400"/>
                            {employee.jurusan || 'N/A'}
                        </p>
                        {requiredEducation && requiredEducation.length > 0 && !aiScore && (
                            educationMatch
                                ? <span title="Jurusan sesuai dengan kualifikasi"><CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0"/></span>
                                : <span title={`Jurusan tidak sesuai. Dibutuhkan: ${requiredEducation.join(', ')}`}><WarningIcon className="h-4 w-4 text-amber-500 flex-shrink-0"/></span>
                        )}
                    </div>
                </div>
                <div className="flex-shrink-0 pt-4">
                    <SuccessionStatusBadge status={employee.successionStatus} />
                </div>
            </div>
            {matchReason && (
                 <div className="mt-2.5 pt-2 border-t border-gray-100">
                    <p className="text-xs text-indigo-700 leading-relaxed" title={matchReason}>
                        <StarIcon className="h-4 w-4 inline-block mr-1.5 text-indigo-400 align-text-bottom"/>
                        <strong className="font-semibold">{aiScore ? 'Analisis AI:' : 'Kesesuaian:'}</strong> {matchReason}
                    </p>
                </div>
            )}
        </div>
    );
};

interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
    children?: React.ReactNode;
}

const TabButton = ({ isActive, onClick, children }: TabButtonProps) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors focus:outline-none ${
            isActive
                ? 'border-indigo-500 text-indigo-600 bg-gray-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-100'
        }`}
    >
        {children}
    </button>
);

interface CriticalJobAnalysisCardProps {
    key?: React.Key | string | number | null;
    job: CriticalJob;
    allEmployees: Employee[];
    onEdit: (job: CriticalJob) => void;
    onDelete: (jobId: string) => void;
    onEditEmployee: (employee: Employee) => void;
    isExpanded: boolean;
    onToggleExpand: () => void;
    isAdmin?: boolean;
}

const CriticalJobAnalysisCard = ({ 
    job, 
    allEmployees,
    onEdit, 
    onDelete, 
    onEditEmployee,
    isExpanded,
    onToggleExpand,
    isAdmin
}: CriticalJobAnalysisCardProps) => {
    const [insight, setInsight] = useState<{ content: string, isLoading: boolean, error: string | null }>({ content: '', isLoading: false, error: null });
    const [candidateTab, setCandidateTab] = useState<'utama' | 'potensial' | 'ai'>('utama');
    const [aiMatches, setAiMatches] = useState<CandidateMatchResult[] | null>(null);
    const [isAiMatching, setIsAiMatching] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    const primaryCandidates = useMemo(() => findSuitableCandidates(job, allEmployees), [job, allEmployees]);
    const primaryCandidateIds = useMemo(() => new Set(primaryCandidates.map(c => c.id)), [primaryCandidates]);
    const potentialCandidates = useMemo(() => findPotentialCandidates(job, allEmployees, primaryCandidateIds), [job, allEmployees, primaryCandidateIds]);
    const allUniqueCandidates = useMemo(() => {
        const combined = [...primaryCandidates, ...potentialCandidates];
        return Array.from(new Map(combined.map(c => [c.id, c])).values());
    }, [primaryCandidates, potentialCandidates]);

    const readyNowCount = useMemo(() => primaryCandidates.filter(c => c.successionStatus === 'Siap Sekarang').length, [primaryCandidates]);

    const handleGenerateClick = async () => {
        setInsight({ content: '', isLoading: true, error: null });
        try {
            const result = await generateSuccessionInsight(job, allUniqueCandidates);
            setInsight({ content: result, isLoading: false, error: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setInsight({ content: '', isLoading: false, error: message });
        }
    };
    
    const handleAiMatchClick = async () => {
        setIsAiMatching(true);
        setAiError(null);
        try {
            let candidatesToAnalyze = allUniqueCandidates;

            // If we have very few identified candidates, perform a broader search
            if (candidatesToAnalyze.length < 5) {
                const requiredRank = getEselonRank(job.requiredEselon);
                
                const broadCandidates = allEmployees.filter(e => {
                    // Filter 1: Not retired
                    if (isOverRetirementAge(e)) return false;
                    
                    // Filter 2: Eselon proximity.
                    // Candidates should be in the same rank, 1 level below (for promotion), 
                    // or 1 level above (for rotation/demotion if needed, though rare).
                    // Lower rank number means higher position (0=Top).
                    const empRank = getEselonRank(e.eselon);
                    const rankDiff = empRank - requiredRank; 
                    
                    // rankDiff 0: Same level.
                    // rankDiff 1 or 2: Employee is 1 or 2 levels below (candidates for promotion).
                    // rankDiff -1: Employee is 1 level above (candidate for rotation/descension).
                    const isRankRelevant = rankDiff >= -1 && rankDiff <= 2;
                    
                    return isRankRelevant;
                })
                // Prioritize high potentials and performers to send the "best" data to AI
                .sort((a, b) => b.potential - a.potential)
                .slice(0, 15); // Limit to top 15 relevant profiles to save tokens and improve focus.

                candidatesToAnalyze = broadCandidates;
            }

            if (candidatesToAnalyze.length === 0) {
                 setAiMatches([]); // No eligible candidates found at all
            } else {
                const matches = await generateCandidateMatch(job, candidatesToAnalyze);
                // Sort by score descending
                matches.sort((a, b) => b.score - a.score);
                setAiMatches(matches);
            }
        } catch (err) {
            console.error("AI Matching Error:", err);
            setAiError(err instanceof Error ? err.message : 'Gagal menghasilkan rekomendasi AI.');
        } finally {
            setIsAiMatching(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-200">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors" onClick={onToggleExpand}>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-12 w-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                        <StarIcon className="h-7 w-7" />
                    </div>
                    <div className="flex-grow min-w-0">
                         <h3 className="text-lg font-bold text-gray-900 truncate">{job.title}</h3>
                        <p className="text-sm font-medium text-gray-600 mt-1">{job.unitKerja}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-gray-500"><BriefcaseIcon className="h-4 w-4" />Eselon: {job.requiredEselon}</span>
                            <span className="inline-flex items-center gap-1.5 font-semibold text-gray-500"><UserCircleIcon className="h-4 w-4" />Lowongan: {job.vacancies}</span>
                            
                            {/* Readiness Indicator Badge */}
                            {readyNowCount === 0 ? (
                                <span className="inline-flex items-center gap-1.5 font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100" title="Tidak ada kandidat 'Siap Sekarang'">
                                    <WarningIcon className="h-4 w-4" />
                                    Krisis: 0 Siap Sekarang
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">
                                    <CheckCircleIcon className="h-4 w-4" />
                                    {readyNowCount} Siap Sekarang
                                </span>
                            )}
                            
                            <span className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 ml-auto md:ml-0"><ClipboardCheckIcon className="h-4 w-4" />Total Pipeline: {allUniqueCandidates.length}</span>
                        </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center md:gap-2">
                        {isAdmin && (
                            <>
                                <button onClick={(e) => { e.stopPropagation(); onEdit(job); }} className="text-indigo-600 hover:text-indigo-900 p-3 md:p-2 rounded-full hover:bg-indigo-100/60" title="Edit Jabatan"><EditIcon className="h-5 w-5 md:h-5 md:w-5" /></button>
                                <button onClick={(e) => { e.stopPropagation(); onDelete(job.id); }} className="text-red-600 hover:text-red-900 p-3 md:p-2 rounded-full hover:bg-red-100/60" title="Hapus Jabatan"><DeleteIcon className="h-5 w-5 md:h-5 md:w-5" /></button>
                            </>
                        )}
                        <ChevronDownIcon className={`h-6 w-6 text-gray-400 transition-transform duration-300 ml-1 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <>
                 <div className="p-4 md:p-6 bg-gray-50/70 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Side: Candidates & Pipeline */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Status Pipeline Suksesi</h4>
                            <PipelineHealthIndicator candidates={allUniqueCandidates} vacancies={job.vacancies} />
                        </div>
                        <div>
                            <div className="flex border-b border-gray-200 -mb-px overflow-x-auto">
                                <TabButton isActive={candidateTab === 'utama'} onClick={() => setCandidateTab('utama')}>
                                    Kandidat Utama ({primaryCandidates.length})
                                </TabButton>
                                <TabButton isActive={candidateTab === 'potensial'} onClick={() => setCandidateTab('potensial')}>
                                    Kandidat Potensial ({potentialCandidates.length})
                                </TabButton>
                                <TabButton isActive={candidateTab === 'ai'} onClick={() => setCandidateTab('ai')}>
                                    <span className="flex items-center gap-1">
                                        <SparklesIcon className="h-4 w-4 text-purple-500" />
                                        Rekomendasi AI
                                    </span>
                                </TabButton>
                            </div>
                            <div className="bg-white p-2 rounded-b-lg border border-t-0 border-gray-200 min-h-[200px]">
                                <div className="space-y-2 max-h-80 overflow-y-auto p-1">
                                    {candidateTab === 'utama' && (
                                        primaryCandidates.length > 0 ? (
                                            primaryCandidates.map(c => {
                                                const aiData = aiMatches?.find(m => m.id === c.id);
                                                return <CandidateCard key={c.id} employee={c} matchReason={aiData?.reason} aiScore={aiData?.score} requiredEducation={job.requiredEducation} requiredGelar={job.requiredGelar} onEdit={onEditEmployee} isAdmin={isAdmin} />;
                                            })
                                        ) : (
                                            <p className="text-center text-gray-500 text-sm py-8">Tidak ada kandidat utama yang memenuhi kualifikasi.</p>
                                        )
                                    )}
                                    {candidateTab === 'potensial' && (
                                        potentialCandidates.length > 0 ? (
                                            potentialCandidates.map((c: Employee & { matchReason?: string; score?: number }) => {
                                                const aiData = aiMatches?.find(m => m.id === c.id);
                                                return <CandidateCard key={c.id} employee={c} matchReason={aiData?.reason || c.matchReason} aiScore={aiData?.score} requiredEducation={job.requiredEducation} requiredGelar={job.requiredGelar} onEdit={onEditEmployee} isAdmin={isAdmin} />
                                            })
                                        ) : (
                                            <p className="text-center text-gray-500 text-sm py-8">Tidak ada kandidat potensial yang ditemukan oleh sistem.</p>
                                        )
                                    )}
                                    {candidateTab === 'ai' && (
                                        <div className="flex flex-col items-center justify-center h-full min-h-[180px]">
                                            {isAiMatching ? (
                                                <>
                                                    <LoadingIcon className="h-8 w-8 text-indigo-500 animate-spin mb-2" />
                                                    <p className="text-sm text-gray-500">AI sedang mencari kandidat terbaik...</p>
                                                </>
                                            ) : aiError ? (
                                                <div className="text-center p-4">
                                                    <WarningIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
                                                    <p className="text-sm text-red-600">{aiError}</p>
                                                </div>
                                            ) : aiMatches ? (
                                                aiMatches.length > 0 ? (
                                                    <div className="w-full space-y-2">
                                                        {aiMatches.map(match => {
                                                            const emp = allEmployees.find(e => e.id === match.id);
                                                            if (!emp) return null;
                                                            return <CandidateCard key={match.id} employee={emp} matchReason={match.reason} aiScore={match.score} onEdit={onEditEmployee} isAdmin={isAdmin} />;
                                                        })}
                                                    </div>
                                                ) : (
                                                     <p className="text-center text-gray-500 text-sm py-8">AI tidak menemukan kecocokan yang signifikan dari daftar kandidat yang tersedia.</p>
                                                )
                                            ) : (
                                                <div className="text-center p-4">
                                                    <p className="text-sm text-gray-500 mb-4">Gunakan AI untuk menganalisis profil pegawai secara mendalam dan menemukan kandidat terbaik berdasarkan deskripsi pekerjaan.</p>
                                                    <button onClick={handleAiMatchClick} className="inline-flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none transition-all">
                                                        <SparklesIcon className="h-5 w-5" />
                                                        Cari Kandidat dengan AI
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Right Side: Visuals & AI Insight */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Peta Sebaran Kandidat</h4>
                            <MiniNineBoxGrid candidates={allUniqueCandidates} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Analisis & Rekomendasi AI</h4>
                            {insight.isLoading ? (
                                <div className="flex items-center justify-center p-4 bg-white rounded-lg border h-32"><LoadingIcon className="h-8 w-8 text-indigo-500 animate-spin" /></div>
                            ) : insight.error ? (
                                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">{insight.error}</div>
                            ) : insight.content ? (
                                <div className="prose prose-sm max-w-none text-gray-600 p-4 bg-white rounded-lg border" dangerouslySetInnerHTML={{ __html: insight.content }} />
                            ) : (
                                <button onClick={handleGenerateClick} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
                                    <SparklesIcon className="h-5 w-5" />
                                    Buat Analisis Strategis
                                </button>
                            )}
                        </div>
                    </div>
                 </div>
                 <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                     <button onClick={handleAiMatchClick} disabled={isAiMatching} className="inline-flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none transition-all disabled:opacity-50">
                         {isAiMatching ? <LoadingIcon className="h-5 w-5 animate-spin text-white"/> : <SparklesIcon className="h-5 w-5" />}
                         {isAiMatching ? 'Sedang Menganalisis dengan AI...' : 'Cari Kandidat dengan AI'}
                     </button>
                 </div>
                </>
            )}
        </div>
    );
};


interface CriticalJobsPageProps {
    criticalJobs: CriticalJob[];
    employees: Employee[];
    onAddJob: () => void;
    onEditJob: (job: CriticalJob) => void;
    onDeleteJob: (jobId: string) => void;
    onEditEmployee: (employee: Employee) => void;
    isAdmin?: boolean;
}

const CriticalJobsPage = ({ criticalJobs, employees, onAddJob, onEditJob, onDeleteJob, onEditEmployee, isAdmin }: CriticalJobsPageProps) => {
    const [expandedJobId, setExpandedJobId] = useState<string | null>(criticalJobs.length > 0 ? criticalJobs[0].id : null);

    const handleToggleExpand = (jobId: string) => {
        setExpandedJobId(prevId => (prevId === jobId ? null : jobId));
    };
    
    return (
        <div>
            {isAdmin && (
                <div className="flex justify-end mb-6">
                    <button
                        onClick={onAddJob}
                        className="w-full sm:w-auto flex items-center justify-center bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        <AddIcon className="h-5 w-5 mr-2" />
                        <span>Tambah Jabatan Baru</span>
                    </button>
                </div>
            )}
            {criticalJobs.length > 0 ? (
                <div className="space-y-6">
                    {criticalJobs.map(job => (
                        <CriticalJobAnalysisCard 
                            key={job.id} 
                            job={job} 
                            allEmployees={employees}
                            onEdit={onEditJob} 
                            onDelete={onDeleteJob}
                            onEditEmployee={onEditEmployee}
                            isExpanded={expandedJobId === job.id}
                            onToggleExpand={() => handleToggleExpand(job.id)}
                            isAdmin={isAdmin}
                        />
                    ))}
                </div>
            ) : (
                 <div className="text-center p-20 bg-white rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold text-gray-700">Belum Ada Jabatan Kritikal</h3>
                    <p className="mt-2 text-gray-500">Silakan tambahkan jabatan kritikal untuk memulai perencanaan suksesi yang mendalam.</p>
                </div>
            )}
        </div>
    );
};

export default CriticalJobsPage;
