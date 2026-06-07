import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CloseIcon, DownloadIcon } from './icons';
import { skpdOptions } from '../utils/talentUtils';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (skpdFilter: string | null) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport }) => {
    const [selectedSKPD, setSelectedSKPD] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onExport(selectedSKPD === '' ? null : selectedSKPD);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
                <motion.div 
                    initial={{ y: 50, opacity: 0, scale: 0.95 }} 
                    animate={{ y: 0, opacity: 1, scale: 1 }} 
                    exit={{ y: 20, opacity: 0, scale: 0.95 }} 
                    className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-800">Cetak Rekapitulasi Data</h2>
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <CloseIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Filter SKPD / Unit Kerja
                                </label>
                                <select 
                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 sm:text-sm"
                                    value={selectedSKPD}
                                    onChange={(e) => setSelectedSKPD(e.target.value)}
                                >
                                    <option value="">Semua SKPD / Unit Kerja</option>
                                    {skpdOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                                <p className="mt-2 text-xs text-gray-500">Pilih unit kerja untuk memfilter data yang akan diekspor, atau biarkan kosong untuk semua data.</p>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-md hover:shadow-lg"
                            >
                                <DownloadIcon className="h-4 w-4 mr-2" />
                                Ekspor PDF
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ExportModal;
