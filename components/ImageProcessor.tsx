
import React, { useState, useRef } from 'react';
import type { LabelData, LabelInfo, LabelPart } from '../types';
import {
    CameraIcon, CopyIcon, UploadIcon, CabinetIcon, DeviceIcon, PortIcon,
    SubPortIcon, ArrowRightIcon, ArrowLeftIcon, RestartIcon, CrossIcon
} from './icons';

// --- INITIAL STATE ---
const initialInfo: LabelInfo = { name: '', image: undefined, imageUrl: undefined };
const initialPart: LabelPart = {
    cabinet: { ...initialInfo },
    device: { ...initialInfo },
    port: { ...initialInfo },
    subPort: { ...initialInfo },
};
const initialData: LabelData = {
    project: '',
    from: JSON.parse(JSON.stringify(initialPart)),
    to: JSON.parse(JSON.stringify(initialPart)),
};

// --- CHILD COMPONENTS ---

const ImageUpload: React.FC<{
    onImageSelect: (file: File) => void;
    onImageRemove: () => void;
    imageUrl?: string;
}> = ({ onImageSelect, onImageRemove, imageUrl }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onImageSelect(event.target.files[0]);
        }
    };

    if (imageUrl) {
        return (
            <div className="relative group w-full h-24">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover rounded-md border border-slate-300" />
                <button
                    onClick={onImageRemove}
                    className="absolute top-1 right-1 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                >
                    <CrossIcon className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all"
                aria-label="Upload an image"
            >
                <UploadIcon className="w-4 h-4" /> Upload
            </button>
            <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />
            <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all"
                aria-label="Use camera"
            >
                <CameraIcon className="w-4 h-4" /> Camera
            </button>
        </div>
    );
};

const InfoInput: React.FC<{
    label: string;
    icon: React.ReactNode;
    value: LabelInfo;
    onUpdate: (value: LabelInfo) => void;
    placeholder: string;
    isOptional?: boolean;
}> = ({ label, icon, value, onUpdate, placeholder, isOptional = false }) => {

    const handleImageSelect = (file: File) => {
        onUpdate({ ...value, image: file, imageUrl: URL.createObjectURL(file) });
    };

    const handleImageRemove = () => {
        if (value.imageUrl) {
            URL.revokeObjectURL(value.imageUrl);
        }
        onUpdate({ ...value, image: undefined, imageUrl: undefined });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <label className="sm:col-span-1 flex items-center gap-2 text-sm font-medium text-slate-700">
                {icon}
                {label} {isOptional && <span className="text-xs text-slate-400">(Optional)</span>}
            </label>
            <input
                type="text"
                value={value.name}
                onChange={(e) => onUpdate({ ...value, name: e.target.value })}
                placeholder={placeholder}
                className="sm:col-span-1 w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="sm:col-span-1">
                <ImageUpload
                    imageUrl={value.imageUrl}
                    onImageSelect={handleImageSelect}
                    onImageRemove={handleImageRemove}
                />
            </div>
        </div>
    );
};

const LabelPartForm: React.FC<{
    title: string;
    data: LabelPart;
    onUpdate: (data: LabelPart) => void;
}> = ({ title, data, onUpdate }) => {
    const handleUpdate = (field: keyof LabelPart, info: LabelInfo) => {
        onUpdate({ ...data, [field]: info });
    };

    return (
        <div className="space-y-6 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-bold text-xl text-slate-800 tracking-wide">{title}</h3>
            <div className="space-y-4">
                <InfoInput label="Cabinet" icon={<CabinetIcon className="w-5 h-5 text-slate-500" />} value={data.cabinet} onUpdate={(v) => handleUpdate('cabinet', v)} placeholder="e.g., US 1, HOUSING" />
                <InfoInput label="Device" icon={<DeviceIcon className="w-5 h-5 text-slate-500" />} value={data.device} onUpdate={(v) => handleUpdate('device', v)} placeholder="e.g., Industrial Switch" />
                <InfoInput label="Port" icon={<PortIcon className="w-5 h-5 text-slate-500" />} value={data.port} onUpdate={(v) => handleUpdate('port', v)} placeholder="e.g., P7, Core 1" />
                <InfoInput label="Sub-Port" icon={<SubPortIcon className="w-5 h-5 text-slate-500" />} value={data.subPort} onUpdate={(v) => handleUpdate('subPort', v)} placeholder="e.g., Tx,Rx, Core 2" isOptional />
            </div>
        </div>
    );
};

const GeneratedLabel: React.FC<{ data: LabelData, onRestart: () => void }> = ({ data, onRestart }) => {
    const [copied, setCopied] = useState(false);

    const formatPartForCopy = (p: LabelPart) => {
        const formatInfo = (i: LabelInfo) => i.name;
        return [formatInfo(p.cabinet), formatInfo(p.device), formatInfo(p.port), formatInfo(p.subPort)].filter(Boolean).join('/');
    };
    const labelText = `Project: ${data.project}\nFm: ${formatPartForCopy(data.from)}\nTo: ${formatPartForCopy(data.to)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(labelText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Generated Label</h2>
                <div className="flex gap-2">
                    <button onClick={onRestart} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
                        <RestartIcon className="w-4 h-4" />
                        Start Over
                    </button>
                    <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-all">
                        {copied ? 'Copied!' : <><CopyIcon className="w-4 h-4" /> Copy Text</>}
                    </button>
                </div>
            </div>
             
             {/* New Label Format */}
             <div className="max-w-xl mx-auto border border-slate-200 bg-white rounded-lg shadow-sm overflow-hidden mt-4">
                <div className="flex">
                    <div className="w-12 border-r border-slate-200 flex flex-col justify-around items-center py-2 font-bold text-lg bg-slate-50 text-slate-500">
                        <span>P</span>
                        <span>E</span>
                        <span>A</span>
                    </div>
                    <div className="flex-1">
                        <div className="text-center font-bold text-lg py-3 px-4 border-b border-slate-200 break-words text-slate-800">
                            {data.project || '[Project Name]'}
                        </div>
                        <div className="flex border-b border-slate-200">
                            <div className="w-24 font-bold py-3 px-4 border-r border-slate-200 bg-slate-50 text-slate-600">Fm:</div>
                            <div className="flex-1 py-3 px-4 break-words min-h-[48px] flex items-center">{formatPartForCopy(data.from) || <span className="text-slate-400">N/A</span>}</div>
                        </div>
                        <div className="flex">
                            <div className="w-24 font-bold py-3 px-4 border-r border-slate-200 bg-slate-50 text-slate-600">To:</div>
                            <div className="flex-1 py-3 px-4 break-words min-h-[48px] flex items-center">{formatPartForCopy(data.to) || <span className="text-slate-400">N/A</span>}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
export const ImageProcessor: React.FC = () => {
    const [page, setPage] = useState<'from' | 'to' | 'result'>('from');
    const [labelData, setLabelData] = useState<LabelData>(JSON.parse(JSON.stringify(initialData)));
    
    const updateProject = (project: string) => {
        setLabelData(prev => ({ ...prev, project }));
    };

    const updatePart = (part: 'from' | 'to', data: LabelPart) => {
        setLabelData(prev => ({ ...prev, [part]: data }));
    };
    
    const handleNext = () => setPage('to');
    const handleBack = () => setPage('from');
    const handleGenerate = () => setPage('result');
    const handleRestart = () => {
        // Revoke all object URLs to prevent memory leaks
        const cleanupUrls = (part: LabelPart) => {
            Object.values(part).forEach((info) => {
                if (info.imageUrl) {
                    URL.revokeObjectURL(info.imageUrl);
                }
            });
        };

        cleanupUrls(labelData.from);
        cleanupUrls(labelData.to);
        
        setLabelData(JSON.parse(JSON.stringify(initialData)));
        setPage('from');
    };

    if (page === 'result') {
        return (
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                <GeneratedLabel data={labelData} onRestart={handleRestart} />
            </div>
        );
    }

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                <input
                    type="text"
                    value={labelData.project}
                    onChange={(e) => updateProject(e.target.value)}
                    placeholder="e.g., Central City Expansion"
                    className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            
            {page === 'from' && (
                <LabelPartForm title="From (Source)" data={labelData.from} onUpdate={(d) => updatePart('from', d)} />
            )}
            {page === 'to' && (
                <LabelPartForm title="To (Destination)" data={labelData.to} onUpdate={(d) => updatePart('to', d)} />
            )}

            <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                {page === 'from' && <div />}
                {page === 'to' && (
                     <button onClick={handleBack} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
                        <ArrowLeftIcon className="w-5 h-5" />
                        Back
                    </button>
                )}
                
                {page === 'from' && (
                    <button onClick={handleNext} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-all">
                        Next: Destination Info
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                )}
                {page === 'to' && (
                    <button onClick={handleGenerate} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-all">
                        Generate Label
                    </button>
                )}
            </div>
        </div>
    );
};