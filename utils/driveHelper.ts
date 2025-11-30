/**
 * Utility to handle Google Drive URLs specifically for embedding.
 */

/**
 * Converts a raw Google Drive sharing link into a usable URL for the app.
 * Follows the logic:
 * 1. Detect if it is a Google Drive URL.
 * 2. Extract the FILE_ID (supports both /file/d/ID and ?id=ID formats).
 * 3. Convert to /preview for videos (iframe) or thumbnail for images.
 */
export const getEmbedUrl = (url: string, isVideo: boolean = false): string => {
  if (!url) return "";

  let fileId = "";

  // Pattern 1: Standard URL (.../file/d/ID/...)
  const matchFile = url.match(/file\/d\/([a-zA-Z0-9_-]+)/);
  
  // Pattern 2: Open ID URL (...?id=ID) common in bulk exports
  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);

  if (matchFile && matchFile[1]) {
    fileId = matchFile[1];
  } else if (matchId && matchId[1]) {
    fileId = matchId[1];
  }

  if (fileId) {
    if (isVideo) {
      // ESTÁNDAR OFICIAL: Usar /preview para incrustar en iframe.
      return `https://drive.google.com/file/d/${fileId}/preview`;
    } else {
      // Para imágenes, usamos el endpoint de miniaturas de alta calidad
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2048`;
    }
  }

  // Si no es un link de Drive, devolver tal cual
  return url;
};

// Deprecated wrapper maintained for backward compatibility
export const getDriveDirectVideoUrl = (url: string): string => {
  return getEmbedUrl(url, true);
};
