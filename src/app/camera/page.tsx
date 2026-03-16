"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera as CameraIcon, UploadCloud, X, ArrowLeft, Image as ImageIcon } from "lucide-react";

export default function CameraPage() {
  const router = useRouter();
  const [guestName, setGuestName] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const MAX_PHOTOS = 10;
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const name = localStorage.getItem("guestName");
    if (!name) {
      router.push("/");
      return;
    }
    setGuestName(name);
    
    // Leer el contador almacenado en este dispositivo particular
    const savedCount = localStorage.getItem("photoCount");
    if (savedCount) {
      setPhotoCount(parseInt(savedCount, 10));
    } else {
      setPhotoCount(0);
    }
  }, [router]);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setSelectedFile(file);
    }
  };

  const cancelImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImage = async () => {
    if (!selectedFile || !guestName) return;
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("guestName", guestName);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al subir la imagen");
      }

      // Actualizar el estado y persistirlo en este dispositivo (para proteger contra F5)
      const newCount = photoCount + 1;
      setPhotoCount(newCount);
      localStorage.setItem("photoCount", newCount.toString());

      setSelectedImage(null);
      setSelectedFile(null);
      
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (!guestName) return null;


  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col relative overflow-hidden">
      {/* Fondo elegante sutil */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

      {/* Header Fijo */}
      <header className="p-4 flex items-center justify-between border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <button 
          onClick={() => router.push("/")}
          className="p-2 -ml-2 text-zinc-500 hover:text-amber-600 transition-colors rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Invitado</p>
          <p className="font-serif font-semibold text-zinc-800">{guestName}</p>
        </div>
        <div className="flex items-center space-x-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 shadow-sm">
          <ImageIcon className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-amber-700">
            {photoCount}/{MAX_PHOTOS}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 animate-in fade-in duration-500 z-10 relative">
        {photoCount >= MAX_PHOTOS ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4 border border-amber-200 shadow-xl shadow-amber-900/5">
              <UploadCloud className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-zinc-800">¡Álbum Lleno!</h2>
            <p className="text-zinc-500 max-w-sm">
              Has tomado tus {MAX_PHOTOS} fotos. ¡Gracias por compartir estos recuerdos!
            </p>
            <button 
              onClick={() => router.push("/album")}
              className="mt-8 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-2xl shadow-lg hover:from-amber-600 hover:to-amber-700 transition-colors"
            >
              Ver el álbum completo
            </button>
          </div>
        ) : !selectedImage ? (
          <div className="flex-1 flex flex-col items-center justify-center group relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            
            {/* Camera Area Elegante */}
            <div className="w-full max-w-md aspect-[3/4] bg-white border border-dashed border-amber-300 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center space-y-4 transition-all hover:border-amber-400 hover:bg-amber-50/50">
              <div className="w-24 h-24 bg-gradient-to-tr from-amber-100 to-amber-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner border border-amber-100">
                <CameraIcon className="w-12 h-12 text-amber-500/80 group-hover:text-amber-600 transition-colors" />
              </div>
              <p className="text-zinc-500 font-medium">Toca para abrir la cámara</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            {/* Previsualización estilo Polariod/Elegante */}
            <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-amber-900/10 ring-4 ring-white">
              <img 
                src={selectedImage} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={cancelImage}
                disabled={isUploading}
                className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-full text-zinc-800 hover:bg-white transition-colors disabled:opacity-50 shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Botón de Subida */}
            <button
              onClick={uploadImage}
              disabled={isUploading}
              className="w-full max-w-md py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed hover:from-amber-600 hover:to-amber-700 transition-all active:scale-[0.98]"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Subiendo recuerdo...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-6 h-6" />
                  <span>Subir Foto al Álbum</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Input nativo oculto para la captura de fotos */}
      <input 
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleCapture}
      />
      
      {/* Botón Flotante Permanente al Álbum */}
      <button
        type="button"
        onClick={() => router.push("/album")}
        className="absolute bottom-6 mx-auto left-0 right-0 w-max px-6 py-2.5 bg-white/90 backdrop-blur-md shadow-xl shadow-amber-900/10 border border-amber-200 text-amber-700 font-semibold rounded-full flex items-center space-x-2 hover:bg-amber-50 hover:scale-105 active:scale-95 transition-all z-40"
      >
        <ImageIcon className="w-4 h-4" />
        <span>Ver álbum participativo</span>
      </button>

      {/* Capa de Bloqueo mientras sube la foto */}
      {isUploading && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-amber-700 font-medium animate-pulse">Guardando en el álbum...</p>
        </div>
      )}
    </main>
  );
}

