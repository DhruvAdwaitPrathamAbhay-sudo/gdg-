import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ExpenseForm from '../components/ExpenseForm';
import { Trash2, Calculator, Edit2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExpenseInputPage = () => {
    const { budget, setBudget, expenses, deleteExpense, updateExpense } = useFinance();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    // Inline edit state
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', category: '', amount: '' });

    const categories = ['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Tuition', 'Books', 'Stationary', 'Other'];

    const handleEditClick = (expense) => {
        setEditingId(expense.id);
        setEditForm({ name: expense.name, category: expense.category, amount: expense.amount });
    };

    const handleEditSave = (id) => {
        updateExpense(id, { name: editForm.name, category: editForm.category, amount: Number(editForm.amount) });
        setEditingId(null);
    };

    const handleEditCancel = () => {
        setEditingId(null);
    };

    const handleAnalyze = () => {
        navigate('/analysis');
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
                
                <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3">
                        <div>
                            <h1 className="text-display-md text-cf-on-surface">Track Expenses</h1>
                            <p className="text-cf-on-muted mt-1 text-xs sm:text-sm">Input your budget and add your monthly expenses.</p>
                        </div>
                        <button
                            onClick={handleAnalyze}
                            className="bg-cf-gradient-secondary text-white font-bold py-2.5 px-4 sm:px-6 rounded-xl flex items-center gap-2 transition-all shadow-glow-secondary hover:shadow-[0_0_24px_rgba(214,116,255,0.35)] text-sm min-h-[44px] w-full sm:w-auto justify-center"
                        >
                            <Calculator size={18} />
                            <span>Analyze Finances</span>
                        </button>
                    </div>

                    {/* Monthly Budget Input */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-cf-surface-high p-4 sm:p-6 rounded-xl sm:rounded-2xl mb-6 sm:mb-8"
                    >
                        <h3 className="font-display text-base sm:text-lg font-bold mb-3 sm:mb-4 text-cf-on-surface">Monthly Budget</h3>
                        <div className="flex items-center gap-4 max-w-sm">
                            <div className="relative w-full">
                                <span className="absolute left-1.5 bottom-[9px] text-cf-on-muted font-bold text-sm">₹</span>
                                <input
                                    type="number"
                                    value={budget || ''}
                                    onChange={(e) => setBudget(Number(e.target.value))}
                                    placeholder="Enter monthly budget"
                                    className="input-bottomline pl-6"
                                    style={{ fontVariantNumeric: 'tabular-nums' }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Expense Form */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6 sm:mb-8"
                    >
                        <ExpenseForm />
                    </motion.div>

                    {/* Expense Table — Card layout on mobile, Table on desktop */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-cf-surface-high rounded-xl sm:rounded-2xl overflow-hidden"
                    >
                        <div className="p-4 sm:p-6">
                            <h3 className="font-display text-base sm:text-lg font-bold text-cf-on-surface">Expense List</h3>
                        </div>

                        {/* Desktop table */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-cf-surface-low text-cf-on-muted text-label-sm">
                                        <th className="p-4">Expense Name</th>
                                        <th className="p-4">Category</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-cf-on-muted text-sm">
                                                No expenses added yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        expenses.map((expense, i) => (
                                            <tr 
                                                key={expense.id} 
                                                className={`hover:bg-cf-surface-high/50 transition-colors ${
                                                    i % 2 === 0 ? 'bg-cf-surface-low' : 'bg-cf-surface-lowest'
                                                }`}
                                            >
                                                {editingId === expense.id ? (
                                                    <>
                                                        <td className="p-4">
                                                            <input 
                                                                type="text" 
                                                                value={editForm.name} 
                                                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                                className="input-bottomline py-1 text-sm bg-transparent w-full"
                                                            />
                                                        </td>
                                                        <td className="p-4">
                                                            <select 
                                                                value={editForm.category} 
                                                                onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                                                                className="input-bottomline py-1 text-sm bg-transparent"
                                                            >
                                                                {categories.map(c => <option key={c} value={c} className="bg-cf-surface-high">{c}</option>)}
                                                            </select>
                                                        </td>
                                                        <td className="p-4">
                                                            <input 
                                                                type="number" 
                                                                value={editForm.amount} 
                                                                onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                                                                className="input-bottomline py-1 text-sm bg-transparent w-24"
                                                            />
                                                        </td>
                                                        <td className="p-4 flex gap-2 justify-end">
                                                            <button onClick={() => handleEditSave(expense.id)} className="text-cf-primary hover:bg-cf-primary/10 p-2 rounded transition-colors" title="Save">
                                                                <Check size={16} />
                                                            </button>
                                                            <button onClick={handleEditCancel} className="text-cf-on-muted hover:bg-white/10 p-2 rounded transition-colors" title="Cancel">
                                                                <X size={16} />
                                                            </button>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="p-4 text-cf-on-surface font-medium text-sm">
                                                            {expense.name}
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="bg-cf-surface-high text-cf-on-muted px-3 py-1 rounded text-[10px] font-semibold uppercase tracking-wider">
                                                                {expense.category}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-cf-on-surface text-sm" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                            ₹{Number(expense.amount).toFixed(2)}
                                                        </td>
                                                        <td className="p-4 flex gap-2 justify-end">
                                                            <button 
                                                                onClick={() => handleEditClick(expense)}
                                                                className="text-cf-on-muted hover:text-cf-primary transition-colors p-2 rounded hover:bg-cf-primary/10"
                                                                title="Edit"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button 
                                                                onClick={() => deleteExpense(expense.id)}
                                                                className="text-cf-on-muted hover:text-cf-error transition-colors p-2 rounded hover:bg-cf-error/10"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile card layout */}
                        <div className="sm:hidden px-4 pb-4 space-y-3">
                            {expenses.length === 0 ? (
                                <p className="py-8 text-center text-cf-on-muted text-sm">No expenses added yet.</p>
                            ) : (
                                expenses.map((expense) => (
                                    <div key={expense.id} className="bg-cf-surface-low p-4 rounded-xl border border-white/5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="min-w-0 mr-2">
                                                <p className="text-sm font-medium text-cf-on-surface truncate">{expense.name}</p>
                                                <span className="bg-cf-surface-high text-cf-on-muted px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider inline-block mt-1">
                                                    {expense.category}
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold text-cf-on-surface whitespace-nowrap" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                ₹{Number(expense.amount).toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-white/5">
                                            <button 
                                                onClick={() => handleEditClick(expense)}
                                                className="text-cf-on-muted hover:text-cf-primary transition-colors p-2 rounded hover:bg-cf-primary/10"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => deleteExpense(expense.id)}
                                                className="text-cf-on-muted hover:text-cf-error transition-colors p-2 rounded hover:bg-cf-error/10"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default ExpenseInputPage;
