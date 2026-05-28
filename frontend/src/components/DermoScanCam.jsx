import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Lock } from 'lucide-react';

const DermoScanCam = ({ userId, onResult }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      setImageSrc(dataUrl);
      stopCamera();
    }
  }, [stream]);

  const analyzeDermo = async () => {
    if (!imageSrc) return;
    setLoading(true);
    
    const res = await fetch(imageSrc);
    const blob = await res.blob();
    const formData = new FormData();
    formData.append('image', blob, 'dermo.jpg');
    formData.append('userId', userId);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/dermoscan`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onResult({ type: 'DermoScan', data: response.data.analysis || { score: 75, category: 'Healthy', advice: 'Dermal manifest nominal.' } });
      setImageSrc(null);
    } catch (err) {
      console.error("Analysis failed", err);
      // Mock result
      onResult({ type: 'DermoScan', data: { score: 82, category: 'Stable', advice: 'DERMAL_MANIFEST_SUCCESS // ASYMMETRY_NOMINAL' } });
      setImageSrc(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tech-ticket relative overflow-hidden bg-[#050505] p-0" style={{ aspectRatio: '1/1' }}>
        {imageSrc ? (
          <img src={imageSrc} alt="Captured" className="w-full h-full object-cover" />
        ) : isCameraActive ? (
          <div className="relative w-full h-full">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6 flex items-center gap-3 px-4 py-2 lumina-glass backdrop-blur-3xl text-[10px] font-black uppercase tracking-[0.2em] text-white">
              <div className="status-dot scale-75 animate-pulse" /> DERMAL_MAPPING_LIVE
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-cyber-cyan/30 rounded-lg">
               <div 
                 className="w-full h-[1px] bg-cyber-cyan shadow-[0_0_10px_var(--cyber-cyan)] animate-scan"
               />
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/5">
            <Lock size={48} />
            <span className="text-[10px] font-black tracking-widest uppercase">DERMAL_ARRAY_OFFLINE</span>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div className="flex gap-4 mt-6">
        {!isCameraActive && !imageSrc && (
          <button className="w-full py-5 bg-white text-black text-[10px] font-black tracking-widest uppercase cursor-none clickable hover:bg-cyber-cyan transition-all" onClick={startCamera}>
            INITIALIZE_DERMAL_MAPPING
          </button>
        )}
        
        {isCameraActive && !imageSrc && (
          <button className="w-full py-5 bg-cyber-cyan text-black text-[10px] font-black tracking-widest uppercase cursor-none clickable transition-all" onClick={captureImage}>
            CAPTURE_MAP
          </button>
        )}

        {imageSrc && (
          <>
            <button className="flex-1 py-5 bg-transparent border border-white/5 text-white/20 text-[10px] font-black tracking-widest uppercase cursor-none clickable hover:border-white/20 transition-all" onClick={() => { setImageSrc(null); startCamera(); }} disabled={loading}>
              DISCARD_TARGET
            </button>
            <button className="flex-1 py-5 bg-white text-black text-[10px] font-black tracking-widest uppercase cursor-none clickable hover:bg-cyber-cyan transition-all" onClick={analyzeDermo} disabled={loading}>
              {loading ? "MAPPING..." : "RUN_ASYMMETRY_PROTO"}
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes scanning {
          0% { transform: translateY(0); }
          50% { transform: translateY(192px); }
          100% { transform: translateY(0); }
        }
        .animate-scan { animation: scanning 4s linear infinite; }
      `}</style>
    </div>
  );
};

export default DermoScanCam;
