
import React, { useState } from 'react';
import { WarningIcon, LoadingIcon, ArrowLeftIcon, BrandIcon } from './icons';

interface LoginPageProps {
    onLogin: () => Promise<boolean>;
    onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLoginSubmit = async () => {
        setError(null);
        setIsLoggingIn(true);

        const success = await onLogin();
        if (!success) {
            setError('Gagal login dengan Google. Silakan coba lagi.');
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
             <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <BrandIcon className="h-16 w-16 mx-auto text-indigo-600" />
                    <h1 className="mt-4 font-bold text-3xl leading-tight text-gray-800">Sistem Informasi Manajemen Talenta</h1>
                    <p className="text-md text-gray-500">Pemerintah Kabupaten Aceh Barat</p>
                </div>
            
                <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-gray-900">
                            Login Area Manajemen
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Masuk dengan akun Google Anda untuk melanjutkan.</p>
                    </div>

                    <div className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-3">
                                <div className="flex">
                                    <div className="flex-shrink-0 pt-0.5">
                                        <WarningIcon className="h-5 w-5 text-red-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                onClick={handleLoginSubmit} disabled={isLoggingIn}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isLoggingIn ? (
                                    <>
                                        <LoadingIcon className="animate-spin h-5 w-5 mr-3" />
                                        <span>Memproses...</span>
                                    </>
                                ) : ( 'Login dengan Google' )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <button onClick={onBack} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                        <ArrowLeftIcon className="inline h-4 w-4 mr-1"/>
                        Kembali ke Dashboard Publik
                    </button>
                </div>
             </div>
        </div>
    );
};

export default LoginPage;