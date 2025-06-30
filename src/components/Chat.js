import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Brain, Shield, Cpu, LogOut, Github, Mail, Instagram, Mic, Camera, Maximize2, Minimize2 } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';
import ImageUpload from './ImageUpload';
import TextToSpeech from './TextToSpeech';
import CyberIntro from './CyberIntro';

const Chat = ({ apiKey, onLogout }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am JARVIS AI, developed by Mohammad Fahad. I can help you with text, voice, and image analysis. Find me on Instagram at @dr_mr.bot. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [error, setError] = useState('');
  const [showIntro, setShowIntro] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState('');
  const messagesEndRef = useRef(null);
  const audioContextRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto fullscreen on component mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          await document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
          await document.documentElement.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } catch (error) {
        console.log('Fullscreen not supported or denied');
      }
    };

    // Small delay to ensure component is fully loaded
    const timer = setTimeout(() => {
      enterFullscreen();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          await document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
          await document.documentElement.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (error) {
      console.log('Fullscreen toggle failed');
    }
  };

  const playResponseSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      const now = audioContextRef.current.currentTime;
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.setValueAtTime(1000, now + 0.1);
      oscillator.frequency.setValueAtTime(1200, now + 0.2);
      
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      
      oscillator.start(now);
      oscillator.stop(now + 0.3);
    } catch (error) {
      console.log('Sound effect not supported');
    }
  };

  const playTypingSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      const now = audioContextRef.current.currentTime;
      oscillator.frequency.setValueAtTime(400, now);
      oscillator.frequency.setValueAtTime(600, now + 0.05);
      
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      
      oscillator.start(now);
      oscillator.stop(now + 0.1);
    } catch (error) {
      console.log('Sound effect not supported');
    }
  };

  const sendMessage = async (messageText, imageData = null) => {
    if (!messageText.trim() && !imageData) return;

    setIsLoading(true);
    setError('');

    const userMessage = {
      role: 'user',
      content: messageText,
      image: imageData,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setShowImageUpload(false);

    try {
      const requestBody = {
        contents: [{
          parts: []
        }]
      };

      if (messageText.trim()) {
        requestBody.contents[0].parts.push({
          text: messageText
        });
      }

      if (imageData) {
        requestBody.contents[0].parts.push({
          inline_data: {
            mime_type: "image/jpeg",
            data: imageData.split(',')[1]
          }
        });
      }

      // Mobile-optimized fetch with timeout and better error handling
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(requestBody),
          mode: 'cors',
          cache: 'no-cache'
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        if (response.status === 400) {
          throw new Error('Invalid API key or request format. Please check your API key.');
        } else if (response.status === 403) {
          throw new Error('API key is invalid or has insufficient permissions.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a moment.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`API Error (${response.status}): ${errorText}`);
        }
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        const aiMessage = {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, aiMessage]);
        setLastSpokenText(aiResponse);
        playResponseSound();
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error:', error);
      
      let errorMessage = 'Failed to get response. ';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage += 'Network error. Please check your internet connection.';
      } else if (error.message.includes('API key')) {
        errorMessage += error.message;
      } else if (error.message.includes('Rate limit')) {
        errorMessage += error.message;
      } else if (error.message.includes('Server error')) {
        errorMessage += error.message;
      } else if (error.message.includes('CORS')) {
        errorMessage += 'CORS error. Please try refreshing the page.';
      } else {
        errorMessage += 'Please check your API key and internet connection.';
      }
      
      setError(errorMessage);
      playTypingSound();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input, selectedImage);
  };

  const handleVoiceTranscript = (transcript) => {
    setInput(transcript);
  };

  const handleImageSelect = (imageData) => {
    setSelectedImage(imageData);
  };

  const handleVoiceError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleImageError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <CyberIntro onComplete={handleIntroComplete} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)] animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.1)_25%,rgba(120,119,198,0.1)_50%,transparent_50%,transparent_75%,rgba(120,119,198,0.1)_75%)] bg-[length:20px_20px] animate-pulse"></div>
      </div>

      {/* Professional Header */}
      <header className="relative bg-black/40 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 py-2 sm:px-4 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-glow">
                  <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  JARVIS AI
                </h1>
                <p className="text-xs text-gray-300 font-medium hidden sm:block">Advanced Neural Network</p>
              </div>
            </div>

            {/* System Status - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-4">
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

            {/* Developer Info - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs text-gray-400">Developed by</p>
                <p className="text-sm font-semibold text-purple-300">Mohammad Fahad</p>
              </div>
              <div className="flex space-x-1">
                <a
                  href="mailto:mohammadfahad@example.com?subject=JARVIS AI Contact&body=Phone: +91 9559034252%0AInstagram: https://www.instagram.com/dr_mr.bot/"
                  className="p-2 text-gray-400 hover:text-purple-400 transition-all duration-300 rounded-lg hover:bg-purple-500/20"
                  title="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/dr_mr.bot/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-purple-400 transition-all duration-300 rounded-lg hover:bg-purple-500/20"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/mohammadfahad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-purple-400 transition-all duration-300 rounded-lg hover:bg-purple-500/20"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Mobile Status */}
            <div className="md:hidden text-right">
              <div className="flex items-center space-x-1 bg-green-500/20 px-1.5 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-300 font-medium">ON</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">M. FAHAD</p>
            </div>

            {/* Logout Button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFullscreen}
                className="flex items-center space-x-1 sm:space-x-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span className="hidden sm:inline font-medium">{isFullscreen ? "Exit" : "Full"}</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 sm:space-x-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                title="Logout"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-3 sm:space-y-4 max-w-4xl mx-auto w-full relative z-10">
        {messages.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="relative mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-glow">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 sm:mb-3">
              Welcome to JARVIS AI
            </h2>
            <div className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 max-w-lg mx-auto px-2 space-y-2">
              <p>I am JARVIS AI, developed by Mohammad Fahad.</p>
              <p className="text-purple-300 font-medium">Contact:</p>
              <p>Instagram: <a href="https://www.instagram.com/dr_mr.bot/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">@dr_mr.bot</a></p>
              <p className="text-xs text-gray-400 mt-3">Your advanced AI assistant is ready to help with text, voice, and image analysis</p>
            </div>
            <div className="flex justify-center space-x-4 sm:space-x-6 text-sm">
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                </div>
                <span className="text-gray-400 text-xs">Voice</span>
              </div>
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                </div>
                <span className="text-gray-400 text-xs">Image</span>
              </div>
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                </div>
                <span className="text-gray-400 text-xs">AI Chat</span>
              </div>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[90%] sm:max-w-[85%] md:max-w-md lg:max-w-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-sm ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
                  : 'bg-black/40 border border-purple-500/30 text-gray-100'
              }`}
            >
              {message.image && (
                <div className="mb-2 sm:mb-3">
                  <img
                    src={message.image}
                    alt="Uploaded"
                    className="w-full h-24 sm:h-32 md:h-40 object-cover rounded-lg sm:rounded-xl shadow-lg"
                  />
                </div>
              )}
              <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{message.content}</div>
              <div className={`text-xs mt-2 sm:mt-3 flex items-center space-x-1 sm:space-x-2 ${message.role === 'user' ? 'text-purple-200' : 'text-gray-400'}`}>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full"></div>
                <span>{message.timestamp}</span>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-black/40 border border-purple-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 max-w-[90%] sm:max-w-[85%] md:max-w-md shadow-xl backdrop-blur-sm">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs sm:text-sm text-gray-300 font-medium">JARVIS is processing...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center animate-fade-in">
            <div className="bg-red-900/80 border border-red-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 max-w-[90%] sm:max-w-[85%] md:max-w-md shadow-xl backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full animate-pulse"></div>
                <p className="text-xs sm:text-sm text-red-100">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative bg-black/40 backdrop-blur-xl border-t border-purple-500/30 p-2 sm:p-3 z-10">
        <div className="max-w-4xl mx-auto">
          {showImageUpload && (
            <div className="mb-2 sm:mb-3 animate-fade-in">
              <ImageUpload onImageSelect={handleImageSelect} onError={handleImageError} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-end space-x-2 sm:space-x-3">
            <div className="flex-1 flex flex-col space-y-1 sm:space-y-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask JARVIS anything..."
                className="flex-1 p-2 sm:p-3 bg-gray-800/60 text-white border border-gray-600 rounded-lg sm:rounded-xl resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 text-sm backdrop-blur-sm"
                rows="1"
                style={{ minHeight: '44px', maxHeight: '100px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              
              {selectedImage && (
                <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-gray-300">
                  <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Image attached</span>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-1 sm:space-y-2">
              <button
                type="button"
                onClick={() => setShowImageUpload(!showImageUpload)}
                className="p-2 sm:p-3 bg-gray-700/60 hover:bg-gray-600/60 text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-lg"
                title="Upload Image"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <VoiceRecorder
                onTranscript={handleVoiceTranscript}
                onError={handleVoiceError}
              />

              <button
                type="submit"
                disabled={isLoading || (!input.trim() && !selectedImage)}
                className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                title="Send Message"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </form>

          {/* Text-to-Speech Controls - Always show for AI responses */}
          {messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' && (
            <div className="mt-2 sm:mt-3 flex justify-center animate-fade-in">
              <TextToSpeech
                text={messages[messages.length - 1].content}
                lastSpokenText={lastSpokenText}
                onError={setError}
                autoSpeak={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;