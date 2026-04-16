import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, PieChart, Shield } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen min-h-[100dvh] flex flex-col bg-cf-bg">
            {/* Nav */}
            <nav className="p-4 sm:p-6 flex justify-between items-center max-w-7xl w-full mx-auto">
                <div className="font-display text-xl sm:text-2xl font-bold text-cf-primary tracking-tight-display">Student Capital</div>


                <div className="flex gap-2 sm:gap-4 items-center">
                    <Link to="/expenses" className="btn-ghost text-xs sm:text-sm py-2 px-3 sm:px-6">
                        Features
                    </Link>
                    <Link to="/dashboard" className="btn-primary text-xs sm:text-sm py-2 px-3 sm:px-6">
                        Dashboard
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-8 sm:pt-12 pb-16 sm:pb-24 relative z-10">
                {/* Ambient orbs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-cf-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute top-1/3 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-cf-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl relative z-10"
                >
                    <h1 className="text-display-lg md:text-[5rem] md:leading-[1.05] text-cf-on-surface tracking-tight-display mb-4 sm:mb-6 leading-tight">
                        Finance Management <br className="hidden md:block"/>
                        <span className="text-transparent bg-clip-text bg-cf-gradient">Designed for Students</span>
                    </h1>


                    <p className="text-base sm:text-lg text-cf-on-muted mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
                        Control your campus budget, track every expense, and start building your future with AI-curated student-friendly investments.
                    </p>

                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <Link to="/expenses" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center gap-2 w-full sm:w-auto justify-center">
                            Start Tracking <ArrowRight size={20} />
                        </Link>
                        <Link to="/dashboard" className="btn-ghost text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center flex">
                            View Dashboard
                        </Link>


                    </div>
                </motion.div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-16 sm:mt-24 max-w-5xl w-full relative z-10 px-2">
                    <FeatureCard
                        icon={<PieChart size={24} className="text-cf-primary" />}
                        title="Expense Tracking"
                        desc="Easily categorize and monitor your daily spending patterns."
                    />
                    <FeatureCard
                        icon={<BarChart3 size={24} className="text-cf-tertiary" />}
                        title="Budget Analysis"
                        desc="Real-time calculation of your net savings based on intuitive logic."
                    />
                    <FeatureCard
                        icon={<Shield size={24} className="text-cf-secondary" />}
                        title="Investment Recommendations"
                        desc="Get curated, moderate-risk assets to grow your wealth safely."
                    />
                </div>
            </main>

            {/* CTA Footer */}
            <footer className="py-12 sm:py-24 glass mt-12 sm:mt-24 border-t-0 rounded-t-3xl sm:rounded-t-[4rem] text-center px-4">
                <h2 className="font-display text-display-md text-cf-on-surface mb-4 sm:mb-6">Build Your Financial Foundation Today</h2>
                <Link to="/expenses" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-flex items-center justify-center">
                    Get Started for Free
                </Link>
            </footer>


        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div 
        whileHover={{ y: -4 }}
        className="group glass p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] text-left transition-all duration-500 shadow-glass relative overflow-hidden"
    >
        {/* Subtle hover glow orb */}
        <div className="absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 bg-cf-primary/5 rounded-full blur-[40px] group-hover:bg-cf-primary/15 transition-all duration-500"></div>
        
        <div className="bg-white/5 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border border-white/10">
            {icon}
        </div>
        <h3 className="font-display text-base sm:text-lg font-bold text-cf-on-surface mb-2 sm:mb-3 group-hover:text-cf-primary transition-colors duration-300">{title}</h3>
        <p className="text-cf-on-muted text-xs sm:text-sm leading-relaxed">{desc}</p>
    </motion.div>
);


export default LandingPage;
