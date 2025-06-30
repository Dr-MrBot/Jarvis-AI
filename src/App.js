import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import Login from './components/Login';
import Chat from './components/Chat';
import ApiTest from './components/ApiTest';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('geminiApiKey') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
      setShowIntro(false);
    }, 3000);
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-glow">
              <Brain className="w-16 h-16 text-white" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent tracking-wider">
            JARVIS AI
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 font-mono">
            Initializing System...
          </p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Show cyber intro on first load
  if (showIntro) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-8">
            <div className="relative">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-glow">
                <Brain className="w-16 h-16 text-white" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent tracking-wider">
              JARVIS AI
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 font-mono">
              Your Personal AI Assistant
            </p>
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <button
              onClick={handleIntroComplete}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-white font-bold rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 touch-friendly shadow-2xl"
            >
              ENTER SYSTEM
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Chat apiKey={apiKey} onLogout={handleLogout} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />
          <Route 
            path="/test" 
            element={<ApiTest />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 