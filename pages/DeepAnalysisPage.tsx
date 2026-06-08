import React, { useState, useEffect } from 'react';
import { Employee, CriticalJob } from '../types';
import { generateDeepSuccessionAnalysis } from '../services/apiService';
import { LoadingIcon, DownloadIcon, ViewGridIcon } from '../components/icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DeepAnalysisPageProps {
    employees: Employee[];
    criticalJobs: CriticalJob[];
    isAdmin?: boolean;
}

const DeepAnalysisPage: React.FC<DeepAnalysisPageProps> = ({ employees, criticalJobs, isAdmin }) => {
    const [analysisHtml, setAnalysisHtml] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateAnalysis = async () => {
        setIsGenerating(true);
        setError(null);
        try {
            const html = await generateDeepSuccessionAnalysis(employees, criticalJobs);
            setAnalysisHtml(html);
        } catch (err) {
            setError((err as Error).message || 'Gagal menghasilkan laporan');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExportPDF = async () => {
        const reportElement = document.getElementById('deep-analysis-report');
        if (!reportElement) return;

        try {
            const canvas = await html2canvas(reportElement, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
            pdf.save(`Analisis-Suksesi-Mendalam-${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
            console.error("Error exporting PDF:", err);
            alert("Gagal mengekspor PDF.");
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                            <ViewGridIcon className="h-6 w-6" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Analisis Suksesi Mendalam</h1>
                    </div>
                    <p className="text-gray-500 text-sm max-w-2xl">
                        Hasilkan laporan analisis suksesi komprehensif, mencakup perbandingan kebutuhan eselon antar SKPD dan saran rotasi talenta secara cerdas.
                    </p>
                </div>
                <div>
                    <button
                        onClick={handleGenerateAnalysis}
                        disabled={isGenerating}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <LoadingIcon className="h-5 w-5 mr-3 animate-spin" />
                                Menganalisis Data...
                            </>
                        ) : (
                            'Buat Laporan Analisis'
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-start gap-3">
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {!analysisHtml && !isGenerating && !error && (
                <div className="text-center p-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-700">Belum Ada Laporan</h3>
                    <p className="text-sm text-gray-500 mt-2">Klik tombol di atas untuk memerintahkan AI menganalisis data talenta dan jabatan kritikal secara mendalam.</p>
                </div>
            )}

            {analysisHtml && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-bold text-gray-800">Hasil Analisis AI</h2>
                        <button
                            onClick={handleExportPDF}
                            className="inline-flex flex-shrink-0 items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <DownloadIcon className="h-4 w-4 mr-2" />
                            Unduh PDF
                        </button>
                    </div>
                    <div className="p-8 overflow-auto" id="deep-analysis-report">
                        <div 
                            className="prose prose-indigo max-w-none prose-headings:font-bold prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-600 prose-li:text-gray-600 html-content"
                            dangerouslySetInnerHTML={{ __html: analysisHtml }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeepAnalysisPage;
