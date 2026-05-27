import React, { useState } from 'react';
import { CloseIcon, SparklesIcon, ClipboardListIcon, LoadingIcon } from './icons';

interface AddJobMethodModalProps {
    isOpen: boolean;
    isLoading: boolean;
    onClose: () => void;
    onManual: () => void;
    onGenerate: (title: string) => void;
}

const AddJobMethodModal: React.FC<AddJobMethodModalProps> = ({ isOpen, isLoading, onClose, onManual, onGenerate }) => {
    const [view, setView] = useState<'choice' | 'ai_input'>('choice');
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');

    const handleGenerateClick = () => {
        if (!title.trim()) {
            setError('Nama jabatan tidak boleh kosong.');
            return;
        }
        setError('');
        onGenerate(title);
    };

    const handleClose = () => {
        // Reset state on close
        setTimeout(() => {
            setView('choice');
            setTitle('');
            setError('');
        }, 300); // Delay to allow for closing animation
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 flex justify-center items-center" onClick={handleClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-4 flex flex-col relative" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Tambah Jabatan Kritikal Baru</h2>
                    <button type="button" onClick={handleClose} className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                {isLoading ? (
                     <div className="p-8 flex flex-col items-center justify-center min-h-[200px] text-center">
                        <LoadingIcon className="h-12 w-12 text-indigo-500 animate-spin" />
                        <p className="mt-4 text-gray-600 font-semibold">AI sedang membuat draf jabatan...</p>
                        <p className="text-sm text-gray-400">Mohon tunggu sebentar.</p>
                    </div>
                ) : view === 'choice' ? (
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button onClick={() => setView('ai_input')} className="group text-center p-6 border-2 border-indigo-500 bg-indigo-50 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <SparklesIcon className="h-12 w-12 mx-auto text-indigo-500 mb-3 transition-transform group-hover:scale-110" />
                            <h3 className="font-bold text-lg text-indigo-800">Buat dengan Bantuan AI</h3>
                            <p className="text-sm text-indigo-600 mt-1">Cukup masukkan nama jabatan, AI akan membuatkan draf untuk Anda.</p>
                        </button>
                        <button onClick={onManual} className="group text-center p-6 border-2 border-gray-300 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <ClipboardListIcon className="h-12 w-12 mx-auto text-gray-400 mb-3 transition-transform group-hover:scale-110" />
                            <h3 className="font-bold text-lg text-gray-800">Isi Formulir Manual</h3>
                            <p className="text-sm text-gray-600 mt-1">Isi semua detail jabatan kritikal secara manual dari awal.</p>
                        </button>
                    </div>
                ) : (
                    <div className="p-8 space-y-4">
                        <div>
                            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Nama Jabatan Kritikal</label>
                            <input
                                type="text"
                                id="jobTitle"
                                value={title}
                                onChange={(e) => { setTitle(e.target.value); setError(''); }}
                                placeholder="Contoh: Kepala Badan Perencanaan Pembangunan Daerah"
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
                                autoFocus
                            />
                            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                             <button type="button" onClick={() => setView('choice')} className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">Kembali</button>
                            <button
                                type="button"
                                onClick={handleGenerateClick}
                                className="px-5 py-2.5 bg-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            >
                                <SparklesIcon className="h-5 w-5"/>
                                <span>Hasilkan Draf</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddJobMethodModal;
