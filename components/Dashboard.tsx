
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Employee, CriticalJob, SuccessionStatus } from '../types';
import Header from './Header';
import EmployeeTable from './EmployeeTable';
import EmployeeFormModal from './EmployeeFormModal';
import ConfirmationModal from './ConfirmationModal';
import JobDescriptionModal from './JobDescriptionModal';
import DevelopmentPlanModal from './DevelopmentPlanModal';
import TalentPoolPage from '../pages/TalentPoolPage';
import CriticalJobsPage from '../pages/CriticalJobsPage';
import CriticalJobFormModal from './CriticalJobFormModal';
import EmployeeDetailModal from './EmployeeDetailModal'; // Import the new component
import { 
    loadEmployeesFromStorage, 
    saveEmployeeToStorage, 
    deleteEmployeeFromStorage,
    saveMultipleEmployeesToStorage,
    deleteMultipleEmployeesFromStorage,
    loadCriticalJobsFromStorage, 
    saveCriticalJobToStorage,
    deleteCriticalJobFromStorage,
    deleteAllEmployeesFromStorage,
    deleteAllCriticalJobsFromStorage
} from '../utils/storage';
import { getPublicAccessSettings, savePublicAccessSettings } from '../utils/settingsStorage';
import { generateJobDescription, generateDevelopmentPlan, generateTalentPoolAnalysis } from '../services/geminiService';
import { getEmployeeBoxInfo, getEselonRank, getBirthDateFromNIP, calculateSuccessionStatus, skpdOptions } from '../utils/talentUtils';
import { LoadingIcon, WarningIcon, MenuIcon } from './icons';
import Sidebar from './Sidebar';
import DashboardSummary from './DashboardSummary';
import SubmissionReviewPage from '../pages/SubmissionReviewPage';
import SettingsModal from './SettingsModal';
import ExportModal from './ExportModal';
import ActivityLogPage from '../pages/ActivityLogPage';
import DeepAnalysisPage from '../pages/DeepAnalysisPage';
import { PublicAccessSettings } from '../types';

type ViewMode = 'summary' | 'list' | 'talentPool' | 'criticalJobs' | 'submissionReview' | 'activityLog' | 'deepAnalysis';

interface DashboardProps {
    onLogout: () => void;
    isAdmin: boolean;
    onGoToLogin?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, isAdmin, onGoToLogin }) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [criticalJobs, setCriticalJobs] = useState<CriticalJob[]>([]);
    const [isLoadingApp, setIsLoadingApp] = useState(true);
    const [isImporting, setIsImporting] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('summary');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState('eselon-desc');
    const [successionStatusFilter, setSuccessionStatusFilter] = useState<SuccessionStatus | 'all'>('all');
    const [skpdFilter, setSkpdFilter] = useState<string>('all');
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

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
    
    // State for Employee Modals
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [detailedEmployee, setDetailedEmployee] = useState<Employee | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    
    // State for Job Modals
    const [editingJob, setEditingJob] = useState<CriticalJob | null>(null);
    const [isJobFormModalOpen, setIsJobFormModalOpen] = useState(false);

    // Unified Confirmation Modal State
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ action: (() => void) | null, title: string, message: string }>({ action: null, title: '', message: '' });

    // State for AI-generated content modals
    const [jobDescContent, setJobDescContent] = useState({ title: '', content: '' });
    const [isJobDescModalOpen, setIsJobDescModalOpen] = useState(false);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
    
    const [devPlanContent, setDevPlanContent] = useState({ title: '', content: '', employeeName: '' });
    const [isDevPlanModalOpen, setIsDevPlanModalOpen] = useState(false);
    const [isGeneratingDevPlan, setIsGeneratingDevPlan] = useState(false);
    
    // State for Talent Pool Analysis
    const [talentPoolAnalysis, setTalentPoolAnalysis] = useState('');
    const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [publicAccessSettings, setPublicAccessSettings] = useState<PublicAccessSettings>({ isOpen: true, startTime: '', endTime: '' });
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoadingApp(true);
        setError(null);
        try {
            const emps = await loadEmployeesFromStorage();
            const jobs = await loadCriticalJobsFromStorage();
            const settings = await getPublicAccessSettings();
            setEmployees(emps);
            setCriticalJobs(jobs);
            setPublicAccessSettings(settings);
        } catch (err) {
            let errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            try {
                const parsedError = JSON.parse(errorMessage);
                if (parsedError.error && parsedError.error.includes('Missing or insufficient permissions')) {
                    errorMessage = 'Anda tidak memiliki akses administrator untuk melihat data ini.';
                } else {
                    errorMessage = parsedError.error || errorMessage;
                }
            } catch (e) {
                // Not JSON, ignore
            }
            setError(`Gagal memuat data: ${errorMessage}`);
        } finally {
            setIsLoadingApp(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const approvedEmployees = useMemo(() => employees.filter(e => e.status === 'Disetujui'), [employees]);
    const pendingSubmissions = useMemo(() => employees.filter(e => e.status === 'Menunggu Persetujuan'), [employees]);

    // Effect to auto-generate analysis when switching to talent pool view
    useEffect(() => {
        const handleViewChange = async () => {
            if (viewMode === 'talentPool' && !talentPoolAnalysis && approvedEmployees.length > 0) {
                setIsGeneratingAnalysis(true);
                setError(null);
                try {
                    const analysis = await generateTalentPoolAnalysis(approvedEmployees);
                    setTalentPoolAnalysis(analysis);
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                    setError(`Gagal membuat analisis talent pool: ${errorMessage}`);
                    setTalentPoolAnalysis('Terjadi kesalahan saat menghasilkan analisis.');
                } finally {
                    setIsGeneratingAnalysis(false);
                }
            }
        };
        handleViewChange();
    }, [viewMode, talentPoolAnalysis, approvedEmployees]);

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
            let valA: any, valB: any;
            let sortDirection = direction; // Use a mutable direction for eselon case

            switch (key) {
                case 'eselon': 
                    valA = getEselonRank(a.eselon); 
                    valB = getEselonRank(b.eselon);
                    // For eselon, a lower rank number is a higher position.
                    // To sort 'desc' (Tertinggi), we must sort the rank number 'asc' (e.g., 2, 3, 4).
                    // So, we flip the sort direction.
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

    const checkIsPublicAccessAllowed = useCallback((): boolean => {
        if (isAdmin) return true;
        if (!publicAccessSettings.isOpen) return false;
        
        const now = new Date().getTime();
        const start = publicAccessSettings.startTime ? new Date(publicAccessSettings.startTime).getTime() : 0;
        const end = publicAccessSettings.endTime ? new Date(publicAccessSettings.endTime).getTime() : Infinity;
        
        if (start && now < start) return false;
        if (end && now > end) return false;
        
        return true;
    }, [isAdmin, publicAccessSettings]);

    // --- Employee CRUD Handlers ---
    const handleAddEmployee = useCallback(() => { 
        if (!checkIsPublicAccessAllowed()) {
            alert('Periode pengisian data mandiri saat ini sedang ditutup atau berada di luar batas waktu yang ditentukan admin.');
            return;
        }
        setEditingEmployee(null); 
        setIsFormModalOpen(true); 
    }, [checkIsPublicAccessAllowed]);
    
    const handleEditEmployee = useCallback((employee: Employee) => { 
        if (!checkIsPublicAccessAllowed()) {
            alert('Periode pengisian/pengeditan data mandiri saat ini sedang ditutup atau berada di luar batas waktu yang ditentukan admin.');
            return;
        }
        setEditingEmployee(employee); 
        setIsFormModalOpen(true); 
    }, [checkIsPublicAccessAllowed]);
    
    const handleViewEmployeeDetails = useCallback((employee: Employee) => {
        setDetailedEmployee(employee);
        setIsDetailModalOpen(true);
    }, []);

    const handleEditFromDetail = useCallback((employee: Employee) => {
        setIsDetailModalOpen(false);
        // Use a short timeout to prevent modal transition clash
        setTimeout(() => {
            handleEditEmployee(employee);
        }, 150);
    }, [handleEditEmployee]);

    const handleSaveEmployee = useCallback(async (employee: Employee) => {
        const employeeToSave = { ...employee, id: employee.id || crypto.randomUUID() };
        await saveEmployeeToStorage(employeeToSave);
        setEmployees(prev => {
            const isEditing = prev.some(e => e.id === employeeToSave.id);
            const newEmployees = isEditing
                ? prev.map(e => e.id === employeeToSave.id ? employeeToSave : e)
                : [...prev, employeeToSave];
            setTalentPoolAnalysis(''); // Invalidate analysis cache
            return newEmployees;
        });
        setIsFormModalOpen(false);
        setEditingEmployee(null);
    }, []);

    const handleDeleteEmployeeRequest = useCallback((id: string) => {
        setConfirmAction({
            action: async () => {
                await deleteEmployeeFromStorage(id);
                setEmployees(prev => {
                    const newEmployees = prev.filter(e => e.id !== id);
                    setTalentPoolAnalysis('');
                    return newEmployees;
                });
                setIsFormModalOpen(false); // Close modal if deleting from within the modal
            },
            title: "Konfirmasi Hapus Pegawai",
            message: "Apakah Anda yakin ingin menghapus data talenta ini? Tindakan ini tidak dapat diurungkan."
        });
        setIsConfirmModalOpen(true);
    }, []);

    // --- Submission Handlers ---
    const handleApproveSubmission = useCallback((id: string) => {
        const employeeToApprove = employees.find(e => e.id === id);
        if (employeeToApprove) {
            handleSaveEmployee({ ...employeeToApprove, status: 'Disetujui' });
        }
    }, [employees, handleSaveEmployee]);

    const handleRejectSubmissionRequest = useCallback((id: string) => {
        setConfirmAction({
            action: async () => {
                await deleteEmployeeFromStorage(id);
                setEmployees(prev => {
                    const newEmployees = prev.filter(e => e.id !== id);
                    return newEmployees;
                });
            },
            title: "Tolak Pengajuan Data",
            message: "Apakah Anda yakin ingin menolak dan menghapus pengajuan data mandiri ini? Tindakan ini tidak dapat diurungkan."
        });
        setIsConfirmModalOpen(true);
    }, []);

    const handleApproveAllSubmissions = useCallback(async () => {
        const employeesToApprove = employees.filter(e => e.status === 'Menunggu Persetujuan').map(e => ({ ...e, status: 'Disetujui' }));
        if (employeesToApprove.length > 0) {
            await saveMultipleEmployeesToStorage(employeesToApprove);
            setEmployees(prev => prev.map(e => e.status === 'Menunggu Persetujuan' ? { ...e, status: 'Disetujui' } : e));
        }
    }, [employees]);

    const handleRejectAllSubmissionsRequest = useCallback(() => {
        setConfirmAction({
            action: async () => {
                const idsToDelete = employees.filter(e => e.status === 'Menunggu Persetujuan').map(e => e.id);
                if (idsToDelete.length > 0) {
                    await deleteMultipleEmployeesFromStorage(idsToDelete);
                    setEmployees(prev => prev.filter(e => e.status !== 'Menunggu Persetujuan'));
                }
            },
            title: "Tolak Semua Pengajuan Data",
            message: "Apakah Anda yakin ingin menolak dan menghapus semua pengajuan data mandiri ini? Tindakan ini tidak dapat diurungkan."
        });
        setIsConfirmModalOpen(true);
    }, [employees]);

    // --- Critical Job CRUD Handlers ---
    const handleAddJob = useCallback(() => { setEditingJob(null); setIsJobFormModalOpen(true); }, []);
    const handleEditJob = useCallback((job: CriticalJob) => { setEditingJob(job); setIsJobFormModalOpen(true); }, []);
    
    const handleClearAllDataRequest = useCallback(() => {
        setConfirmAction({
            action: async () => {
                await deleteAllEmployeesFromStorage();
                await deleteAllCriticalJobsFromStorage();
                setEmployees([]);
                setCriticalJobs([]);
                setTalentPoolAnalysis('');
            },
            title: "Hapus Semua Data",
            message: "PERINGATAN BERBAHAYA: Apakah Anda yakin ingin menghapus SEMUA data Pegawai dan Jabatan Kritikal dari sistem? Tindakan ini menghapus data secara menyeluruh dan permanen."
        });
        setIsConfirmModalOpen(true);
    }, []);
    
    const handleSaveJob = useCallback(async (job: CriticalJob) => {
        const jobToSave = { ...job, id: job.id || `cj-${Date.now()}` };
        await saveCriticalJobToStorage(jobToSave);
        setCriticalJobs(prev => {
            const isEditing = job.id && prev.some(j => j.id === job.id);
            const newJobs = isEditing
                ? prev.map(j => (j.id === job.id ? jobToSave : j))
                : [...prev, jobToSave];
            return newJobs;
        });
        setIsJobFormModalOpen(false);
        setEditingJob(null);
    }, []);

    const handleDeleteJobRequest = useCallback((id: string) => {
        setConfirmAction({
            action: async () => {
                await deleteCriticalJobFromStorage(id);
                setCriticalJobs(prev => {
                    const newJobs = prev.filter(j => j.id !== id);
                    return newJobs;
                });
                setIsJobFormModalOpen(false); // Close modal if deleting from within modal
            },
            title: "Konfirmasi Hapus Jabatan",
            message: "Apakah Anda yakin ingin menghapus jabatan kritis ini? Ini tidak akan menghapus data pegawai terkait."
        });
        setIsConfirmModalOpen(true);
    }, []);
    
    const handleSaveSettings = useCallback(async (newSettings: PublicAccessSettings) => {
        await savePublicAccessSettings(newSettings);
        setPublicAccessSettings(newSettings);
    }, []);

    // --- AI Generation Handlers ---
    const handleGenerateDescription = useCallback(async (employee: Employee) => {
        setIsGeneratingDesc(true); setError(null);
        setJobDescContent({ title: `Deskripsi Pekerjaan untuk ${employee.jabatan}`, content: '' });
        setIsJobDescModalOpen(true);
        try {
            const description = await generateJobDescription(employee.jabatan, employee.unitKerja);
            setJobDescContent(prev => ({ ...prev, content: description }));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setJobDescContent(prev => ({ ...prev, content: `Terjadi kesalahan saat berkomunikasi dengan AI. ${errorMessage}` }));
        } finally { setIsGeneratingDesc(false); }
    }, []);

    const handleGenerateDevelopmentPlan = useCallback(async (employee: Employee) => {
        setIsGeneratingDevPlan(true); setError(null);
        setDevPlanContent({ title: `Rencana Pengembangan`, content: '', employeeName: employee.name });
        setIsDevPlanModalOpen(true);
        try {
            const plan = await generateDevelopmentPlan(employee);
            setDevPlanContent(prev => ({ ...prev, content: plan }));
            // Also save the plan to the employee record
            handleSaveEmployee({ ...employee, developmentPlan: plan });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setDevPlanContent(prev => ({ ...prev, content: `Terjadi kesalahan saat berkomunikasi dengan AI. ${errorMessage}` }));
        } finally { setIsGeneratingDevPlan(false); }
    }, [handleSaveEmployee]);

    const handleDownloadTemplate = useCallback(() => {
        const wb = XLSX.utils.book_new();
        const sampleData = [{
            "NIP": "198501152010011001",
            "Nama Lengkap": "Ahmad Subarjo",
            "Jabatan": "Analis Kepegawaian",
            "Pangkat/Golongan": "Penata Muda, III/a",
            "Pendidikan": "S1",
            "Jurusan": "Manajemen SDM",
            "Unit Kerja": "BKPSDM",
            "Email": "ahmad.s@example.com",
            "Telepon": "081234567890",
            "Pelatihan Terakhir": "Analisis Beban Kerja",
            "Eselon": "Fungsional Ahli Pertama",
            "Kinerja": 90,
            "Potensi": 92,
            "Kompetensi": 88,
            "Keterampilan": "Analisis Data, Rekrutmen, Excel",
            "Jabatan Target": "Kasubbag Kepegawaian"
        }];
        const ws = XLSX.utils.json_to_sheet(sampleData);
        XLSX.utils.book_append_sheet(wb, ws, "Data Pegawai");
        XLSX.writeFile(wb, "Template_Import_Talenta_ASN.xlsx");
    }, []);

    const handleImportData = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = ".xlsx";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                setIsImporting(true);
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = event.target?.result;
                        const workbook = XLSX.read(data, { type: 'binary' });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];
                        const json = XLSX.utils.sheet_to_json<any>(worksheet);
                        
                        const newEmployees = json.map(row => {
                            const nip = String(row.NIP || '').trim();
                            const name = String(row['Nama Lengkap'] || 'N/A').trim();
                            const jabatan = String(row.Jabatan || '').trim();
                            
                            let eselon = String(row.Eselon || '').trim();
                            if (!eselon || eselon === 'Staf') {
                                const lowerJab = jabatan.toLowerCase();
                                if (lowerJab.includes('kepala dinas') || lowerJab.includes('kadin') || lowerJab.includes('kepala badan') || lowerJab.includes('kaban')) {
                                    eselon = 'JPT Pratama (Eselon II)';
                                } else if (lowerJab.includes('kepala bidang') || lowerJab.includes('kabid') || lowerJab.includes('kepala bagian') || lowerJab.includes('kabag') || lowerJab.includes('sekretaris') || lowerJab.includes('sekdis') || lowerJab.includes('camat') || lowerJab.includes('sekcam') || lowerJab.includes('sekretaris kecamatan')) {
                                    eselon = 'Administrator (Eselon III)';
                                } else if (lowerJab.includes('kepala sub') || lowerJab.includes('kasub') || lowerJab.includes('kepala seksi') || lowerJab.includes('kasi') || lowerJab.includes('lurah')) {
                                    eselon = 'Pengawas (Eselon IV)';
                                } else if (lowerJab.includes('ahli muda')) {
                                    eselon = 'Fungsional Ahli Muda';
                                } else if (lowerJab.includes('ahli madya')) {
                                    eselon = 'Fungsional Ahli Madya';
                                } else if (lowerJab.includes('ahli pertama')) {
                                    eselon = 'Fungsional Ahli Pertama';
                                } else {
                                    eselon = eselon || 'Staf';
                                }
                            }

                            const performance = Number(row.Kinerja || 75);
                            const potential = Number(row.Potensi || 75);
                            const pendidikan = String(row.Pendidikan || '').trim();
                            const birthDate = getBirthDateFromNIP(nip)?.toISOString();
                            
                            const successionStatus = calculateSuccessionStatus({
                                performance,
                                potential,
                                eselon,
                                pendidikan,
                                birthDate,
                            });
    
                            // Flexible column reading for Unit Kerja/SKPD
                            const unitKerjaValue = row['Unit Kerja'] || row['SKPD'] || row['SKPD (Unit Kerja)'];

                            return {
                                id: nip || `import-${Date.now()}-${Math.random()}`,
                                nip,
                                name,
                                jabatan: String(row.Jabatan || '').trim(),
                                pangkatGolongan: String(row['Pangkat/Golongan'] || '').trim(),
                                pendidikan,
                                jurusan: String(row.Jurusan || '').trim(),
                                unitKerja: String(unitKerjaValue || '').trim(),
                                email: String(row.Email || '').trim(),
                                phone: String(row.Telepon || '').trim(),
                                trainingAttended: String(row['Pelatihan Terakhir'] || '').trim(),
                                avatar: `https://ui-avatars.com/api/?name=${name.replace(/\s/g, '+')}`,
                                eselon,
                                performance,
                                potential,
                                competency: Number(row.Kompetensi || 75),
                                skills: String(row.Keterampilan || '').split(',').map(s => s.trim()).filter(Boolean),
                                criticalPosition: String(row['Jabatan Target'] || '').trim(),
                                developmentPlan: '',
                                birthDate,
                                successionStatus,
                                submissionType: 'Admin',
                                status: 'Disetujui',
                                educationHistory: [],
                                performanceHistory: [],
                                careerHistory: [],
                                developmentHistory: [],
                            } as Employee;
                        });

                        setEmployees(prev => {
                            const updatedEmployees = [...prev];
                            newEmployees.forEach(newEmp => {
                                const index = updatedEmployees.findIndex(e => e.nip === newEmp.nip);
                                if (index !== -1) {
                                    updatedEmployees[index] = { ...updatedEmployees[index], ...newEmp, id: updatedEmployees[index].id };
                                } else {
                                    updatedEmployees.push(newEmp);
                                }
                            });
                            // Save to Firestore asynchronously
                            saveMultipleEmployeesToStorage(updatedEmployees).then(() => {
                                alert(`${newEmployees.length} data pegawai berhasil diimpor/diperbarui.`);
                            }).catch(err => {
                                console.error("Error saving imported data to Firestore:", err);
                                alert(`Data diimpor ke memori, tetapi gagal disimpan ke database: ${err.message}`);
                            });
                            return updatedEmployees;
                        });
                    } catch (err) {
                        console.error("Error importing data:", err);
                        alert(`Gagal mengimpor data: ${err instanceof Error ? err.message : 'Unknown error'}`);
                    } finally {
                        setIsImporting(false);
                    }
                };
                reader.readAsBinaryString(file);
            }
        };
        input.click();
    }, []);
    
    const handleExportData = useCallback((skpdFilter: string | null) => {
        let dataToExport = approvedEmployees;
        if (skpdFilter) {
            dataToExport = approvedEmployees.filter((emp) => emp.unitKerja === skpdFilter || (skpdFilter === 'Lainnya' && !skpdOptions.includes(emp.unitKerja)));
        }

        if (dataToExport.length === 0) { alert("Tidak ada data talenta yang disetujui untuk diekspor pada filter ini."); return; }
        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(16);
        doc.text("Rekapitulasi Data Talenta ASN - Kabupaten Aceh Barat", 14, 15);
        doc.setFontSize(10);
        const reportDate = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        doc.text(`Tanggal Laporan: ${reportDate}`, 14, 22);
        if (skpdFilter) {
            doc.text(`Filter Unit Kerja: ${skpdFilter}`, 14, 27);
        }
        const headers = [["No", "Nama", "NIP", "Jabatan", "Unit Kerja", "Kinerja", "Potensi", "Kompetensi", "Kotak", "Kategori Kotak", "Status Suksesi"]];
        const rows = dataToExport.map((emp, index) => {
            const { boxNumber, category } = getEmployeeBoxInfo(emp);
            return [index + 1, emp.name, emp.nip, emp.jabatan, emp.unitKerja, emp.performance, emp.potential, emp.competency ?? 'N/A', boxNumber, category, emp.successionStatus];
        });
        autoTable(doc, {
            head: headers, body: rows, startY: skpdFilter ? 32 : 30, theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [44, 62, 80], textColor: [255, 255, 255], fontStyle: 'bold' },
            columnStyles: { 0: { cellWidth: 12 }, 5: { halign: 'center' }, 6: { halign: 'center' }, 7: { halign: 'center' }, 8: { halign: 'center' } }
        });
        const skpdSuffix = skpdFilter ? `-${skpdFilter.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}` : '';
        doc.save(`rekapitulasi-talenta-${new Date().toISOString().slice(0, 10)}${skpdSuffix}.pdf`);
    }, [approvedEmployees]);

    if (isLoadingApp) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
            <LoadingIcon className="h-16 w-16 text-indigo-600 animate-spin" />
            <h1 className="mt-6 text-2xl font-bold text-gray-800">Mempersiapkan Aplikasi</h1>
            <p className="mt-2 text-gray-500">Memuat data talenta dari penyimpanan lokal...</p>
        </div>
    );
    
    if (error && employees.length === 0) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg">
                <WarningIcon className="h-16 w-16 text-red-500 mx-auto" />
                <h1 className="mt-6 text-2xl font-bold text-gray-800">Oops! Terjadi Kesalahan</h1>
                <p className="mt-2 text-gray-600">{error}</p>
                <button onClick={() => fetchData()} className="mt-8 px-4 py-2 bg-indigo-600 text-white rounded-lg">Coba Lagi</button>
            </div>
        </div>
    );

    const getHeaderTitle = (): string => {
        switch (viewMode) {
            case 'summary': return 'Dashboard';
            case 'list': return 'Daftar Talenta ASN';
            case 'talentPool': return 'Peta Talent Pool';
            case 'criticalJobs': return 'Jabatan Kritikal & Suksesi';
            case 'submissionReview': return 'Tinjau Pengajuan Mandiri';
            case 'activityLog': return 'Log Aktivitas';
            default: return 'Manajemen Talenta';
        }
    };

    const getHeaderSubtitle = (): string => {
        switch (viewMode) {
            case 'summary': return 'Ringkasan data talenta, kinerja, dan potensi ASN.';
            case 'list': return `Total ${filteredEmployees.length} talenta yang disetujui ditampilkan.`;
            case 'talentPool': return 'Visualisasi dan analisis 9-Box Matrix untuk perencanaan suksesi.';
            case 'criticalJobs': return 'Rencanakan suksesi untuk posisi-posisi strategis.';
            case 'submissionReview': return `${pendingSubmissions.length} pengajuan menunggu tinjauan Anda.`;
            case 'activityLog': return 'Melacak kapan data pegawai terakhir diperbarui.';
            default: return 'Sistem Informasi Manajemen Talenta';
        }
    };

    const handleNavigateToTalentPool = () => setViewMode('talentPool');

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar 
                viewMode={viewMode} 
                setViewMode={setViewMode} 
                onExportData={() => setIsExportModalOpen(true)} 
                onLogout={onLogout} 
                onAddEmployee={handleAddEmployee}
                onClearAllData={handleClearAllDataRequest}
                onOpenSettings={() => setIsSettingsModalOpen(true)}
                pendingSubmissionsCount={pendingSubmissions.length}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isAdmin={isAdmin}
                onGoToLogin={onGoToLogin}
            />
             <div className={`flex-1 flex flex-col relative transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64 ml-0' : 'ml-0'}`}>
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
                        showControls={viewMode === 'list'}
                        onAddEmployee={handleAddEmployee}
                        onSearchChange={(e) => setSearchTerm(e.target.value)}
                        sortKey={sortKey}
                        onSortKeyChange={setSortKey}
                        successionStatusFilter={successionStatusFilter}
                        onSuccessionStatusFilterChange={setSuccessionStatusFilter}
                        skpdFilter={skpdFilter}
                        onSkpdFilterChange={setSkpdFilter}
                        onImportData={handleImportData}
                        onDownloadTemplate={handleDownloadTemplate}
                        isAdmin={isAdmin}
                    />
                    
                    <main className="mt-8">
                        {viewMode === 'summary' && <DashboardSummary employees={approvedEmployees} criticalJobs={criticalJobs} onNavigateToTalentPool={handleNavigateToTalentPool} />}
                        {viewMode === 'list' && (
                            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                                <EmployeeTable 
                                    employees={filteredEmployees} 
                                    onEdit={handleEditEmployee} 
                                    onDelete={handleDeleteEmployeeRequest} 
                                    onGenerateDescription={handleGenerateDescription} 
                                    onGenerateDevelopmentPlan={handleGenerateDevelopmentPlan}
                                    onShowDetails={handleViewEmployeeDetails}
                                    isAdmin={isAdmin}
                                />
                            </div>
                        )}
                        {viewMode === 'talentPool' && <TalentPoolPage employees={approvedEmployees} analysis={talentPoolAnalysis} isLoading={isGeneratingAnalysis} error={error} onShowDetails={handleViewEmployeeDetails} onEdit={handleEditEmployee} isAdmin={isAdmin} />}
                        {viewMode === 'criticalJobs' && <CriticalJobsPage criticalJobs={criticalJobs} employees={employees} onAddJob={handleAddJob} onEditJob={handleEditJob} onDeleteJob={handleDeleteJobRequest} onEditEmployee={handleEditEmployee} isAdmin={isAdmin} />}
                        {viewMode === 'submissionReview' && <SubmissionReviewPage submissions={pendingSubmissions} onApprove={handleApproveSubmission} onReject={handleRejectSubmissionRequest} onApproveAll={handleApproveAllSubmissions} onRejectAll={handleRejectAllSubmissionsRequest} />}
                        {viewMode === 'activityLog' && <ActivityLogPage employees={employees} />}
                        {viewMode === 'deepAnalysis' && <DeepAnalysisPage employees={approvedEmployees} criticalJobs={criticalJobs} isAdmin={isAdmin} />}
                    </main>
                </div>
            </div>

            {isFormModalOpen && <EmployeeFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSave={handleSaveEmployee} onDelete={handleDeleteEmployeeRequest} employee={editingEmployee} allEmployees={employees} isAdmin={isAdmin} />}
            {isJobFormModalOpen && <CriticalJobFormModal isOpen={isJobFormModalOpen} onClose={() => setIsJobFormModalOpen(false)} onSave={handleSaveJob} onDelete={handleDeleteJobRequest} job={editingJob} />}
            {isConfirmModalOpen && <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={() => { if(confirmAction.action) confirmAction.action(); setIsConfirmModalOpen(false); }} title={confirmAction.title} message={confirmAction.message} />}
            {isJobDescModalOpen && <JobDescriptionModal isOpen={isJobDescModalOpen} onClose={() => setIsJobDescModalOpen(false)} title={jobDescContent.title} description={jobDescContent.content} isLoading={isGeneratingDesc} error={null} />}
            {isDevPlanModalOpen && <DevelopmentPlanModal isOpen={isDevPlanModalOpen} onClose={() => setIsDevPlanModalOpen(false)} title={devPlanContent.title} content={devPlanContent.content} isLoading={isGeneratingDevPlan} error={null} employeeName={devPlanContent.employeeName} />}
            {isDetailModalOpen && detailedEmployee && (
                <EmployeeDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    employee={detailedEmployee}
                    onEdit={handleEditFromDetail}
                    onGenerateDescription={handleGenerateDescription}
                />
            )}
            
            <SettingsModal 
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                settings={publicAccessSettings}
                onSave={handleSaveSettings}
            />
            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onExport={handleExportData}
            />
        </div>
    );
};

export default Dashboard;
