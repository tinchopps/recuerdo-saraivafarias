import React from 'react';
import { motion } from 'framer-motion';
import { Album } from '../types';
import { getEmbedUrl } from '../utils/driveHelper';

interface AlbumCardProps {
  album: Album;
  onClick: (album: Album) => void;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album, onClick }) => {
  // Use helper to ensure cover image works if it's from Drive
  const coverSrc = getEmbedUrl(album.coverImage);

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(album)}
      className="group w-full text-left bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-sepia-200 hover:border-sepia-400 transition-colors focus:outline-none focus:ring-4 focus:ring-sepia-400"
      aria-label={`Abrir álbum: ${album.title}`}
    >
      <div className="relative aspect-[4/3] w-full bg-sepia-100 overflow-hidden">
        <img
          src={coverSrc}
          alt=""
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sepia-900/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
          <p className="text-sepia-50 text-sm md:text-lg font-medium drop-shadow-md mb-1">
            {album.date}
          </p>
          <h3 className="text-white text-2xl md:text-3xl font-bold drop-shadow-md leading-tight break-words">
            {album.title}
          </h3>
        </div>
      </div>
      <div className="p-4 md:p-6 bg-white">
        <div className="flex justify-between items-center">
          <span className="text-sepia-800 text-lg md:text-xl font-medium">
            {album.media.length} Recuerdos
          </span>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-sepia-100 flex items-center justify-center group-hover:bg-sepia-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-sepia-800 w-5 h-5 md:w-6 md:h-6">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.button>
  );
};