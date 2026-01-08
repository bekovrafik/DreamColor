import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ScreenWrapper, BottomNav, TopBar } from '../components/Layout';
import { useApp } from '../context/AppContext';

export const About: React.FC = () => {
    const navigate = useNavigate();
    
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'DreamColor',
                text: 'Turn photos into magical coloring pages with AI!',
                url: 'https://dreamcolor.app',
            }).catch(console.error);
        } else {
            alert("Thanks for sharing!");
        }
    };

    return (
        <ScreenWrapper>
            <TopBar title="About DreamColor" />
            <main className="flex-1 flex flex-col gap-6 p-4 pb-24 overflow-y-auto">
                {/* Hero Section */}
                <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-surface-dark shadow-lg border border-slate-100 dark:border-slate-800">
                    <div className="h-48 w-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCr3oX05EUYLbiYyaakon2vsa-O1iVEdEsRbwHGZXQAQThoaPvlEF3HhMzH_AbONYigsr9nWeEp_v_btQ5rKZs7zuXvifRIQ5QDC9mkJ4qHiux_h8xARw6wE9devSCg7RTYuKhLqTnNewgJY1CuWGnX-ogCYHvcVixPFKQUDTvISlg98xfeFZaDCFIA4GtxSCK3VJCpubpu7iCfT4XmDukj5gAZSNe20p5FJC1AdKSlhGU8sFWPFBdLc6xUr3T48EqXnDcWTqds4J0")'}}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-5 right-5">
                            <h2 className="font-comic text-3xl font-bold text-white leading-tight mb-1">Dream. Color. Play.</h2>
                            <p className="text-white/90 text-sm font-medium">Sparking creativity, one page at a time.</p>
                        </div>
                    </div>
                    <div className="p-6">
                        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                            DreamColor was born from a simple idea: <strong>What if children could color their own memories?</strong> 
                            <br/><br/>
                            We use cutting-edge AI to instantly transform photos and wild ideas into beautiful, print-ready coloring pages. We believe every child is an artist, and the best stories are the ones they imagine themselves.
                        </p>
                        
                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Follow Us</span>
                            <div className="flex gap-3">
                                <button className="flex items-center justify-center size-10 rounded-full bg-slate-50 dark:bg-slate-800 text-blue-600 hover:bg-blue-500 hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-[20px]">public</span>
                                </button>
                                <button className="flex items-center justify-center size-10 rounded-full bg-slate-50 dark:bg-slate-800 text-pink-600 hover:bg-pink-500 hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                                </button>
                                <button className="flex items-center justify-center size-10 rounded-full bg-slate-50 dark:bg-slate-800 text-sky-500 hover:bg-sky-500 hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-[20px]">send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How it Works */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-comic text-xl font-bold text-slate-900 dark:text-white px-2">How Magic Happens</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-4 p-4 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[24px]">add_a_photo</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">1. Snap & Upload</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Upload a photo or describe a scene.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                             <div className="size-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">2. AI Draws It</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Our engine creates bold, clean lines.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                             <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[24px]">print</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">3. Print & Color</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Export PDF and bring it to life!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                     <button onClick={handleShare} className="w-full flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 h-14 rounded-full font-bold shadow-lg active:scale-95 transition-all">
                        <span className="material-symbols-outlined">ios_share</span>
                        Share App
                    </button>
                    <button className="w-full flex items-center justify-center gap-3 bg-white dark:bg-surface-dark text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 h-14 rounded-full font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <span className="material-symbols-outlined text-yellow-500">star</span>
                        Rate Us 5 Stars
                    </button>
                </div>

                {/* Footer Info */}
                <div className="flex flex-col items-center gap-2 mt-2">
                    <div className="flex gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <button onClick={() => navigate('/legal', { state: { tab: 'terms' } })} className="hover:text-primary transition-colors">Terms</button>
                        <button onClick={() => navigate('/legal', { state: { tab: 'privacy' } })} className="hover:text-primary transition-colors">Privacy</button>
                        <button onClick={() => navigate('/help')} className="hover:text-primary transition-colors">Support</button>
                    </div>
                    <p className="text-xs text-slate-400">Version 1.0.2 • Made with ❤️ in California</p>
                </div>
            </main>
            <BottomNav />
        </ScreenWrapper>
    );
};

export const Help: React.FC = () => {
    // ... existing help content ...
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const helpArticles = [
        {
            id: 'print',
            title: 'How do I print?',
            icon: 'print',
            subtitle: 'Printer settings & Export',
            content: 'To print your coloring page, tap the "Export Book PDF" button in the Preview screen. This creates a high-quality PDF. Open it on your device and use the system Share/Print menu to send it to your printer.',
            keywords: 'printing pdf paper hardcopy'
        },
        {
            id: 'upload',
            title: 'Can I upload photos?',
            icon: 'add_photo_alternate',
            subtitle: 'Using your own images',
            content: 'Yes! When starting a New Adventure, tap the "Upload a photo" card. Select a picture from your gallery, and our AI will use it as a reference to draw the character in your coloring book.',
            keywords: 'upload picture camera photo gallery'
        },
        {
            id: 'subscription',
            title: 'Subscription help',
            icon: 'card_membership',
            subtitle: 'Manage plans & billing',
            content: 'You can manage subscriptions in your App Store or Google Play Store settings. Go to Settings > Subscription in the app to check your status or restore purchases.',
            keywords: 'billing cancel upgrade payment cost'
        },
        {
            id: 'safety',
            title: 'Is it safe for kids?',
            icon: 'shield_person',
            subtitle: 'Data privacy & safety',
            content: 'DreamColor is built with safety first. We do not store your personal photos permanently, and we do not have community features where children can interact with strangers.',
            keywords: 'safety privacy kids children'
        },
        {
            id: 'share',
            title: 'How do I share?',
            icon: 'share',
            subtitle: 'Sending to family',
            content: 'After creating a book, you can use the "Export Book PDF" to get a file you can email or message to grandparents and friends!',
            keywords: 'share email send message'
        }
    ];

    const filteredItems = searchQuery 
        ? helpArticles.filter(item => 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.keywords.includes(searchQuery.toLowerCase())
          )
        : helpArticles;

    const handleAction = (action: string) => {
        if (action === 'email') window.location.href = 'mailto:support@dreamcolor.app?subject=DreamColor Support';
        if (action === 'bug') window.location.href = 'mailto:bugs@dreamcolor.app?subject=Bug Report';
        if (action === 'tutorial') alert("Video tutorials coming soon!");
    };

    const toggleArticle = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <ScreenWrapper>
            <div className="flex items-center p-4 pb-0 justify-between sticky top-0 z-20 bg-background-light dark:bg-background-dark">
                <button onClick={() => navigate(-1)} className="text-[#131118] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined" style={{fontSize: '24px'}}>arrow_back</span>
                </button>
                <h2 className="text-[#131118] dark:text-white text-base font-semibold font-display leading-tight tracking-wide flex-1 text-center pr-10">Help Center</h2>
            </div>
            
            <div className="px-6 pt-6 pb-2">
                <h2 className="text-[#131118] dark:text-white tracking-wide text-[28px] font-bold font-comic leading-[1.3] text-left">
                    How can we help you create today?
                </h2>
            </div>

            {/* Redesigned Search Bar */}
            <div className="px-6 py-4 mb-4 relative z-10">
                <div className="flex w-full items-center rounded-full h-14 bg-white dark:bg-[#1f1b2e] shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-none border border-transparent focus-within:border-primary/50 transition-all overflow-hidden group">
                    <div className="pl-5 pr-3 text-primary group-focus-within:scale-110 transition-transform">
                         <span className="material-symbols-outlined" style={{fontSize: '26px'}}>search</span>
                    </div>
                    <input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-[#131118] dark:text-white placeholder:text-slate-400 text-base font-medium h-full w-full focus:ring-0 p-0" 
                        placeholder="Search for answers..." 
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="pr-4 text-gray-400 hover:text-gray-600 transition-colors">
                             <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-24 px-6 no-scrollbar">
                {searchQuery ? (
                    <div className="flex flex-col gap-3 animate-fade-in">
                        <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Search Results</p>
                        {filteredItems.length > 0 ? filteredItems.map((item) => (
                             <div 
                                key={item.id} 
                                onClick={() => toggleArticle(item.id)}
                                className="bg-white dark:bg-[#1f1b2e] rounded-xl overflow-hidden shadow-sm border border-slate-50 dark:border-slate-800 transition-all"
                            >
                                <div className="p-4 flex items-center cursor-pointer">
                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mr-4">
                                        <span className="material-symbols-outlined">{item.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-[#131118] dark:text-white">{item.title}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.subtitle}</p>
                                    </div>
                                    <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${expandedId === item.id ? 'rotate-90' : ''}`}>chevron_right</span>
                                </div>
                                {expandedId === item.id && (
                                    <div className="px-4 pb-4 pl-[4.5rem] text-sm text-slate-600 dark:text-slate-300 leading-relaxed animate-fade-in">
                                        {item.content}
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div className="text-center py-10 opacity-60">
                                <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                                <p>No results found for "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="pb-8">
                            <h3 className="text-[#131118] dark:text-white text-lg font-bold font-comic mb-4 pl-1">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => handleAction('tutorial')} className="group flex flex-col gap-3 rounded-2xl p-5 aspect-[4/3] bg-primary/10 hover:bg-primary/20 transition-all text-left items-start justify-between relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined text-primary" style={{fontSize: '64px'}}>play_circle</span>
                                    </div>
                                    <div className="bg-white dark:bg-primary/20 rounded-full p-2 flex items-center justify-center text-primary shadow-sm">
                                        <span className="material-symbols-outlined" style={{fontSize: '24px'}}>school</span>
                                    </div>
                                    <p className="text-[#131118] dark:text-white text-lg font-bold leading-tight font-comic">Tutorials</p>
                                </button>
                                <button onClick={() => handleAction('email')} className="group flex flex-col gap-3 rounded-2xl p-5 aspect-[4/3] bg-primary/10 hover:bg-primary/20 transition-all text-left items-start justify-between relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined text-primary" style={{fontSize: '64px'}}>support_agent</span>
                                    </div>
                                    <div className="bg-white dark:bg-primary/20 rounded-full p-2 flex items-center justify-center text-primary shadow-sm">
                                        <span className="material-symbols-outlined" style={{fontSize: '24px'}}>mail</span>
                                    </div>
                                    <p className="text-[#131118] dark:text-white text-lg font-bold leading-tight font-comic">Contact Us</p>
                                </button>
                                <button onClick={() => handleAction('bug')} className="col-span-2 group flex flex-row gap-4 rounded-2xl p-5 bg-[#FFF0F0] dark:bg-red-900/20 hover:bg-[#ffe5e5] dark:hover:bg-red-900/30 transition-all text-left items-center justify-start relative overflow-hidden">
                                    <div className="bg-white dark:bg-red-500/20 rounded-full p-2 flex items-center justify-center text-red-500 shadow-sm shrink-0">
                                        <span className="material-symbols-outlined" style={{fontSize: '24px'}}>bug_report</span>
                                    </div>
                                    <div>
                                        <p className="text-[#131118] dark:text-white text-lg font-bold leading-tight font-comic">Report a Bug</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Found something odd? Let us know.</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="pb-10">
                            <h3 className="text-[#131118] dark:text-white text-lg font-bold font-comic mb-4 pl-1">Common Questions</h3>
                            <div className="flex flex-col gap-3">
                                {helpArticles.map((item) => (
                                    <div 
                                        key={item.id} 
                                        onClick={() => toggleArticle(item.id)}
                                        className="bg-white dark:bg-[#1f1b2e] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-50 dark:border-slate-800"
                                    >
                                        <div className="p-4 flex items-center">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                    <span className="material-symbols-outlined" style={{fontSize: '18px'}}>{item.icon}</span>
                                                </div>
                                                <span className="text-base font-medium text-[#131118] dark:text-white">{item.title}</span>
                                            </div>
                                            <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${expandedId === item.id ? 'rotate-90' : ''}`} style={{fontSize: '20px'}}>chevron_right</span>
                                        </div>
                                        {expandedId === item.id && (
                                            <div className="px-4 pb-4 pl-[3.25rem] text-sm text-slate-600 dark:text-slate-300 leading-relaxed animate-fade-in">
                                                {item.content}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
            <BottomNav />
        </ScreenWrapper>
    )
};

export const Subscription: React.FC = () => {
    const navigate = useNavigate();
    const { credits, purchaseCredits } = useApp();

    const handlePurchase = (pack: 'single' | 'party', price: string) => {
        purchaseCredits(pack);
        const creditAmount = pack === 'single' ? 6 : 30;
        alert(`Hooray! Added ${creditAmount} credits for ${price}.`);
        navigate('/home');
    };

    return (
        <ScreenWrapper>
            <div className="flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 shadow-sm">
                <button onClick={() => navigate(-1)} className="text-[#131118] dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <div className="flex flex-col items-center flex-1 pr-12">
                    <h2 className="text-[#131118] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] text-center">Get Credits</h2>
                    <p className="text-xs text-gray-500">Balance: {credits}</p>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 pb-32">
                <div className="py-6 text-center">
                    <h2 className="text-[#131118] dark:text-white tracking-tight text-[28px] font-bold leading-tight font-comic">Unlock Creativity</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 max-w-[260px] mx-auto font-medium">
                        Choose the plan that fits your family best
                    </p>
                </div>

                <div className="flex flex-col gap-6 pb-6">
                    {/* Plan 2: Explorer Pack (Party Pack) */}
                    <div className="relative flex flex-col gap-4 rounded-3xl border-2 border-primary bg-white dark:bg-gray-800 p-6 shadow-xl shadow-primary/10 overflow-hidden transform transition-all hover:scale-[1.01]">
                        <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">Most Popular</div>
                        
                        <div className="flex flex-col gap-1 pr-16">
                            <h3 className="text-primary font-comic text-2xl font-bold leading-tight">Explorer Pack</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-normal">5 Full Books (30 Credits)</p>
                        </div>

                         <div className="flex flex-col gap-3 py-3">
                            {[
                                '30 Credits (5 Books + Covers)', 
                                'Upload Own Photos', 
                                'All Themes Unlocked',
                                'Export High-Quality PDFs'
                            ].map((feat, i) => (
                                <div key={i} className="text-sm font-medium flex gap-3 text-gray-700 dark:text-gray-300 items-start">
                                    <div className="size-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                                    </div>
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => handlePurchase('party', '$29.99')}
                            className="flex w-full cursor-pointer items-center justify-center rounded-full h-14 px-6 bg-primary hover:bg-primary/90 transition-colors text-white text-lg font-bold tracking-wide shadow-lg shadow-primary/20 mt-auto"
                        >
                            Get 30 Credits - $29.99
                        </button>
                    </div>

                    {/* Plan 1: Single Adventure */}
                    <div className="relative flex flex-col gap-4 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 shadow-sm">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[#131118] dark:text-white font-comic text-xl font-bold leading-tight">Single Adventure</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-normal">1 Full Book (6 Credits)</p>
                        </div>

                        <div className="flex flex-col gap-3 py-2">
                            {[
                                '6 Credits (5 Pages + Cover)', 
                                'Personalized Cover', 
                                'Unlock Photo Upload', 
                                'Print-Ready PDF'
                            ].map((feat, i) => (
                                <div key={i} className="text-sm font-medium flex gap-3 text-gray-600 dark:text-gray-400 items-start">
                                    <span className="material-symbols-outlined text-gray-400 text-[20px] shrink-0">check</span>
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>

                         <button 
                            onClick={() => handlePurchase('single', '$2.99')}
                            className="flex w-full cursor-pointer items-center justify-center rounded-full h-12 px-6 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-slate-900 dark:text-white text-base font-bold tracking-wide mt-auto"
                        >
                            Get 6 Credits - $2.99
                        </button>
                    </div>

                    {/* Plan 3: Free Starter */}
                    <div className="relative flex flex-col gap-4 rounded-3xl border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-slate-900/50 p-6 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-slate-700 dark:text-slate-200 font-comic text-xl font-bold leading-tight">Free Starter</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-normal">Try out the magic daily.</p>
                        </div>

                        <div className="flex flex-col gap-3 py-2">
                            {[
                                '1 Page every 24 Hours',
                                'Space Theme Only',
                                'Web Preview Only',
                                'No Photo Uploads'
                            ].map((feat, i) => (
                                <div key={i} className="text-sm font-medium flex gap-3 text-slate-500 dark:text-slate-400 items-start">
                                    <span className="material-symbols-outlined text-[18px] shrink-0">check</span>
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>

                         <div className="flex w-full items-center justify-center rounded-full h-12 px-6 border border-slate-200 dark:border-slate-700 bg-transparent text-slate-500 dark:text-slate-400 text-sm font-bold tracking-wide mt-auto">
                            Active (When 0 Credits)
                        </div>
                    </div>
                </div>

                <div className="px-6 py-2 flex flex-col items-center gap-4 text-center">
                    <button className="text-primary text-sm font-semibold hover:underline">Restore Purchases</button>
                    <div className="flex gap-4 text-xs text-gray-400 dark:text-gray-500">
                        <button onClick={() => navigate('/legal', { state: { tab: 'terms' } })} className="hover:text-gray-600 dark:hover:text-gray-300">Terms of Service</button>
                        <span>•</span>
                        <button onClick={() => navigate('/legal', { state: { tab: 'privacy' } })} className="hover:text-gray-600 dark:hover:text-gray-300">Privacy Policy</button>
                    </div>
                </div>
            </div>
             <BottomNav />
        </ScreenWrapper>
    )
};

export const Legal: React.FC = () => {
    // ... existing legal content ...
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
        }
    }, [location.state]);

    return (
        <ScreenWrapper>
             <TopBar title="Legal" />
             <main className="flex-1 flex flex-col gap-4 p-4 pb-24 overflow-y-auto">
                <div className="flex p-1 mb-2 bg-gray-200/50 dark:bg-white/5 rounded-full sticky top-0 z-10 backdrop-blur-md">
                    <label className="relative flex-1 cursor-pointer">
                        <input 
                            checked={activeTab === 'privacy'} 
                            onChange={() => setActiveTab('privacy')}
                            className="peer sr-only" name="legal-tab" type="radio" value="privacy" 
                        />
                        <div className="flex items-center justify-center py-2.5 px-4 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                            Privacy Policy
                        </div>
                    </label>
                    <label className="relative flex-1 cursor-pointer">
                        <input 
                            checked={activeTab === 'terms'}
                            onChange={() => setActiveTab('terms')}
                            className="peer sr-only" name="legal-tab" type="radio" value="terms" 
                        />
                        <div className="flex items-center justify-center py-2.5 px-4 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                            Terms of Service
                        </div>
                    </label>
                </div>

                {activeTab === 'privacy' ? (
                    <div className="space-y-4 animate-fade-in">
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Privacy Policy</h2>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                                Last Updated: Jan 2025
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                                Welcome to <span className="font-comic text-primary font-bold">DreamColor</span>! We are committed to protecting your privacy and ensuring you and your children have a magical and safe experience.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                             <h3 className="font-bold text-slate-900 dark:text-white mb-2">1. Data Collection</h3>
                             <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                We collect minimal data to provide our services:
                                <br/><br/>
                                • <strong>Photos:</strong> Images you upload are processed securely in the cloud to generate coloring pages and are strictly deleted immediately after processing. We do NOT store your personal photos.
                                <br/>
                                • <strong>Generated Content:</strong> The coloring pages created are stored on your device and in your private cloud gallery associated with your account.
                                <br/>
                                • <strong>Device Info:</strong> Anonymous usage data and crash reports to help us improve the app.
                             </p>
                        </div>

                        <div className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                             <h3 className="font-bold text-slate-900 dark:text-white mb-2">2. Children's Privacy</h3>
                             <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                DreamColor is designed for families. We adhere to COPPA and GDPR-K guidelines. We do not knowingly collect personal information from children under 13 without parental consent. All account creation and billing must be performed by an adult.
                             </p>
                        </div>

                        <div className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                             <h3 className="font-bold text-slate-900 dark:text-white mb-2">3. Data Deletion</h3>
                             <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                You have the right to request deletion of all your data. You can do this by deleting your account in Settings or contacting support@dreamcolor.app.
                             </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-fade-in">
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Terms of Service</h2>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                                Last Updated: Jan 2025
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                                By using DreamColor, you agree to the following terms. Please read them carefully.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                             <h3 className="font-bold text-slate-900 dark:text-white mb-2">1. Subscription Terms</h3>
                             <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                • <strong>Payment:</strong> Payment will be charged to your iTunes/Google Play Account at confirmation of purchase.
                                <br/>
                                • <strong>Auto-Renewal:</strong> Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period.
                                <br/>
                                • <strong>Account Charged:</strong> Account will be charged for renewal within 24-hours prior to the end of the current period at the cost of the chosen package.
                                <br/>
                                • <strong>Cancellation:</strong> Subscriptions may be managed by the user and auto-renewal may be turned off by going to the user's Account Settings after purchase.
                             </p>
                        </div>

                        <div className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                             <h3 className="font-bold text-slate-900 dark:text-white mb-2">2. Usage Rights</h3>
                             <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                You retain ownership of the original photos you upload. By using the app, you grant DreamColor a temporary license to process these photos to create coloring pages. The generated coloring pages are yours to use for personal, non-commercial purposes.
                             </p>
                        </div>

                        <div className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                             <h3 className="font-bold text-slate-900 dark:text-white mb-2">3. Prohibited Content</h3>
                             <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                You agree not to upload content that is illegal, offensive, or violates the rights of others. We reserve the right to ban users who violate this policy.
                             </p>
                        </div>
                    </div>
                )}

                 <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 text-center mt-4 mb-8">
                    <h4 className="text-slate-900 dark:text-white font-bold mb-2">Have Questions?</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">If you have any questions about our practices, please contact us.</p>
                    <button className="inline-flex items-center justify-center px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-colors text-sm shadow-md shadow-primary/20">
                        Email Support
                    </button>
                </div>
             </main>
             <BottomNav />
        </ScreenWrapper>
    )
}