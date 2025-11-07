
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import ForgotPassword from '@/pages/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import Account from '@/pages/Account';
import { HistoryProvider } from '@/contexts/HistoryContext';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <HistoryProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account" element={<Account />} />
          </Routes>
          <Toaster />
        </HistoryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
