import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChannelRow } from '@/components/ChannelRow';
import { FeaturedCard } from '@/components/FeaturedCard';
import { SectionHeading } from '@/components/SectionHeading';
import { categoryOptions } from '@/data/channels';
import { useIptv } from '@/context/iptv-context';
import { useColors } from '@/hooks/useColors';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { channels, isFavorite, toggleFavorite } = useIptv();
  const [category, setCategory] = useState('All channels');
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const filtered = useMemo(
    () =>
      channels.filter((channel) => {
        const matchesCategory =
          category === 'All channels' || channel.category === category;
        const query = search.trim().toLowerCase();
        return (
          matchesCategory &&
          (!query ||
            channel.name.toLowerCase().includes(query) ||
            channel.category.toLowerCase().includes(query))
        );
      }),
    [category, channels, search],
  );
  const featured = channels.filter((channel) => channel.isFeatured);
  const openChannel = (id: string) => {
    void Haptics.selectionAsync();
    router.push('/channel/' + id);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 104 },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={[styles.brandMark, { backgroundColor: colors.primary }]}>
              <Feather
                name="play"
                size={12}
                color={colors.primaryForeground}
                fill={colors.primaryForeground}
              />
            </View>
            <Text style={[styles.brandText, { color: colors.foreground }]}>
              PLAYSPORT
            </Text>
            <Text style={[styles.brandPro, { color: colors.primary }]}>PRO</Text>
          </View>
          <View style={styles.headerActions}>
            {searchOpen && (
              <TextInput
                autoFocus
                value={search}
                onChangeText={setSearch}
                placeholder="Search channels"
                placeholderTextColor={colors.mutedForeground}
                style={[
                  styles.searchInput,
                  {
                    color: colors.foreground,
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                  },
                ]}
              />
            )}
            <Pressable
              testID="search-button"
              onPress={() => {
                setSearchOpen((value) => !value);
                if (searchOpen) setSearch('');
              }}
              style={[
                styles.iconButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather
                name={searchOpen ? 'x' : 'search'}
                size={18}
                color={colors.foreground}
              />
            </Pressable>
            <Pressable
              onPress={() => router.push('/(tabs)/settings')}
              style={[styles.avatar, { backgroundColor: colors.accent }]}
            >
              <Text style={[styles.avatarText, { color: colors.accentForeground }]}>
                D
              </Text>
            </Pressable>
          </View>
        </View>

        <ImageBackground
          source={require('../../assets/images/stadium-hero.png')}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroShade} />
          <View style={styles.heroCopy}>
            <View style={[styles.eyebrow, { backgroundColor: colors.primary }]}>
              <View style={styles.eyebrowDot} />
              <Text style={[styles.eyebrowText, { color: colors.primaryForeground }]}>
                STREAMING NOW
              </Text>
            </View>
            <Text style={styles.heroTitle}>
              Stay in the{'\n'}game.
            </Text>
            <Text style={styles.heroBody}>
              Live sports and the channels you love, in one place.
            </Text>
            <Pressable
              onPress={() => openChannel('arena-one')}
              style={({ pressed }) => [
                styles.heroButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.82 : 1 },
              ]}
            >
              <Feather
                name="play"
                size={14}
                color={colors.primaryForeground}
                fill={colors.primaryForeground}
              />
              <Text style={[styles.heroButtonText, { color: colors.primaryForeground }]}>
                Watch live
              </Text>
            </Pressable>
          </View>
          <View style={styles.heroStats}>
            <View>
              <Text style={styles.statValue}>24/7</Text>
              <Text style={styles.statLabel}>LIVE COVERAGE</Text>
            </View>
            <View style={styles.statDivider} />
            <View>
              <Text style={styles.statValue}>4K</Text>
              <Text style={styles.statLabel}>ULTRA HD</Text>
            </View>
          </View>
        </ImageBackground>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {categoryOptions.map((item) => (
            <Pressable
              key={item}
              onPress={() => {
                void Haptics.selectionAsync();
                setCategory(item);
              }}
              style={[
                styles.categoryPill,
                {
                  backgroundColor:
                    category === item ? colors.primary : colors.card,
                  borderColor: category === item ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      category === item
                        ? colors.primaryForeground
                        : colors.mutedForeground,
                  },
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <SectionHeading title="Featured live" action="See all" onAction={() => setCategory('All channels')} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredRow}
        >
          {featured.map((channel) => (
            <FeaturedCard
              key={channel.id}
              channel={channel}
              favorite={isFavorite(channel.id)}
              onPress={() => openChannel(channel.id)}
              onToggleFavorite={() => toggleFavorite(channel.id)}
            />
          ))}
        </ScrollView>

        <SectionHeading
          title={search ? 'Search results' : 'All channels'}
          action={filtered.length + ' channels'}
        />
        {filtered.length ? (
          filtered.map((channel) => (
            <ChannelRow
              key={channel.id}
              channel={channel}
              favorite={isFavorite(channel.id)}
              onPress={() => openChannel(channel.id)}
              onToggleFavorite={() => toggleFavorite(channel.id)}
            />
          ))
        ) : (
          <View
            style={[
              styles.empty,
              { borderColor: colors.border, backgroundColor: colors.card },
            ]}
          >
            <Feather name="search" size={24} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No channels found
            </Text>
            <Text style={[styles.emptyCopy, { color: colors.mutedForeground }]}>
              Try another search or category.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 18 },
  header: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandMark: {
    width: 25,
    height: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { fontFamily: 'Inter_700Bold', fontSize: 15, letterSpacing: 1.4 },
  brandPro: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.8,
    marginTop: -8,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  searchInput: {
    width: 132,
    height: 38,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 11,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  hero: {
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 18,
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  heroImage: { borderRadius: 24 },
  heroShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(5,12,23,0.56)',
  },
  heroCopy: { alignItems: 'flex-start' },
  eyebrow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginBottom: 14,
  },
  eyebrowDot: { width: 5, height: 5, borderRadius: 5, backgroundColor: '#07111F' },
  eyebrowText: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.7 },
  heroTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 38,
    lineHeight: 39,
    letterSpacing: -1.6,
  },
  heroBody: {
    color: 'rgba(255,255,255,0.72)',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    maxWidth: 205,
    marginTop: 9,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 10,
    marginTop: 14,
  },
  heroButtonText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  heroStats: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  statValue: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 16 },
  statLabel: {
    color: 'rgba(255,255,255,0.58)',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 8,
    letterSpacing: 0.7,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  categoryRow: { gap: 8, paddingBottom: 25 },
  categoryPill: {
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 12,
  },
  categoryText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  featuredRow: { paddingBottom: 24 },
  empty: {
    minHeight: 145,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  emptyTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  emptyCopy: { fontFamily: 'Inter_400Regular', fontSize: 12 },
});