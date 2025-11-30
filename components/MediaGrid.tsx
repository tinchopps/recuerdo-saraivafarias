import React from 'react';
import { motion } from 'framer-motion';
import { Album, MediaItem, MediaType } from '../types';
import { Play } from 'lucide-react';
import { getEmbedUrl } from '../utils/driveHelper';

interface MediaGridProps {
  album: Album;
  onMediaClick: (index: number) => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({ album, onMediaClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
      {album.media.map((item, index) => {
        // For grid display, we want the image preview even for videos
        // If it's a video, use the custom thumbnail if available, or try to use the URL directly (if standard video file)
        const displaySrc = item.type === MediaType.VIDEO && item.thumbnail 
          ? getEmbedUrl(item.thumbnail)
          : getEmbedUrl(item.url);

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => onMediaClick(index)}
              className="relative group w-full aspect-square bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border-4 border-white hover:border-sepia-300 focus:outline-none focus:ring-4 focus:ring-sepia-400"
              aria-label={`Ver ${item.type === MediaType.VIDEO ? 'video' : 'foto'}: ${item.caption || 'Sin título'}`}
            >
              {item.type === MediaType.VIDEO ? (
                // Video Card
                <div className="w-full h-full bg-gray-200 relative">
                   {/* If it's a video, we show a play button overlay */}
                   {item.thumbnail ? (
                     <img 
                       src={displaySrc} 
                       alt="" 
                       className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-sepia-200 text-sepia-800">
                        <Play size={48} />
                     </div>
                   )}
                   <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                      <div className="bg-white/80 p-4 rounded-full shadow-lg">
                        <Play size={32} className="text-sepia-900 fill-sepia-900" />
                      </div>
                   </div>
                </div>
              ) : (
                // Photo Card
                <img
                  src={displaySrc}
                  alt={item.caption || ""}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              )}
              
              {/* Simple caption overlay at bottom */}
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-sepia-900/70 p-3 text-white text-lg font-medium truncate text-center">
                  {item.caption}
                </div>
              )}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
};