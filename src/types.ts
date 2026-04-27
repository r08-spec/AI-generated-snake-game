
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  coverUrl: string;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}
