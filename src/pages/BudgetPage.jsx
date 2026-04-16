import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Pizza, 
    Home, 
    Bus, 
    Gamepad2, 
    ShoppingBag, 
    Stethoscope, 
    GraduationCap, 
    BookOpen, 
    MoreHorizontal,
    Edit3,
    Check,
    Zap,
    Pencil
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const CATEGORY_ICONS = {
    Housing: <Home size={20} />,
    Food: <Pizza size={20} />,
    Transportation: <Bus size={20} />,
    Utilities: <Zap size={20} />,
    Entertainment: <Gamepad2 size={20} />,
    Shopping: <ShoppingBag size={20} />,
    Healthcare: <Stethoscope size={20} />,
    Tuition: <GraduationCap size={20} />,
    Books: <BookOpen size={20} />,
    Stationary: <Pencil size={20} />,
    Other: <MoreHorizontal size={20} />
};

const BudgetCard = ({ category, budget, spent, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(budget);
    
    const progress = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
    const isOverBudget = spent > budget && budget > 0;

    const handleSave = () => {
        onSave(category, Number(inputValue));
        setIsEditing(false);
    };

    return (
        <motion.div 
            layout
            className="glass p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] border-white/5 group hover:border-cf-primary/20 transition-all duration-300"
        >
            <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-xl sm:rounded-2xl text-cf-on-muted group-hover:text-cf-primary group-hover:bg-cf-primary/10 transition-colors">
                        {CATEGORY_ICONS[category] || <MoreHorizontal size={20} />}
                    </div>
                    <div>
                        <h4 className="font-bold text-cf-on-surface text-sm sm:text-base">{category}</h4>
                        <p className="text-[10px] text-cf-on-muted uppercase tracking-widest font-black">Category Limit</p>
                    </div>
                </div>
                
                {isEditing ? (
                    <button onClick={handleSave} className="p-2 bg-cf-primary/10 text-cf-primary rounded-xl border border-cf-primary/20 min-w-[36px] min-h-[36px] flex items-center justify-center">
                        <Check size={16} />
                    </button>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="p-2 sm:opacity-0 sm:group-hover:opacity-100 text-cf-on-muted hover:text-white transition-all min-w-[36px] min-h-[36px] flex items-center justify-center">
                        <Edit3 size={16} />
                    </button>
                )}
            </div>

            <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] text-cf-on-muted font-bold uppercase mb-1">Spent</p>
                        <h3 className="text-lg sm:text-xl font-display font-black text-cf-on-surface">₹{spent.toLocaleString()}</h3>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-cf-on-muted font-bold uppercase mb-1">Budget</p>
                        {isEditing ? (
                            <input 
                                autoFocus
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onBlur={handleSave}
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                className="bg-cf-surface font-display font-black text-cf-primary w-20 text-right outline-none border-b border-cf-primary/50 text-lg sm:text-xl"
                            />
                        ) : (
                            <h3 className="text-lg sm:text-xl font-display font-black text-cf-primary">₹{budget.toLocaleString()}</h3>
                        )}
                    </div>
                </div>

                <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`absolute inset-y-0 left-0 rounded-full ${isOverBudget ? 'bg-cf-error shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-cf-primary shadow-glow-primary'}`}
                    />
                </div>
                
                <p className={`text-[10px] font-bold uppercase tracking-tighter ${isOverBudget ? 'text-cf-error' : 'text-cf-on-muted'}`}>
                    {isOverBudget ? 'Limit Exceeded' : `${(100 - progress).toFixed(0)}% Budget Remaining`}
                </p>
            </div>
        </motion.div>
    );
};

const BudgetPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { categoryBudgets, setCategoryBudget, expenses, budget: totalBudget } = useFinance();

    const categorySpending = useMemo(() => {
        const spending = {};
        expenses.forEach(exp => {
            spending[exp.category] = (spending[exp.category] || 0) + Number(exp.amount);
        });
        return spending;
    }, [expenses]);

    const totalAllocated = useMemo(() => {
        return Object.values(categoryBudgets).reduce((sum, val) => sum + Number(val), 0);
    }, [categoryBudgets]);

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

            <main className="flex-1 flex flex-col h-screen h-[100dvh] overflow-y-auto custom-scrollbar min-w-0">
                <Navbar toggleSidebar={() => setSidebarOpen(true)} />
                
                <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 sm:mb-12 gap-4 sm:gap-6"
                    >
                        <div>
                            <h1 className="text-display-md text-cf-on-surface mb-1 sm:mb-2">Budget Allocations</h1>
                            <p className="text-cf-on-muted text-xs sm:text-sm max-w-xl">
                                Strategize your spending across campus life and academic essentials.
                            </p>
                        </div>
                        
                        <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
                            <div className="glass px-4 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-3xl border-cf-primary/10 flex-1 sm:flex-none">
                                <p className="text-[10px] text-cf-on-muted uppercase tracking-widest font-black mb-1">Total Pool</p>
                                <h3 className="text-xl sm:text-2xl font-display font-black text-cf-on-surface">₹{totalBudget.toLocaleString()}</h3>
                            </div>
                            <div className={`glass px-4 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-3xl border-cf-secondary/10 flex-1 sm:flex-none ${totalAllocated > totalBudget ? 'border-cf-error/20' : ''}`}>
                                <p className="text-[10px] text-cf-on-muted uppercase tracking-widest font-black mb-1">Allocated</p>
                                <h3 className={`text-xl sm:text-2xl font-display font-black ${totalAllocated > totalBudget ? 'text-cf-error' : 'text-cf-secondary'}`}>
                                    ₹{totalAllocated.toLocaleString()}
                                </h3>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {Object.keys(categoryBudgets).map((category) => (
                            <BudgetCard 
                                key={category}
                                category={category}
                                budget={categoryBudgets[category]}
                                spent={categorySpending[category] || 0}
                                onSave={setCategoryBudget}
                            />
                        ))}
                    </div>

                    {totalAllocated > totalBudget && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 sm:mt-12 p-4 sm:p-6 glass border-cf-error/20 rounded-2xl sm:rounded-[2rem] flex items-center gap-3 sm:gap-4 text-cf-error"
                        >
                            <Stethoscope size={24} className="shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm sm:text-base">Allocation Error</h4>
                                <p className="text-[10px] sm:text-xs text-cf-on-muted">Your category budgets exceed your total monthly pool. Consider rebalancing your capital deployment.</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default BudgetPage;
