import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { channels, type Channel } from '@/data/channels';
import { parseM3U } from '@/utils/m3u';
type IptvContextValue = {
  channels: Channel[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addPlaylist: (name: string, url: string) => void;
  refreshPlaylist: () => Promise<void>;
  playlistName: string;
  playlistUrl: string;
  hasPlaylist: boolean;
  isLoading: boolean;
  error: string | null;
};
const FAVORITES_KEY = 'sports-iptv-favorites';
const PLAYLIST_KEY = 'sports-iptv-playlist';
const IptvContext = createContext<IptvContextValue | null>(null);
export function IptvProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loadedChannels, setLoadedChannels] = useState<Channel[]>(channels);
  const [playlistName, setPlaylistName] = useState('Demo Sports TV');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlaylist = async (url: string) => {
    const normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      setError('URL playlist không hợp lệ. Hãy dùng địa chỉ bắt đầu bằng http:// hoặc https://.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(normalizedUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const parsed = parseM3U(await response.text());
      if (!parsed.length) throw new Error('M3U không có kênh hợp lệ');
      setLoadedChannels(parsed);
    } catch (loadError) {
      setError('Không tải được playlist mới. Ứng dụng đang dùng danh sách kênh đã lưu.');
      console.warn('Playlist load failed:', loadError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      const [storedFavorites, storedPlaylist] = await Promise.all([
        AsyncStorage.getItem(FAVORITES_KEY),
        AsyncStorage.getItem(PLAYLIST_KEY),
      ]);
      if (storedFavorites) {
        try {
          setFavorites(JSON.parse(storedFavorites) as string[]);
        } catch {
          await AsyncStorage.removeItem(FAVORITES_KEY);
        }
      }
      if (storedPlaylist) {
        try {
          const parsed = JSON.parse(storedPlaylist) as { name: string; url: string };
          setPlaylistName(parsed.name);
          setPlaylistUrl(parsed.url);
          await loadPlaylist(parsed.url);
        } catch {
          await AsyncStorage.removeItem(PLAYLIST_KEY);
        }
      }
    })();
  }, []);

  const toggleFavorite = (id: string) => { setFavorites((current) => { const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]; void AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next)); return next; }); };
  const addPlaylist = (name: string, url: string) => {
    const nextName = name.trim() || 'My IPTV playlist';
    const nextUrl = url.trim();
    setPlaylistName(nextName);
    setPlaylistUrl(nextUrl);
    void AsyncStorage.setItem(PLAYLIST_KEY, JSON.stringify({ name: nextName, url: nextUrl }));
    void loadPlaylist(nextUrl);
  };
  const refreshPlaylist = async () => {
    if (playlistUrl) await loadPlaylist(playlistUrl);
  };
  const value = useMemo<IptvContextValue>(() => ({
    channels: loadedChannels,
    favorites,
    toggleFavorite,
    isFavorite: (id) => favorites.includes(id),
    addPlaylist,
    refreshPlaylist,
    playlistName,
    playlistUrl,
    hasPlaylist: Boolean(playlistUrl),
    isLoading,
    error,
  }), [loadedChannels, favorites, playlistName, playlistUrl, isLoading, error]);
  return <IptvContext.Provider value={value}>{children}</IptvContext.Provider>;
}
export function useIptv() { const context = useContext(IptvContext); if (!context) throw new Error('useIptv must be used inside IptvProvider'); return context; }
