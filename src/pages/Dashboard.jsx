import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useFinance } from '../context/FinanceContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BudgetCard from '../components/BudgetCard';
import ExpenseChart from '../components/ExpenseChart';
import { 
    Wallet, 
    CreditCard, 
    PiggyBank, 
    Plus, 
    X, 
    Trash2, 
    Filter, 
    ChevronRight,
    Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import confetti from 'canvas-confetti';

const NumberCounter = ({ value }) => {
    const { number } = useSpring({
        from: { number: 0 },
        number: value,
        delay: 200,
        config: { mass: 1, tension: 20, friction: 10 },
    });

    return <animated.span>{number.to(n => n.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    }))}</animated.span>;
};

const Dashboard = () => {
    const { 
        budget, 
        totalExpenses, 
        netSavings, 
        expenses, 
        addExpense, 
        deleteExpense,
        setBudget 
    } = useFinance();
    
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [timeframe, setTimeframe] = useState('monthly');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [savingsGoalPercent, setSavingsGoalPercent] = useState(() => {
        return Number(localStorage.getItem('savings_goal_percent')) || 20;
    });
    const [hasCelebrated, setHasCelebrated] = useState(false);
    
    // New Expense Form State
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
    });

    const categories = ['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Tuition', 'Books', 'Stationary', 'Other'];

    const savingsGoalAmount = budget > 0 ? (budget * (savingsGoalPercent / 100)) : 0;
    const savingsPercent = budget > 0 ? ((netSavings / budget) * 100) : 0;
    const progressWidth = Math.min(Math.max((netSavings / savingsGoalAmount) * 100, 0), 100);

    // Mouse parallax for orbs — disabled on mobile (touch)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window);
    
    useEffect(() => {
        if (isTouchDevice) return; // Skip parallax on mobile
        const handleMouseMove = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 40,
                y: (e.clientY / window.innerHeight - 0.5) * 40
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isTouchDevice]);

    // Confetti trigger
    useEffect(() => {
        if (netSavings >= savingsGoalAmount && savingsGoalAmount > 0 && !hasCelebrated) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff9800', '#ff5722', '#ff7043']
            });

            setHasCelebrated(true);
        }
    }, [netSavings, savingsGoalAmount, hasCelebrated]);

    const handleAddExpense = (e) => {
        e.preventDefault();
        if (!newExpense.description || !newExpense.amount) return;
        addExpense({
            ...newExpense,
            amount: Number(newExpense.amount)
        });
        setIsAddModalOpen(false);
        setNewExpense({
            description: '',
            amount: '',
            category: 'Food',
            date: new Date().toISOString().split('T')[0]
        });
    };

    const handleGoalUpdate = (e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            const val = Number(e.target.value);
            if (!isNaN(val) && val > 0) {
                setSavingsGoalPercent(val);
                localStorage.setItem('savings_goal_percent', val.toString());
            }
            setIsEditingGoal(false);
        }
    };

    const filteredExpenses = useMemo(() => {
        const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
        if (selectedCategory) {
            return sorted.filter(e => e.category === selectedCategory);
        }
        return sorted;
    }, [expenses, selectedCategory]);

    const latestTransactions = filteredExpenses.slice(0, 5);

    return (
        <div className="flex h-screen h-[100dvh] overflow-hidden bg-cf-bg relative">
            {/* Ambient Parallax Background Orbs */}
            {!isTouchDevice && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden sm:block">
                    <motion.div 
                        animate={{ x: mousePos.x, y: mousePos.y }}
                        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-cf-secondary/10 rounded-full blur-[140px]"
                    ></motion.div>
                    <motion.div 
                        animate={{ x: -mousePos.x, y: -mousePos.y }}
                        className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] bg-cf-primary/10 rounded-full blur-[120px]"
                    ></motion.div>
                    <motion.div 
                        animate={{ x: mousePos.x * 0.5, y: -mousePos.y * 1.5 }}
                        className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] bg-cf-tertiary/5 rounded-full blur-[100px]"
                    ></motion.div>
                </div>
            )}

            {/* Mobile Sidebar overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>
            
            <div className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-500 ease-out`}>
                <Sidebar closeSidebar={() => setSidebarOpen(false)} />
            </div>

            <main className="flex-1 flex flex-col h-screen h-[100dvh] overflow-hidden relative z-10 min-w-0">
                <Navbar toggleSidebar={() => setSidebarOpen(true)} />
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10 gap-3 sm:gap-4"
                        >
                            <div>
                                <h1 className="text-display-md text-cf-on-surface leading-tight">Console Ledger</h1>
                                <p className="text-cf-on-muted mt-1 sm:mt-2 text-xs sm:text-sm flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-cf-primary animate-pulse"></span>
                                    Mainframe sync: Stable
                                </p>
                            </div>

                            
                            <div className="flex items-center gap-3">
                                <div className="bg-cf-surface-high/50 backdrop-blur-xl border border-white/10 p-1 rounded-xl sm:rounded-2xl flex items-center gap-1">
                                    <button 
                                        onClick={() => setTimeframe('monthly')}
                                        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-lg sm:rounded-xl transition-all ${timeframe === 'monthly' ? 'bg-cf-primary/10 text-cf-primary border border-cf-primary/20' : 'text-cf-on-muted hover:text-cf-on-surface'}`}
                                    >
                                        Monthly
                                    </button>
                                    <button 
                                        onClick={() => setTimeframe('yearly')}
                                        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-lg sm:rounded-xl transition-all ${timeframe === 'yearly' ? 'bg-cf-primary/10 text-cf-primary border border-cf-primary/20' : 'text-cf-on-muted hover:text-cf-on-surface'}`}
                                    >
                                        Yearly
                                    </button>
                                </div>
                            </div>

                        </motion.div>

                        {/* Top Perspective Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
                            {[
                                { title: timeframe === 'yearly' ? 'Annual Budget' : 'Monthly Budget', amount: budget * (timeframe === 'yearly' ? 12 : 1), icon: <Wallet className="text-cf-primary" size={20} />, color: 'primary' },
                                { title: timeframe === 'yearly' ? 'Annual Spending' : 'Spending', amount: totalExpenses * (timeframe === 'yearly' ? 12 : 1), icon: <CreditCard className="text-cf-secondary" size={20} />, color: 'secondary' },
                                { title: timeframe === 'yearly' ? 'Annual Net Savings' : 'Net Space', amount: netSavings * (timeframe === 'yearly' ? 12 : 1), icon: <PiggyBank className="text-cf-tertiary" size={20} />, color: 'tertiary', accent: true }
                            ].map((card, i) => (

                                <motion.div
                                    key={card.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    className={`relative group h-32 sm:h-40 overflow-hidden p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] glass flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 ${
                                        card.accent ? 'bg-cf-tertiary/5' : ''
                                    }`}
                                >

                                    <div className="absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 rounded-full blur-[50px] opacity-20 transition-all duration-500 group-hover:opacity-40" style={{ backgroundColor: `var(--cf-${card.color})` }}></div>
                                    <div className="flex justify-between items-start relative z-10">
                                        <p className="text-label-sm text-cf-on-muted tracking-widest">{card.title}</p>
                                        <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/5 border border-white/10">{card.icon}</div>
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="text-2xl sm:text-4xl font-display font-black text-cf-on-surface tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                            ₹<NumberCounter value={card.amount} />
                                        </h3>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                            {/* Visual Analytics */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="lg:col-span-8 glass p-5 sm:p-10 rounded-2xl sm:rounded-[2.5rem] group transition-all duration-500 shadow-glass overflow-hidden relative"
                            >

                                <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-cf-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 relative z-10 gap-3">
                                    <h3 className="font-display text-lg sm:text-2xl font-bold text-cf-on-surface">Category Distribution</h3>
                                    {selectedCategory && (
                                        <motion.button 
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            onClick={() => setSelectedCategory(null)}
                                            className="px-4 py-1.5 bg-cf-error/10 text-cf-error border border-cf-error/20 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-cf-error/20 transition-colors"
                                        >
                                            <X size={14} /> Clear Filter
                                        </motion.button>
                                    )}
                                </div>
                                <ExpenseChart expenses={expenses} onCategoryClick={setSelectedCategory} />
                            </motion.div>

                            {/* Savings & Goals */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="lg:col-span-4 flex flex-col gap-6 sm:gap-8 h-full"
                            >
                                <div className="bg-cf-gradient-secondary rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 text-white relative overflow-hidden shadow-glass group flex-1">
                                    <div className="absolute top-0 right-0 w-28 sm:w-40 h-28 sm:h-40 bg-white/20 rounded-full blur-[60px] group-hover:scale-125 transition-transform duration-700"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                            <div className="p-2 sm:p-3 bg-white/20 rounded-xl sm:rounded-2xl border border-white/20">
                                                <Target size={20} />
                                            </div>
                                            <h3 className="font-display text-base sm:text-xl font-bold italic">Accumulation Index</h3>
                                        </div>

                                        
                                        <div className="mb-6 sm:mb-10">
                                            <p className="text-white/70 text-xs sm:text-sm mb-1 uppercase tracking-widest font-bold">Target Achievement</p>
                                            <div className="flex items-baseline gap-2 flex-wrap">
                                                <h4 className="text-3xl sm:text-5xl font-display font-black tracking-tighter">
                                                    {Math.min(100, progressWidth).toFixed(0)}%
                                                </h4>
                                                {isEditingGoal ? (
                                                    <input 
                                                        autoFocus
                                                        type="number"
                                                        className="bg-transparent border-b-2 border-white/40 w-16 text-2xl sm:text-3xl font-black outline-none focus:border-white transition-colors"
                                                        defaultValue={savingsGoalPercent}
                                                        onKeyDown={handleGoalUpdate}
                                                        onBlur={handleGoalUpdate}
                                                    />
                                                ) : (
                                                    <span 
                                                        onClick={() => setIsEditingGoal(true)}
                                                        className="text-xs font-bold px-2 py-1 bg-white/20 rounded-lg cursor-pointer hover:bg-white/30 transition-colors border border-white/10"
                                                    >
                                                        Goal: {savingsGoalPercent}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="w-full bg-white/10 rounded-full h-6 sm:h-8 p-1 sm:p-1.5 border border-white/10 mb-4 sm:mb-6 backdrop-blur-md overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressWidth}%` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="h-full rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)] relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.5)_1px,transparent_0)] bg-[size:10px_10px]"></div>
                                            </motion.div>
                                        </div>
                                        
                                        <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
                                            {netSavings >= savingsGoalAmount 
                                                ? "Threshold exceeded! Your capital efficiency is peak." 
                                                : `Buffer required: ₹${(savingsGoalAmount - netSavings).toFixed(2)} to hit your target.`}
                                        </p>
                                    </div>
                                </div>

                                {/* Quick Transactions Card */}
                                <div className="glass p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] shadow-glass flex-1 flex flex-col">

                                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                                        <h3 className="font-display text-lg sm:text-xl font-bold text-cf-on-surface">Signals</h3>
                                        <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-cf-on-muted border border-white/5 font-bold uppercase tracking-widest">Recent 5</span>
                                    </div>
                                    <div className="flex flex-col gap-2 sm:gap-3 flex-1">
                                        {latestTransactions.length > 0 ? (
                                            latestTransactions.map((tx, i) => (
                                                <motion.div 
                                                    key={tx.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 * i }}
                                                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl flex justify-between items-center border transition-all duration-300 group hover:shadow-lg ${
                                                        selectedCategory === tx.category 
                                                            ? 'bg-cf-primary/10 border-cf-primary/30' 
                                                            : 'bg-white/5 border-white/5 hover:border-white/10'
                                                    }`}
                                                >
                                                    <div className="flex gap-3 sm:gap-4 items-center overflow-hidden min-w-0">
                                                        <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors shrink-0 ${selectedCategory === tx.category ? 'bg-cf-primary/20 text-cf-primary' : 'bg-white/5 text-cf-on-muted'}`}>
                                                            <Filter size={14} />
                                                        </div>
                                                        <div className="truncate min-w-0">
                                                            <p className="text-xs sm:text-sm font-bold text-cf-on-surface truncate">{tx.description}</p>
                                                            <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                                                                <span className="text-[10px] text-cf-on-muted font-medium">{tx.date}</span>
                                                                <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                                                <span className="text-[10px] text-cf-on-muted uppercase font-black tracking-tighter">{tx.category}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-2">
                                                        <p className="text-xs sm:text-sm font-black text-cf-on-surface whitespace-nowrap">-₹{tx.amount}</p>
                                                        <button 
                                                            onClick={() => deleteExpense(tx.id)}
                                                            className="opacity-0 group-hover:opacity-100 p-1.5 sm:p-2 hover:bg-cf-error/10 hover:text-cf-error rounded-lg sm:rounded-xl transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-6 text-cf-on-muted border-2 border-dashed border-white/5 rounded-2xl sm:rounded-3xl">
                                                <Filter size={28} className="opacity-20 mb-3 sm:mb-4" />
                                                <p className="text-xs uppercase font-bold tracking-widest">No Signals Broadcasted</p>
                                            </div>
                                        )}
                                    </div>
                                    <button className="w-full py-3 sm:py-4 mt-4 sm:mt-6 text-xs text-cf-primary font-bold uppercase tracking-widest bg-cf-primary/5 hover:bg-cf-primary/10 border border-cf-primary/10 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 min-h-[44px]">
                                        View Full Ledger <ChevronRight size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* FAB */}
                <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsAddModalOpen(true)}
                    className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 w-14 h-14 sm:w-20 sm:h-20 bg-cf-gradient rounded-2xl sm:rounded-[2rem] shadow-[0_0_30px_rgba(143,245,255,0.4)] flex items-center justify-center text-cf-bg z-50 cursor-pointer border border-white/20"
                >
                    <Plus size={28} strokeWidth={3} className="sm:hidden" />
                    <Plus size={36} strokeWidth={3} className="hidden sm:block" />
                </motion.button>

                {/* Addition Modal */}
                <AnimatePresence>
                    {isAddModalOpen && (
                        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsAddModalOpen(false)}
                                className="absolute inset-0 bg-cf-bg/80 backdrop-blur-2xl"
                            />
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 60 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 60 }}
                                className="w-full sm:max-w-xl bg-fintech-darkCard border border-white/10 rounded-t-3xl sm:rounded-[3rem] p-6 sm:p-10 relative z-10 shadow-glass overflow-hidden max-h-[90vh] sm:max-h-none overflow-y-auto"
                            >
                                <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-cf-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
                                
                                {/* Drag handle on mobile */}
                                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden"></div>
                                
                                <div className="flex justify-between items-center mb-6 sm:mb-10">
                                    <h2 className="font-display text-xl sm:text-3xl font-bold text-cf-on-surface">Commit Transaction</h2>

                                    <button onClick={() => setIsAddModalOpen(false)} className="p-2 sm:p-3 hover:bg-white/5 rounded-xl sm:rounded-2xl transition-colors">
                                        <X size={22} className="text-cf-on-muted hover:text-white" />
                                    </button>
                                </div>

                                <form onSubmit={handleAddExpense} className="space-y-5 sm:space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-cf-on-muted tracking-widest pl-1">Reason</label>
                                        <input 
                                            autoFocus
                                            type="text" 
                                            placeholder="Capital Deployment"
                                            className="w-full bg-white/5 border border-white/10 p-4 sm:p-5 rounded-xl sm:rounded-2xl text-base sm:text-lg outline-none focus:border-cf-primary/50 transition-all text-white placeholder:text-white/10"
                                            value={newExpense.description}
                                            onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-black text-cf-on-muted tracking-widest pl-1">Amount (₹)</label>
                                            <input 
                                                type="number" 
                                                placeholder="0.00"
                                                className="w-full bg-white/5 border border-white/10 p-4 sm:p-5 rounded-xl sm:rounded-2xl text-base sm:text-lg outline-none focus:border-cf-primary/50 transition-all text-white placeholder:text-white/10 font-mono"
                                                value={newExpense.amount}
                                                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-black text-cf-on-muted tracking-widest pl-1">Vector</label>
                                            <select 
                                                className="w-full bg-white/5 border border-white/10 p-4 sm:p-5 rounded-xl sm:rounded-2xl text-base sm:text-lg outline-none focus:border-cf-primary/50 transition-all text-white appearance-none cursor-pointer"
                                                value={newExpense.category}
                                                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat} className="bg-cf-bg">{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full py-4 sm:py-6 bg-cf-gradient rounded-2xl sm:rounded-3xl font-display text-lg sm:text-xl font-black text-cf-bg shadow-lg hover:shadow-[0_0_30px_rgba(255,152,0,0.4)] hover:scale-[1.02] active:scale-100 transition-all duration-300 uppercase tracking-widest mt-2 sm:mt-4 min-h-[52px]"
                                    >
                                        Push to Ledger
                                    </button>

                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Dashboard;
