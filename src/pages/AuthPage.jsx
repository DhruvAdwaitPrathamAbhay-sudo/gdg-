import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, AlertCircle } from 'lucide-react';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
            }
            navigate('/');
        } catch (err) {
            console.error("Auth error:", err);
            setError((err?.message || 'Authentication failed').trim());
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen min-h-[100dvh] bg-cf-bg flex items-center justify-center p-4">
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-cf-primary/10 blur-[120px] mix-blend-screen" />
                <div className="absolute top-[60%] -right-[10%] w-[30%] h-[30%] rounded-full bg-cf-secondary/10 blur-[100px] mix-blend-screen" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10 glass p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] border border-white/5 shadow-2xl"
            >
                <div className="flex flex-col items-center mb-6 sm:mb-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-cf-primary/20 flex items-center justify-center mb-3 sm:mb-4 shadow-glow-primary border border-cf-primary/30">
                        <Shield className="text-cf-primary w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-display font-black text-cf-on-surface">Secure Access Portal</h2>
                    <p className="text-xs sm:text-sm text-cf-on-muted mt-1 sm:mt-2 text-center">Authenticate to encrypt your financial metrics.</p>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-cf-error/10 border border-cf-error/20 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 flex items-start gap-3">
                        <AlertCircle className="text-cf-error w-5 h-5 shrink-0 mt-0.5" />
                        <p className="text-xs sm:text-sm text-cf-error">{error}</p>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="text-[10px] uppercase font-black text-cf-on-muted tracking-widest pl-1">Ident Protocol (Email)</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="text-cf-on-muted w-4 h-4" />
                            </div>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-cf-on-surface focus:outline-none focus:border-cf-primary/50 focus:ring-1 focus:ring-cf-primary/50 transition-all text-sm min-h-[44px]"
                                placeholder="student@university.edu"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-black text-cf-on-muted tracking-widest pl-1">Cryptographic Key (Password)</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="text-cf-on-muted w-4 h-4" />
                            </div>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-cf-on-surface focus:outline-none focus:border-cf-primary/50 focus:ring-1 focus:ring-cf-primary/50 transition-all text-sm min-h-[44px]"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        type="submit" 
                        className={`w-full btn-primary py-3 flex items-center justify-center mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Authenticating...' : (isLogin ? 'Log In' : 'Sign Up')}
                    </button>
                </form>

                <div className="mt-6 sm:mt-8 text-center">
                    <button 
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="text-xs sm:text-sm font-medium text-cf-primary hover:text-white transition-colors"
                    >
                        {isLogin ? "New user? Sign up here." : "Already have an account? Log in here."}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
