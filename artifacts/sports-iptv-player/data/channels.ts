import type { ImageSourcePropType } from 'react-native';
export type Channel = {
  id: string; name: string; shortName: string; category: string; language: string; quality: string;
  description: string; schedule: string; accent: string; logoColor: string; image?: ImageSourcePropType;
  isLive: boolean; isFeatured?: boolean;
};
export const categoryOptions = ['All channels', 'Sports', 'News', 'Movies', 'Kids'];
export const channels: Channel[] = [
  { id: 'arena-one', name: 'Arena One', shortName: 'A1', category: 'Sports', language: 'English', quality: '4K', description: 'Live sports, matchday analysis and the biggest moments from around the world.', schedule: 'Premier League · 20:30', accent: '#62E6CF', logoColor: '#113D44', image: require('../assets/images/stadium-hero.png'), isLive: true, isFeatured: true },
  { id: 'court-side', name: 'Court Side', shortName: 'CS', category: 'Sports', language: 'English', quality: 'HD', description: 'Fast breaks, courtside access and live basketball coverage.', schedule: 'Basketball Live · 21:00', accent: '#FFCB77', logoColor: '#513E22', image: require('../assets/images/basketball-card.png'), isLive: true, isFeatured: true },
  { id: 'global-news', name: 'Global News', shortName: 'GN', category: 'News', language: 'English', quality: 'HD', description: 'The latest headlines, live interviews and stories that matter now.', schedule: 'World Briefing · 21:30', accent: '#A991FF', logoColor: '#2C2557', isLive: true },
  { id: 'city-report', name: 'City Report', shortName: 'CR', category: 'News', language: 'Vietnamese', quality: 'HD', description: 'Local voices and city stories with a clear point of view.', schedule: 'Evening Report · 22:00', accent: '#83B8FF', logoColor: '#1E3C63', isLive: true },
  { id: 'midnight-cinema', name: 'Midnight Cinema', shortName: 'MC', category: 'Movies', language: 'English', quality: '4K', description: 'A handpicked selection of films for late-night viewing.', schedule: 'The Long Way Home · 22:15', accent: '#F58DC1', logoColor: '#55243E', isLive: false },
  { id: 'family-box', name: 'Family Box', shortName: 'FB', category: 'Kids', language: 'English', quality: 'HD', description: 'Bright, friendly and always ready for a family watch.', schedule: 'Adventure Club · 19:45', accent: '#FF9F6E', logoColor: '#5F3323', isLive: false },
  { id: 'fight-night', name: 'Fight Night', shortName: 'FN', category: 'Sports', language: 'English', quality: 'HD', description: 'Combat sports, previews and ringside commentary.', schedule: 'Main Event · 23:00', accent: '#F77D8A', logoColor: '#5D252D', isLive: true },
  { id: 'world-play', name: 'World Play', shortName: 'WP', category: 'Sports', language: 'English', quality: 'HD', description: 'International football and the stories behind the game.', schedule: 'World Matchday · 23:30', accent: '#84A7FF', logoColor: '#25335C', isLive: false },
];
