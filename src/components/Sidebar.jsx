import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, PieChart, TrendingUp, Settings, Brain, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ closeSidebar = () => {} }) => {
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Expenses', path: '/expenses', icon: <Wallet size={20} /> },
        { name: 'Budget', path: '/budget', icon: <PieChart size={20} /> },
        { name: 'Investments', path: '/investments', icon: <TrendingUp size={20} /> },
        { name: 'AI Insights', path: '/ai-insights', icon: <Brain size={20} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    ];


    return (
        <motion.aside 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="w-64 sm:w-72 glass h-screen h-[100dvh] pt-6 sm:pt-8 sticky top-0 flex flex-col z-50 overflow-y-auto"
        >
            <div className="px-5 sm:px-8 mb-8 sm:mb-12 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cf-gradient rounded-lg flex items-center justify-center">
                        <span className="text-cf-bg font-black text-sm">S</span>
                    </div>
                    <h2 className="font-display text-base sm:text-lg font-bold text-cf-on-surface tracking-tight-display">
                        Internal Console
                    </h2>
                </div>
                <button onClick={closeSidebar} className="md:hidden p-2 text-cf-on-muted hover:text-cf-primary transition-colors">
                    <X size={20} />
                </button>
            </div>
            
            <nav className="flex flex-col gap-1.5 sm:gap-2 px-3 sm:px-4 flex-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl transition-all duration-300 border min-h-[44px] ${
                                isActive
                                    ? 'bg-cf-primary/10 text-cf-primary border-cf-primary/20 shadow-glow-primary'
                                    : 'text-cf-on-muted border-transparent hover:bg-white/5 hover:text-cf-on-surface hover:border-white/5'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="font-medium text-sm tracking-wide">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 sm:p-6 mt-auto">
                <div className="glass-light p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cf-primary/10 flex items-center justify-center text-cf-primary">
                        <Brain size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] text-cf-primary font-black uppercase tracking-widest">Status</p>
                        <p className="text-xs text-cf-on-surface font-bold">System Online</p>
                    </div>
                </div>
            </div>
        </motion.aside>

    );
};

export default Sidebar;
