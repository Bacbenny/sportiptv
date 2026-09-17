import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChannelLogo } from '@/components/ChannelLogo';
import { groupOptions, type Channel } from '@/data/channels';
import { useIptv } from '@/context/iptv-context';
import { useColors } from '@/hooks/useColors';

function ChannelGridCard({
  channel,
  width,
  favorite,
  onPress,
  onToggleFavorite,
}: {
  channel: Channel;
  width: number;
  favorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.channelCard,
        { width, backgroundColor: colors.card, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <LinearGradient
        colors={[channel.accent, channel.logoColor]}
        style={styles.poster}
      >
        <View style={styles.posterTop}>
          <Text style={styles.posterBrand}>TV360+</Text>
          <Pressable hitSlop={10} onPress={onToggleFavorite}>
            <Feather
              name="heart"
              size={16}
              color={favorite ? colors.destructive : '#FFFFFF'}
              fill={favorite ? colors.destructive : 'transparent'}
            />
          </Pressable>
        </View>
        <View style={styles.posterArt}>
          <View style={styles.posterOrbit} />
          <ChannelLogo channel={channel} size={58} />
          <Text style={styles.posterEvent}>{channel.isLive ? 'LIVE' : 'TV360+'}</Text>
        </View>
        <View style={styles.posterBottom}>
          <Text style={styles.posterCaption}>{channel.category.toUpperCase()}</Text>
          <Text style={styles.posterQuality}>{channel.quality}</Text>
        </View>
      </LinearGradient>
      <View style={styles.cardFooter}>
        <View style={styles.cardTitleRow}>
          <Text numberOfLines={1} style={[styles.cardTitle, { color: colors.foreground }]}>
            {channel.name}
          </Text>
          {channel.isLive && (
            <View style={[styles.liveDot, { backgroundColor: colors.destructive }]} />
          )}
        </View>
        <Text numberOfLines={1} style={[styles.cardSchedule, { color: colors.mutedForeground }]}>
          {channel.schedule}
        </Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { channels, isFavorite, toggleFavorite } = useIptv();
  const [selectedGroup, setSelectedGroup] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const railWidth = width >= 700 ? 168 : 116;
  const contentWidth = Math.max(width - railWidth - 42, 220);
  const cardWidth = Math.max(108, Math.floor((contentWidth - 12) / 2));

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return channels.filter((channel) => {
      const groupMatches =
        selectedGroup === 'Tất cả' || channel.group === selectedGroup;
      const searchMatches =
        !query ||
        channel.name.toLowerCase().includes(query) ||
        channel.group.toLowerCase().includes(query);
      return groupMatches && searchMatches;
    });
  }, [channels, search, selectedGroup]);

  const selectGroup = (group: string) => {
    void Haptics.selectionAsync();
    setSelectedGroup(group);
  };
  const openChannel = (id: string) => {
    void Haptics.selectionAsync();
    router.push({ pathname: '/channel/[id]', params: { id } });
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.page,
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 24 },
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
            <Text style={[styles.brandText, { color: colors.foreground }]}>PLAYSPORT</Text>
          </View>
          <View style={styles.headerRight}>
            {searchOpen && (
              <TextInput
                autoFocus
                value={search}
                onChangeText={setSearch}
                placeholder="Tìm kênh"
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
              onPress={() => {
                setSearchOpen((value) => !value);
                if (searchOpen) setSearch('');
              }}
              style={[styles.headerButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Feather
                name={searchOpen ? 'x' : 'search'}
                size={17}
                color={colors.foreground}
              />
            </Pressable>
            <Pressable
              onPress={() => router.push('/(tabs)/settings')}
              style={[styles.headerButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Feather name="settings" size={17} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        <View style={styles.body}>
          <View style={[styles.rail, { width: railWidth, borderRightColor: colors.border }]}>
            <Text style={[styles.railLabel, { color: colors.mutedForeground }]}>
              NHÓM KÊNH
            </Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              contentContainerStyle={styles.railList}
            >
              {groupOptions.map((group) => {
                const selected = group === selectedGroup;
                const count =
                  group === 'Tất cả'
                    ? channels.length
                    : channels.filter((channel) => channel.group === group).length;
                return (
                  <Pressable
                    key={group}
                    onPress={() => selectGroup(group)}
                    style={[
                      styles.railItem,
                      selected && { backgroundColor: colors.secondary },
                    ]}
                  >
                    <View
                      style={[
                        styles.railIndicator,
                        { backgroundColor: selected ? colors.primary : 'transparent' },
                      ]}
                    />
                    <View style={styles.railCopy}>
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.railText,
                          { color: selected ? colors.foreground : colors.mutedForeground },
                        ]}
                      >
                        {group}
                      </Text>
                      <Text style={[styles.railCount, { color: colors.mutedForeground }]}>
                        {count}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.programs}>
            <View style={styles.programHeader}>
              <View>
                <Text style={[styles.programKicker, { color: colors.primary }]}>
                  PLAYLIST
                </Text>
                <Text style={[styles.programTitle, { color: colors.foreground }]}>
                  {selectedGroup}
                </Text>
              </View>
              <View style={[styles.channelCount, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.channelCountText, { color: colors.secondaryForeground }]}>
                  {filtered.length} kênh
                </Text>
              </View>
            </View>
            {filtered.length ? (
              <View style={styles.grid}>
                {filtered.map((channel) => (
                  <ChannelGridCard
                    key={channel.id}
                    channel={channel}
                    width={cardWidth}
                    favorite={isFavorite(channel.id)}
                    onPress={() => openChannel(channel.id)}
                    onToggleFavorite={() => toggleFavorite(channel.id)}
                  />
                ))}
              </View>
            ) : (
              <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="tv" size={25} color={colors.mutedForeground} />
                <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                  Không có kênh
                </Text>
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  Thử chọn nhóm khác hoặc tìm kiếm lại.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  page: { paddingHorizontal: 14 },
  header: {
    minHeight: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  brandMark: {
    width: 25,
    height: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { fontFamily: 'Inter_700Bold', fontSize: 14, letterSpacing: 1.2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  searchInput: {
    width: 128,
    height: 36,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flexDirection: 'row', alignItems: 'stretch' },
  rail: { borderRightWidth: 1, paddingRight: 10, minHeight: 470 },
  railLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 1.1,
    marginBottom: 9,
    paddingLeft: 4,
  },
  railList: { gap: 4, paddingBottom: 12 },
  railItem: {
    minHeight: 45,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  railIndicator: { width: 3, height: 28, borderRadius: 4 },
  railCopy: { flex: 1, paddingHorizontal: 8 },
  railText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, lineHeight: 14 },
  railCount: { fontFamily: 'Inter_400Regular', fontSize: 9, marginTop: 2 },
  programs: { flex: 1, paddingLeft: 12 },
  programHeader: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  programKicker: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.1 },
  programTitle: { fontFamily: 'Inter_700Bold', fontSize: 21, letterSpacing: -0.6, marginTop: 3 },
  channelCount: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, marginBottom: 2 },
  channelCountText: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  channelCard: { borderWidth: 1, borderRadius: 14, overflow: 'hidden', marginBottom: 1 },
  pressed: { opacity: 0.78 },
  poster: { height: 112, padding: 9, justifyContent: 'space-between' },
  posterTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  posterBrand: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.6 },
  posterArt: { alignItems: 'center', justifyContent: 'center', flex: 1, gap: 2 },
  posterOrbit: {
    position: 'absolute',
    width: 66,
    height: 35,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    transform: [{ rotate: '-18deg' }],
  },
  posterEvent: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1 },
  posterBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  posterCaption: { color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_600SemiBold', fontSize: 8, letterSpacing: 0.5 },
  posterQuality: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 8 },
  cardFooter: { paddingHorizontal: 9, paddingVertical: 8, gap: 4 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  cardTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, flexShrink: 1 },
  liveDot: { width: 5, height: 5, borderRadius: 5 },
  cardSchedule: { fontFamily: 'Inter_400Regular', fontSize: 9 },
  empty: {
    minHeight: 180,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 11, textAlign: 'center' },
});