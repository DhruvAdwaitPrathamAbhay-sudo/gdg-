import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ExpenseInputPage from './pages/ExpenseInputPage';
import FinancialAnalysisPage from './pages/FinancialAnalysisPage';
import AIInsightsPage from './pages/AIInsightsPage';
import SettingsPage from './pages/SettingsPage';
import InvestmentsPage from './pages/InvestmentsPage';
import BudgetPage from './pages/BudgetPage';
import AuthPage from './pages/AuthPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();
    if (!currentUser) {
        return <Navigate to="/auth" replace />;
    }
    return children;
};function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><ExpenseInputPage /></ProtectedRoute>} />
            <Route path="/analysis" element={<ProtectedRoute><FinancialAnalysisPage /></ProtectedRoute>} />
            <Route path="/ai-insights" element={<ProtectedRoute><AIInsightsPage /></ProtectedRoute>} />
            <Route path="/investments" element={<ProtectedRoute><InvestmentsPage /></ProtectedRoute>} />
            <Route path="/budget" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;
