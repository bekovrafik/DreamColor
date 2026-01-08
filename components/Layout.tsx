import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const getIconClass = (path: string) => {
    return currentPath === path 
      ? "material-symbols-outlined text-[28px] icon-filled" 
      : "material-symbols-outlined text-[28px]";
  };

  const getTextClass = (path: string) => {
    return currentPath === path
      ? "text-[10px] font-bold tracking-wide"
      : "text-[10px] font-medium tracking-wide";
  };

  const getContainerClass = (path: string) => {
      return currentPath === path ? "text-primary" : "text-gray-400 dark:text-gray-500 hover:text-primary transition-colors group";
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-background-dark/95 backdrop-blur-lg border-t border-gray-100 dark:border-slate-800 pb-safe pt-2 max-w-md mx-auto">
      <div className="flex justify-around items-center h-16 px-2">
        <button onClick={() => navigate('/home')} className={`flex flex-1 flex-col items-center gap-1.5 ${getContainerClass('/home')}`}>
          <div className={`p-1 rounded-xl ${currentPath === '/home' ? 'bg-primary/10 dark:bg-primary/20' : 'group-hover:bg-primary/5 transition-colors'}`}>
            <span className={getIconClass('/home')}>home</span>
          </div>
          <span className={getTextClass('/home')}>Home</span>
        </button>

        <button onClick={() => navigate('/presets')} className={`flex flex-1 flex-col items-center gap-1.5 ${getContainerClass('/presets')}`}>
          <div className={`p-1 rounded-xl ${currentPath === '/presets' ? 'bg-primary/10 dark:bg-primary/20' : 'group-hover:bg-primary/5 transition-colors'}`}>
             <span className={getIconClass('/presets')}>tune</span>
          </div>
          <span className={getTextClass('/presets')}>Presets</span>
        </button>

        <button onClick={() => navigate('/gallery')} className={`flex flex-1 flex-col items-center gap-1.5 ${getContainerClass('/gallery')}`}>
           <div className={`p-1 rounded-xl ${currentPath === '/gallery' ? 'bg-primary/10 dark:bg-primary/20' : 'group-hover:bg-primary/5 transition-colors'}`}>
            <span className={getIconClass('/gallery')}>photo_library</span>
          </div>
          <span className={getTextClass('/gallery')}>Gallery</span>
        </button>
      </div>
      <div className="h-5 w-full"></div>
    </nav>
  );
};

export const TopBar: React.FC<{ title: string; backPath?: string; rightAction?: React.ReactNode }> = ({ title, backPath, rightAction }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <button 
        onClick={() => backPath ? navigate(backPath) : navigate(-1)}
        className="text-[#131118] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back</span>
      </button>
      <h2 className="text-[#131118] dark:text-white text-xl font-bold font-comic leading-tight tracking-wide flex-1 text-center pr-10 truncate">
        {title}
      </h2>
      <div className="absolute right-4 top-4">
          {rightAction}
      </div>
    </div>
  );
};

export const ScreenWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl ${className}`}>
      {children}
    </div>
  );
};
