import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaItem, MediaType } from '../types';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { getEmbedUrl } from '../utils/driveHelper';

interface LightboxProps {
  item: MediaItem;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const Lightbox: React.FC<LightboxProps> = ({
  item,
  isOpen,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}) => {
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight' && hasNext) onNext();
    if (e.key === 'ArrowLeft' && hasPrev) onPrev();
  }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  const isVideo = item.type === MediaType.VIDEO;
  const displayUrl = getEmbedUrl(item.url, isVideo);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-sepia-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-0 md:p-4"
        onClick={onClose}
      >
        {/* Top Control Bar - SafeArea for Mobile */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-50 pointer-events-none">
          {/* Drive Link (Left) */}
          <div className="pointer-events-auto">
             {isVideo && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 bg-sepia-600/90 hover:bg-sepia-700 text-white px-3 py-2 md:px-5 md:py-3 rounded-full transition-colors shadow-lg border border-white/20 backdrop-blur-md"
              >
                <ExternalLink size={18} className="md:w-6 md:h-6" />
                <span className="font-medium text-xs md:text-lg">¿Problemas? Abrir en Drive</span>
              </a>
            )}
          </div>

          {/* Close Button (Right) */}
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="pointer-events-auto p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-md border border-white/10"
            aria-label="Cerrar"
          >
            <X size={24} className="md:w-10 md:h-10" />
          </button>
        </div>

        {/* Navigation Buttons - Absolute to screen edges */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 md:px-8 pointer-events-none z-40">
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            disabled={!hasPrev}
            className={`pointer-events-auto p-3 md:p-6 rounded-full bg-sepia-900/40 hover:bg-sepia-900/80 text-white backdrop-blur-sm transition-all ${!hasPrev ? 'opacity-0' : 'opacity-100'}`}
            aria-label="Anterior"
          >
            <ChevronLeft size={32} className="md:w-12 md:h-12" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            disabled={!hasNext}
            className={`pointer-events-auto p-3 md:p-6 rounded-full bg-sepia-900/40 hover:bg-sepia-900/80 text-white backdrop-blur-sm transition-all ${!hasNext ? 'opacity-0' : 'opacity-100'}`}
            aria-label="Siguiente"
          >
            <ChevronRight size={32} className="md:w-12 md:h-12" />
          </button>
        </div>

        {/* Content Container */}
        <div 
          className={`relative w-full max-w-6xl mx-auto flex items-center justify-center transition-all ${
            isVideo 
              ? 'aspect-video w-full bg-black shadow-2xl' // Force 16:9 for videos
              : 'h-auto max-h-[80vh] p-2' // Allow images to size naturally within viewport
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {isVideo ? (
            <iframe
              src={displayUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              referrerPolicy="origin"
              title="Reproductor de video"
              sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-forms"
            />
          ) : (
            <img
              src={displayUrl}
              alt={item.caption || ""}
              className="max-w-full max-h-[80vh] object-contain rounded-md shadow-2xl"
            />
          )}

          {/* Caption Overlay - Integrated at bottom with gradient */}
          {item.caption && (
            <div className={`absolute bottom-0 left-0 right-0 p-4 pt-12 text-center pointer-events-none ${isVideo ? 'bg-gradient-to-t from-black/90 to-transparent' : ''}`}>
               {/* For images, we might want a distinct pill or gradient depending on if it overlaps. 
                   Using a safe overlay approach for both. */}
              <div className={`inline-block px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md text-white text-sm md:text-xl font-medium shadow-lg max-w-[90%]`}>
                {item.caption}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};