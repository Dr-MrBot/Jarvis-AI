import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

const VoiceRecorder = ({ onTranscript, onError }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(isMobileDevice);
    };
    checkMobile();
  }, []);

  // Check permission status on component mount
  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const permission = await navigator.permissions.query({ name: 'microphone' });
        if (permission.state === 'denied') {
          setPermissionDenied(true);
        }
        permission.onchange = () => {
          if (permission.state === 'granted') {
            setPermissionDenied(false);
          } else if (permission.state === 'denied') {
            setPermissionDenied(true);
          }
        };
      }
    } catch (error) {
      console.log('Permission API not supported');
    }
  };

  const requestMicrophonePermission = async () => {
    if (permissionRequested) return false;
    
    setPermissionRequested(true);
    
    try {
      // For mobile devices, use simpler audio constraints
      const audioConstraints = isMobile ? {
        audio: true
      } : {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(audioConstraints);
      
      // Stop the stream immediately after getting permission
      stream.getTracks().forEach(track => track.stop());
      setPermissionDenied(false);
      setPermissionRequested(false);
      return true;
    } catch (error) {
      console.error('Microphone permission error:', error);
      setPermissionRequested(false);
      
      if (error.name === 'NotAllowedError') {
        setPermissionDenied(true);
        if (isMobile) {
          onError('Microphone access denied. Please go to your browser settings and allow microphone permissions for this site.');
        } else {
          onError('Microphone access denied. Please allow microphone permissions in your browser settings and refresh the page.');
        }
      } else if (error.name === 'NotFoundError') {
        onError('No microphone found. Please check your device settings.');
      } else if (error.name === 'NotReadableError') {
        onError('Microphone is already in use by another application.');
      } else {
        onError('Microphone not available. Please check your device settings.');
      }
      return false;
    }
  };

  const startRecording = async () => {
    if (permissionDenied) {
      if (isMobile) {
        onError('Please go to your browser settings and allow microphone permissions for this site.');
      } else {
        onError('Please allow microphone permissions and refresh the page.');
      }
      return;
    }

    try {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) return;

      // For mobile devices, use simpler audio constraints
      const audioConstraints = isMobile ? {
        audio: true
      } : {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(audioConstraints);
      
      // Try different MIME types for better compatibility
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/mp4';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = '';
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: mimeType || undefined
      });
      
      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        startSpeechRecognition();
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        onError('Recording failed. Please try again.');
        setIsRecording(false);
      };

      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsRecording(true);
      setPermissionDenied(false);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      if (error.name === 'NotAllowedError') {
        setPermissionDenied(true);
        if (isMobile) {
          onError('Microphone access denied. Please go to your browser settings and allow microphone permissions for this site.');
        } else {
          onError('Microphone access denied. Please allow microphone permissions and refresh the page.');
        }
      } else if (error.name === 'NotFoundError') {
        onError('No microphone found. Please check your device settings.');
      } else if (error.name === 'NotReadableError') {
        onError('Microphone is already in use by another application.');
      } else {
        onError('Failed to access microphone. Please check your device settings.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      } catch (error) {
        console.error('Error stopping recording:', error);
        setIsRecording(false);
      }
    }
  };

  const startSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          onTranscript(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          onError('Speech recognition permission denied. Please allow microphone access.');
        } else if (event.error === 'no-speech') {
          onError('No speech detected. Please try again.');
        } else if (event.error === 'audio-capture') {
          onError('Audio capture failed. Please check your microphone.');
        } else if (event.error === 'network') {
          onError('Network error. Please check your internet connection.');
        } else {
          onError('Speech recognition error. Please try again.');
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        onError('Speech recognition failed to start. Please try again.');
        setIsListening(false);
      }
    } else {
      onError('Speech recognition not supported in this browser.');
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
        setIsListening(false);
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording || isListening) {
      stopRecording();
      stopSpeechRecognition();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex items-center space-x-2 sm:space-x-3">
      <button
        onClick={toggleRecording}
        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg ${
          isRecording || isListening
            ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white animate-pulse'
            : permissionDenied
            ? 'bg-gray-600/60 text-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
        }`}
        title={isRecording || isListening ? 'Stop Recording' : 'Start Voice Recording'}
        disabled={permissionDenied}
      >
        {isRecording || isListening ? (
          <MicOff className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
        )}
      </button>
      
      {isListening && (
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-xs text-gray-300 font-medium">Listening...</span>
        </div>
      )}
      
      {permissionDenied && (
        <div className="text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded-lg">
          {isMobile ? 'Check browser settings' : 'Permission denied'}
        </div>
      )}
      
      {transcript && (
        <div className="text-xs text-gray-300 bg-gray-800/40 px-2 py-1 rounded-lg max-w-24 sm:max-w-32 truncate">
          "{transcript}"
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder; 