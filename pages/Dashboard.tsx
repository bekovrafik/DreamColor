import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenWrapper, BottomNav } from '../components/Layout';
import { useApp } from '../context/AppContext';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setTheme, resetAdventure, savedBooks, childName, loadBook, credits, checkFreeLimit, isPaidUser } = useApp();
  const [sparkStatus, setSparkStatus] = useState<{ available: boolean; timeStr: string }>({ available: true, timeStr: '' });

  useEffect(() => {
      const check = () => {
          const { allowed, waitTimeStr } = checkFreeLimit();
          setSparkStatus({ available: allowed, timeStr: waitTimeStr || '' });
      };
      check();
      const interval = setInterval(check, 60000); // Update every minute
      return () => clearInterval(interval);
  }, []);

  const handleQuickStart = (themeName: string) => {
      resetAdventure();
      setTheme(themeName);
      // Navigate to 'new' with preserveState flag so it doesn't auto-reset
      navigate('/new', { state: { preserveState: true } });
  };

  const handleRecentClick = (book: any) => {
      loadBook(book);
      navigate('/preview');
  };

  // Use saved books if available, otherwise use presets
  const recentItems = savedBooks.length > 0 ? savedBooks.slice(0, 5) : [
        { title: 'Lion King', theme: 'Safari', isPreset: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWdx6v16k0WvtQzniY9xT8FptPFAuqt3d3MDSsJHyhgaCIOpDHJVIqtOCSd8Vi7jJKRtQ0-x5hjdglHyTVWNsRJ77uNveW_x5swqOfuV4kBxIg3rDhgBTQMdxtJLaeZiRuuXWv2Ha-O3srsEI6VYVdW9-PHg-Gqxa3IdBmicwjdOT9Kzof4E8m5fMENwg2hX3wU1Id3Woa1nnsgSIiSpV951cES-ap_VWC9Bgr2Kwmpsk6Q-d00Xz-aROq6cyfoUXTDwMB1wDZMqI' },
        { title: 'Space Trip', theme: 'Space', isPreset: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHrzVFt1RWglU2lDIR0BGkTbgj_E2YFly6Yvm6KAt8ApWiZZtRi0hOiW3Lnk9MVU2c_nrVXO_X0k0Hz0rHdo8ll2I7HhKX5B1L2cffAT-QhEi17izPWNtRvmhXur0DJNq9xH2jmJu6Il85punMoNR9gZo_fuPUfwbcvLo8-lXJBjU632tQcZlFjW_POIdQub73D3pvWYY5I01mI4T2adti7jyy2Kgv6E9dFt3la6oFKtUcz591bNCeMkLVf3-EO5L9AYGcTlvFz-0' },
        { title: 'Magic Woods', theme: 'Fantasy', isPreset: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUYCIvvJVTzoCY1Uuabhbp0hgnob3BOYcLrEHh8N5DNFNpjKf0oRV1NshaSsEtAvl3CAibdsL7rMwaCzfKMqHoUYGm7Rd0jT1WVNpK-vOVY_j2SW6Zl-KIvrTILy7tQXkkgAe0Ez9jMglo8t3KHnxOe7JG2ZtcPZzxbOpFsPKsx347YEsJxYSEtuEmaLUV-69Vlqi0skrniu0PLc5JdZEvTag9RaZf4xTQma9TogUxWndvqUP4Hm-tb2-TR63osCBqTkh1QovkECA' }
  ];

  return (
    <ScreenWrapper>
      <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={() => navigate('/settings')}>
              <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-white dark:border-slate-700 shadow-sm" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCe-AOwUtRikrrTGJYXo4zGubhVdxeE2mDBIRi8HK-9wP3aFIMf99ob_zYMuQGkPjyL-q7rg-pWtEzfH8ARq8NdAbFqUOjWvK6VOcEZy-vHlgUdn3iOWF36pT5n5ZVx3K8Avbm5Xgjq1EUMg_s3Sg2gaTkm_pU6nP2yTxxEfo8NIMxQHJGaYCRupsYy9y883g_R6exlv4YrxjhoEWq7CYX_4DJLWDRikr1OfScZ21JgEcyEWjqu7Ye3ubg0S_fFyFkRakVtoaUNjDU")'}}></div>
              <div className="absolute bottom-0 right-0 size-3 bg-green-400 rounded-full border-2 border-white dark:border-background-dark"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Welcome back</span>
              <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-none tracking-tight">Hello{childName ? `, ${childName}` : ''}! 🎨</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
              <button onClick={() => navigate('/subscription')} className="flex items-center gap-1.5 bg-primary/10 dark:bg-primary/20 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-[18px]">token</span>
                  <span className="text-primary font-bold text-sm">{credits}</span>
              </button>
              <button onClick={() => navigate('/settings')} className="flex items-center justify-center rounded-full size-10 bg-white dark:bg-surface-dark text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined" style={{fontSize: '24px'}}>settings</span>
              </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-6 px-4 pt-2 pb-24">
        {/* Daily Spark Indicator for Free Users */}
        {!isPaidUser && (
            <div 
                onClick={() => !sparkStatus.available && navigate('/subscription')}
                className={`w-full rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer border transition-all ${sparkStatus.available ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-transparent text-white' : 'bg-white dark:bg-surface-dark border-slate-100 dark:border-slate-700'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-full flex items-center justify-center ${sparkStatus.available ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                        <span className="material-symbols-outlined">{sparkStatus.available ? 'bolt' : 'timelapse'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-xs font-bold uppercase tracking-wider ${sparkStatus.available ? 'text-white/80' : 'text-slate-500'}`}>Daily Spark</span>
                        <span className={`text-sm font-bold ${sparkStatus.available ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                            {sparkStatus.available ? 'Ready to Create! ✨' : `Recharging... ${sparkStatus.timeStr}`}
                        </span>
                    </div>
                </div>
                {!sparkStatus.available && (
                    <button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-colors">
                        Unlock
                    </button>
                )}
            </div>
        )}

        <div className="w-full @container">
          <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-white dark:bg-surface-dark shadow-[0_4px_20px_rgba(70,13,242,0.08)] dark:shadow-none transition-transform duration-200 group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl"></div>
            
            <div className="flex flex-col w-full p-6 items-center text-center z-10">
              <div className="mb-4 p-4 bg-primary/10 rounded-full text-primary">
                <span className="material-symbols-outlined filled" style={{fontSize: '40px', fontVariationSettings: "'FILL' 1"}}>auto_fix</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Create New Book</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6 max-w-[240px]">
                  Turn your favorite photos into magical coloring pages instantly.
              </p>
              <div className="flex flex-col w-full items-center gap-3">
                <button onClick={() => navigate('/new')} className="flex items-center justify-center gap-2 w-full max-w-[260px] h-12 rounded-full bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-0.5 active:scale-95">
                  <span className="material-symbols-outlined" style={{fontSize: '20px'}}>add_circle</span>
                  <span>Start a New Creation</span>
                </button>
                <button onClick={() => navigate('/gallery')} className="flex items-center justify-center gap-2 w-full max-w-[260px] h-12 rounded-full bg-primary/10 hover:bg-primary/20 text-primary dark:text-indigo-300 font-bold transition-colors active:scale-95">
                  <span className="material-symbols-outlined" style={{fontSize: '20px'}}>photo_library</span>
                  <span>Browse Gallery</span>
                </button>
              </div>
            </div>
            
            <div className="flex w-full h-24 mt-2 gap-2 px-2 pb-2 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-500">
              <div className="flex-1 rounded-xl bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBnro4DNDsiRjGf8pxOTADCBwyhEF5M6erzIKpAyJRULv-a8kg7Jl6gquv08GfZrdT4KxigPZOPjQ11ONmOY0vzU8ahXpdmTBZnI-4jnJjC0CVWZIH8R-ucZNrQmmPVecUhIuOWGI3jdK-NqJaUXX3CpT7kz1RHuh-TWCJ1qk9drP3V1eyVtmsIEPq8yri7nun-ys9Nu21SMTMEEDJi0nS0po9F1HtS-LLRCi39munevSPed5G2xrNm3RyVTbW7APo0t9xnQmb5djU")'}}></div>
              <div className="flex-1 rounded-xl bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCXID5r0xrXgTLvhceDK8zGcgFfSVwTsP8uicLfgL43IvQxOxfiz-TFL-th60Mb1zFAxwBt-S4XMQ4kGxhLcq6_HzQgg3ADYIAtx9W4L-cYmLvCcoHhyJbybI9rpYnnQDYs4rgOH1KdrZLX7ZNjV7drXBp-TiMDXZL-b0wub8U9NbU7ffhLAIPstfblYZoE48zBKHDBnnI9Wz8IsCRpcwN9WQNbZ0SaILvvhbq2PpspU5_njfbYSI-vykowHe3Gzp0hrFzaNlGGViI")'}}></div>
              <div className="flex-1 rounded-xl bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBGkTVz1tW5qt2rElR5I2HWwxEYvRsIZq4HczT5WWvaKHUaMMSvwI8tPOu9fzwqrdkGYUYGumdfxNdm5XvF0yjz8JAEJkJiT9CRCLCbV03OLUdZRwGxoUmfzMgcUq9FcydTQWV67KvtSvSCVA4ADEo2Jy2MSH5mHjHXARA6cTDenmWEH1F6_4eymbm2GC5wNMVDUYPvymjO-FykMXooykHaxd-XtljXYD_kJSz_OF413kPUwqu3A2uzjkc1obSFd1cUeYrY_LgRfa0")'}}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => navigate('/presets')} className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm flex flex-col justify-between aspect-square group cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden text-left">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="z-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                <span className="material-symbols-outlined" style={{fontSize: '24px'}}>palette</span>
             </div>
             <div className="z-10">
                <h4 className="text-slate-900 dark:text-white font-bold text-lg leading-tight">My Presets</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Saved styles</p>
             </div>
             <div className="absolute right-[-10px] bottom-[-10px] opacity-10 rotate-12">
                <span className="material-symbols-outlined" style={{fontSize: '80px'}}>palette</span>
             </div>
          </button>
          
          <button onClick={() => navigate('/gallery')} className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm flex flex-col justify-between aspect-square group cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden text-left">
             <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-transparent dark:from-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="z-10 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                <span className="material-symbols-outlined" style={{fontSize: '24px'}}>photo_library</span>
             </div>
             <div className="z-10">
                <h4 className="text-slate-900 dark:text-white font-bold text-lg leading-tight">Gallery</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Your creations</p>
             </div>
             <div className="absolute right-[-10px] bottom-[-10px] opacity-10 rotate-12">
                <span className="material-symbols-outlined" style={{fontSize: '80px'}}>photo_library</span>
             </div>
          </button>
        </div>

        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">
                    {savedBooks.length > 0 ? "Jump back in" : "Try a preset"}
                </h3>
                <button onClick={() => navigate(savedBooks.length > 0 ? '/gallery' : '/presets')} className="text-primary text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="w-full overflow-x-auto no-scrollbar pb-2">
                <div className="flex flex-row gap-4 min-w-min">
                    {recentItems.map((item: any, idx) => (
                        <div key={idx} onClick={() => item.isPreset ? handleQuickStart(item.theme) : handleRecentClick(item)} className="flex flex-col gap-2 w-32 cursor-pointer group">
                            <div className="w-32 h-32 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative shadow-sm group-hover:shadow-md transition-all border border-slate-100 dark:border-slate-700">
                                {item.isPreset ? (
                                    <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{backgroundImage: `url("${item.img}")`}}></div>
                                ) : (
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain p-2 bg-white dark:bg-surface-dark transition-transform duration-500 group-hover:scale-110" />
                                )}
                                <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-black/60 backdrop-blur rounded-full p-1.5 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-primary group-hover:text-white text-[16px] block">
                                        {item.isPreset ? 'play_arrow' : 'edit'}
                                    </span>
                                </div>
                            </div>
                            <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold truncate pl-1">{item.title}</span>
                        </div>
                    ))}
                    <div className="w-2 shrink-0"></div>
                </div>
            </div>
        </div>
      </main>
      <BottomNav />
    </ScreenWrapper>
  );
};

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { childName, setChildName, darkMode, toggleDarkMode, logout } = useApp();

  return (
    <ScreenWrapper>
      <div className="flex items-center p-4 justify-between sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <button onClick={() => navigate('/home')} className="text-[#131118] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined" style={{fontSize: '24px'}}>arrow_back</span>
        </button>
        <h2 className="text-[#131118] dark:text-white text-xl font-bold font-comic leading-tight tracking-wide flex-1 text-center pr-10">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-6">
        {/* Child Profile Section */}
        <div className="mt-4 flex flex-col items-center">
            <div className="relative mb-3">
                <div className="size-24 rounded-full bg-cover bg-center border-4 border-white dark:border-surface-dark shadow-md" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCe-AOwUtRikrrTGJYXo4zGubhVdxeE2mDBIRi8HK-9wP3aFIMf99ob_zYMuQGkPjyL-q7rg-pWtEzfH8ARq8NdAbFqUOjWvK6VOcEZy-vHlgUdn3iOWF36pT5n5ZVx3K8Avbm5Xgjq1EUMg_s3Sg2gaTkm_pU6nP2yTxxEfo8NIMxQHJGaYCRupsYy9y883g_R6exlv4YrxjhoEWq7CYX_4DJLWDRikr1OfScZ21JgEcyEWjqu7Ye3ubg0S_fFyFkRakVtoaUNjDU")'}}></div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full text-white shadow-sm border-2 border-white dark:border-surface-dark">
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
            </div>
            <div className="w-full max-w-xs">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-3 mb-1 block">Child's Name</label>
                <div className="relative">
                    <input 
                        type="text" 
                        value={childName} 
                        onChange={(e) => setChildName(e.target.value)}
                        className="w-full bg-white dark:bg-surface-dark rounded-xl px-4 py-3 text-slate-900 dark:text-white font-bold border-none ring-1 ring-slate-100 dark:ring-slate-800 focus:ring-primary/50"
                    />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">edit</span>
                </div>
            </div>
        </div>

        {/* Preferences */}
        <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white px-2">Preferences</h3>
            <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                         <div className="size-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center">
                            <span className="material-symbols-outlined">dark_mode</span>
                         </div>
                         <span className="font-semibold text-slate-700 dark:text-slate-200">Dark Mode</span>
                    </div>
                    <button 
                        onClick={toggleDarkMode}
                        className={`w-12 h-7 rounded-full transition-colors relative ${darkMode ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 left-1 size-5 bg-white rounded-full shadow-sm transition-transform ${darkMode ? 'translate-x-5' : ''}`}></div>
                    </button>
                </div>
                 <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                         <div className="size-8 rounded-full bg-pink-50 dark:bg-pink-900/20 text-pink-500 flex items-center justify-center">
                            <span className="material-symbols-outlined">notifications</span>
                         </div>
                         <span className="font-semibold text-slate-700 dark:text-slate-200">Notifications</span>
                    </div>
                     <button className="w-12 h-7 rounded-full bg-slate-200 dark:bg-slate-700 relative">
                        <div className="absolute top-1 left-1 size-5 bg-white rounded-full shadow-sm"></div>
                    </button>
                </div>
            </div>
        </div>

        {/* Account & Support */}
        <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white px-2">Account & Support</h3>
            <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
                {[
                    { icon: 'card_membership', label: 'Subscription', path: '/subscription', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                    { icon: 'help', label: 'Help Center', path: '/help', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { icon: 'info', label: 'About DreamColor', path: '/about', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                    { icon: 'gavel', label: 'Legal', path: '/legal', color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-800' },
                ].map((item, i) => (
                    <button 
                        key={i} 
                        onClick={() => navigate(item.path)}
                        className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                        <div className="flex items-center gap-3">
                             <div className={`size-8 rounded-full ${item.bg} ${item.color} flex items-center justify-center`}>
                                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                             </div>
                             <span className="font-semibold text-slate-700 dark:text-slate-200">{item.label}</span>
                        </div>
                         <span className="material-symbols-outlined text-gray-400 text-[20px]">chevron_right</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
            <button 
                onClick={() => { logout(); navigate('/'); }}
                className="w-full py-4 rounded-xl text-slate-600 dark:text-slate-300 font-bold bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
                <span className="material-symbols-outlined">logout</span>
                Log Out
            </button>
            <button 
                onClick={() => { 
                    if(confirm("Are you sure? This will delete all your data permanently.")) {
                        logout(); 
                        navigate('/'); 
                    }
                }}
                className="w-full py-4 rounded-xl text-red-500 font-bold bg-white dark:bg-surface-dark border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2"
            >
                <span className="material-symbols-outlined">delete_forever</span>
                Delete Account
            </button>
        </div>

         <p className="text-center text-xs text-gray-400 pb-4">Version 1.0.2</p>
      </div>
      <BottomNav />
    </ScreenWrapper>
  );
};