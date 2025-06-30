import React from 'react';
import { LogOut, Terminal, Github, Mail, Instagram, Shield, Cpu } from 'lucide-react';

const Header = ({ onLogout, isAuthenticated }) => {
  if (!isAuthenticated) return null;

  return (
    <header className="bg-gray-900 border-b border-green-500 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded flex items-center justify-center">
              <Terminal className="w-4 h-4 sm:w-6 sm:h-6 text-black" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-green-400 font-mono">JARVIS_TERMINAL</h1>
              <p className="text-xs sm:text-sm text-gray-400 font-mono">AI Assistant v2.0</p>
            </div>
          </div>

          {/* System Status */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-green-400 animate-pulse" />
              <span className="text-xs text-gray-400 font-mono">SYSTEM: ONLINE</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400 font-mono">SECURE</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-mono">DEVELOPER</p>
              <p className="text-sm font-semibold text-green-400 font-mono">M. FAHAD</p>
            </div>
            <div className="flex space-x-2">
              <a
                href="mailto:mohammadfahad@example.com"
                className="p-2 text-gray-400 hover:text-green-400 transition-colors rounded hover:bg-gray-800"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/mohammadfahad"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-green-400 transition-colors rounded hover:bg-gray-800"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/mohammadfahad"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-green-400 transition-colors rounded hover:bg-gray-800"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Mobile System Status */}
          <div className="sm:hidden text-right">
            <p className="text-xs text-green-400 font-mono">ONLINE</p>
            <p className="text-xs text-gray-400 font-mono">M. FAHAD</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-sm touch-friendly"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline font-mono">LOGOUT</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 