import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FinanceContext = createContext();

export const useFinance = () => {
    return useContext(FinanceContext);
};

// Helper to safely read from localStorage
const loadFromStorage = (key, fallback) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
};

// Helper to save to localStorage
const saveToStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
        console.warn('Failed to save to localStorage:', err);
    }
};

export const FinanceProvider = ({ children }) => {
    const theme = 'dark';
    const [userProfile, setUserProfile] = useState(() => loadFromStorage('finance_user_profile', {
        username: 'Student User',
        email: 'student@university.edu',
    }));
    const [budget, setBudgetState] = useState(() => loadFromStorage('finance_budget', 0));
    const [categoryBudgets, setCategoryBudgets] = useState(() => loadFromStorage('finance_category_budgets', {
        Housing: 500,
        Food: 200,
        Transportation: 100,
        Utilities: 100,
        Entertainment: 100,
        Shopping: 100,
        Healthcare: 50,
        Tuition: 0,
        Books: 0,
        Stationary: 0,
        Other: 50
    }));
    const [expenses, setExpenses] = useState(() => loadFromStorage('finance_expenses', []));

    const [dataLoaded, setDataLoaded] = useState(false);
    
    const { currentUser } = useAuth();
    
    const getAuthHeaders = async (baseHeaders = {}) => {
        if (!currentUser) return baseHeaders;
        try {
            const token = currentUser.token;
            if (!token) return baseHeaders;
            return {
                ...baseHeaders,
                'Authorization': `Bearer ${token}`
            };
        } catch (e) {
            return baseHeaders;
        }
    };

    // Try to fetch from backend API, but fall back to localStorage
    useEffect(() => {
        if (!currentUser) return; // Wait for user to sign in
        
        const fetchData = async () => {
            const headers = await getAuthHeaders();
            
            // Fetch user profile from DB
            try {
                const profileRes = await fetch('/api/profile', { headers });
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    if (profileData.username) {
                        setUserProfile({ username: profileData.username, email: profileData.email });
                        saveToStorage('finance_user_profile', { username: profileData.username, email: profileData.email });
                    }
                }
            } catch (err) {
                console.log('Profile API not available, using local storage.');
            }

            try {
                // Try fetching budget from API
                const headers = await getAuthHeaders();
                const budgetRes = await fetch('/api/budget', { headers });
                if (budgetRes.ok) {
                    const budgetData = await budgetRes.json();
                    if (budgetData.amount && budgetData.amount > 0) {
                        setBudgetState(budgetData.amount);
                        saveToStorage('finance_budget', budgetData.amount);
                    }
                }
            } catch (err) {
                // API not available - use localStorage (already loaded via useState initializer)
                console.log('Budget API not available, using local storage.');
            }

            try {
                // Try fetching expenses from API
                const headers = await getAuthHeaders();
                const expensesRes = await fetch('/api/expenses', { headers });
                if (expensesRes.ok) {
                    const expensesData = await expensesRes.json();
                    if (Array.isArray(expensesData) && expensesData.length > 0) {
                        setExpenses(expensesData);
                        saveToStorage('finance_expenses', expensesData);
                    }
                }
            } catch (err) {
                console.log('Expenses API not available, using local storage.');
            }

            setDataLoaded(true);
        };
        fetchData();
    }, [currentUser]); // Re-fetch whenever the user logs in

    // Always ensure dark mode is applied
    useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);

    // Persist budget to localStorage whenever it changes
    useEffect(() => {
        if (dataLoaded || budget > 0) {
            saveToStorage('finance_budget', budget);
        }
    }, [budget, dataLoaded]);

    // Persist category budgets to localStorage whenever they change
    useEffect(() => {
        if (dataLoaded || Object.keys(categoryBudgets).length > 0) {
            saveToStorage('finance_category_budgets', categoryBudgets);
        }
    }, [categoryBudgets, dataLoaded]);

    // Persist user profile to localStorage whenever it changes
    useEffect(() => {
        saveToStorage('finance_user_profile', userProfile);
    }, [userProfile]);

    const updateUserProfile = async (newProfile) => {
        const updated = { ...userProfile, ...newProfile };
        setUserProfile(updated);
        saveToStorage('finance_user_profile', updated);
        try {
            await fetch('/api/profile', {
                method: 'PUT',
                headers: await getAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({ username: updated.username, email: updated.email })
            });
        } catch (err) {
            // API not available, already saved to localStorage
            console.log('Profile API not available, saved locally.');
        }
    };

    // Persist expenses to localStorage whenever they change


    const updateBudget = async (newAmount) => {
        setBudgetState(newAmount);
        saveToStorage('finance_budget', newAmount);
        try {
            await fetch('/api/budget', {
                method: 'POST',
                headers: await getAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({ amount: newAmount })
            });
        } catch (err) {
            // API not available, already saved to localStorage
        }
    };
    
    // Update individual category budget
    const updateCategoryBudget = (category, amount) => {
        setCategoryBudgets(prev => ({
            ...prev,
            [category]: amount
        }));
    };




    const addExpense = async (expense) => {
        const id = expense.id || Date.now().toString();
        const newExpense = { ...expense, id };
        const updatedExpenses = [...expenses, newExpense];
        setExpenses(updatedExpenses);
        saveToStorage('finance_expenses', updatedExpenses);
        
        try {
            await fetch('/api/expenses', {
                method: 'POST',
                headers: await getAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(newExpense)
            });
        } catch (err) {
            // API not available, already saved to localStorage
        }
    };

    const updateExpense = async (id, updatedFields) => {
        const updatedExpenses = expenses.map(e => e.id === id ? { ...e, ...updatedFields } : e);
        setExpenses(updatedExpenses);
        saveToStorage('finance_expenses', updatedExpenses);
        
        try {
            await fetch('/api/expenses', {
                method: 'POST',
                headers: await getAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({ id, ...updatedFields })
            });
        } catch (err) {
            // API not available
            console.log('API not available, saved local edit');
        }
    };

    const deleteExpense = async (id) => {
        const updatedExpenses = expenses.filter(e => e.id !== id);
        setExpenses(updatedExpenses);
        saveToStorage('finance_expenses', updatedExpenses);
        
        try {
            await fetch(`/api/expenses?id=${id}`, {
                method: 'DELETE',
                headers: await getAuthHeaders()
            });
        } catch (err) {
            // API not available, already saved to localStorage
        }
    };

    const totalExpenses = expenses.reduce((sum, curr) => sum + Number(curr.amount), 0);
    const netSavings = budget - totalExpenses;

    const value = {
        theme,
        budget,
        setBudget: updateBudget,
        categoryBudgets,
        setCategoryBudget: updateCategoryBudget,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        totalExpenses,
        netSavings,
        userProfile,
        updateUserProfile
    };


    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
};
