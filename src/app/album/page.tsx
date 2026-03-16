"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Image as ImageIcon, Loader2 } from "lucide-react";

interface Photo {
  id: string;
  name: string;
  url: string;
}

export default function AlbumPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch("/api/photos");
        if (!res.ok) throw new Error("Error al cargar fotos");
        
        const data = await res.json();
        setPhotos(data.photos || []);
      } catch (err: any) {
        setError(err.message || "No se pudieron cargar las fotos");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPhotos();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col relative overflow-hidden">
      {/* Fondo elegante sutil */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-multiply pointer-events-none"></div>

      {/* Header Fijo */}
      <header className="p-4 flex items-center justify-between border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <button 
          onClick={() => router.push("/camera")}
          className="flex items-center space-x-2 text-zinc-500 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Volver a cámara</span>
        </button>
        <div className="flex items-center space-x-2 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full border border-amber-200 shadow-sm">
          <ImageIcon className="w-4 h-4" />
          <span className="text-[12px] font-bold tracking-widest">ÁLBUM DIGITAL</span>
        </div>
      </header>

      {/* Galería */}
      <div className="flex-1 p-4 md:p-8 z-10 relative">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4 text-zinc-400 min-h-[50vh]">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <p className="font-serif italic text-lg animate-pulse">Revelando recuerdos...</p>
          </div>
        ) : error ? (
           <div className="h-full flex flex-col items-center justify-center space-y-4 text-zinc-500 min-h-[50vh] text-center">
             <p className="text-rose-500 font-medium">{error}</p>
             <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-white border border-zinc-200 text-zinc-800 font-semibold rounded-lg shadow-sm hover:bg-zinc-50 transition-colors"
            >
              Reintentar
            </button>
           </div>
        ) : photos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4 text-zinc-400 min-h-[50vh] text-center">
            <ImageIcon className="w-16 h-16 opacity-30 text-amber-600" />
            <h2 className="text-2xl font-serif font-semibold text-zinc-700">Aún no hay fotos</h2>
            <p className="text-zinc-500">¡Sé el primero en capturar un momento especial!</p>
            <button 
              onClick={() => router.push("/camera")}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-2xl shadow-lg hover:from-amber-600 hover:to-amber-700 transition-colors"
            >
              Tomar una foto
            </button>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 animate-in fade-in duration-1000">
            {photos.map((photo) => {
              // El método más nativo y directo para enlazar imágenes de carpetas compartidas
              const displayUrl = `https://drive.google.com/uc?id=${photo.id}`;
              
              return (
              <div 
                key={photo.id} 
                className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-white ring-1 ring-zinc-200 shadow-md hover:shadow-xl hover:shadow-amber-900/10 transition-shadow duration-300 p-1"
              >
                <img 
                  src={displayUrl} 
                  alt={photo.name}
                  loading="lazy"
                  className="w-full h-auto min-h-[150px] object-cover rounded-xl transition-transform duration-700 group-hover:scale-[1.02] bg-zinc-100"
                  onError={(e) => {
                    // Si un AdBlocker bloquea el uc?id, probamos miniatura pura
                    (e.target as HTMLImageElement).src = `https://lh3.googleusercontent.com/d/${photo.id}`;
                  }}
                />
                <div className="absolute inset-0 rounded-2xl ring-inset ring-1 ring-black/5 pointer-events-none"></div>
              </div>
            )})}
          </div>
        )}
      </div>
    </main>
  );
}


