import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

// Global flag to prevent multiple speech instances
let globalSpeechInProgress = false;

const TextToSpeech = ({ text, lastSpokenText, onError, autoSpeak = false }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [internalLastSpokenText, setInternalLastSpokenText] = useState('');

  // Use the prop if provided, otherwise use internal state
  const effectiveLastSpokenText = lastSpokenText || internalLastSpokenText;

  // Function to clean text for speech (remove emojis and URLs)
  const cleanTextForSpeech = (textToClean) => {
    if (!textToClean) return '';
    
    return textToClean
      // Remove emojis
      .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
      // Remove URLs
      .replace(/https?:\/\/[^\s]+/g, '')
      // Remove Instagram handles but keep the username
      .replace(/@([a-zA-Z0-9._]+)/g, '$1')
      // Clean up extra spaces
      .replace(/\s+/g, ' ')
      .trim();
  };

  const speak = useCallback((textToSpeak) => {
    if (!isEnabled || !textToSpeak || globalSpeechInProgress) return;

    // Set global flag to prevent other speech instances
    globalSpeechInProgress = true;

    // Cancel any existing speech immediately
    speechSynthesis.cancel();
    if (currentUtterance) {
      currentUtterance.cancel();
    }

    // Clean the text before speaking
    const cleanedText = cleanTextForSpeech(textToSpeak);
    if (!cleanedText) {
      setIsSpeaking(false);
      globalSpeechInProgress = false;
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    
    // Configure speech settings for male voice
    utterance.rate = 0.85; // Slightly slower for clarity
    utterance.pitch = 0.7; // Lower pitch for male voice
    utterance.volume = 0.9; // Higher volume
    
    // Try to use a male voice
    const voices = speechSynthesis.getVoices();
    const maleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('male') ||
      voice.name.toLowerCase().includes('david') ||
      voice.name.toLowerCase().includes('james') ||
      voice.name.toLowerCase().includes('john') ||
      voice.name.toLowerCase().includes('mark') ||
      voice.name.toLowerCase().includes('mike') ||
      voice.name.toLowerCase().includes('paul') ||
      voice.name.toLowerCase().includes('steve') ||
      voice.name.toLowerCase().includes('tom') ||
      voice.name.toLowerCase().includes('will') ||
      voice.name.toLowerCase().includes('google uk english male') ||
      voice.name.toLowerCase().includes('google us english male') ||
      voice.name.toLowerCase().includes('microsoft david') ||
      voice.name.toLowerCase().includes('microsoft mark') ||
      voice.name.toLowerCase().includes('microsoft james') ||
      voice.name.toLowerCase().includes('microsoft george') ||
      voice.name.toLowerCase().includes('microsoft ryan') ||
      voice.name.toLowerCase().includes('microsoft tony') ||
      voice.name.toLowerCase().includes('microsoft guy') ||
      voice.name.toLowerCase().includes('microsoft frank') ||
      voice.name.toLowerCase().includes('microsoft ravi') ||
      voice.name.toLowerCase().includes('microsoft hemant') ||
      voice.name.toLowerCase().includes('microsoft neeraj') ||
      voice.name.toLowerCase().includes('microsoft prabhat') ||
      voice.name.toLowerCase().includes('microsoft sanjay') ||
      voice.name.toLowerCase().includes('microsoft vishwa') ||
      voice.name.toLowerCase().includes('microsoft kalpana') ||
      voice.name.toLowerCase().includes('microsoft heera')
    );
    
    if (maleVoice) {
      utterance.voice = maleVoice;
    } else {
      // If no male voice found, use default voice but ensure it's not female
      const defaultVoice = voices.find(voice => 
        !voice.name.toLowerCase().includes('female') &&
        !voice.name.toLowerCase().includes('zira') &&
        !voice.name.toLowerCase().includes('hazel') &&
        !voice.name.toLowerCase().includes('eva') &&
        !voice.name.toLowerCase().includes('maria') &&
        !voice.name.toLowerCase().includes('sarah') &&
        !voice.name.toLowerCase().includes('lisa') &&
        !voice.name.toLowerCase().includes('kate') &&
        !voice.name.toLowerCase().includes('victoria') &&
        !voice.name.toLowerCase().includes('samantha') &&
        !voice.name.toLowerCase().includes('alex') &&
        !voice.name.toLowerCase().includes('siri') &&
        !voice.name.toLowerCase().includes('cortana') &&
        !voice.name.toLowerCase().includes('google uk english female') &&
        !voice.name.toLowerCase().includes('google us english female') &&
        !voice.name.toLowerCase().includes('microsoft zira') &&
        !voice.name.toLowerCase().includes('microsoft heera') &&
        !voice.name.toLowerCase().includes('microsoft kalpana')
      );
      
      if (defaultVoice) {
        utterance.voice = defaultVoice;
      }
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentUtterance(utterance);
      setInternalLastSpokenText(cleanedText);
      // Play response sound effect
      playResponseSound();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentUtterance(null);
      globalSpeechInProgress = false;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setCurrentUtterance(null);
      onError('Speech synthesis failed. Please try again.');
      globalSpeechInProgress = false;
    };

    utterance.onpause = () => {
      setIsSpeaking(false);
    };

    utterance.onresume = () => {
      setIsSpeaking(true);
    };

    try {
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
      setCurrentUtterance(null);
      onError('Speech synthesis not supported in this browser.');
      globalSpeechInProgress = false;
    }
  }, [isEnabled, currentUtterance, onError, isSpeaking]);

  const playResponseSound = () => {
    try {
      // Create a simple beep sound effect
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Sound effect not supported');
    }
  };

  const stopSpeaking = () => {
    try {
      // Cancel current utterance
      if (currentUtterance) {
        currentUtterance.cancel();
        setCurrentUtterance(null);
      }
      // Cancel all speech synthesis
      speechSynthesis.cancel();
      // Reset state and global flag
      setIsSpeaking(false);
      globalSpeechInProgress = false;
    } catch (error) {
      console.error('Error stopping speech:', error);
      setIsSpeaking(false);
      setCurrentUtterance(null);
      globalSpeechInProgress = false;
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      // Ensure we're not already speaking before starting
      if (!isSpeaking && !currentUtterance) {
        speak(text);
      }
    }
  };

  const toggleEnabled = () => {
    if (isEnabled && isSpeaking) {
      stopSpeaking();
    }
    setIsEnabled(!isEnabled);
  };

  // Auto-speak if enabled and text is new and different from last spoken
  useEffect(() => {
    if (autoSpeak && isEnabled && text) {
      const cleanedText = cleanTextForSpeech(text);
      if (cleanedText && cleanedText !== effectiveLastSpokenText && !isSpeaking) {
        // Set a flag to prevent multiple speech instances
        setIsSpeaking(true);
        
        // Small delay to ensure component is stable
        const timeoutId = setTimeout(() => {
          // Final check before speaking
          if (isEnabled && !currentUtterance) {
            speak(text);
          } else {
            setIsSpeaking(false);
          }
        }, 1500);
        
        return () => {
          clearTimeout(timeoutId);
          setIsSpeaking(false);
        };
      }
    }
  }, [text, isEnabled, autoSpeak]); // Removed dependencies that cause re-triggers

  // Reset speaking state when text changes
  useEffect(() => {
    if (text !== effectiveLastSpokenText) {
      setIsSpeaking(false);
      setInternalLastSpokenText('');
    }
  }, [text, effectiveLastSpokenText]);

  return (
    <div className="flex items-center space-x-2 sm:space-x-3 bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-lg">
      <button
        onClick={toggleEnabled}
        className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 ${
          isEnabled 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg' 
            : 'bg-gray-600/60 hover:bg-gray-500/60 text-gray-300'
        }`}
        title={isEnabled ? 'Disable Voice' : 'Enable Voice'}
      >
        {isEnabled ? (
          <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
        )}
      </button>
      
      {isEnabled && (
        <button
          onClick={toggleSpeech}
          className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 ${
            isSpeaking 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg' 
              : 'bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white shadow-lg'
          }`}
          title={isSpeaking ? 'Stop Speaking' : 'Speak Text'}
        >
          {isSpeaking ? (
            <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Play className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </button>
      )}
      
      {isSpeaking && (
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-xs text-gray-300 font-medium">JARVIS speaking...</span>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech; 