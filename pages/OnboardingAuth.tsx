import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenWrapper } from '../components/Layout';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ScreenWrapper className="justify-between">
      <div className="flex items-center p-4 pt-6 justify-end">
        <button onClick={() => navigate('/register')} className="flex items-center justify-center px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <p className="text-[#6b608a] dark:text-[#9e94b8] text-base font-bold leading-normal tracking-[0.015em]">Skip</p>
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 pb-6">
        <div className="@container w-full mb-8">
          <div className="relative w-full aspect-[4/5] max-h-[400px] bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-lg border border-[#dedbe6] dark:border-[#2a2638]">
            <div className="absolute inset-0 bg-center bg-no-repeat bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBrg0IdBpBxYcTZ9eiFf_Mm5CxSHqfyUKEUe0eJ74RW0bn_G0d0rgaNhVWQA-sPmHIKWPZLGdRqTnfNECQpQUowYB78IZj2edNS9V-d52DTcbxC2M2yUPTREwXfIGYd1ZD9LpB67I7wj077HQjEZSOZo38orh6RPHZViycJ9WONgrXqm-GOVXDbbpO8ZPC4JkCQXS81zW5j2_Vtj9MBNxdyCxrkB2pturiESx6wDAbHWlbpBTlRY36zUEeXSt3eQULAKMIRWbTj_j4")' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 dark:bg-[#141022]/90 p-3 rounded-full shadow-lg backdrop-blur-sm border border-primary/20">
                <span className="material-symbols-outlined text-primary text-3xl">auto_fix_high</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center text-center space-y-3">
          <h1 className="font-comic text-[#131118] dark:text-white text-[36px] font-bold leading-tight tracking-tight">
            Spark Creativity <br/> with AI
          </h1>
          <p className="text-[#6b608a] dark:text-[#b0a8c2] text-lg font-normal leading-relaxed max-w-[320px]">
            Instantly turn your favorite photos into endless coloring fun.
          </p>
        </div>
      </div>

      <div className="w-full px-6 pb-10 pt-4">
        <div className="flex w-full flex-row items-center justify-center gap-3 mb-8">
          <div className="h-2.5 w-8 rounded-full bg-primary transition-all duration-300"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-[#dedbe6] dark:bg-[#3b3649]"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-[#dedbe6] dark:bg-[#3b3649]"></div>
        </div>
        <button onClick={() => navigate('/register')} className="w-full h-14 bg-primary rounded-full flex items-center justify-center gap-2 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
          <span className="text-white text-lg font-bold font-display tracking-wide">Let's Paint!</span>
          <span className="material-symbols-outlined text-white text-xl">palette</span>
        </button>
      </div>
    </ScreenWrapper>
  );
};

export const Register: React.FC = () => {
  const navigate = useNavigate();
  return (
    <ScreenWrapper className="bg-white dark:bg-slate-900 sm:my-8 sm:min-h-[calc(100vh-4rem)] sm:rounded-[3rem]">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent rounded-t-[3rem] pointer-events-none"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <header className="relative z-10 flex flex-col items-center pt-10 px-6 pb-2">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 shadow-inner rotate-3 transition-transform hover:rotate-0 duration-500">
          <span className="material-symbols-outlined text-primary text-[40px]">palette</span>
        </div>
        <h1 className="text-slate-900 dark:text-white text-[32px] font-extrabold leading-tight text-center tracking-tight">
            Let's get creative!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-normal pt-3 text-center max-w-[280px]">
            Sign up to turn your photos into magical coloring pages.
        </p>
      </header>

      <main className="relative z-10 flex flex-col gap-4 px-6 py-4 flex-1">
        <div className="relative flex items-center">
            <input className="peer w-full h-14 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 border-2 border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-slate-900 rounded-full px-5 pl-12 text-base font-medium outline-none transition-all duration-200" placeholder="Choose a username" type="text" />
            <div className="absolute left-4 text-slate-400 peer-focus:text-primary transition-colors">
                <span className="material-symbols-outlined text-[22px]">person</span>
            </div>
        </div>
        <div className="relative flex items-center">
            <input className="peer w-full h-14 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 border-2 border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-slate-900 rounded-full px-5 pl-12 text-base font-medium outline-none transition-all duration-200" placeholder="Enter your email" type="email" />
            <div className="absolute left-4 text-slate-400 peer-focus:text-primary transition-colors">
                <span className="material-symbols-outlined text-[22px]">mail</span>
            </div>
        </div>
        <div className="relative flex items-center">
            <input className="peer w-full h-14 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 border-2 border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-slate-900 rounded-full px-5 pl-12 pr-12 text-base font-medium outline-none transition-all duration-200" placeholder="Create a password" type="password" />
            <div className="absolute left-4 text-slate-400 peer-focus:text-primary transition-colors">
                <span className="material-symbols-outlined text-[22px]">lock</span>
            </div>
            <button className="absolute right-4 text-slate-400 hover:text-primary transition-colors" type="button">
                <span className="material-symbols-outlined text-[22px]">visibility_off</span>
            </button>
        </div>

        <button onClick={() => navigate('/billing')} className="w-full h-14 mt-4 bg-primary hover:bg-indigo-700 active:scale-[0.98] text-white rounded-full text-lg font-bold shadow-lg shadow-indigo-500/30 transition-all duration-200 flex items-center justify-center gap-2">
            Create Account
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>

        <div className="relative flex items-center gap-4 py-4">
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700"></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700"></div>
        </div>

        <div className="flex flex-col gap-3">
            <button className="w-full h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.99] text-slate-900 dark:text-white rounded-full text-base font-semibold transition-all duration-200 flex items-center justify-center gap-3 relative overflow-hidden group">
               <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">G</div>
               Continue with Google
            </button>
            <button className="w-full h-14 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.99] text-white dark:text-slate-900 rounded-full text-base font-semibold transition-all duration-200 flex items-center justify-center gap-3">
                <span className="material-symbols-outlined text-[24px]">ios</span>
                Continue with Apple
            </button>
        </div>
      </main>

      <footer className="p-6 text-center">
        <p className="text-slate-500 dark:text-slate-400 font-medium">
            Already have an account? 
            <button onClick={() => navigate('/home')} className="text-primary hover:text-indigo-600 font-bold ml-1 hover:underline decoration-2 underline-offset-4">Log in</button>
        </p>
        <button onClick={() => navigate('/forgot-password')} className="text-xs text-slate-400 mt-2 hover:underline">Forgot Password?</button>
      </footer>
      <div className="h-6 w-full"></div>
    </ScreenWrapper>
  );
};

export const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    return (
        <ScreenWrapper className="bg-white dark:bg-background-dark">
             <div className="flex items-center p-4 justify-between sticky top-0 z-10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm">
                <button onClick={() => navigate(-1)} className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors group">
                <span className="material-symbols-outlined text-[#131118] dark:text-white transition-transform group-hover:-translate-x-1" style={{fontSize: '24px'}}>arrow_back</span>
                </button>
            </div>
            <div className="flex flex-col items-center justify-center px-4 py-6">
                <div className="relative size-40 flex items-center justify-center rounded-full bg-primary/5 dark:bg-primary/20 mb-4">
                <div className="w-full h-full bg-center bg-no-repeat bg-contain transform scale-75" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDluBVu1EpWIlOUPF3h3-zLk0TzcdDqSJzURzO6fPh8ChTBfsxYmjG_qyh7zeQFR3QqDMSdwDpMZ7O272nZE1OULV6LONsJghmnm0-2NruFOqhhJeRjq5yAc2qmJ00TbkCODLYM4e82WRbVVDuwDDi6Ln1nN9RYNrvTl-ldrQU0pWbZrcJGEtdTO0l9s2rHVbTqIXUe2LXycLs5Pau449E3RAdEtVskrXWG1pKUTf_tnmIGufwUKrNPyBTB9rXQV4eB_Cp2weDVoxk")'}}></div>
                </div>
            </div>
            <div className="flex flex-col px-6 text-center">
                <h1 className="text-[#131118] dark:text-white tracking-tight text-3xl font-bold leading-tight pb-3">Forgot Password?</h1>
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-relaxed">
                    Don't worry! It happens. Please enter the email address linked to your account.
                </p>
            </div>
            <div className="flex flex-col px-6 py-8 gap-6 w-full">
                <label className="flex flex-col w-full group">
                    <p className="text-[#131118] dark:text-gray-200 text-sm font-semibold leading-normal pb-2 ml-2">Email Address</p>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400" style={{fontSize: '20px'}}>mail</span>
                        </div>
                        <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-[#131118] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 pl-11 pr-4 text-base font-medium leading-normal transition-all" placeholder="parent@example.com" type="email" />
                    </div>
                </label>
                <button className="flex w-full items-center justify-center rounded-full bg-primary h-14 px-4 text-white font-bold text-lg hover:bg-primary/90 active:scale-[0.98] transition-all shadow-soft shadow-primary/30">
                    Send Reset Link
                </button>
                <div className="flex flex-col items-center gap-6 mt-2">
                    <button onClick={() => navigate('/register')} className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                        Remember it? <span className="text-primary font-bold ml-1">Log In</span>
                    </button>
                    <button className="inline-flex items-center justify-center gap-1 text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        Still having trouble? Contact Support
                    </button>
                </div>
            </div>
        </ScreenWrapper>
    )
}

export const Billing: React.FC = () => {
  const navigate = useNavigate();
  return (
    <ScreenWrapper>
      <div className="flex items-center px-6 py-4 justify-between sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="text-[#131118] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="text-[#131118] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10 font-comic">Account Setup</h2>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pb-24">
        <div className="w-full mt-6 mb-2 flex justify-center">
            <div className="relative w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
                <span className="material-symbols-outlined text-primary text-[48px]">check_circle</span>
            </div>
        </div>

        <h2 className="text-[#131118] dark:text-white tracking-tight text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-4 font-comic">
            All Set!
        </h2>
        <p className="text-[#6b608a] dark:text-gray-400 text-base font-normal leading-relaxed pb-8 px-2 text-center">
            Your creative studio is ready. Let's start transforming your ideas into art.
        </p>

        <div className="mt-4 bg-surface-light dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 w-full">
            <div className="flex items-center gap-4 mb-4">
                <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                    <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">AI Tools Ready</h3>
                    <p className="text-xs text-slate-500">Powered by Gemini</p>
                </div>
                <span className="material-symbols-outlined text-green-500">check</span>
            </div>
             <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <span className="material-symbols-outlined">cloud_done</span>
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">Storage Secured</h3>
                    <p className="text-xs text-slate-500">Private Gallery</p>
                </div>
                <span className="material-symbols-outlined text-green-500">check</span>
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light dark:via-background-dark to-transparent max-w-md mx-auto">
        <button onClick={() => navigate('/home')} className="w-full bg-primary hover:bg-primary-hover text-white text-lg font-bold font-comic h-14 rounded-full shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
            <span>Start Creating</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </ScreenWrapper>
  );
};