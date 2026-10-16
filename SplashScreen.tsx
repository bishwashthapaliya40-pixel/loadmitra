import React, { useEffect, useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { useApp } from '../../context/AppContext';

interface Props {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onDismiss }) => {
  const { t } = useApp();
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onDismiss, 350);
    }, 1800);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-white transition-opacity duration-300 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center space-y-4 text-center max-w-sm animate-in zoom-in-95 duration-500">
        <BrandLogo size="xl" layout="vertical" inverted={true} />
        <p className="text-xs text-slate-400 font-medium tracking-wide">
          {t.tagline}
        </p>
        <div className="flex items-center gap-2 pt-4">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[11px] text-slate-500 uppercase font-mono tracking-widest">
            Connecting Nepal Freight Fleets
          </span>
        </div>
      </div>
    </div>
  );
};
