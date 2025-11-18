import { Injectable, Provider } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Track } from './audio.service';

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  tracks: Track[];
}

export interface AlbumCard {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
}

export interface SearchResults {
  tracks: Track[];
  artists: { id: string; name: string }[];
  albums: AlbumCard[];
}

/**
 * PUBLIC_INTERFACE
 * ApiService declares the interface for fetching data. Implementations may be real or mock.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  // PUBLIC_INTERFACE
  getFeatured(): Observable<{ playlists: Playlist[]; albums: AlbumCard[] }> {
    throw new Error('ApiService.getFeatured not implemented');
  }
  // PUBLIC_INTERFACE
  getLibrary(): Observable<Playlist[]> { throw new Error('ApiService.getLibrary not implemented'); }
  // PUBLIC_INTERFACE
  getPlaylist(id: string): Observable<Playlist> { throw new Error('ApiService.getPlaylist not implemented'); }
  // PUBLIC_INTERFACE
  search(query: string): Observable<SearchResults> { throw new Error('ApiService.search not implemented'); }
}

/**
 * Mock implementation with sample JSON and small delays for skeletons/spinners.
 */
@Injectable()
export class MockApiService extends ApiService {
  private sampleTracks: Track[] = [
    {
      id: 't1',
      title: 'Ocean Breeze',
      artist: 'Blue Horizon',
      album: 'Sea Lights',
      durationMs: 212000,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2021/10/26/audio_7fe20c3e23.mp3?filename=ambient-10671.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 't2',
      title: 'Amber Trails',
      artist: 'Sunset Drive',
      album: 'Golden Hour',
      durationMs: 198000,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/30/audio_4b6b9ee3c9.mp3?filename=relaxing-ambient-106120.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1501973801540-537f08ccae7b?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 't3',
      title: 'Deep Current',
      artist: 'Northern Waves',
      album: 'Blue Depth',
      durationMs: 240000,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/28/audio_2c6e1e5dd2.mp3?filename=soft-ambient-106088.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=600&auto=format&fit=crop'
    }
  ];

  private playlists = [
    {
      id: 'p1',
      name: 'Focus Flow',
      description: 'Stay in the zone with mellow electronic beats.',
      coverUrl: this.sampleTracks[0].coverUrl,
      tracks: this.sampleTracks
    },
    {
      id: 'p2',
      name: 'Morning Energy',
      description: 'Fresh tunes to kickstart your day.',
      coverUrl: this.sampleTracks[1].coverUrl,
      tracks: this.sampleTracks
    }
  ];

  override getFeatured() {
    return of({
      playlists: this.playlists,
      albums: this.sampleTracks.map((t, i) => ({
        id: `a${i + 1}`,
        title: t.album || `Album ${i + 1}`,
        artist: t.artist,
        coverUrl: t.coverUrl
      }))
    }).pipe(delay(300));
  }

  override getLibrary() {
    return of(this.playlists).pipe(delay(200));
  }

  override getPlaylist(id: string) {
    const p = this.playlists.find(x => x.id === id) || this.playlists[0];
    return of(p).pipe(delay(200));
  }

  override search(query: string) {
    const q = (query || '').toLowerCase();
    const tracks = this.sampleTracks.filter(t => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q));
    const albums = this.sampleTracks
      .filter(t => t.album?.toLowerCase().includes(q))
      .map((t, i) => ({ id: `a${i + 1}`, title: t.album || '', artist: t.artist, coverUrl: t.coverUrl }));
    const artists = Array.from(new Set(this.sampleTracks.map(t => t.artist)))
      .filter(a => a.toLowerCase().includes(q))
      .map((name, i) => ({ id: `ar${i}`, name }));
    return of({ tracks, albums, artists }).pipe(delay(250));
  }
}

/**
 * Helper provider factory to switch between real and mock API. For now it always uses MockApiService.
 * Real implementation can be added later and chosen based on env.
 */
export const provideApiService = (useMock = true): Provider => ({
  provide: ApiService,
  useClass: useMock ? MockApiService : MockApiService
});
