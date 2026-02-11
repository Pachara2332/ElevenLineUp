'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full p-1 border border-white/30">
            <button
                onClick={() => setLanguage('th')}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${language === 'th'
                    ? 'bg-white shadow-md scale-105'
                    : 'hover:bg-white/30 opacity-70 hover:opacity-100'
                    }`}
                title="Switch to Thai"
            >
                <span className="text-xl">TH</span>
            </button>
            <button
                onClick={() => setLanguage('en')}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${language === 'en'
                    ? 'bg-white shadow-md scale-105'
                    : 'hover:bg-white/30 opacity-70 hover:opacity-100'
                    }`}
                title="Switch to English"
            >
                <span className="text-xl">EN</span>
            </button>
        </div>
    );
}
