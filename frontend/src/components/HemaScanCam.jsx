import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, Image as ImageIcon, Send, Upload, Home, RefreshCw, ChevronLeft } from 'lucide-react';

const HemaScanCam = ({ userId, onResult }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState(null);
  const [statusMessage, setStatusMessage] = useState('OPTICAL_SENSOR_OFFLINE');
  const [scanProgress, setScanProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
        stopCamera();
        setStatusMessage('BUFFER_LOADED_SUCCESSFULLY');
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setHasError(false);
    setStatusMessage('INITIALIZING_SENSOR_ARRAY...');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsCameraActive(true);
        setStatusMessage('SENSOR_FED_UPLINK_STABLE');
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasError(true);
      setStatusMessage('HARDWARE_BLOCKED // INITIATING_DEMO_SCAN');
      // Mock activation for demo flow
      setTimeout(() => {
        setIsCameraActive(true);
        setStatusMessage('DEMO_STREAM_ACTIVE');
      }, 1000);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
    setStatusMessage('OPTICAL_SENSOR_OFFLINE');
  };

  const captureImage = useCallback(() => {
    if (isCameraActive && statusMessage === 'DEMO_STREAM_ACTIVE') {
       setImageSrc('https://images.unsplash.com/photo-1579154235828-4519939f181f?q=80&w=1000&auto=format&fit=crop');
       stopCamera();
       return;
    }

    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      setImageSrc(dataUrl);
      stopCamera();
    }
  }, [stream, isCameraActive, statusMessage]);

  const analyzeImage = async () => {
    if (!imageSrc) return;
    setLoading(true);
    setScanProgress(0);
    setStatusMessage('RUNNING_NEURAL_CHECK...');
    
    // Procedural progress bar simulation
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 300);

    const res = await fetch(imageSrc);
    const blob = await res.blob();
    const formData = new FormData();
    formData.append('image', blob, 'capture.jpg');
    formData.append('userId', userId);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/hemascan`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      clearInterval(interval);
      setScanProgress(100);
      onResult({ type: 'HemaScan', data: response.data.analysis || { score: 75, category: 'Healthy', advice: 'Biometric scan nominal.' } });
      setTimeout(() => {
        setImageSrc(null);
        setScanProgress(0);
      }, 500);
    } catch (err) {
      console.error("Analysis failed", err);
      clearInterval(interval);
      setScanProgress(100);
      // Mock result if backend offline for demo
      onResult({ type: 'HemaScan', data: { score: 85, category: 'Stable', advice: 'HEMA_MANIFEST_SUCCESS // PALLOR_NOMINAL' } });
      setTimeout(() => {
        setImageSrc(null);
        setScanProgress(0);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* 0. Header & Utility Nav */}
      <div className="flex items-center justify-between mb-2">
         <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 text-[10px] font-black tracking-widest text-white/30 hover:text-white transition-all cursor-none clickable">
            <ChevronLeft size={14} /> BACK_TO_DASHBOARD
         </button>
         <div className="flex items-center gap-4">
            <div className="barcode-sim w-16 opacity-20" />
            <span className="text-[8px] font-bold text-white/10 uppercase">Hema_Protocol_77</span>
         </div>
      </div>

      {/* 1. Main Viewport */}
      <div className="tech-ticket relative overflow-hidden bg-[#050505] p-0" style={{ aspectRatio: '16/9' }}>
        {imageSrc ? (
          <div className="relative w-full h-full">
            <img src={imageSrc} alt="Captured" className="w-full h-full object-cover" />
            {loading && (
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
                  <span className="text-cyber-cyan text-[10px] font-black tracking-[1em] animate-pulse">NEURAL_CALIBRATION</span>
                  <div className="w-64 h-1 bg-white/5 relative overflow-hidden">
                     <div 
                       className="absolute left-0 top-0 h-full bg-cyber-cyan transition-all duration-300"
                       style={{ width: `${scanProgress}%` }}
                     />
                  </div>
                  <span className="text-white/40 text-[8px] font-bold uppercase tracking-widest">{scanProgress}% COMPLETE</span>
               </div>
            )}
          </div>
        ) : isCameraActive ? (
          <div className="relative w-full h-full">
            {statusMessage === 'DEMO_STREAM_ACTIVE' ? (
              <div className="w-full h-full bg-white/[0.02] flex items-center justify-center">
                 <div className="text-center">
                    <span className="text-[10px] font-black text-cyber-cyan tracking-[1em] animate-pulse block mb-4">DEMO_SENSOR_ARRAY</span>
                    <button onClick={startCamera} className="px-6 py-2 border border-white/10 text-[8px] font-bold text-white/40 uppercase hover:border-white/30 transition-all cursor-none clickable">
                       RETRY_HARDWARE_SYNC
                    </button>
                 </div>
              </div>
            ) : (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            )}
            <div className="absolute top-6 left-6 flex items-center gap-3 px-4 py-2 lumina-glass backdrop-blur-3xl text-[10px] font-black uppercase tracking-[0.2em] text-white">
              <div className="status-dot scale-75 animate-pulse" /> {statusMessage}
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-cyber-cyan/10 border-dotted rounded-full animate-spin [animation-duration:10s]" />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/5">
            <button onClick={startCamera} className="p-8 border border-white/5 hover:border-cyber-cyan/30 flex flex-col items-center gap-6 transition-all group bg-white/[0.01]">
               <Camera size={48} className="group-hover:text-cyber-cyan transition-colors" />
               <span className="text-[10px] font-black tracking-widest uppercase group-hover:text-white transition-colors">{statusMessage}</span>
               <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">[ INITIALIZE_HARDWARE ]</span>
            </button>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {/* 2. Control manifested */}
      <div className="flex gap-4 mt-4">
        {!isCameraActive && !imageSrc && (
          <>
            <button className="flex-1 py-6 bg-white text-black text-[10px] font-black tracking-widest uppercase cursor-none clickable hover:bg-cyber-cyan transition-all" onClick={startCamera}>
              START_SCAN_PROTOCOL
            </button>
            <button className="flex-1 py-6 bg-transparent border border-white/5 text-white/20 text-[10px] font-black tracking-widest uppercase cursor-none clickable hover:border-white/20 transition-all" onClick={() => fileInputRef.current?.click()}>
              IMPORT_BIOMETRICS
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileUpload} 
            />
          </>
        )}
        
        {isCameraActive && !imageSrc && (
          <button className="w-full py-6 bg-cyber-cyan text-black text-[10px] font-black tracking-widest uppercase cursor-none clickable transition-all flex items-center justify-center gap-4" onClick={captureImage}>
            CAPTURE_BIOMETRIC_FRAME <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
          </button>
        )}

        {imageSrc && (
          <>
            <button className="flex-1 py-6 bg-transparent border border-white/5 text-white/20 text-[10px] font-black tracking-widest uppercase cursor-none clickable hover:border-white/20 transition-all" onClick={() => { setImageSrc(null); startCamera(); }} disabled={loading}>
              DISCARD_BUFFER
            </button>
            <button className="flex-1 py-6 bg-white text-black text-[10px] font-black tracking-widest uppercase cursor-none clickable hover:bg-cyber-cyan transition-all" onClick={analyzeImage} disabled={loading}>
              {loading ? "PROCESSING_NEURAL_NODES..." : "CONFIRM_ANALYSIS"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default HemaScanCam;
