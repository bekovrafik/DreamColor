import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenWrapper, BottomNav } from '../components/Layout';
import { useApp, SavedBook } from '../context/AppContext';

export const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const { savedBooks, loadBook, deleteBook } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredBooks = useMemo(() => {
    return savedBooks.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            book.theme.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === 'All' || 
                            book.theme.toLowerCase().includes(selectedFilter.toLowerCase()) ||
                            (selectedFilter === 'Fantasy' && !['Space', 'Animals', 'Vehicles'].some(t => book.theme.includes(t))); // Basic fallback logic for demo
      return matchesSearch && matchesFilter;
    });
  }, [savedBooks, searchQuery, selectedFilter]);

  const handleBookClick = (book: SavedBook) => {
    loadBook(book);
    navigate('/preview');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if(confirm("Are you sure you want to delete this masterpiece?")) {
        deleteBook(id);
      }
  };

  return (
    <ScreenWrapper className="h-screen overflow-hidden flex flex-col">
      {/* Fixed Header matching Presets */}
      <header className="flex items-center bg-background-light dark:bg-background-dark px-6 pt-6 pb-2 justify-between z-20 shrink-0">
          <h2 className="text-3xl font-extrabold leading-tight tracking-[-0.02em] text-[#131118] dark:text-white flex-1">
              My Gallery
          </h2>
          <div className="flex items-center justify-end">
              <button onClick={() => navigate('/new')} className="flex items-center justify-center rounded-full h-11 w-11 bg-white dark:bg-surface-dark shadow-sm text-primary hover:bg-primary hover:text-white transition-all duration-300 active:scale-95">
                  <span className="material-symbols-outlined text-[24px]" data-weight="600">add</span>
              </button>
          </div>
      </header>

      {/* Fixed Search & Filters */}
      <div className="flex flex-col gap-4 px-5 pt-2 pb-2 bg-background-light dark:bg-background-dark z-20 shrink-0">
          <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors duration-300">
                  <span className="material-symbols-outlined text-[22px]">search</span>
              </div>
              <input 
                  type="text" 
                  className="block w-full h-12 pl-11 pr-10 border-none rounded-2xl bg-white dark:bg-surface-dark text-base font-medium placeholder-gray-400 focus:ring-2 focus:ring-primary/20 shadow-sm transition-all" 
                  placeholder="Search gallery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">cancel</span>
                </button>
              )}
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5">
              {['All', 'Animals', 'Fantasy', 'Space', 'Vehicles'].map((tag, i) => (
                  <button 
                      key={i} 
                      onClick={() => setSelectedFilter(tag)}
                      className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-all active:scale-95 ${selectedFilter === tag ? 'bg-primary text-white shadow-md font-bold' : 'bg-white dark:bg-surface-dark text-slate-700 dark:text-slate-300 border border-transparent dark:border-gray-700 font-medium'}`}
                  >
                      <p className="text-sm leading-normal">{tag}</p>
                  </button>
              ))}
          </div>
      </div>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-32 no-scrollbar w-full">
        {savedBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full pb-20">
                <div className="relative mb-8 group cursor-default">
                    <div className="absolute -inset-4 bg-primary/5 dark:bg-primary/10 rounded-full blur-2xl transform group-hover:scale-105 transition-transform duration-700"></div>
                    <div className="relative w-64 h-64 bg-white dark:bg-white/5 rounded-3xl shadow-sm border border-white/50 dark:border-white/10 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-center bg-contain bg-no-repeat transform scale-90" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAtSLJIgl6f9PQthBIg8xPXfxgiUpoK4kSX2iynEue5XHyAnaW0xtdqFNKmTaJFe8du9P0kG35N4zkmGjjFF85GSTmiWAEuFq_yEjeL3XS1vSUUVcpHmvoSzpd-T4t6j4RbI40wniDb8WRhMxOQSTjIuycu64JM2IYASuizuHgSRKx9dEk_gXKmztXuFmWeKcgeQmjFKAxuHHMwngxnwF11oKB-E3yHTZs98i87sHcy8ASc1FYiBcI5il1_RLtZdvEVe8j2WnD7gN0")'}}></div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2 max-w-[320px] text-center mb-8">
                    <h3 className="text-[#131118] dark:text-white text-2xl font-bold leading-tight">Nothing here yet!</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-normal">Start a new adventure to fill your gallery.</p>
                </div>
                <button onClick={() => navigate('/new')} className="w-full max-w-[240px] h-12 rounded-full bg-primary text-white font-bold shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">brush</span>
                    Create Book
                </button>
            </div>
        ) : filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                <span className="material-symbols-outlined text-[48px] mb-2">image_search</span>
                <p>No matching masterpieces found.</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 gap-4">
                {filteredBooks.map((item, idx) => (
                    <div key={item.id} onClick={() => handleBookClick(item)} className="group flex flex-col bg-white dark:bg-surface-dark rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative">
                         {/* Delete Button */}
                         <button onClick={(e) => handleDelete(e, item.id)} className="absolute top-2 right-2 z-10 size-8 bg-white/90 text-red-500 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                             <span className="material-symbols-outlined text-[18px]">delete</span>
                         </button>
                        
                        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg mb-3">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105" />
                            {item.pages && item.pages.length > 1 && (
                                <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md rounded-md px-1.5 py-0.5 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-white text-[10px]">content_copy</span>
                                    <span className="text-[10px] font-bold text-white">{item.pages.length}</span>
                                </div>
                            )}
                            {idx === 0 && selectedFilter === 'All' && !searchQuery && (
                                <div className="absolute top-2 left-2 bg-black/20 backdrop-blur-md rounded-full px-2 py-0.5">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">New</span>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-[#131118] dark:text-white text-base font-bold leading-tight truncate">{item.title}</h3>
                                <p className="text-[#6b608a] dark:text-gray-400 text-xs font-medium mt-1 truncate">{item.theme} • {item.date}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>

      <BottomNav />
    </ScreenWrapper>
  );
};

export const Presets: React.FC = () => {
    const navigate = useNavigate();
    const { setTheme, resetAdventure } = useApp();

    const handlePresetClick = (theme: string) => {
        resetAdventure();
        setTheme(theme);
        // Navigate to 'new' with preserveState flag so it doesn't auto-reset
        navigate('/new', { state: { preserveState: true } });
    };

    return (
        <ScreenWrapper className="h-screen overflow-hidden flex flex-col">
            <header className="flex items-center bg-background-light dark:bg-background-dark p-6 pb-2 justify-between z-20 shrink-0">
                <h2 className="text-3xl font-extrabold leading-tight tracking-[-0.02em] text-[#131118] dark:text-white flex-1">
                    My Presets
                </h2>
                <div className="flex items-center justify-end">
                    <button onClick={() => navigate('/new')} className="flex items-center justify-center rounded-full h-12 w-12 bg-white dark:bg-surface-dark shadow-sm text-primary hover:bg-primary hover:text-white transition-all duration-300">
                        <span className="material-symbols-outlined text-[28px]" data-weight="600">add</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto px-4 py-4 pb-32 space-y-4 no-scrollbar">
                {[
                    { title: "Chloe's Dinosaurs", theme: "Dinosaurs", desc: "Theme: Prehistoric • Style: Cartoon", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCB6i7GmEcPa4EHt6InnI1E5DBtd7txHkDxXCrp-zehcGE06J9XWrxQHTDk5kkJfUsW_g5Xfe7PKP-H--a46EcTvOjSGdID_d-wU6U_rYbzp3S4jXNdg9x92k3c8pGJp32SiVoZkYEoLGOZyAMovUJgZFvsV3EWbbpMwSHEOWYqHH6Lvh-4hn5qljrj0eVlI-RCzzGZ7lG0rjkpe6skbi7U3X54WUpBcwSWpmjRClEDOILnsy1EivGndWqXsjJJyY0pfdL78fYokhs", active: true },
                    { title: "Max's Space Adventure", theme: "Space", desc: "Theme: Space • Style: Line Art", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMlJCU23uVoa0bo3te_1ij-oZhHm9G4DJNoEzuIvg9yispGm8B7sYn5yjvQSWKN0fi0x6qdXDUCguPXNfsAbtYIUHM96i5AKjnpts4qnaisf_H2do4HQgzeQXFrJSFqSVZOCyUmBceR6Lol7S_y29bumFG_bIqEkPFR_g6jXj57AM2vBQY3nysD1fcFWhYqRmUpKohNXjXncu8mP-Geq_Eitc6w9AS30lmLZ8eZOYmqS7NVaA4MdkVbUSLwJs-jNcpxoYZ_ZroG-s" },
                    { title: "Sophie's Garden", theme: "Nature", desc: "Theme: Nature • Style: Fantasy", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBejSO-mY1mE1HKfo9QvR7D8Ycc30ohEpIZ4gDP4F-TpYCVkpUFK1E1FSFHBC0X2pfHynbV75ViQ-xhBtw0N9ahdjpnlWUC2spEwiK7JPsBwQ8OI-uNP5Yii7Hj9KWAVDt3hHpTA-CKMKA2Ye6y1T0gHL5wpQX3NuDgEFtw8CpB_Dm5g-KcW3CncnUkvSMmHnFYc17lwIfxaJmmbxwGawUgxZtiaDc982s0tjInBpudAfuFZ8PaZO-Koq_IKnpG9yd6E-TRAQAr5UY" },
                    { title: "Puppy Patrol", theme: "Animals", desc: "Theme: Animals • Style: Simple", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVBi8b6Dy70TTME04rkw58o24B5avSdETX5oo67kZZncWVDw4ERTZCb1XNmLq0Wt_mssG7d5k72ffcmEd_H1RjZoJgo0DD6jqkNFvnTZFREdKNMLHa4mR47nc1NaDIpZnzwYQSNgYqIG-TPXAUPX9aDQ9pAaYg1jgYXncCUkBLFRSlX6hd7wAP9vq_IJTzXcZq2TYnUgJfWFvFuPM-vLlmxf5s6Nb1HAR51zklIGB_PRpBEokz9LskG2OYYtqovGpjGrD-90srifI" }
                ].map((item, idx) => (
                     <div key={idx} className="group relative flex flex-col gap-4 bg-surface-light dark:bg-surface-dark p-4 rounded-[2rem] shadow-sm border border-transparent hover:border-primary/10 transition-all duration-300 active:scale-[0.98]">
                        <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white dark:border-white/10 shadow-md">
                                <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url("${item.img}")`}}></div>
                            </div>
                            <div className="flex flex-col flex-1 min-w-0 justify-center">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-[#131118] dark:text-white text-lg font-bold leading-tight truncate pr-2">{item.title}</h3>
                                    <button className="text-gray-400 hover:text-primary dark:text-gray-500 transition-colors p-1 -mr-2 -mt-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/5">
                                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                    </button>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal truncate mt-1">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                        {item.active ? (
                            <button onClick={() => handlePresetClick(item.theme)} className="flex w-full items-center justify-center gap-2 rounded-full h-11 bg-primary text-white text-sm font-bold tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:translate-y-0.5">
                                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                                Generate
                            </button>
                        ) : (
                            <button onClick={() => handlePresetClick(item.theme)} className="flex w-full items-center justify-center gap-2 rounded-full h-11 bg-primary/10 dark:bg-primary/20 text-primary dark:text-white text-sm font-bold tracking-wide hover:bg-primary hover:text-white transition-all active:translate-y-0.5">
                                <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                                Start
                            </button>
                        )}
                    </div>
                ))}
            </main>
            <BottomNav />
        </ScreenWrapper>
    )
}