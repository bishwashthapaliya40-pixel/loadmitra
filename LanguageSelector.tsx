import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'header' | 'modal' | 'segmented';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'header',
  className = ''
}) => {
  const { language, setLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string; flag: string; sub: string }[] = [
    { code: 'ne', label: 'नेपाली', flag: '🇳🇵', sub: 'Nepali' },
    { code: 'en', label: 'English', flag: '🇬🇧', sub: 'English' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳', sub: 'Hindi' },
    { code: 'zh', label: '中文', flag: '🇨🇳', sub: 'Simplified Chinese' }
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'segmented') {
    return (
      <div className={`flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 ${className}`}>
        {languages.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLanguage(l.code)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap min-h-[36px] flex items-center gap-1.5 ${
              language === l.code
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>{l.flag}</span>
            <span>{l.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 active:bg-slate-100 transition-colors min-h-[40px]"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-slate-500" />
        <span className="text-slate-800 font-medium">{currentLangObj.flag} {currentLangObj.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1.5 w-48 origin-top-right bg-white rounded-xl shadow-lg border border-slate-200 py-1 focus:outline-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            Language / भाषा / 语言
          </div>
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLanguage(l.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors ${
                language === l.code
                  ? 'bg-orange-50/70 text-orange-950 font-bold'
                  : 'text-slate-700 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">{l.flag}</span>
                <div>
                  <div className="leading-tight">{l.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{l.sub}</div>
                </div>
              </div>
              {language === l.code && <Check className="w-4 h-4 text-orange-600 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
