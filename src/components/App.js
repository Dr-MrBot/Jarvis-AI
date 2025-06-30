import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('geminiApiKey') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (apiKey) {
      setIsAuthenticated(true);
    }
  }, [apiKey]);

  const handleLogin = (key) => {
    setApiKey(key);
    localStorage.setItem('geminiApiKey', key);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setApiKey('');
    localStorage.removeItem('geminiApiKey');
    setIsAuthenticated(false);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  // Show cyber intro on first load
  if (showIntro) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-8">
            <div className="w-32 h-32 mx-auto bg-green-500 rounded flex items-center justify-center animate-pulse-glow">
              <div className="text-6xl">🖥️</div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-green-400 tracking-wider glitch font-mono">
              JARVIS TERMINAL
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 font-mono">
              AI Assistant Terminal v2.0
            </p>
            <div className="flex justify-center space-x-1">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <button
              onClick={handleIntroComplete}
              className="mt-8 px-8 py-4 bg-green-600 text-white font-bold rounded transition-all duration-300 transform hover:scale-105 touch-friendly font-mono"
            >
              INITIALIZE SYSTEM
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Chat apiKey={apiKey} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 