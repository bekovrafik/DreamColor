import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { jsPDF } from "jspdf";
import { ScreenWrapper, TopBar, BottomNav } from '../components/Layout';
import { useApp } from '../context/AppContext';

// Audio Helper Functions
const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

// UI Sound Synthesizer
const playUiSound = (type: 'send' | 'receive' | 'mic-on' | 'mic-off') => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const now = ctx.currentTime;

        if (type === 'send') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(1000, now + 0.08);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'receive') {
            // A pleasant major triad arpeggio
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
            notes.forEach((freq, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g);
                g.connect(ctx.destination);
                o.type = 'sine';
                o.frequency.value = freq;
                
                const startTime = now + (i * 0.06);
                g.gain.setValueAtTime(0, startTime);
                g.gain.linearRampToValueAtTime(0.05, startTime + 0.02);
                g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
                
                o.start(startTime);
                o.stop(startTime + 0.5);
            });
        } else if (type === 'mic-on') {
             const osc = ctx.createOscillator();
             const gain = ctx.createGain();
             osc.connect(gain);
             gain.connect(ctx.destination);

             osc.frequency.setValueAtTime(400, now);
             osc.frequency.linearRampToValueAtTime(600, now + 0.15);
             gain.gain.setValueAtTime(0.05, now);
             gain.gain.linearRampToValueAtTime(0, now + 0.15);
             osc.start(now);
             osc.stop(now + 0.15);
        } else if (type === 'mic-off') {
             const osc = ctx.createOscillator();
             const gain = ctx.createGain();
             osc.connect(gain);
             gain.connect(ctx.destination);

             osc.frequency.setValueAtTime(600, now);
             osc.frequency.linearRampToValueAtTime(400, now + 0.15);
             gain.gain.setValueAtTime(0.05, now);
             gain.gain.linearRampToValueAtTime(0, now + 0.15);
             osc.start(now);
             osc.stop(now + 0.15);
        }
    } catch (e) {
        // Ignore audio errors
    }
};

// Helper to get authenticated AI client
const getAiClient = async () => {
    if ((window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
            await (window as any).aistudio.openSelectKey();
        }
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const NewAdventure: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { childName, setChildName, theme, setTheme, resetAdventure, uploadedImage, setUploadedImage, credits, isPaidUser, checkFreeLimit } = useApp();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [limitWaitTime, setLimitWaitTime] = useState('');

    // Reset state when entering new adventure to prevent stale data
    // UNLESS we are coming from a preset/quick-start which explicitly sets state beforehand
    useEffect(() => {
        if (!location.state?.preserveState) {
            resetAdventure();
            // Default theme for Free plan if not set
            if (!isPaidUser) setTheme('Space');
        }
    }, []);

    const handleStart = () => {
        // Validation
        if (uploadedImage) {
             if (!isPaidUser || credits < 6) {
                 alert("You need at least 6 credits for a custom photo adventure. Please top up!");
                 navigate('/subscription');
                 return;
             }
        }

        // Logic for Standard Flow (No upload) or Upload Flow
        // Both go to Chat for brainstorming now, to allow creative direction even with photos
        if (credits >= 6) {
             // User has enough credits for a full book.
             navigate('/chat');
        } else {
             // User has < 6 credits.
             if (credits > 0) {
                 // User has some credits but not enough for full book. 
                 // Prompt to top up.
                 alert("You need 6 credits to create a full book! Please refill your credits.");
                 navigate('/subscription');
                 return;
             }

             // Credits == 0. Check Free Limit.
             const { allowed, waitTimeStr } = checkFreeLimit();
             if (!allowed) {
                setLimitWaitTime(waitTimeStr || '24h');
                setShowLimitModal(true);
                return;
             }
             
             // Allowed to use free daily page
             navigate('/chat');
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isPaidUser) {
            navigate('/subscription');
            return;
        }
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setUploadedImage(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileUpload = () => {
        if (!isPaidUser) {
            navigate('/subscription');
        } else {
            fileInputRef.current?.click();
        }
    };

    const handleThemeSelect = (t: string) => {
        if (!isPaidUser && t !== 'Space') {
             // Block selection
             return;
        }
        setTheme(t);
    };

    return (
        <ScreenWrapper>
            <TopBar title="New Adventure" backPath="/home" />
            
            {/* Free Limit Modal */}
            {showLimitModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-6">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-center border border-slate-100 dark:border-slate-800">
                        <div className="size-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined text-[32px]">timelapse</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pencils need a rest! ✏️</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            Your daily magic spark is used! I have to rest my pencils for {limitWaitTime}, or you can unlock 5 credits right now for $2.99.
                        </p>
                        <div className="flex flex-col gap-3 mt-4">
                            <button onClick={() => navigate('/subscription')} className="w-full bg-primary hover:bg-primary-hover text-white font-bold h-12 rounded-full shadow-lg">
                                Unlock 5 Credits - $2.99
                            </button>
                            <button onClick={() => setShowLimitModal(false)} className="text-sm text-gray-500 font-bold hover:text-gray-700 mt-2">
                                I'll wait
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-3 px-6 py-2">
                <div className="flex gap-6 justify-between items-end">
                    <p className="text-primary text-sm font-bold leading-normal uppercase tracking-wider">Step 1 of 3</p>
                    <div className="flex items-center gap-2">
                         <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md uppercase">
                            {credits} Credits
                         </span>
                         <span className="text-xs text-gray-400 font-medium">Setup</span>
                    </div>
                </div>
                <div className="h-2 w-full rounded-full bg-[#dedbe6] dark:bg-gray-700 overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: '33%' }}></div>
                </div>
            </div>

            <div className="flex-1 flex flex-col px-4 pb-24 overflow-y-auto">
                <h2 className="text-[#131118] dark:text-white tracking-tight text-[32px] font-extrabold leading-[1.1] px-2 text-left pb-6 pt-6">
                    Let's make something <span className="text-primary">special</span>
                </h2>
                
                <div className="flex flex-col gap-2 px-2 pb-6">
                    <label className="text-[#131118] dark:text-gray-200 text-base font-bold leading-normal pl-1" htmlFor="childName">Child's Name</label>
                    <input 
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        className="form-input flex w-full resize-none overflow-hidden rounded-full text-[#131118] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-0 shadow-sm bg-white dark:bg-gray-800 h-16 placeholder:text-gray-400 px-6 text-lg font-medium leading-normal transition-all" 
                        id="childName" 
                        placeholder="e.g. Leo, Maya..." 
                        type="text" 
                    />
                </div>

                <div className="flex flex-col gap-3 px-2 pb-8">
                    <div className="flex justify-between items-center pl-1">
                        <h2 className="text-[#131118] dark:text-gray-200 text-base font-bold leading-normal">Pick a magical theme</h2>
                        {!isPaidUser && <button onClick={() => navigate('/subscription')} className="text-xs text-primary font-bold hover:underline">Unlock All</button>}
                    </div>
                    
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
                        {['Space', 'Jungle', 'Princess', 'Dinosaurs', 'Underwater'].map((t) => {
                            const isLocked = !isPaidUser && t !== 'Space';
                            return (
                                <button 
                                    key={t}
                                    onClick={() => handleThemeSelect(t)}
                                    disabled={isLocked}
                                    className={`relative flex items-center gap-2 px-5 py-3 rounded-full shadow-sm whitespace-nowrap transition-all active:scale-95 border ${theme === t ? 'bg-primary text-white border-primary shadow-primary/30' : 'bg-white dark:bg-gray-800 text-[#131118] dark:text-gray-300 border-transparent hover:border-gray-200 dark:hover:border-gray-700'} ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    <span className="font-bold text-sm">{t}</span>
                                    {isLocked && <span className="material-symbols-outlined text-[14px] text-gray-500 ml-1">lock</span>}
                                </button>
                            );
                        })}
                    </div>
                    <div className="relative mt-1">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">edit</span>
                        <input 
                            value={theme}
                            disabled={!isPaidUser}
                            onChange={(e) => setTheme(e.target.value)}
                            className={`form-input w-full rounded-full border-0 bg-white dark:bg-gray-800 pl-12 pr-4 h-12 text-sm font-medium focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 dark:text-white shadow-sm ${!isPaidUser ? 'opacity-60 cursor-not-allowed' : ''}`} 
                            placeholder={!isPaidUser ? "Custom themes locked (Premium)" : "Or type your own theme..."} 
                            type="text" 
                        />
                         {!isPaidUser && <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-sm">lock</span>}
                    </div>
                </div>

                <div className="flex flex-col gap-3 px-2">
                    <div className="flex justify-between items-baseline pl-1">
                        <h2 className="text-[#131118] dark:text-gray-200 text-base font-bold leading-normal">
                            {uploadedImage ? "Image Uploaded!" : "Personalize with AI"}
                        </h2>
                         <div className="flex gap-2">
                            <span className="text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">OPTIONAL</span>
                         </div>
                    </div>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        accept="image/*" 
                        className="hidden" 
                    />

                    <div 
                        onClick={triggerFileUpload}
                        className={`group relative flex flex-col items-center justify-center w-full aspect-[2/1] bg-white dark:bg-gray-800 rounded-[2rem] border-2 border-dashed ${uploadedImage ? 'border-primary' : 'border-[#dedbe6] dark:border-gray-700'} hover:border-primary/50 dark:hover:border-primary/50 transition-all cursor-pointer overflow-hidden`}
                    >
                        {!isPaidUser && !uploadedImage && (
                            <div className="absolute top-3 right-3 z-20 bg-gray-200/80 dark:bg-black/40 backdrop-blur rounded-full p-1.5 text-gray-600 dark:text-white">
                                <span className="material-symbols-outlined text-[18px]">lock</span>
                            </div>
                        )}
                        
                        {uploadedImage ? (
                             <div className="w-full h-full relative">
                                <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover opacity-60" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                     <div className="bg-white/90 text-slate-800 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">check_circle</span>
                                        Change Photo
                                     </div>
                                </div>
                             </div>
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10 flex flex-col items-center text-center p-6 gap-3">
                                    <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1 group-hover:scale-110 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-[28px]">add_a_photo</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#131118] dark:text-white">Upload a photo</p>
                                        <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
                                            {!isPaidUser ? "Unlock to turn photos into coloring pages!" : "We'll turn it into a coloring page!"}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark pt-8 z-20 max-w-md mx-auto">
                <button 
                    onClick={handleStart}
                    disabled={!childName || !theme}
                    className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold h-14 rounded-full text-lg shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {uploadedImage ? "Plan with Photo" : "Create Magic"} 
                    <span className="material-symbols-outlined text-[20px]">{uploadedImage ? 'chat_bubble' : 'auto_awesome'}</span>
                </button>
            </div>
        </ScreenWrapper>
    );
};

export const Chat: React.FC = () => {
    // ... existing Chat logic ...
    const navigate = useNavigate();
    const { childName, theme, chatHistory, addChatMessage, uploadedImage } = useApp();
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [playingMessageId, setPlayingMessageId] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Initial greeting if history is empty
    useEffect(() => {
        if (chatHistory.length === 0 && childName && theme) {
            let initialGreeting = `Hi! I'm so excited to help you create a ${theme} coloring book for ${childName}! We are going to make 5 different pages. What kind of ${theme} scene should the first one be?`;
            
            if (uploadedImage) {
                initialGreeting = `Wow, great photo of ${childName}! I'll use it as a reference for the character. We're making a ${theme} book. What should ${childName} be doing on the first page?`;
            }
            
            addChatMessage('model', initialGreeting);
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // Cleanup audio context
    useEffect(() => {
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    // Speech Recognition
    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }
        
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            playUiSound('mic-on');
        };
        recognition.onend = () => {
            setIsListening(false);
            playUiSound('mic-off');
        };
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputText(prev => prev + (prev ? ' ' : '') + transcript);
        };
        recognition.onerror = () => setIsListening(false);
        
        recognition.start();
    };

    const playMessageAudio = async (text: string, index: number) => {
        if (playingMessageId === index) return; // Already playing/loading this one
        
        try {
            setPlayingMessageId(index);
            
            // Re-use or create audio context
            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
            } else if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }

            const ai = await getAiClient();
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: text }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: 'Kore' },
                        },
                    },
                },
            });

            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            
            if (base64Audio) {
                 const audioBuffer = await decodeAudioData(
                    decode(base64Audio),
                    audioContextRef.current,
                    24000,
                    1,
                );
                
                const source = audioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current.destination);
                source.onended = () => setPlayingMessageId(null);
                source.start();
            } else {
                setPlayingMessageId(null);
            }

        } catch (err) {
            console.error("TTS Error:", err);
            setPlayingMessageId(null);
        }
    };

    const handleSendMessage = async (textOverride?: string) => {
        const messageToSend = textOverride || inputText.trim();
        if (!messageToSend || isLoading) return;

        playUiSound('send');

        setInputText('');
        setError(null);
        addChatMessage('user', messageToSend);
        setIsLoading(true);

        try {
            // Enhanced system prompt to be more creative and proactive
            const systemPrompt = `You are a magical creative partner for a parent making a 5-page coloring book for their child, ${childName}. 
            The current theme is ${theme}.
            ${uploadedImage ? "The user provided a photo of the child, which will be used for generation." : ""}
            Your goal is to brainstorm 5 distinct, fun scene ideas.
            Do NOT just ask generic questions like "What else?". 
            Instead, proactively suggest creative visual details for each page (e.g., "For page 2, should the dinosaur be eating a giant ice cream?").
            Ask about specific props, characters, and their expressions.
            Keep your responses short (under 40 words), enthusiastic, and inspiring.
            When the user indicates they are happy with the ideas or says "generate", strictly reply with "Ok, getting your paints ready!" to signal completion.`;

            const history = chatHistory.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }));

            // Using gemini-3-flash-preview for chat logic
            const ai = await getAiClient();
            const chat = ai.chats.create({
                model: 'gemini-3-flash-preview',
                history: history,
                config: { systemInstruction: systemPrompt }
            });

            const result = await chat.sendMessage({ message: messageToSend });
            const responseText = result.text;
            
            if (responseText) {
                addChatMessage('model', responseText);
                playUiSound('receive');
            }
        } catch (error) {
            console.error("Chat error:", error);
            setError("Oops! I couldn't reach the magic cloud. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSendMessage();
    }

    const handleChipClick = (text: string) => {
        // Optimistically set text (optional, but good for feeling)
        // Then send immediately
        handleSendMessage(text);
    };

    return (
        <ScreenWrapper className="h-screen overflow-hidden flex flex-col">
            <header className="flex-none bg-background-light dark:bg-background-dark z-20 px-4 pt-6 pb-2 flex items-center justify-between transition-colors duration-300 border-b border-transparent dark:border-white/5">
                <div className="flex items-center gap-3">
                     <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full bg-transparent text-slate-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/10">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="font-comic text-xl font-bold text-[#131118] dark:text-white tracking-wide">
                            Brainstorming
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Planning 5 pages</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/generating')}
                    className={`h-10 px-4 flex items-center justify-center gap-2 rounded-full bg-primary text-white shadow-soft hover:bg-primary-hover active:scale-95 transition-all ${chatHistory.length > 4 ? 'animate-pulse' : ''}`}
                >
                    <span className="text-sm font-bold">Generate</span>
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                </button>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar w-full flex flex-col px-4 pt-4 pb-40 gap-4 relative" ref={scrollRef}>
                <div className="flex justify-center py-2">
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-white/50 dark:bg-white/5 px-3 py-1 rounded-full">Designing "{theme}" Book</span>
                </div>
                
                {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex items-end gap-2 group ${msg.role === 'user' ? 'justify-end' : ''} animate-fade-in`}>
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-cover bg-center shrink-0 border-2 border-white dark:border-surface-dark shadow-sm self-end mb-1" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAvnZsti9Y60nlnt9lw9L0_oza-NGOUOb8v5GOfjT_a92LvuE4qTFUvzndbHs1Jp7XSI84MfFeZnVRFi0G8I-JDuZi00jpavi0R-tT2XeBAr2xILUvfWVkBUIE_wI1fvhyFVtJnDdjTY1t9Cd2rPCm5DUvRwnS7R_Nvcj8qxMnMYfH6nSWY52WP_0ml1URtNJa03faDpidRQBAXzx0K7xREHm33bHVjAEtVIQzUzPXbJdsarS3Enng9LHEklDsw85OP18Y_rky2I5Q")'}}></div>
                        )}
                        <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[90%]`}>
                            <div className={`relative px-4 py-3 rounded-2xl shadow-sm text-[#131118] dark:text-white ${msg.role === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-white dark:bg-surface-dark rounded-bl-sm'}`}>
                                <p className={`text-base font-normal leading-relaxed ${msg.role === 'user' ? 'text-white' : ''}`}>
                                    {msg.text}
                                </p>
                                {msg.role === 'model' && (
                                    <button 
                                        onClick={() => playMessageAudio(msg.text, idx)}
                                        className={`absolute -right-8 bottom-0 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${playingMessageId === idx ? 'text-primary' : 'text-gray-400'}`}
                                    >
                                        <span className={`material-symbols-outlined text-[20px] ${playingMessageId === idx ? 'animate-pulse' : ''}`}>
                                            {playingMessageId === idx ? 'volume_up' : 'volume_mute'}
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-cover bg-center shrink-0 border-2 border-white dark:border-surface-dark shadow-sm self-end mb-1" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDr61Sq4S5ZQxahGMfYfhQfzPPWyw7Y-GUmT4thdVVZYoqNWNC84rqWiGaXoxI7acnorIV4ryWvQQUciUwwjl3x7eRqI1bmj_rs4nMlLbnuoy9Coiu-g-zEKPOGwYYBsblXS2xbpqemIpRwbjfJli-qJXeYSWN2_9ZAUrmcHk4GiNvLPrhSRjKYQ9Xf1jwHXY0gwnLQ5iZlz_HlzMfHghxrVoR9KMGSNBDSxiPNOu_kjkLumz82a6IizMwME9gb1lMUpVy9Aw4a1ys")'}}></div>
                        )}
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-end gap-2 animate-fade-in">
                        <div className="w-8 h-8 rounded-full bg-cover bg-center shrink-0 border-2 border-white dark:border-surface-dark shadow-sm mb-1" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAvnZsti9Y60nlnt9lw9L0_oza-NGOUOb8v5GOfjT_a92LvuE4qTFUvzndbHs1Jp7XSI84MfFeZnVRFi0G8I-JDuZi00jpavi0R-tT2XeBAr2xILUvfWVkBUIE_wI1fvhyFVtJnDdjTY1t9Cd2rPCm5DUvRwnS7R_Nvcj8qxMnMYfH6nSWY52WP_0ml1URtNJa03faDpidRQBAXzx0K7xREHm33bHVjAEtVIQzUzPXbJdsarS3Enng9LHEklDsw85OP18Y_rky2I5Q")'}}></div>
                        <div className="flex gap-1 p-4 bg-white dark:bg-surface-dark rounded-2xl rounded-bl-none shadow-sm">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="flex justify-center animate-fade-in">
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-300 px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-red-100 dark:border-red-900/50">
                            {error}
                        </div>
                    </div>
                )}
            </main>

            <div className="fixed bottom-0 left-0 right-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl pt-2 pb-6 flex flex-col gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-black/5 dark:border-white/5 max-w-md mx-auto">
                 <div className="w-full overflow-x-auto no-scrollbar pl-4 pr-4">
                    <div className="flex gap-2 w-max">
                        {['Make it funnier', 'Add a robot', 'More trees', 'Surprise me!'].map((tag, idx) => (
                             <button 
                                key={idx} 
                                onClick={() => handleChipClick(tag)}
                                disabled={isLoading}
                                className="flex items-center gap-2 h-9 px-4 rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-primary/50 active:bg-primary/5 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{tag}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="px-4 w-full">
                    <div className="flex items-center gap-2 p-1.5 pl-4 rounded-full bg-white dark:bg-surface-dark shadow-sm ring-1 ring-black/5 dark:ring-white/10 focus-within:ring-primary dark:focus-within:ring-primary transition-all">
                        <button 
                            onClick={startListening}
                            className={`flex size-8 items-center justify-center rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' : 'text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-white/10'}`}
                            title="Speak"
                        >
                            <span className="material-symbols-outlined text-[20px]">{isListening ? 'mic' : 'mic_none'}</span>
                        </button>
                        <input 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent border-none outline-none text-base text-[#131118] dark:text-white placeholder-gray-400 focus:ring-0 p-0 h-10 font-display" 
                            placeholder={isListening ? "Listening..." : "Type an idea..."}
                            type="text" 
                        />
                        <button 
                            onClick={() => handleSendMessage()}
                            disabled={isLoading || (!inputText.trim() && !isListening)}
                            aria-label="Send Message" 
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 active:scale-95 transition-transform shadow-md disabled:bg-gray-300 dark:disabled:bg-gray-700"
                        >
                            <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
                        </button>
                    </div>
                </div>
            </div>
        </ScreenWrapper>
    );
};

export const GenerationProgress: React.FC = () => {
    // ... no changes needed to logic, assumes Chat passed history ...
    const navigate = useNavigate();
    const { childName, theme, chatHistory, setGeneratedImages, uploadedImage, deductCredits, credits, recordFreeGeneration } = useApp();
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("Planning your book...");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const generate = async (retryCount = 0) => {
            try {
                // Determine if Paid run or Free run logic
                // A "Full Book" Paid Run uses 6 credits.
                const isPaidRun = credits >= 6;
                const pageCount = isPaidRun ? 6 : 1;
                
                // If not paid run, we are using the free daily limit.
                // We assume `NewAdventure` already checked eligibility, but safety check:
                if (isPaidRun) {
                    // We will deduct later upon success
                }

                const ai = await getAiClient();
                const allImages: string[] = [];

                if (isMounted) {
                    setStatusText(retryCount > 0 ? "Retrying..." : `Dreaming up ${pageCount === 1 ? 'a scene' : 'your book'}...`);
                    setProgress(10);
                }

                const fullContext = chatHistory.map(m => `${m.role === 'user' ? 'Parent' : 'Idea Helper'}: ${m.text}`).join('\n');
                
                // Prompt to get scene descriptions
                const planResponse = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: `You are creating a ${pageCount}-page coloring book for a child named ${childName}. Theme: ${theme}. 
                    Previous conversation ideas: ${fullContext}. 
                    Task: Generate ${pageCount} distinct, creative, and detailed scene descriptions.
                    ${pageCount === 6 ? "One of these must be a cover page design." : ""}
                    If an image was uploaded, assume it is the main character and incorporate it into the scenes.
                    Return ONLY a valid JSON array of strings. Example: ["scene 1..."].`,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                });

                const scenes = JSON.parse(planResponse.text || '[]');
                if (!scenes || scenes.length === 0) throw new Error("Could not plan scenes.");
                
                const totalScenes = scenes.length;
                
                for (let i = 0; i < totalScenes; i++) {
                    if (!isMounted) return;
                    const sceneDescription = scenes[i];
                    setStatusText(`Drawing page ${i + 1} of ${totalScenes}: ${sceneDescription.substring(0, 20)}...`);
                    setProgress(20 + ((i / totalScenes) * 70)); 

                    const contentsParts: any[] = [];
                    
                    let finalPrompt = `Create a high-quality children's coloring page (line art only). 
                    Scene Description: ${sceneDescription}. 
                    Theme: ${theme}. 
                    Main Character Name: ${childName}.
                    Style Requirements: clear bold black lines, pure white background, NO shading, NO grayscale, NO colors. 
                    Ensure the image is simple enough for a child to color but detailed enough to be fun.`;

                    if (uploadedImage) {
                        finalPrompt += ` IMPORTANT: Use the provided reference image as the primary visual source for the character ${childName}. Maintain the character's key features in line art style.`;
                        const base64Data = uploadedImage.split(',')[1];
                        const mimeType = uploadedImage.split(';')[0].split(':')[1];
                        contentsParts.push({ text: finalPrompt });
                        contentsParts.push({ inlineData: { mimeType: mimeType, data: base64Data } });
                    } else {
                        contentsParts.push({ text: finalPrompt });
                    }

                    const imgResponse = await ai.models.generateContent({
                        model: 'gemini-3-pro-image-preview',
                        contents: { parts: contentsParts },
                        config: { imageConfig: { imageSize: "1K" } }
                    });

                    if (imgResponse.candidates?.[0]?.content?.parts) {
                        for (const part of imgResponse.candidates[0].content.parts) {
                            if (part.inlineData && part.inlineData.data) {
                                const base64 = part.inlineData.data;
                                const mime = part.inlineData.mimeType || 'image/png';
                                allImages.push(`data:${mime};base64,${base64}`);
                                break;
                            }
                        }
                    }
                }

                if (isMounted) {
                    if (allImages.length > 0) {
                        let showRefill = false;
                        if (isPaidRun) {
                            const success = deductCredits(6);
                            if (success && (credits - 6) === 0) {
                                showRefill = true;
                            }
                        } else {
                            recordFreeGeneration();
                        }
                        
                        setGeneratedImages(allImages);
                        setProgress(100);
                        setStatusText("Book complete!");
                        setTimeout(() => navigate('/preview', { state: { showRefill } }), 500);
                    } else {
                        throw new Error("No images were generated.");
                    }
                }

            } catch (e: any) {
                if (!isMounted) return;
                console.error("Generation failed", e);
                
                // Handle Permission/Auth errors
                const isAuthError = e.status === 403 || e.message?.includes("PERMISSION_DENIED") || e.message?.includes("403");
                
                if (isAuthError && retryCount < 1 && (window as any).aistudio) {
                    try {
                        setStatusText("Please select a paid API Key...");
                        await (window as any).aistudio.openSelectKey();
                        generate(retryCount + 1);
                        return;
                    } catch (keyErr) {
                         // Fall through to error display
                    }
                }

                setError(e.message || "Something went wrong. Please check your connection.");
            }
        };

        generate();
        return () => { isMounted = false; };
    }, []);

    if (error) {
        return (
            <ScreenWrapper className="justify-center items-center px-6 text-center">
                <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 mb-4">
                    <span className="material-symbols-outlined text-[40px]">error_outline</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Oh no!</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
                <button onClick={() => navigate('/chat')} className="w-full rounded-full bg-primary py-4 font-bold text-white shadow-lg">
                    Try Again
                </button>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper className="justify-center items-center overflow-hidden">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
            <div className="pointer-events-none absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>
            
            <div className="flex flex-col items-center justify-center px-6 gap-10 z-10 w-full">
                <div className="relative flex flex-col items-center">
                    <div className="absolute inset-0 -m-8 rounded-full border-2 border-dashed border-primary/20 animate-spin-slow"></div>
                    <div className="absolute inset-0 -m-3 rounded-full border-2 border-primary/10 animate-spin-reverse-slow"></div>
                    <div className="relative h-56 w-56 overflow-hidden rounded-full bg-white dark:bg-slate-800 shadow-2xl shadow-primary/20 ring-4 ring-white dark:ring-slate-800 z-10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[64px] animate-pulse">brush</span>
                         <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay"></div>
                    </div>
                    <div className="absolute -bottom-4 z-20 flex items-center gap-2 rounded-full bg-white px-5 py-2 shadow-lg shadow-primary/10 border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                        <span className="material-symbols-outlined text-primary text-[20px] animate-pulse">auto_awesome</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">AI Magic</span>
                    </div>
                </div>

                <div className="flex max-w-sm flex-col items-center text-center gap-2 mt-4">
                    <h1 className="text-[#131118] dark:text-white tracking-tight text-[32px] font-extrabold leading-tight px-4 pb-1">
                        {statusText.includes("Planning") ? "Planning your story..." : statusText.includes("select") ? "Waiting for Key..." : "Illustrating..."}
                    </h1>
                    <h2 className="text-slate-500 dark:text-slate-400 text-lg font-semibold leading-tight tracking-[-0.015em] px-4 min-h-[50px]">
                        {statusText}
                    </h2>
                </div>

                <div className="w-full max-w-xs flex flex-col gap-3">
                    <div className="flex justify-between items-end px-2">
                        <span className="text-sm font-bold text-primary">Progress</span>
                        <span className="text-sm font-bold text-slate-400 dark:text-slate-500">{Math.round(progress)}%</span>
                    </div>
                    <div className="relative h-6 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-inner">
                        <div className="absolute top-0 left-0 h-full rounded-full bg-primary transition-all duration-300 ease-out flex items-center" style={{width: `${progress}%`}}>
                            <div className="w-full h-full opacity-30" style={{backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem'}}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full flex-none px-6 pb-10 pt-4 z-10">
                 <button onClick={() => navigate(-1)} className="w-full rounded-full border-2 border-slate-200 dark:border-slate-700 bg-transparent py-4 text-center text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200">
                    Cancel Generation
                </button>
            </div>
        </ScreenWrapper>
    );
}

export const PreviewBook: React.FC = () => {
    // ... existing PreviewBook content ...
    const navigate = useNavigate();
    const location = useLocation();
    const { generatedImages, theme, childName, saveBook, setGeneratedImages, isPaidUser, credits, deductCredits, uploadedImage } = useApp();
    const [isExporting, setIsExporting] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasSaved, setHasSaved] = useState(false);
    const [showRefillModal, setShowRefillModal] = useState(false);
    
    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [brightness, setBrightness] = useState(100); // %
    const [contrast, setContrast] = useState(100); // %
    const [rotation, setRotation] = useState(0); // degrees
    
    // Regeneration State
    const [showRegenModal, setShowRegenModal] = useState(false);
    const [regenPrompt, setRegenPrompt] = useState("");
    const [isRegenerating, setIsRegenerating] = useState(false);

    // PDF Settings State
    const [showPdfSettings, setShowPdfSettings] = useState(false);
    const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [margin, setMargin] = useState<'none' | 'small' | 'normal'>('normal');
    const [includeTitlePage, setIncludeTitlePage] = useState(true);
    const [showPageNumbers, setShowPageNumbers] = useState(true);

    const currentImage = generatedImages[currentIndex];

    useEffect(() => {
        if (location.state?.showRefill) {
            setShowRefillModal(true);
        }
    }, [location.state]);

    if (!generatedImages || generatedImages.length === 0) {
        return (
             <ScreenWrapper className="justify-center items-center">
                <p>No images generated. <button onClick={() => navigate('/new')} className="text-primary underline">Try again</button></p>
             </ScreenWrapper>
        );
    }

    const applyEdits = () => {
        // Bake changes into new image
        const img = new Image();
        img.src = currentImage;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Swap dimensions if rotating 90 or 270
            if (rotation % 180 !== 0) {
                canvas.width = img.height;
                canvas.height = img.width;
            } else {
                canvas.width = img.width;
                canvas.height = img.height;
            }

            // Filter
            ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

            // Translate to center for rotation
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            
            // Draw image centered
            ctx.drawImage(img, -img.width / 2, -img.height / 2);

            const newImageData = canvas.toDataURL('image/png');
            
            // Update the specific image in the array
            const newImages = [...generatedImages];
            newImages[currentIndex] = newImageData;
            setGeneratedImages(newImages);
            
            setIsEditing(false);
            
            // Reset controls
            setRotation(0);
            setBrightness(100);
            setContrast(100);
        };
    };
    
    const handleRegeneratePage = async () => {
        // Validate
        if (!isPaidUser || credits < 1) {
             setShowRegenModal(false);
             alert("You need at least 1 credit to regenerate a page.");
             navigate('/subscription');
             return;
        }
        
        // Deduct
        deductCredits(1);
        
        setIsRegenerating(true);
        setShowRegenModal(false);
        
        try {
             const ai = await getAiClient();
             
             let finalPrompt = `Create a high-quality children's coloring page (line art only). 
                Theme: ${theme}. 
                Main Character Name: ${childName}.
                Description: ${regenPrompt || `A fun ${theme} scene for ${childName}`}.
                Style Requirements: clear bold black lines, pure white background, NO shading, NO grayscale, NO colors. 
                Ensure the image is simple enough for a child to color but detailed enough to be fun.`;

             const contentsParts: any[] = [];
             
             if (uploadedImage) {
                 finalPrompt += ` IMPORTANT: Use the provided reference image as the primary visual source for the character ${childName}. Maintain the character's key features in line art style.`;
                 const base64Data = uploadedImage.split(',')[1];
                 const mimeType = uploadedImage.split(';')[0].split(':')[1];
                 contentsParts.push({ text: finalPrompt });
                 contentsParts.push({ inlineData: { mimeType: mimeType, data: base64Data } });
             } else {
                 contentsParts.push({ text: finalPrompt });
             }

             const imgResponse = await ai.models.generateContent({
                model: 'gemini-3-pro-image-preview',
                contents: { parts: contentsParts },
                config: { imageConfig: { imageSize: "1K" } }
            });
            
            let newImage = currentImage; // fallback
            if (imgResponse.candidates?.[0]?.content?.parts) {
                for (const part of imgResponse.candidates[0].content.parts) {
                    if (part.inlineData && part.inlineData.data) {
                        const base64 = part.inlineData.data;
                        const mime = part.inlineData.mimeType || 'image/png';
                        newImage = `data:${mime};base64,${base64}`;
                        break;
                    }
                }
            }
            
            // Update Array
            const newImages = [...generatedImages];
            newImages[currentIndex] = newImage;
            setGeneratedImages(newImages);
            
        } catch(e) {
            console.error("Regeneration failed", e);
            alert("Oops, something went wrong regenerating the page.");
        } finally {
            setIsRegenerating(false);
            setRegenPrompt("");
        }
    };

    const handleExportClick = () => {
        if (!isPaidUser) {
            navigate('/subscription');
            return;
        }
        setShowPdfSettings(true);
    };

    const handleGeneratePdf = () => {
        setShowPdfSettings(false);
        setIsExporting(true);
        
        // Auto-save before export if not already saved
        if (!hasSaved) {
             saveBook({
                title: `${theme} Adventure`,
                theme: theme,
                imageUrl: generatedImages[0],
                pages: generatedImages
            });
            setHasSaved(true);
        }

        // Slight delay to allow UI to update
        setTimeout(() => {
            try {
                const doc = new jsPDF({
                    orientation: orientation,
                    unit: 'mm',
                    format: pageSize
                });
                
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                
                // Margin Logic
                let marginSize = 0;
                if (margin === 'small') marginSize = 10;
                if (margin === 'normal') marginSize = 20;

                // Add Title Page if requested
                if (includeTitlePage) {
                    doc.setFillColor(255, 255, 255);
                    doc.rect(0, 0, pageWidth, pageHeight, "F");

                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(32);
                    doc.setTextColor(70, 13, 242);
                    doc.text("DreamColor", pageWidth / 2, pageHeight / 3, { align: "center" });
                    
                    doc.setFontSize(18);
                    doc.setTextColor(0, 0, 0);
                    doc.text(`${theme} Adventure`, pageWidth / 2, pageHeight / 3 + 15, { align: "center" });
                    
                    doc.setFontSize(12);
                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(100, 100, 100);
                    doc.text(`Created for ${childName || 'You'}`, pageWidth / 2, pageHeight / 3 + 25, { align: "center" });
                    
                    doc.text(new Date().toLocaleDateString(), pageWidth / 2, pageHeight - 20, { align: "center" });
                    
                    doc.addPage();
                }

                // Loop through all images
                generatedImages.forEach((imgData, index) => {
                    if (index > 0) doc.addPage();

                    // Add Header
                    if (margin !== 'none') {
                        doc.setFont("helvetica", "bold");
                        doc.setFontSize(16);
                        doc.setTextColor(70, 13, 242); 
                        doc.text("DreamColor", pageWidth / 2, Math.max(12, marginSize), { align: "center" });
                    }
                    
                    // Add Image
                    const imgProps = doc.getImageProperties(imgData);
                    const imgRatio = imgProps.width / imgProps.height;
                    
                    const availableWidth = pageWidth - (marginSize * 2);
                    const availableHeight = pageHeight - (marginSize * 2) - (margin === 'none' ? 0 : 30); // reserve space for header/footer
                    
                    let printWidth = availableWidth;
                    let printHeight = printWidth / imgRatio;
                    
                    if (printHeight > availableHeight) {
                        printHeight = availableHeight;
                        printWidth = printHeight * imgRatio;
                    }
                    
                    const xPos = (pageWidth - printWidth) / 2;
                    const yPos = (pageHeight - printHeight) / 2 + (margin === 'none' ? 0 : 5); 
                    
                    doc.addImage(imgData, 'PNG', xPos, yPos, printWidth, printHeight);
                    
                    // Add Footer
                    if (showPageNumbers && margin !== 'none') {
                        doc.setFontSize(10);
                        doc.setTextColor(100);
                        doc.text(`Page ${index + 1}`, pageWidth / 2, pageHeight - Math.max(10, marginSize / 2), { align: "center" });
                    }
                });
                
                doc.save('dreamcolor-book.pdf');
                navigate('/pdf-ready');
            } catch (error) {
                console.error("PDF Export failed", error);
                setIsExporting(false);
            }
        }, 100);
    };

    const handleSaveToGallery = () => {
        if (!isPaidUser) {
            navigate('/subscription');
            return;
        }

        if (!hasSaved) {
            saveBook({
                title: `${theme} Adventure`,
                theme: theme,
                imageUrl: generatedImages[0], // Cover
                pages: generatedImages
            });
            setHasSaved(true);
        }
        navigate('/saved');
    };

    return (
        <ScreenWrapper>
            <TopBar title={isEditing ? "Edit Page" : "Preview Book"} backPath={isEditing ? undefined : undefined} />
            
            {/* Regen Modal */}
            {showRegenModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-6">
                     <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col gap-4 border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Remix Page {currentIndex + 1}</h3>
                            <button onClick={() => setShowRegenModal(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <p className="text-sm text-gray-500">What should this page look like instead?</p>
                        
                        <textarea 
                            value={regenPrompt}
                            onChange={(e) => setRegenPrompt(e.target.value)}
                            className="w-full h-24 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                            placeholder={`e.g. ${childName} flying on a ${theme} creature...`}
                        />
                        
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={handleRegeneratePage}
                                className="w-full h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary/90"
                            >
                                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                                Regenerate (1 Credit)
                            </button>
                             <button onClick={() => setShowRegenModal(false)} className="text-sm font-semibold text-gray-400 py-2">Cancel</button>
                        </div>
                     </div>
                </div>
            )}

            {/* Refill Modal */}
            {showRefillModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-6">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-center border border-slate-100 dark:border-slate-800">
                        <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                            <span className="material-symbols-outlined text-[32px]">celebration</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">You’ve reached the end of this adventure! 🎨</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            You have used all credits. {childName} has enough art for a whole gallery! Ready to start a brand new set?
                        </p>
                        <div className="flex flex-col gap-3 mt-4">
                            <button onClick={() => navigate('/subscription')} className="w-full bg-primary hover:bg-primary-hover text-white font-bold h-12 rounded-full shadow-lg">
                                Refill 30 Credits - $29.99
                            </button>
                            <button onClick={() => navigate('/subscription')} className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold h-12 rounded-full hover:bg-slate-200">
                                Grab a Single Adventure - $2.99
                            </button>
                            <button onClick={() => setShowRefillModal(false)} className="text-xs text-gray-400 font-bold hover:text-gray-600 mt-2">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Edit Mode Header Overlay override */}
            {isEditing && (
                 <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-white dark:bg-background-dark shadow-sm">
                    <button onClick={() => setIsEditing(false)} className="text-red-500 font-bold text-sm">Cancel</button>
                    <h2 className="font-bold">Adjust Page {currentIndex + 1}</h2>
                    <button onClick={applyEdits} className="text-primary font-bold text-sm">Save</button>
                 </div>
            )}
            
            {/* PDF Settings Modal */}
            {showPdfSettings && (
                <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col gap-6 border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">PDF Settings</h3>
                            <button onClick={() => setShowPdfSettings(false)} className="size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Layout Section */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">dashboard</span>
                                    Layout
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => setPageSize('a4')}
                                        className={`py-3 rounded-xl border-2 font-bold text-sm transition-all relative overflow-hidden ${pageSize === 'a4' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                                    >
                                        A4
                                        {pageSize === 'a4' && <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-bl-lg"></div>}
                                    </button>
                                    <button 
                                        onClick={() => setPageSize('letter')}
                                        className={`py-3 rounded-xl border-2 font-bold text-sm transition-all relative overflow-hidden ${pageSize === 'letter' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                                    >
                                        Letter
                                        {pageSize === 'letter' && <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-bl-lg"></div>}
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => setOrientation('portrait')}
                                        className={`py-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 relative overflow-hidden ${orientation === 'portrait' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                                    >
                                        <span className="material-symbols-outlined text-lg">crop_portrait</span>
                                        Portrait
                                        {orientation === 'portrait' && <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-bl-lg"></div>}
                                    </button>
                                    <button 
                                        onClick={() => setOrientation('landscape')}
                                        className={`py-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 relative overflow-hidden ${orientation === 'landscape' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                                    >
                                        <span className="material-symbols-outlined text-lg">crop_landscape</span>
                                        Landscape
                                        {orientation === 'landscape' && <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-bl-lg"></div>}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Options Section */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">tune</span>
                                    Options
                                </label>
                                
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Margins</span>
                                    <div className="flex bg-white dark:bg-surface-dark rounded-lg p-1 shadow-sm border border-slate-200 dark:border-slate-700">
                                        {['none', 'small', 'normal'].map((m) => (
                                            <button 
                                                key={m}
                                                onClick={() => setMargin(m as any)}
                                                className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${margin === m ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[18px]">title</span>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Title Page</span>
                                    </div>
                                    <button 
                                        onClick={() => setIncludeTitlePage(!includeTitlePage)}
                                        className={`w-12 h-7 rounded-full transition-colors relative ${includeTitlePage ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                                    >
                                        <div className={`absolute top-1 left-1 size-5 bg-white rounded-full shadow-sm transition-transform ${includeTitlePage ? 'translate-x-5' : ''}`}></div>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Page Numbers</span>
                                    </div>
                                    <button 
                                        onClick={() => setShowPageNumbers(!showPageNumbers)}
                                        className={`w-12 h-7 rounded-full transition-colors relative ${showPageNumbers ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                                    >
                                        <div className={`absolute top-1 left-1 size-5 bg-white rounded-full shadow-sm transition-transform ${showPageNumbers ? 'translate-x-5' : ''}`}></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleGeneratePdf}
                            className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-bold h-14 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all mt-2"
                        >
                            <span className="material-symbols-outlined">download</span>
                            Download Book PDF
                        </button>
                    </div>
                </div>
            )}

            <main className="flex-1 flex flex-col items-center w-full overflow-y-auto">
                {!isEditing && (
                    <div className="w-full px-6 pt-4 pb-2 text-center">
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">Your Coloring Book</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Page {currentIndex + 1} of {generatedImages.length}</p>
                    </div>
                )}

                <div className={`w-full mt-4 flex flex-col items-center justify-center ${isEditing ? 'py-10' : ''}`}>
                     <div className="relative w-[80vw] max-w-[360px] aspect-[3/4] bg-white rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden group">
                         {/* Navigation Arrows */}
                         {!isEditing && generatedImages.length > 1 && (
                             <>
                                <button 
                                    onClick={() => setCurrentIndex(prev => (prev - 1 + generatedImages.length) % generatedImages.length)}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 z-10 transition-colors"
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button 
                                    onClick={() => setCurrentIndex(prev => (prev + 1) % generatedImages.length)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 z-10 transition-colors"
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                             </>
                         )}

                         {/* Image */}
                         {isRegenerating ? (
                             <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                 <div className="flex flex-col items-center gap-3">
                                    <div className="size-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                                    <p className="text-xs font-bold text-gray-500">Painting...</p>
                                 </div>
                             </div>
                         ) : (
                            <img 
                                src={currentImage} 
                                alt={`Generated coloring page ${currentIndex + 1}`} 
                                className="w-full h-full object-contain transition-all duration-200"
                                style={{
                                    filter: isEditing ? `brightness(${brightness}%) contrast(${contrast}%)` : 'none',
                                    transform: isEditing ? `rotate(${rotation}deg)` : 'none'
                                }}
                            />
                         )}
                    </div>
                    
                    {/* Dots indicator */}
                    {!isEditing && generatedImages.length > 1 && (
                        <div className="flex gap-2 mt-4">
                            {generatedImages.map((_, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`size-2 rounded-full transition-all ${idx === currentIndex ? 'bg-primary w-4' : 'bg-slate-300 dark:bg-slate-700'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Edit Controls */}
                {isEditing && (
                    <div className="w-full px-8 py-6 flex flex-col gap-6 bg-white dark:bg-surface-dark mt-auto rounded-t-3xl shadow-lg border-t border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between">
                                <span className="text-xs font-bold text-gray-500 uppercase">Brightness</span>
                                <span className="text-xs font-bold text-primary">{brightness}%</span>
                            </div>
                            <input 
                                type="range" min="50" max="150" value={brightness} 
                                onChange={(e) => setBrightness(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between">
                                <span className="text-xs font-bold text-gray-500 uppercase">Contrast</span>
                                <span className="text-xs font-bold text-primary">{contrast}%</span>
                            </div>
                            <input 
                                type="range" min="50" max="150" value={contrast} 
                                onChange={(e) => setContrast(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                        <div className="flex justify-center pt-2">
                            <button 
                                onClick={() => setRotation(r => (r + 90) % 360)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full font-bold text-sm text-slate-700 dark:text-slate-200 hover:bg-gray-200"
                            >
                                <span className="material-symbols-outlined">rotate_right</span>
                                Rotate
                            </button>
                        </div>
                    </div>
                )}

                {!isEditing && (
                    <>
                        <div className="flex-1"></div>
                        <div className="w-full max-w-md px-6 flex flex-col gap-3 pb-8 mt-6">
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1 h-12 flex items-center justify-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 text-slate-700 dark:text-white font-bold hover:bg-gray-200 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">tune</span>
                                    Adjust Page
                                </button>
                                <button onClick={() => {
                                    setRegenPrompt("");
                                    setShowRegenModal(true);
                                }} className="flex-1 h-12 flex items-center justify-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 text-slate-700 dark:text-white font-bold hover:bg-gray-200 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">refresh</span>
                                    Regenerate
                                </button>
                            </div>
                            
                            <button 
                                onClick={handleExportClick}
                                disabled={isExporting}
                                className={`group flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full h-14 px-6 bg-primary shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:bg-indigo-600 transition-all active:scale-95 disabled:bg-gray-400 ${!isPaidUser ? 'opacity-90' : ''}`}
                            >
                                <span className="material-symbols-outlined text-white" style={{fontSize: '24px'}}>picture_as_pdf</span>
                                <span className="text-white text-lg font-bold leading-normal tracking-wide">
                                    {isExporting ? 'Creating Book PDF...' : isPaidUser ? 'Export Book PDF' : 'Unlock to Export PDF'}
                                </span>
                                {!isPaidUser && <span className="material-symbols-outlined text-white text-[18px]">lock</span>}
                            </button>
                            <button 
                                onClick={handleSaveToGallery}
                                className="group flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full h-14 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
                            >
                                <span className="material-symbols-outlined text-primary" style={{fontSize: '24px'}}>photo_library</span>
                                <span className="text-base font-bold leading-normal tracking-wide">
                                    {hasSaved ? 'Saved!' : isPaidUser ? 'Save to Gallery' : 'Unlock to Save'}
                                </span>
                                {!isPaidUser && <span className="material-symbols-outlined text-slate-400 text-[18px]">lock</span>}
                            </button>
                        </div>
                    </>
                )}
            </main>
            {!isEditing && <BottomNav />}
        </ScreenWrapper>
    )
}
