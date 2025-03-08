import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';

export default function App() {
    const [token, setToken] = useState(null);
    
    return (
        <>
        {/* <Leaderboard/> */}
        <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Routes>
            <Route path="/" element={<Register />} />

                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={token ? <Dashboard /> : <Login setToken={setToken} />} />
            </Routes>
            </div>
        </Router>
        </>
    );
}