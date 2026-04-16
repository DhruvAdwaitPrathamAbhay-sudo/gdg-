import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SentimentAnalyzer from '../components/SentimentAnalyzer';
import MarketAnalyzer from '../components/MarketAnalyzer';
import ZerodhaPredictor from '../components/ZerodhaPredictor';
import DailyScanner from '../components/DailyScanner';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';

const AIInsightsPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
                
                <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto w-full">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 pb-4 gap-3"
                    >
                        <div>
                            <h1 className="text-display-md text-cf-on-surface mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
                                <Brain className="text-cf-primary shrink-0" size={24} />
                                <span>Predictive Data Mainframe</span>
                            </h1>
                            <p className="text-cf-on-muted text-xs sm:text-sm">
                                Vectorized sentiment analysis & real-time market telemetry.
                            </p>
                        </div>
                    </motion.div>

                    <SentimentAnalyzer />

                    {/* Section divider — tonal shift instead of line */}
                    <div className="my-8 sm:my-12 relative flex items-center justify-center">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-cf-outline/15 to-transparent"></div>
                        <span className="absolute bg-cf-bg px-3 sm:px-4 text-label-sm text-cf-on-muted uppercase tracking-widest text-xs">Global Telemetry</span>

                    </div>

                    <MarketAnalyzer />

                    <div className="my-8 sm:my-12 relative flex items-center justify-center">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-cf-outline/15 to-transparent"></div>
                        <span className="absolute bg-cf-bg px-3 sm:px-4 text-label-sm text-cf-on-muted uppercase tracking-widest text-xs">Vector Projection</span>

                    </div>

                    <ZerodhaPredictor />

                    <div className="my-8 sm:my-12 relative flex items-center justify-center">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-cf-outline/15 to-transparent"></div>
                        <span className="absolute bg-cf-bg px-3 sm:px-4 text-label-sm text-cf-on-muted uppercase tracking-widest text-xs">Ledger Sweep</span>

                    </div>

                    <DailyScanner />
                </div>
            </main>
        </div>
    );
};

export default AIInsightsPage;
