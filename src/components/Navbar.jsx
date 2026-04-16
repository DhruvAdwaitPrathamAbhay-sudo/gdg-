import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrokerConnect from './BrokerConnect';
import { motion } from 'framer-motion';

const Navbar = ({ toggleSidebar }) => {
    const { userProfile } = useFinance();
    const userInitial = userProfile?.username ? userProfile.username.charAt(0).toUpperCase() : 'U';

    return (
        <motion.header 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-16 sm:h-20 flex items-center justify-between px-3 sm:px-6 glass sticky top-0 w-full z-30"
        >
            <div className="flex items-center gap-2 sm:gap-4">
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleSidebar}
                    className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-cf-on-muted hover:bg-cf-primary/10 hover:text-cf-primary transition-all duration-300 border border-transparent hover:border-cf-primary/20 md:hidden"
                    aria-label="Toggle Menu"
                >
                    <Menu size={22} />
                </motion.button>
                <Link to="/" className="flex items-center gap-2 group">
                    <motion.div 
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-cf-gradient rounded-lg sm:rounded-xl flex items-center justify-center shadow-glow-primary transition-transform duration-300"
                    >
                        <span className="text-cf-bg font-black text-lg sm:text-xl">S</span>
                    </motion.div>
                    <span className="font-display text-lg sm:text-xl font-bold text-cf-on-surface tracking-tight-display hidden sm:block">
                        Student Capital
                    </span>

                </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                <div className="hidden sm:block">
                    <BrokerConnect />
                </div>
                <Link to="/settings">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-cf-primary flex items-center justify-center font-bold text-sm font-display hover:border-cf-primary/30 transition-colors cursor-pointer shadow-glass"
                        title={userProfile?.username || 'User'}
                    >
                        {userInitial}
                    </motion.div>
                </Link>
            </div>
        </motion.header>
    );
};

export default Navbar;
