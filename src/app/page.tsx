"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Heart } from "lucide-react";

export default function Home() {
  const [name, setName] = useState("");
  const [isLimited, setIsLimited] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Al cargar la página, verificamos si este dispositivo ya tomó todas sus fotos
    const savedCount = localStorage.getItem("photoCount");
    if (savedCount && parseInt(savedCount, 10) >= 10) {
      setIsLimited(true);
    }
  }, []);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    localStorage.setItem("guestName", name.trim());
    
    // Inicializar contador si no existe
    if (!localStorage.getItem("photoCount")) {
      localStorage.setItem("photoCount", "0");
    }
    
    router.push("/camera");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 text-zinc-900 p-6 relative overflow-hidden">
      
      {/* Fondo elegante sutil */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-multiply pointer-events-none"></div>
      
      <div className="w-full max-w-md flex flex-col items-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 z-10">
        
        {/* Imagen de Aniversario (Círculo elegante) */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-tr from-amber-200 via-yellow-500 to-amber-700 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex justify-center items-center">
            {/* Foto de los festejados con query params por si hay un problema de caché */}
            <img 
              src={`/portada.jpg?t=${new Date().getTime()}`} 
              alt="Nuestro Aniversario" 
              className="w-full h-full object-cover text-center text-xs text-zinc-400"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800";
              }}
            />
          </div>
          <div className="absolute -bottom-3 -right-3 bg-white p-3 rounded-full shadow-lg border border-amber-100">
             <Heart className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>
        </div>

        {/* Título y Mensaje */}
        <div className="flex flex-col items-center space-y-3 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent pb-1">
            Nuestro Aniversario
          </h1>
          <p className="text-zinc-500 text-sm md:text-base max-w-xs leading-relaxed">
            {isLimited 
              ? "Has alcanzado el límite de 10 fotos por dispositivo." 
              : "Acompáñanos a crear recuerdos inolvidables. (✨ Máximo 10 fotos)"}
          </p>
        </div>

        {/* Formulario o Bloqueo */}
        {isLimited ? (
          <div className="w-full bg-white p-8 rounded-3xl shadow-xl shadow-amber-900/5 border border-amber-200/60 flex flex-col items-center space-y-4 text-center">
            <h2 className="text-lg font-bold text-amber-700">¡Gracias por participar!</h2>
            <p className="text-zinc-500 text-sm">Ya has subido todas tus fotos permitidas desde este teléfono.</p>
            <button
              onClick={() => router.push("/album")}
              className="w-full py-4 mt-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-amber-500/30 hover:from-amber-600 hover:to-amber-700 transition-all active:scale-[0.98]"
            >
              Ver el álbum
            </button>
          </div>
        ) : (
          <form onSubmit={handleStart} className="w-full flex flex-col space-y-5 bg-white p-8 rounded-3xl shadow-xl shadow-amber-900/5 border border-amber-100/50 relative">
            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                Tu nombre o familia
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Familia Pérez"
                className="w-full px-5 py-4 bg-zinc-50/50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-zinc-800 placeholder:text-zinc-400 font-medium"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed hover:from-amber-600 hover:to-amber-700 transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <Camera className="w-5 h-5" />
              <span>Entrar a la cámara</span>
            </button>
            
            {/* Enlace al Álbum para espectadores sin subir foto */}
            <div className="pt-2 text-center w-full">
              <button
                type="button"
                onClick={() => router.push("/album")}
                className="text-amber-700 font-medium text-sm hover:text-amber-600 hover:underline underline-offset-4 transition-colors p-2"
              >
                Solo quiero ver el álbum fotográfico →
              </button>
            </div>
          </form>
        )}

      </div>
    </main>
  );
}

