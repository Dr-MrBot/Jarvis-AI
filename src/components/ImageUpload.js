import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ onImageSelect, onError }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const permission = await navigator.permissions.query({ name: 'camera' });
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

  const requestCameraPermission = async () => {
    if (permissionRequested) return false;
    
    setPermissionRequested(true);
    
    try {
      // For mobile devices, use simpler video constraints
      const videoConstraints = isMobile ? {
        video: {
          facingMode: 'environment' // Use back camera on mobile
        }
      } : {
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: 'environment'
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
      
      // Stop the stream immediately after getting permission
      stream.getTracks().forEach(track => track.stop());
      setPermissionDenied(false);
      setPermissionRequested(false);
      return true;
    } catch (error) {
      console.error('Camera permission error:', error);
      setPermissionRequested(false);
      
      if (error.name === 'NotAllowedError') {
        setPermissionDenied(true);
        if (isMobile) {
          onError('Camera access denied. Please go to your browser settings and allow camera permissions for this site.');
        } else {
          onError('Camera access denied. Please allow camera permissions in your browser settings and refresh the page.');
        }
      } else if (error.name === 'NotFoundError') {
        onError('No camera found. Please check your device settings.');
      } else if (error.name === 'NotReadableError') {
        onError('Camera is already in use by another application.');
      } else {
        onError('Camera not available. Please check your device settings.');
      }
      return false;
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target.result);
          onImageSelect(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        onError('Please select a valid image file.');
      }
    }
  };

  const openCamera = async () => {
    if (permissionDenied) {
      if (isMobile) {
        onError('Please go to your browser settings and allow camera permissions for this site.');
      } else {
        onError('Please allow camera permissions and refresh the page.');
      }
      return;
    }

    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      // For mobile devices, use simpler video constraints
      const videoConstraints = isMobile ? {
        video: {
          facingMode: 'environment' // Use back camera on mobile
        }
      } : {
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: 'environment'
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }
      
      setIsCameraOpen(true);
      setPermissionDenied(false);
    } catch (error) {
      console.error('Error accessing camera:', error);
      if (error.name === 'NotAllowedError') {
        setPermissionDenied(true);
        if (isMobile) {
          onError('Camera access denied. Please go to your browser settings and allow camera permissions for this site.');
        } else {
          onError('Camera access denied. Please allow camera permissions and refresh the page.');
        }
      } else if (error.name === 'NotFoundError') {
        onError('No camera found. Please check your device settings.');
      } else if (error.name === 'NotReadableError') {
        onError('Camera is already in use by another application.');
      } else {
        onError('Failed to access camera. Please check your device settings.');
      }
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      try {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      } catch (error) {
        console.error('Error closing camera:', error);
      }
    }
    setIsCameraOpen(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      try {
        const context = canvasRef.current.getContext('2d');
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        const imageData = canvasRef.current.toDataURL('image/jpeg', 0.8);
        setSelectedImage(imageData);
        onImageSelect(imageData);
        closeCamera();
      } catch (error) {
        console.error('Error capturing image:', error);
        onError('Failed to capture image. Please try again.');
      }
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    onImageSelect(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-4 bg-black/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image preview */}
      {selectedImage && (
        <div className="relative">
          <img
            src={selectedImage}
            alt="Selected"
            className="w-full max-w-md h-32 sm:h-48 object-cover rounded-xl border-2 border-purple-500/30 shadow-lg"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Upload buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          onClick={triggerFileInput}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <Upload className="h-5 w-5" />
          <span className="font-medium">Upload Image</span>
        </button>
        
        <button
          onClick={openCamera}
          disabled={permissionDenied}
          className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg ${
            permissionDenied
              ? 'bg-gray-600/60 text-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white'
          }`}
        >
          <Camera className="h-5 w-5" />
          <span className="font-medium">{permissionDenied ? 'Camera Blocked' : 'Take Photo'}</span>
        </button>
      </div>

      {/* Permission denied message */}
      {permissionDenied && (
        <div className="text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded-lg text-center">
          {isMobile ? 'Camera permission denied. Please check browser settings.' : 'Camera permission denied. Please allow camera access in browser settings.'}
        </div>
      )}

      {/* Camera modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Take a Photo</h3>
              <button
                onClick={closeCamera}
                className="p-2 hover:bg-gray-800/60 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-gray-300" />
              </button>
            </div>
            
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-xl border border-purple-500/30"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            <div className="flex justify-center mt-4 space-x-3">
              <button
                onClick={captureImage}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-lg font-medium"
              >
                Capture
              </button>
              <button
                onClick={closeCamera}
                className="px-6 py-3 bg-gray-600/60 hover:bg-gray-500/60 text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-gray-300 text-center flex items-center justify-center space-x-2">
        <ImageIcon className="h-4 w-4 text-purple-400" />
        <p>Upload an image or take a photo to analyze with AI</p>
      </div>
    </div>
  );
};

export default ImageUpload; 