
import React from 'react';
import { ImageProcessor } from './components/ImageProcessor';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center p-4 sm:p-6 md:p-8">
            <header className="w-full max-w-4xl mb-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <LogoIcon className="w-10 h-10 text-indigo-600" />
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                        Fiber Optic Label Generator
                    </h1>
                </div>
                <p className="text-base text-slate-600 max-w-2xl mx-auto">
                    An application for communication engineers to generate standardized fiber optic cable labels. Fill in the source and destination details to create a professional, printable label.
                </p>
            </header>
            <main className="w-full max-w-4xl">
                <ImageProcessor />
            </main>
            <footer className="w-full max-w-4xl mt-8 text-center text-sm text-slate-500">
                <p>&copy; {new Date().getFullYear()} Communication Engineers Inc. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;