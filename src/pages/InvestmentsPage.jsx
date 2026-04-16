import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Sparkles, ArrowUpRight, ShieldCheck, Briefcase, Zap, Target } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const getRecommendations = (savings) => {
    const baseSavings = Math.max(0, savings);
    const sipAmount = Math.floor(baseSavings * 0.2); // 20% of net savings for SIP

    if (baseSavings < 50) {
        return {
            sipAmount,
            message: "Focus on building an emergency fund first. Start micro-investing with fractional shares.",
            stocks: [
                { symbol: 'VT', name: 'Vanguard Total World (Fractional)', type: 'ETF', risk: 'Low', return: '9.8%', reason: 'Buy fractional shares. Maximum global diversification for long-term safety.' },
                { symbol: 'SGOV', name: 'iShares 0-3 Month Treasury', type: 'Bond', risk: 'Very Low', return: '5.2%', reason: 'Safe parking spot for your emergency fund while earning yield.' }
            ]
        };
    } else if (baseSavings < 300) {
        return {
            sipAmount,
            message: "Great baseline! Set up a monthly SIP to automate your wealth building.",
            stocks: [
                { symbol: 'VOO', name: 'Vanguard S&P 500', type: 'ETF', risk: 'Moderate', return: '12.4%', reason: 'Core portfolio component. Perfect for consistent SIP contributions.' },
                { symbol: 'SCHD', name: 'Schwab Dividend ETF', type: 'Dividend', risk: 'Low', return: '11.2%', reason: 'Focus on quality companies paying consistent dividends for passive income.' },
                { symbol: 'QQQM', name: 'Invesco NASDAQ 100', type: 'ETF', risk: 'High', return: '16.5%', reason: 'High growth potential focusing on the top 100 non-financial tech companies.' }
            ]
        };
    } else {
        return {
            sipAmount,
            message: "Solid capital available. Diversify between ETFs and high-growth blue-chip tech.",
            stocks: [
                { symbol: 'VOO', name: 'Vanguard S&P 500', type: 'ETF', risk: 'Moderate', return: '12.4%', reason: 'Perfect building block for portfolios. Diversified across top 500 companies.' },
                { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock', risk: 'Moderate', return: '18.2%', reason: 'Strong consumer brand with massive cash reserves and consistent buybacks.' },
                { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'Stock', risk: 'Moderate', return: '15.5%', reason: 'AI industry leader with immensely stable enterprise revenue streams.' },
                { symbol: 'NVDA', name: 'Nvidia Corp', type: 'Stock', risk: 'High', return: '42.1%', reason: 'Aggressive growth play leveraging the ongoing AI hardware supercycle.' }
            ]
        };
    }
};

const InvestmentsPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { netSavings } = useFinance();
    const strategy = getRecommendations(netSavings);

    return (
        <div className="flex h-screen h-[100dvh] overflow-hidden bg-cf-bg">
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>
            
            <div className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300`}>
                <Sidebar closeSidebar={() => setSidebarOpen(false)} />
            </div>

            <main className="flex-1 flex flex-col h-screen h-[100dvh] overflow-y-auto w-full min-w-0">
                <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                
                <div className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto w-full">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-10 gap-4 sm:gap-6"
                    >
                        <div>
                            <h1 className="text-display-md text-cf-on-surface mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
                                <TrendingUp className="text-cf-primary shrink-0" size={24} />
                                Student Portfolio
                            </h1>
                            <p className="text-cf-on-muted text-xs sm:text-sm max-w-xl">
                                AI-powered investment signals tailored for your current savings capital.
                            </p>
                        </div>
                        <div className="glass px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-emerald-500/20 shadow-glow-primary w-full sm:w-auto">
                            <p className="text-xs text-cf-on-muted uppercase tracking-widest mb-1 italic">Vetted for Entry</p>
                            <h3 className="text-xl sm:text-2xl font-display font-black text-cf-primary">₹{(netSavings > 0 ? netSavings : 0).toLocaleString()} <span className="text-xs sm:text-sm font-normal text-cf-on-muted">Available Capital</span></h3>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
                        <section className="lg:col-span-2 space-y-4 sm:space-y-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                                <h3 className="font-display text-lg sm:text-xl font-bold text-cf-on-surface flex items-center gap-2">
                                    <Sparkles className="text-cf-secondary" size={20} />
                                    AI Optimized Asset Signals
                                </h3>
                                <div className="text-xs text-cf-on-muted bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    Personalized
                                </div>
                            </div>
                            
                            <p className="text-cf-on-muted text-xs sm:text-sm italic border-l-2 border-cf-secondary pl-3 ml-2">
                                {strategy.message}
                            </p>

                            <div className="space-y-3 sm:space-y-4 pt-2">
                                {strategy.stocks.map((stock, i) => (
                                    <motion.div 
                                        key={stock.symbol}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="glass p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] hover:bg-white/5 transition-all duration-300 group cursor-pointer border-white/5 relative overflow-hidden"
                                    >
                                        <div className="flex justify-between items-center relative z-10 gap-3">
                                            <div className="flex gap-3 sm:gap-4 items-center min-w-0">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cf-primary/10 flex items-center justify-center text-cf-primary font-bold text-base sm:text-lg border border-cf-primary/20 shrink-0">
                                                    {stock.symbol[0]}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-cf-on-surface text-base sm:text-lg group-hover:text-cf-primary transition-colors">{stock.symbol}</h4>
                                                    <p className="text-[10px] sm:text-xs text-cf-on-muted truncate">{stock.name} • <span className="uppercase">{stock.type}</span></p>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-cf-primary font-black text-base sm:text-lg flex items-center gap-1 justify-end">
                                                    {stock.return} <ArrowUpRight size={16} />
                                                </p>
                                                <p className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded mt-1 inline-block ${stock.risk === 'Low' || stock.risk === 'Very Low' ? 'bg-emerald-500/10 text-emerald-500' : stock.risk === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-cf-secondary/10 text-cf-secondary'}`}>
                                                    {stock.risk} Risk
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                                            <p className="text-xs sm:text-sm text-cf-on-muted leading-relaxed">
                                                {stock.reason}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        <aside className="space-y-4 sm:space-y-6">
                            <h3 className="font-display text-lg sm:text-xl font-bold text-cf-on-surface flex items-center gap-2 mb-2 sm:mb-4">
                                <ShieldCheck className="text-cf-tertiary" size={20} />
                                Strategy Vault
                            </h3>
                            
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                className="glass p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] border-cf-primary/20 shadow-glow-primary relative overflow-hidden"
                            >
                                <div className="absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 bg-cf-primary/20 rounded-full blur-[40px]"></div>
                                <div className="p-2.5 sm:p-3 bg-cf-primary/10 rounded-xl sm:rounded-2xl text-cf-primary inline-flex mb-3 sm:mb-4 border border-cf-primary/20 relative z-10">
                                    <Target size={20} />
                                </div>
                                <h4 className="font-bold text-cf-on-surface mb-1 sm:mb-2 relative z-10">Suggested Monthly SIP</h4>
                                <div className="flex items-baseline gap-2 mb-1 sm:mb-2 relative z-10 flex-wrap">
                                    <span className="text-2xl sm:text-3xl font-black text-cf-on-surface">₹{strategy.sipAmount}</span>
                                    <span className="text-xs font-bold text-cf-primary uppercase tracking-wider">/ month</span>
                                </div>
                                <p className="text-[10px] sm:text-xs text-cf-on-muted leading-relaxed relative z-10">
                                    Based on your current net savings (₹{Math.max(0, netSavings).toLocaleString()}), we recommend allocating 20% to an automated systematic investment plan (SIP).
                                </p>
                            </motion.div>

                            <div className="glass p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] border-cf-tertiary/10">
                                <div className="p-2.5 sm:p-3 bg-cf-tertiary/10 rounded-xl sm:rounded-2xl text-cf-tertiary inline-flex mb-3 sm:mb-4">
                                    <Zap size={20} />
                                </div>
                                <h4 className="font-bold text-cf-on-surface mb-1 sm:mb-2">The 50/30/20 Framework</h4>
                                <p className="text-[10px] sm:text-xs text-cf-on-muted leading-relaxed">
                                    Recommended for students: 50% Essentials, 30% Lifestyle, and 20% future capital building.
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InvestmentsPage;
