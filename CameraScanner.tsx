
import React, { useRef, useState, useEffect } from 'react';
import { ScanMode } from '../types';

interface CameraScannerProps {
  onCapture: (base64: string, mode: ScanMode) => void;
  onClose: () => void;
  initialMode?: ScanMode;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture, onClose, initialMode = ScanMode.GENERAL }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<ScanMode>(initialMode);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraReady(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Please grant camera permissions to use this feature.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [facingMode]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const base64 = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
        onCapture(base64, mode);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        onCapture(base64, mode);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between text-white bg-black/40 backdrop-blur-md absolute top-0 left-0 right-0 z-10">
        <button onClick={onClose} className="p-2"><i className="fas fa-arrow-left text-xl"></i></button>
        <div className="flex bg-white/10 p-1 rounded-full">
          <button 
            onClick={() => setMode(ScanMode.GENERAL)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${mode === ScanMode.GENERAL ? 'bg-white text-black' : 'text-white'}`}
          >General</button>
          <button 
            onClick={() => setMode(ScanMode.FOOD)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${mode === ScanMode.FOOD ? 'bg-white text-black' : 'text-white'}`}
          >Food</button>
          <button 
            onClick={() => setMode(ScanMode.PLANT)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${mode === ScanMode.PLANT ? 'bg-white text-black' : 'text-white'}`}
          >Plant</button>
        </div>
        <button onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')} className="p-2">
          <i className="fas fa-rotate text-xl"></i>
        </button>
      </div>

      {/* Video Stream */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="flex-1 object-cover w-full h-full"
      />

      {/* Frame Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 border-2 border-white/50 rounded-3xl relative">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl -m-1"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl -m-1"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl -m-1"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl -m-1"></div>
          <div className="absolute bottom-[-40px] left-0 right-0 text-center text-white text-sm font-medium">Align object within the frame</div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-8 pb-12 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between absolute bottom-0 left-0 right-0">
        <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
          <i className="fas fa-image text-xl"></i>
        </button>
        <button 
          onClick={captureImage}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-90"
        >
          <div className="w-16 h-16 rounded-full bg-blue-600"></div>
        </button>
        <div className="w-12 h-12"></div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileUpload}
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraScanner;
