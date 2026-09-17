import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { channels, type Channel } from '@/data/channels';
type IptvContextValue = { channels: Channel[]; favorites: string[]; toggleFavorite: (id: string) => void; isFavorite: (id: string) => boolean; addPlaylist: (name: string, url: string) => void; playlistName: string; playlistUrl: string; hasPlaylist: boolean };
const FAVORITES_KEY = 'sports-iptv-favorites';
const PLAYLIST_KEY = 'sports-iptv-playlist';
const IptvContext = createContext<IptvContextValue | null>(null);
export function IptvProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(['arena-one', 'court-side']);
  const [playlistName, setPlaylistName] = useState('Demo Sports TV');
  const [playlistUrl, setPlaylistUrl] = useState('');
  useEffect(() => { void (async () => {
    const [storedFavorites, storedPlaylist] = await Promise.all([AsyncStorage.getItem(FAVORITES_KEY), AsyncStorage.getItem(PLAYLIST_KEY)]);
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites) as string[]);
    if (storedPlaylist) { const parsed = JSON.parse(storedPlaylist) as { name: string; url: string }; setPlaylistName(parsed.name); setPlaylistUrl(parsed.url); }
  })(); }, []);
  const toggleFavorite = (id: string) => { setFavorites((current) => { const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]; void AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next)); return next; }); };
  const addPlaylist = (name: string, url: string) => { const nextName = name.trim() || 'My IPTV playlist'; setPlaylistName(nextName); setPlaylistUrl(url.trim()); void AsyncStorage.setItem(PLAYLIST_KEY, JSON.stringify({ name: nextName, url: url.trim() })); };
  const value = useMemo<IptvContextValue>(() => ({ channels, favorites, toggleFavorite, isFavorite: (id) => favorites.includes(id), addPlaylist, playlistName, playlistUrl, hasPlaylist: Boolean(playlistUrl) }), [favorites, playlistName, playlistUrl]);
  return <IptvContext.Provider value={value}>{children}</IptvContext.Provider>;
}
export function useIptv() { const context = useContext(IptvContext); if (!context) throw new Error('useIptv must be used inside IptvProvider'); return context; }
