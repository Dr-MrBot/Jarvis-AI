import React, { useState, useRef } from 'react';
import { Brain, Key, Eye, EyeOff, Mail, Instagram, Github, Shield, Cpu } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [hackingProgress, setHackingProgress] = useState(0);
  const audioContextRef = useRef(null);

  const playGlitchSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      // Create glitch sound effect
      const now = audioContextRef.current.currentTime;
      oscillator.frequency.setValueAtTime(200, now);
      oscillator.frequency.setValueAtTime(800, now + 0.05);
      oscillator.frequency.setValueAtTime(300, now + 0.1);
      oscillator.frequency.setValueAtTime(600, now + 0.15);
      oscillator.frequency.setValueAtTime(400, now + 0.2);
      
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.setValueAtTime(0.2, now + 0.05);
      gainNode.gain.setValueAtTime(0.1, now + 0.1);
      gainNode.gain.setValueAtTime(0.2, now + 0.15);
      gainNode.gain.setValueAtTime(0.1, now + 0.2);
      
      oscillator.start(now);
      oscillator.stop(now + 0.25);
    } catch (error) {
      console.log('Sound effect not supported');
    }
  };

  const playHackingSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      const now = audioContextRef.current.currentTime;
      oscillator.frequency.setValueAtTime(300, now);
      oscillator.frequency.setValueAtTime(500, now + 0.1);
      oscillator.frequency.setValueAtTime(400, now + 0.2);
      oscillator.frequency.setValueAtTime(600, now + 0.3);
      
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.setValueAtTime(0.1, now + 0.1);
      gainNode.gain.setValueAtTime(0.05, now + 0.2);
      gainNode.gain.setValueAtTime(0.1, now + 0.3);
      
      oscillator.start(now);
      oscillator.stop(now + 0.4);
    } catch (error) {
      console.log('Sound effect not supported');
    }
  };

  const triggerGlitchEffect = () => {
    setGlitchEffect(true);
    playGlitchSound();
    setTimeout(() => setGlitchEffect(false), 500);
  };

  const validateApiKey = async (key) => {
    try {
      // Check if we're on mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        console.log('Mobile device detected, using mobile-optimized API call');
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: "Test"
              }]
            }]
          }),
          mode: 'cors',
          cache: 'no-cache'
        }
      );

      return { success: response.ok, status: response.status };
    } catch (error) {
      console.error('API validation error:', error);
      return { success: false, error: error.message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Please enter your API key');
      triggerGlitchEffect();
      return;
    }

    setIsLoading(true);
    setError('');
    setHackingProgress(0);

    // Simulate hacking progress
    const progressInterval = setInterval(() => {
      setHackingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Test the API key with mobile-optimized validation
      const validation = await validateApiKey(apiKey);
      
      if (validation.success) {
        clearInterval(progressInterval);
        setHackingProgress(100);
        playHackingSound();
        setTimeout(() => {
          onLogin(apiKey);
        }, 500);
      } else {
        throw new Error(`API validation failed: ${validation.error || `Status ${validation.status}`}`);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setHackingProgress(0);
      
      let errorMessage = 'Invalid API key. ';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('API key')) {
        errorMessage += error.message;
      } else if (error.message.includes('Rate limit')) {
        errorMessage = error.message;
      } else if (error.message.includes('Network error')) {
        errorMessage = error.message;
      } else {
        errorMessage += 'Please check your key and try again.';
      }
      
      setError(errorMessage);
      triggerGlitchEffect();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)] animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.1)_25%,rgba(120,119,198,0.1)_50%,transparent_50%,transparent_75%,rgba(120,119,198,0.1)_75%)] bg-[length:20px_20px] animate-pulse"></div>
      </div>
      
      {/* Glitch overlay */}
      {glitchEffect && (
        <div className="absolute inset-0 bg-red-500 opacity-10 animate-pulse z-10"></div>
      )}

      <div className="w-full max-w-md relative z-20">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className={`relative w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-glow mb-6 ${glitchEffect ? 'animate-glitch' : ''}`}>
            <Brain className="w-12 h-12 text-white" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <h1 className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 ${glitchEffect ? 'animate-glitch' : ''}`}>
            JARVIS AI
          </h1>
          <p className="text-gray-300 font-medium text-sm sm:text-base">
            Advanced Neural Network
          </p>
          <div className="flex justify-center mt-4 space-x-3">
            <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-300 font-medium">ONLINE</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-500/20 px-3 py-1 rounded-full">
              <Cpu className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-blue-300 font-medium">ACTIVE</span>
            </div>
            <div className="flex items-center space-x-2 bg-purple-500/20 px-3 py-1 rounded-full">
              <Shield className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-purple-300 font-medium">SECURE</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
                <Key className="w-4 h-4 inline mr-2" />
                Gemini API Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="apiKey"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter your API key"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/80 border border-red-700 text-red-100 px-4 py-3 rounded-xl text-sm animate-pulse backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2"></div>
                  {error}
                </div>
              </div>
            )}

            {/* Hacking Progress */}
            {isLoading && (
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>INITIALIZING NEURAL NETWORK</span>
                  <span>{hackingProgress}%</span>
                </div>
                <div className="w-full bg-gray-800/60 rounded-full h-2 backdrop-blur-sm">
                  <div 
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${hackingProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {hackingProgress < 30 && "ESTABLISHING CONNECTION..."}
                  {hackingProgress >= 30 && hackingProgress < 60 && "VALIDATING CREDENTIALS..."}
                  {hackingProgress >= 60 && hackingProgress < 90 && "INITIALIZING AI CORE..."}
                  {hackingProgress >= 90 && "ACCESS GRANTED"}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${glitchEffect ? 'animate-glitch' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>INITIALIZING...</span>
                </div>
              ) : (
                'ACCESS JARVIS'
              )}
            </button>
          </form>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-gray-800/40 rounded-xl backdrop-blur-sm border border-gray-700/50">
            <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
              <Cpu className="w-4 h-4 mr-2" />
              How to get your API key:
            </h3>
            <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
              <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Google AI Studio</a></li>
              <li>Sign in with your Google account</li>
              <li>Click "Create API Key"</li>
              <li>Copy the generated key and paste it above</li>
            </ol>
          </div>
        </div>

        {/* Developer Info */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400 mb-4">Developed by</p>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <a
              href="mailto:mohammadfahad@example.com"
              className="p-2 text-gray-400 hover:text-purple-400 transition-all duration-300 rounded-xl hover:bg-purple-500/20"
              title="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com/mohammadfahad"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-purple-400 transition-all duration-300 rounded-xl hover:bg-purple-500/20"
              title="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/mohammadfahad"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-purple-400 transition-all duration-300 rounded-xl hover:bg-purple-500/20"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
          <p className="text-lg font-semibold text-purple-300 font-medium">Mohammad Fahad</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 