

import React, { useState } from 'react';
import { Employee } from '../types';
import { saveEmployeeToStorage } from '../utils/storage';
import { ArrowLeftIcon, ClipboardListIcon, BrandIcon } from '../components/icons';
import SelfServiceFormPage from './SelfServiceFormPage';

interface PublicDashboardPageProps {
    onGoToLogin: () => void;
}

const PublicDashboardPage: React.FC<PublicDashboardPageProps> = ({ onGoToLogin }) => {
    const [view, setView] = useState<'summary' | 'selfServiceForm'>('summary');

    const handleSaveFromSelfService = async (employee: Employee) => {
        try {
            const employeeToSave = { ...employee, id: employee.nip || crypto.randomUUID() };
            await saveEmployeeToStorage(employeeToSave);
            alert('Data Anda berhasil dikirim! Data akan ditinjau lebih lanjut oleh administrator.');
            setView('summary');
        } catch (error) {
            console.error('Failed to save self-service data:', error);
            alert(`Gagal menyimpan data. NIP mungkin sudah terdaftar atau terjadi kesalahan jaringan.`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-white/70">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div 
                        className="flex items-center gap-3 cursor-pointer group transition-all"
                        onClick={() => setView('summary')}
                    >
                        <div className="bg-white p-2 rounded-lg shadow-sm border group-hover:border-indigo-300 transition-colors">
                           <BrandIcon className="h-8 w-8 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl leading-tight text-gray-800 group-hover:text-indigo-600 transition-colors">Sistem Informasi Manajemen Talenta</h1>
                            <p className="text-sm text-gray-500">Pemerintah Kabupaten Aceh Barat</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {view === 'selfServiceForm' ? (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Pengisian Data Mandiri Pegawai</h2>
                                <p className="text-gray-600">Isi formulir berikut untuk mendaftarkan data talenta Anda.</p>
                            </div>
                            <button 
                                onClick={() => setView('summary')} 
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <ArrowLeftIcon className="h-4 w-4" />
                                <span>Kembali ke Beranda</span>
                            </button>
                        </div>
                        <SelfServiceFormPage onSave={handleSaveFromSelfService} />
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-8 mt-10">
                         <div className="bg-white shadow-xl rounded-2xl p-8 space-y-4 text-center">
                            <ClipboardListIcon className="h-16 w-16 mx-auto text-indigo-500" />
                            <h2 className="text-2xl font-bold text-gray-900">ASN Kabupaten Aceh Barat?</h2>
                            <p className="text-gray-500 text-md">Lengkapi dan daftarkan data talenta Anda untuk mendukung pengembangan karir dan perencanaan suksesi yang lebih baik.</p>
                            <div className="pt-4">
                                <button
                                    onClick={() => setView('selfServiceForm')}
                                    className="w-full sm:w-auto flex justify-center items-center gap-2 py-3 px-8 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 mx-auto"
                                >
                                    Isi Data Mandiri Sekarang
                                </button>
                            </div>
                        </div>

                        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Akses Area Manajemen
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">Login khusus untuk Administrator BKPSDM.</p>
                            </div>
                            <button
                                onClick={onGoToLogin}
                                className="w-full sm:w-auto flex justify-center py-2.5 px-8 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 mx-auto"
                            >
                                Login Administrator
                            </button>
                        </div>
                    </div>
                )}
            </main>
             <footer className="text-center py-6 text-sm text-gray-500 mt-10">
                <p>&copy; {new Date().getFullYear()} BKPSDM Aceh Barat. All rights reserved.</p>
            </footer>
        </div>
    );
};
export default PublicDashboardPage;