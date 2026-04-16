import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Save, Check } from 'lucide-react';

const SettingsPage = () => {
    const { userProfile, updateUserProfile } = useFinance();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Local draft state initialized from context
    const [draft, setDraft] = useState({
        username: userProfile.username,
        email: userProfile.email,
    });

    const [notifications, setNotifications] = useState(true);

    // Keep draft in sync if userProfile changes externally
    useEffect(() => {
        setDraft({
            username: userProfile.username,
            email: userProfile.email,
        });
    }, [userProfile]);

    // Check if there are unsaved changes
    const hasChanges = draft.username !== userProfile.username || draft.email !== userProfile.email;

    const handleSave = () => {
        updateUserProfile({
            username: draft.username,
            email: draft.email,
        });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
    };

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
                        className="mb-6 sm:mb-8"
                    >
                        <h1 className="text-display-md text-cf-on-surface mb-1 sm:mb-2">Account Settings</h1>
                        <p className="text-cf-on-muted text-xs sm:text-sm">Manage your profile and application preferences.</p>
                    </motion.div>

                    <div className="space-y-4 sm:space-y-6">
                        {/* Profile Section */}
                        <section className="glass p-5 sm:p-8 rounded-2xl sm:rounded-[2rem]">
                            <h3 className="font-display text-lg sm:text-xl font-bold text-cf-on-surface mb-4 sm:mb-6 flex items-center gap-2">
                                <User className="text-cf-primary" size={20} />
                                Profile Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <label className="text-label-sm text-cf-on-muted">Username</label>
                                    <input 
                                        type="text" 
                                        value={draft.username}
                                        onChange={(e) => setDraft({...draft, username: e.target.value})}
                                        className="input-bottomline" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-label-sm text-cf-on-muted">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={draft.email}
                                        onChange={(e) => setDraft({...draft, email: e.target.value})}
                                        className="input-bottomline" 
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Preferences Section */}
                        <section className="glass p-5 sm:p-8 rounded-2xl sm:rounded-[2rem]">
                            <h3 className="font-display text-lg sm:text-xl font-bold text-cf-on-surface mb-4 sm:mb-6 flex items-center gap-2">
                                <Bell className="text-cf-secondary" size={20} />
                                Preferences
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/5 gap-4">
                                    <div className="min-w-0">
                                        <p className="text-cf-on-surface font-bold text-sm">Push Notifications</p>
                                        <p className="text-cf-on-muted text-xs truncate">Receive alerts about budget status and spending limits.</p>
                                    </div>
                                    <button 
                                        onClick={() => setNotifications(!notifications)}
                                        className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${notifications ? 'bg-cf-primary' : 'bg-cf-surface-high'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </section>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2 sm:pt-4 pb-6">
                            <AnimatePresence>
                                {saveSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex items-center justify-center gap-2 text-green-400 text-sm font-medium"
                                    >
                                        <Check size={16} /> Profile updated successfully!
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <button 
                                onClick={handleSave}
                                disabled={!hasChanges && !saveSuccess}
                                className={`btn-primary px-8 py-3 flex items-center justify-center gap-2 transition-opacity ${!hasChanges && !saveSuccess ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;

