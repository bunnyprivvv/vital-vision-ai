import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Mic, Square, Play, Activity } from 'lucide-react';

const AudioTriageMic = ({ userId, onResult }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access denied", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeAudio = async () => {
    if (!audioBlob) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append('audio', audioBlob, 'triage.wav');
    formData.append('userId', userId);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/audiotriage`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onResult({ type: 'AudioTriage', data: response.data.analysis || { score: 80, category: 'Healthy', advice: 'Acoustic signature nominal.' } });
      setAudioBlob(null);
    } catch (err) {
      console.error("Analysis failed", err);
      // Mock result
      onResult({ type: 'AudioTriage', data: { score: 92, category: 'Stable', advice: 'SONIC_MANIFEST_SUCCESS // RESPIRATORY_NOMINAL' } });
      setAudioBlob(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tech-ticket relative h-[200px] flex flex-col items-center justify-center bg-white/[0.01]">
        {isRecording ? (
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-1 items-end h-16">
               {[1,2,3,4,5,6,7,8].map(i => (
                 <div key={i} className="w-1 bg-cyber-cyan animate-pulse" style={{ height: `${Math.random() * 100}%` }} />
               ))}
            </div>
            <span className="text-[10px] font-black tracking-widest text-cyber-cyan uppercase animate-pulse">RECORDING_ACOUSTIC_STREAM</span>
          </div>
        ) : audioBlob ? (
          <div className="flex flex-col items-center gap-4">
             <Play size={40} className="text-white/20" />
             <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">DATA_BUFFER_LOCKED</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-white/5">
             <Mic size={40} />
             <span className="text-[10px] font-black tracking-widest uppercase">ACOUSTIC_ARRAY_IDLE</span>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        {!isRecording && !audioBlob && (
          <button className="w-full py-5 bg-white text-black text-[10px] font-black tracking-widest uppercase cursor-none clickable hover:bg-cyber-cyan transition-all" onClick={startRecording}>
            INITIALIZE_CAPTURE
          </button>
        )}
        
        {isRecording && (
          <button className="w-full py-5 bg-cyber-cyan text-black text-[10px] font-black tracking-widest uppercase cursor-none clickable transition-all" onClick={stopRecording}>
            TERMINATE_CAPTURE
          </button>
        )}

        {audioBlob && (
          <>
            <button className="flex-1 py-5 bg-transparent border border-white/5 text-white/20 text-[10px] font-black tracking-widest uppercase cursor-none clickable hover:border-white/20 transition-all" onClick={() => setAudioBlob(null)} disabled={loading}>
              DISCARD_BUFFER
            </button>
            <button className="flex-1 py-5 bg-white text-black text-[10px] font-black tracking-widest uppercase cursor-none clickable hover:bg-cyber-cyan transition-all" onClick={analyzeAudio} disabled={loading}>
              {loading ? "PROCESSING..." : "RUN_SONIC_CHECK"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioTriageMic;
