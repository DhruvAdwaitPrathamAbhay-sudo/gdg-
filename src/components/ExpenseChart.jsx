import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ExpenseChart = ({ expenses, onCategoryClick = () => {} }) => {
    // Group expenses by category
    const categoryData = expenses.reduce((acc, expense) => {
        const existing = acc.find(c => c.name === expense.category);
        if (existing) {
            existing.value += Number(expense.amount);
        } else {
            acc.push({ name: expense.category, value: Number(expense.amount) });
        }
        return acc;
    }, []);

    // Design system palette
    // Design system palette - Warm Coder Theme
    const COLORS = ['#ff9800', '#ff5722', '#ff7043', '#e64a19', '#ffcc80', '#fb8c00', '#44484f'];


    // Delay rendering to ensure the container has settled its layout dimensions
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!expenses || expenses.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-cf-on-muted text-sm">
                No expense data available.
            </div>
        );
    }

    if (!ready) {
        return <div className="h-72 w-full min-h-[200px]" />;
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass rounded-2xl p-4 shadow-glass border border-white/10 backdrop-blur-xl">
                    <p className="font-display font-semibold text-cf-on-surface text-sm">{payload[0].name}</p>
                    <p className="text-cf-primary font-bold text-lg" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        ₹{payload[0].value.toFixed(2)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-72 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                    <Pie
                        data={categoryData}
                        cx="50%"
                        cy="45%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        strokeWidth={0}
                        onClick={(data) => onCategoryClick(data.name)}
                        className="cursor-pointer outline-none"
                    >
                        {categoryData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                                className="hover:opacity-80 transition-opacity duration-300 outline-none"
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '24px', fontSize: '12px', color: '#8a90a0', fontFamily: 'Space Grotesk' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpenseChart;
