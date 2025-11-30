import React, { useState, useEffect } from 'react';
import { familyAlbums } from './data/familyData';
import { AlbumCard } from './components/AlbumCard';
import { MediaGrid } from './components/MediaGrid';
import { Lightbox } from './components/Lightbox';
import { Album } from './types';
import { ArrowLeft, Heart, Lock, LogOut } from 'lucide-react';

const SHARED_PASSWORD = "familia"; // Contraseña simple para la familia

const App: React.FC = () => {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  // --- App State ---
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // --- Effects ---
  useEffect(() => {
    // Check if user was previously logged in
    const storedAuth = localStorage.getItem("isFamilyAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // --- Auth Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.toLowerCase().trim() === SHARED_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("isFamilyAuthenticated", "true");
      setAuthError("");
    } else {
      setAuthError("Contraseña incorrecta. Inténtalo de nuevo.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isFamilyAuthenticated");
    setPasswordInput("");
    setSelectedAlbum(null);
  };

  // --- Gallery Handlers ---
  const handleAlbumSelect = (album: Album) => {
    window.scrollTo(0, 0);
    setSelectedAlbum(album);
  };

  const handleBackToGallery = () => {
    setSelectedAlbum(null);
    setLightboxIndex(null);
  };

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handleNextMedia = () => {
    if (selectedAlbum && lightboxIndex !== null && lightboxIndex < selectedAlbum.media.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const handlePrevMedia = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  // --- Render: Login Screen ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-sepia-50 flex items-center justify-center p-4 font-sans text-sepia-900">
        <div className="bg-white w-full max-w-lg p-6 md:p-12 rounded-3xl shadow-xl border-4 border-sepia-200 text-center animate-in fade-in zoom-in duration-500">
           
           <div className="inline-flex p-4 md:p-6 bg-sepia-100 rounded-full mb-6 md:mb-8 text-sepia-600 shadow-inner">
             <Lock className="w-12 h-12 md:w-16 md:h-16" />
           </div>

           <h1 className="text-2xl md:text-4xl font-bold text-sepia-900 mb-4 tracking-tight">
             Bienvenida a la Familia
           </h1>
           
           <p className="text-lg md:text-2xl text-sepia-700 mb-6 md:mb-8 leading-relaxed">
             Por favor, escribe la contraseña familiar para ver los recuerdos.
           </p>

           <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
             <div>
               <input
                 type="password"
                 value={passwordInput}
                 onChange={(e) => setPasswordInput(e.target.value)}
                 className="w-full text-2xl md:text-3xl p-4 md:p-5 text-center border-4 border-sepia-200 rounded-2xl focus:border-sepia-500 focus:outline-none focus:ring-4 focus:ring-sepia-200 placeholder:text-sepia-300 text-sepia-800 transition-all bg-sepia-50"
                 placeholder="Contraseña"
                 autoFocus
                 autoComplete="current-password"
               />
             </div>
             
             {authError && (
               <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 md:p-4 animate-bounce">
                 <p className="text-red-600 text-lg md:text-xl font-bold">
                   {authError}
                 </p>
               </div>
             )}

             <button 
               type="submit"
               className="w-full bg-sepia-600 hover:bg-sepia-700 text-white text-xl md:text-3xl font-bold py-4 md:py-6 rounded-2xl shadow-lg transform transition active:scale-95 focus:outline-none focus:ring-4 focus:ring-sepia-400 mt-2 md:mt-4"
             >
               Entrar
             </button>
           </form>
           
           <p className="mt-6 md:mt-8 text-sepia-400 text-base md:text-lg italic">
             (Pista: es la palabra "familia")
           </p>
        </div>
      </div>
    );
  }

  // --- Render: Main App ---
  return (
    <div className="min-h-screen bg-sepia-50 font-sans text-sepia-900 selection:bg-sepia-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-4 border-sepia-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-6 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full">
            {selectedAlbum ? (
              <button
                onClick={handleBackToGallery}
                className="flex-shrink-0 flex items-center gap-2 bg-sepia-100 hover:bg-sepia-200 text-sepia-900 px-4 py-2 md:px-6 md:py-3 rounded-full font-bold text-base md:text-xl transition-colors focus:outline-none focus:ring-4 focus:ring-sepia-400"
              >
                <ArrowLeft className="w-5 h-5 md:w-7 md:h-7" />
                <span>Volver</span>
              </button>
            ) : (
              <div className="flex-shrink-0 p-2 md:p-3 bg-sepia-100 rounded-full">
                <Heart className="w-6 h-6 md:w-8 md:h-8 text-red-500 fill-red-500" />
              </div>
            )}
            
            <h1 className="text-lg md:text-3xl lg:text-4xl font-bold text-sepia-800 tracking-tight truncate flex-1">
              {selectedAlbum ? selectedAlbum.title : 'Recuerdos Familiares'}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-3 md:px-4 py-6 md:py-12 min-h-[60vh]">
        {!selectedAlbum ? (
          // Albums List View
          <div className="space-y-6 animate-in fade-in duration-500">
            <p className="text-lg md:text-2xl text-sepia-700 mb-6 md:mb-8 max-w-2xl">
              Bienvenida. Seleccione un álbum para ver las fotos y videos de la familia.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {familyAlbums.map((album) => (
                <AlbumCard 
                  key={album.id} 
                  album={album} 
                  onClick={handleAlbumSelect} 
                />
              ))}
            </div>
          </div>
        ) : (
          // Single Album View
          <div className="animate-in fade-in zoom-in duration-300">
            <div className="flex flex-wrap items-center gap-2 mb-6 text-sepia-600 text-base md:text-xl font-medium">
              <span>{selectedAlbum.date}</span>
              <span className="hidden md:inline">•</span>
              <span className="w-full md:w-auto block md:inline">{selectedAlbum.media.length} fotos/videos</span>
            </div>
            
            <MediaGrid 
              album={selectedAlbum} 
              onMediaClick={handleOpenLightbox} 
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-sepia-100 border-t border-sepia-200 py-8 md:py-12 mt-8 md:mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-center gap-4 md:gap-6 text-center">
          <p className="text-sepia-800 text-base md:text-lg font-medium">
            Hecho con mucho cariño para la Familia ❤️
          </p>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sepia-500 hover:text-sepia-800 px-4 py-2 rounded-lg hover:bg-sepia-200/50 transition-colors text-sm md:text-base"
          >
            <LogOut size={18} />
            <span>Cerrar sesión (Salir)</span>
          </button>
        </div>
      </footer>

      {/* Lightbox Overlay */}
      {selectedAlbum && lightboxIndex !== null && (
        <Lightbox
          item={selectedAlbum.media[lightboxIndex]}
          isOpen={lightboxIndex !== null}
          onClose={handleCloseLightbox}
          onNext={handleNextMedia}
          onPrev={handlePrevMedia}
          hasNext={lightboxIndex < selectedAlbum.media.length - 1}
          hasPrev={lightboxIndex > 0}
        />
      )}
    </div>
  );
};

export default App;