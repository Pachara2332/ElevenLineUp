'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
                className={`relative inline-flex h-7 w-16 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner border border-slate-200/50 ${
                    language === 'th' ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
            >
                <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none">
                    <span className={`text-[9px] font-black transition-all duration-300 outline-none ${language === 'th' ? 'text-white opacity-100 scale-110' : 'text-slate-500 opacity-60'}`}>TH</span>
                    <span className={`text-[9px] font-black transition-all duration-300 outline-none ${language === 'en' ? 'text-slate-800 opacity-100 scale-110' : 'text-white opacity-60'}`}>EN</span>
                </div>

                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${
                        language === 'en' ? 'translate-x-[36px]' : 'translate-x-[2px]'
                    }`}
                />
            </button>
        </div>
    );
}
