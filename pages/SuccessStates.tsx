import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenWrapper } from '../components/Layout';

export const BookSaved: React.FC = () => {
  const navigate = useNavigate();
  return (
    <ScreenWrapper className="bg-background-light dark:bg-background-dark overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl dark:bg-primary/10"></div>
        <div className="absolute bottom-[-10%] left-[-10%] h-[250px] w-[250px] rounded-full bg-purple-400/10 blur-3xl dark:bg-purple-600/10"></div>

        <div className="absolute top-6 right-6 z-20">
            <button onClick={() => navigate('/home')} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 text-slate-800 backdrop-blur-sm transition hover:bg-white dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
            <div className="relative mb-10 flex flex-col items-center">
                <div className="relative z-10 h-64 w-48 rotate-[-3deg] transform overflow-hidden rounded-xl border-[6px] border-white shadow-2xl transition-transform hover:rotate-0 dark:border-gray-800">
                    <div className="h-full w-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBM1URCcM5oArLf7igavhEFUTZJpUWoTt7a_-DqP1a2onc9HRZvYLHdwnVuH4N9XGdZNw1qNpYII40NwEvmze69MrxOvgCpR57jFAO5LjB5lT4fAlHauyTEHkqAJaJFiBgeu2Ll7qCRdqwGK7_oBZ0Jjf8uCNqEYmPsWkzromcyt1Sa_anp3NytprAMqK5tbt0DLoio0rqPKWgP8QBqYrdjEZSLTEtBLiP3r9uhhl3Ju2vfx29--_246FMFbr26mrj_2zwQruHwGzI")'}}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                </div>
                <div className="absolute -bottom-5 -right-2 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-[#1cc973] text-white shadow-xl ring-4 ring-white dark:ring-background-dark">
                    <span className="material-symbols-outlined text-[36px] font-bold">check_circle</span>
                </div>
            </div>

            <div className="flex w-full max-w-sm flex-col items-center text-center">
                <h1 className="mb-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-[#131118] dark:text-white">
                    Hooray! Book Saved.
                </h1>
                <p className="mb-8 px-2 text-base font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                    Your masterpiece has been added to your collection. It's safe and sound!
                </p>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-3">
                <button onClick={() => navigate('/gallery')} className="group flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-bold tracking-[0.015em] text-white transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/30">
                    <span className="material-symbols-outlined text-[20px]">photo_library</span>
                    <span className="truncate">Open Gallery</span>
                </button>
                <button onClick={() => navigate('/new')} className="group flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 text-base font-bold tracking-[0.015em] text-[#131118] dark:text-white transition-all hover:bg-slate-50 dark:hover:bg-white/10 active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[20px] text-primary dark:text-primary/80">add_circle</span>
                    <span className="truncate">Make Another</span>
                </button>
            </div>
        </div>
        <div className="h-4 w-full"></div>
    </ScreenWrapper>
  );
};

export const PdfExported: React.FC = () => {
    const navigate = useNavigate();
    return (
        <ScreenWrapper className="justify-between group/design-root overflow-hidden">
             <div className="flex-1 flex flex-col items-center justify-center w-full px-6 pt-12 pb-4 gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-110"></div>
                    <div className="relative flex items-center justify-center w-24 h-24 bg-white dark:bg-gray-800 rounded-full shadow-lg border-4 border-background-light dark:border-background-dark">
                        <span className="material-symbols-outlined text-primary text-[48px]">check_circle</span>
                    </div>
                </div>
                <div className="flex flex-col items-center text-center gap-2 z-10">
                    <h1 className="text-[#131118] dark:text-white tracking-tight text-[36px] font-extrabold leading-tight">Hooray!</h1>
                    <p className="text-[#131118]/70 dark:text-white/70 text-lg font-medium leading-relaxed max-w-[280px]">
                        Your coloring book PDF is ready to print.
                    </p>
                </div>
                <div className="mt-4 relative w-full flex justify-center py-6">
                    <div className="relative w-48 aspect-[1/1.4] group">
                        <div className="absolute inset-0 bg-primary rounded-[1.5rem] transform rotate-6 translate-x-2 translate-y-2 opacity-20"></div>
                        <div aria-label="Preview of the generated coloring book cover" className="relative w-full h-full bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transform transition-transform" role="img">
                            <div className="w-full h-full bg-center bg-no-repeat bg-cover opacity-90" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCHY9zyoGojgs8BmYDronLjg-Dwr_ggGeee2vKsKBPJATY4Ya9btXBl6UYXvWNRE1tk6Vbyzqtt3BMS0U8CwtuxWQ35JO9nYhpZlwbRjJo4EMpq94I37Z_PAyS56It6wXJJm6Elba-o1SyDDy9i1fTteJWD16d4a0o1YfnCsRCw8oDaR1taeWKhwD5QERa0OR8_gQhhKMZLdH3eUiZ28IgkebOjZc6z0CfLnTh2fOEoaSAYx25NFa_JJo8simEeqwTcIKwtlUcEkg0")'}}></div>
                            <div className="absolute bottom-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                                PDF
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full px-6 pb-10 pt-4 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark z-20">
                <div className="flex flex-col gap-3">
                    <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-primary text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 transition-transform active:scale-95 hover:bg-primary/90">
                        <span className="material-symbols-outlined mr-2 text-[20px]">download</span>
                        <span className="truncate">Open PDF</span>
                    </button>
                    <button onClick={() => navigate('/home')} className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-transparent text-primary dark:text-white text-lg font-bold leading-normal tracking-[0.015em] hover:bg-primary/5 dark:hover:bg-white/5 transition-colors">
                        <span className="truncate">Done</span>
                    </button>
                </div>
            </div>
        </ScreenWrapper>
    )
}