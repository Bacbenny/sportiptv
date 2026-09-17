import type { ImageSourcePropType } from 'react-native';

export type Channel = {
  id: string;
  name: string;
  shortName: string;
  group: string;
  category: string;
  language: string;
  quality: string;
  description: string;
  schedule: string;
  accent: string;
  logoColor: string;
  image?: ImageSourcePropType;
  isLive: boolean;
  isFeatured?: boolean;
};

export const groupOptions = [
  'Tất cả',
  'HTV',
  'In The Box',
  'Nước Ngoài',
  'Địa Phương',
  'Sự Kiện TVPrime',
  'Sự Kiện TV360',
];

export const channels: Channel[] = [
  {
    id: 'arena-one',
    name: 'Kênh TV360+ 4',
    shortName: 'A1',
    group: 'HTV',
    category: 'Sports',
    language: 'Vietnamese',
    quality: '4K',
    description: 'Live sports, matchday analysis and the biggest moments from around the world.',
    schedule: 'Premier League · 20:30',
    accent: '#7A39E8',
    logoColor: '#29104F',
    isLive: true,
    isFeatured: true,
  },
  {
    id: 'court-side',
    name: 'Kênh TV360+ 6',
    shortName: 'CS',
    group: 'HTV',
    category: 'Sports',
    language: 'Vietnamese',
    quality: 'HD',
    description: 'Fast breaks, courtside access and live basketball coverage.',
    schedule: 'Basketball Live · 21:00',
    accent: '#9747FF',
    logoColor: '#35116A',
    isLive: true,
    isFeatured: true,
  },
  {
    id: 'global-news',
    name: 'Kênh TV360+ 7',
    shortName: 'GN',
    group: 'Nước Ngoài',
    category: 'News',
    language: 'English',
    quality: 'HD',
    description: 'The latest headlines, live interviews and stories that matter now.',
    schedule: 'World Briefing · 21:30',
    accent: '#7435D9',
    logoColor: '#241044',
    isLive: true,
  },
  {
    id: 'city-report',
    name: 'Kênh TV360+ 1',
    shortName: 'CR',
    group: 'Địa Phương',
    category: 'News',
    language: 'Vietnamese',
    quality: 'HD',
    description: 'Local voices and city stories with a clear point of view.',
    schedule: 'Evening Report · 22:00',
    accent: '#8E49F4',
    logoColor: '#30145E',
    isLive: true,
  },
  {
    id: 'midnight-cinema',
    name: 'Kênh TV360+ 2',
    shortName: 'MC',
    group: 'In The Box',
    category: 'Movies',
    language: 'English',
    quality: '4K',
    description: 'A handpicked selection of films for late-night viewing.',
    schedule: 'The Long Way Home · 22:15',
    accent: '#B256FF',
    logoColor: '#3B1161',
    isLive: false,
  },
  {
    id: 'family-box',
    name: 'Kênh TV360+ 3',
    shortName: 'FB',
    group: 'Địa Phương',
    category: 'Kids',
    language: 'Vietnamese',
    quality: 'HD',
    description: 'Bright, friendly and always ready for a family watch.',
    schedule: 'Adventure Club · 19:45',
    accent: '#A343E7',
    logoColor: '#45134C',
    isLive: false,
  },
  {
    id: 'fight-night',
    name: 'Kênh TV360+ 5',
    shortName: 'FN',
    group: 'Sự Kiện TVPrime',
    category: 'Sports',
    language: 'Vietnamese',
    quality: 'HD',
    description: 'Combat sports, previews and ringside commentary.',
    schedule: 'Main Event · 23:00',
    accent: '#8D3FE5',
    logoColor: '#351148',
    isLive: true,
  },
  {
    id: 'world-play',
    name: 'Kênh TV360+ 8',
    shortName: 'WP',
    group: 'Sự Kiện TV360',
    category: 'Sports',
    language: 'Vietnamese',
    quality: 'HD',
    description: 'International football and the stories behind the game.',
    schedule: 'World Matchday · 23:30',
    accent: '#6D33D7',
    logoColor: '#211143',
    isLive: false,
  },
];