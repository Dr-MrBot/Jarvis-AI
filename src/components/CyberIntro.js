import React, { useState, useEffect, useRef } from 'react';
import { Zap, Shield, Cpu, Wifi } from 'lucide-react';

const CyberIntro = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const audioContextRef = useRef(null);

  const steps = [
    { text: "INITIALIZING JARVIS", icon: Cpu, delay: 1000 },
    { text: "ESTABLISHING SECURE CONNECTION", icon: Shield, delay: 1500 },
    { text: "CONNECTING TO AI NETWORK", icon: Wifi, delay: 1500 },
    { text: "SYSTEM READY", icon: Zap, delay: 1000 }
  ];

  const playCyberSound = (frequency, duration) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 2, audioContextRef.current.currentTime + duration);
      
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.log('Audio not supported');
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
      
      // Create a hacking-like sound pattern
      const now = audioContextRef.current.currentTime;
      oscillator.frequency.setValueAtTime(200, now);
      oscillator.frequency.setValueAtTime(400, now + 0.1);
      oscillator.frequency.setValueAtTime(300, now + 0.2);
      oscillator.frequency.setValueAtTime(500, now + 0.3);
      oscillator.frequency.setValueAtTime(250, now + 0.4);
      
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.setValueAtTime(0.1, now + 0.1);
      gainNode.gain.setValueAtTime(0.05, now + 0.2);
      gainNode.gain.setValueAtTime(0.1, now + 0.3);
      gainNode.gain.setValueAtTime(0.05, now + 0.4);
      
      oscillator.start(now);
      oscillator.stop(now + 0.5);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        playCyberSound(300 + currentStep * 100, 0.3);
        setCurrentStep(currentStep + 1);
      } else {
        playHackingSound();
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 500);
        }, 1000);
      }
    }, steps[currentStep].delay);

    return () => clearTimeout(timer);
  }, [currentStep, steps, onComplete]);

  if (!isVisible) return null;

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Matrix-style background effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="matrix-bg"></div>
        </div>
        
        {/* Main content */}
        <div className="relative z-10">
          {/* Logo/Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center animate-pulse">
              <Zap className="w-12 h-12 text-white" />
            </div>
          </div>
          
          {/* Current step */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              {CurrentIcon && (
                <CurrentIcon className="w-6 h-6 text-cyan-400 animate-pulse" />
              )}
              <h1 className="text-2xl sm:text-3xl font-mono font-bold text-cyan-400 tracking-wider">
                {steps[currentStep].text}
              </h1>
            </div>
            
            {/* Progress bar */}
            <div className="w-64 sm:w-80 mx-auto bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
            
            {/* Loading dots */}
            <div className="flex justify-center space-x-1">
              {[0, 1, 2].map((dot) => (
                <div
                  key={dot}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    dot <= currentStep ? 'bg-cyan-400 animate-pulse' : 'bg-gray-600'
                  }`}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Status text */}
          <div className="mt-8 text-sm text-gray-400 font-mono">
            <p>SYSTEM STATUS: {currentStep < steps.length - 1 ? 'INITIALIZING' : 'READY'}</p>
            <p className="mt-1">PROGRESS: {Math.round(((currentStep + 1) / steps.length) * 100)}%</p>
          </div>
        </div>
      </div>
      
      {/* CSS for matrix background */}
      <style jsx>{`
        .matrix-bg {
          background: linear-gradient(90deg, transparent 50%, rgba(0, 255, 255, 0.1) 50%);
          background-size: 20px 20px;
          animation: matrix 2s linear infinite;
        }
        
        @keyframes matrix {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); }
        }
      `}</style>
    </div>
  );
};

export default CyberIntro; 