export enum MediaType {
  PHOTO = 'photo',
  VIDEO = 'video'
}

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string; // The raw Google Drive URL or direct link
  caption?: string;
  thumbnail?: string; // Optional custom thumbnail for videos
}

export interface Album {
  id: string;
  title: string;
  coverImage: string;
  date: string;
  media: MediaItem[];
}