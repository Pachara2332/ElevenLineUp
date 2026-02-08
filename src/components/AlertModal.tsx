import React from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

type AlertType = 'success' | 'error' | 'info';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: AlertType;
    confirmText?: string;
    onConfirm?: () => void;
}

export default function AlertModal({
    isOpen,
    onClose,
    title,
    message,
    type = 'info',
    confirmText = 'OK',
    onConfirm
}: AlertModalProps) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onClose();
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircleIcon className="w-12 h-12 text-emerald-500" />;
            case 'error': return <ExclamationCircleIcon className="w-12 h-12 text-red-500" />;
            case 'info': default: return <InformationCircleIcon className="w-12 h-12 text-blue-500" />;
        }
    };

    const getButtonColor = () => {
        switch (type) {
            case 'success': return 'bg-emerald-600 hover:bg-emerald-700 text-white';
            case 'error': return 'bg-red-600 hover:bg-red-700 text-white';
            case 'info': default: return 'bg-blue-600 hover:bg-blue-700 text-white';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all animate-in zoom-in duration-200 border border-white/50">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-white rounded-full shadow-lg">
                        {getIcon()}
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-2">
                        {title}
                    </h3>

                    <p className="text-gray-600 mb-6 font-medium">
                        {message}
                    </p>

                    <button
                        onClick={handleConfirm}
                        className={`w-full py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 ${getButtonColor()}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
