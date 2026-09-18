import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  Platform,
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

const appIcon = require('../../assets/images/icon.png');

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
      <LinearGradient colors={[channel.accent, channel.logoColor]} style={styles.poster}>
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

function PlaylistSourceModal({
  visible,
  initialName,
  initialUrl,
  onClose,
  onSave,
}: {
  visible: boolean;
  initialName: string;
  initialUrl: string;
  onClose: () => void;
  onSave: (name: string, url: string) => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(initialName);
  const [url, setUrl] = useState(initialUrl);

  const save = () => {
    if (!url.trim()) {
      Alert.alert('Thiếu địa chỉ playlist', 'Hãy nhập URL M3U hoặc Xtream Codes.');
      return;
    }
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave(name, url);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.modalBackdrop, { backgroundColor: colors.overlay }]}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.card, paddingBottom: insets.bottom + 18 },
          ]}
        >
          <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
          <View style={styles.sheetHeader}>
            <View>
              <Text style={[styles.sheetKicker, { color: colors.primary }]}>NGUỒN PHÁT</Text>
              <Text style={[styles.sheetTitle, { color: colors.foreground }]}>
                Thêm danh sách
              </Text>
            </View>
            <Pressable hitSlop={10} onPress={onClose}>
              <Feather name="x" size={22} color={colors.mutedForeground} />
            </Pressable>
          </View>
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
            Tên danh sách
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Playlist của tôi"
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.field,
              {
                color: colors.foreground,
                backgroundColor: colors.input,
                borderColor: colors.border,
              },
            ]}
          />
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
            URL M3U hoặc Xtream Codes
          </Text>
          <TextInput
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="https://provider.example/playlist.m3u"
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.field,
              {
                color: colors.foreground,
                backgroundColor: colors.input,
                borderColor: colors.border,
              },
            ]}
          />
          <Text style={[styles.helper, { color: colors.mutedForeground }]}>
            Danh sách sẽ được lưu trên thiết bị này.
          </Text>
          <Pressable
            onPress={save}
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={[styles.saveText, { color: colors.primaryForeground }]}>
              Lưu danh sách
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function PlaylistLanding({
  playlistName,
  playlistUrl,
  onAddSource,
  onOpenSettings,
}: {
  playlistName: string;
  playlistUrl: string;
  onAddSource: () => void;
  onOpenSettings: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const now = new Date();
  const topInset = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.landingPage,
        { paddingTop: topInset + 12, paddingBottom: bottomInset + 20 },
      ]}
    >
      <View style={styles.landingHeader}>
        <View style={styles.landingDate}>
          <Image source={appIcon} style={styles.landingIcon} />
          <View>
            <Text style={[styles.weekday, { color: colors.foreground }]}>
              {now.toLocaleDateString('vi-VN', { weekday: 'long' })}
            </Text>
            <Text style={[styles.dateNumber, { color: colors.foreground }]}>
              {now.getDate()}
            </Text>
            <Text style={[styles.dateMeta, { color: colors.mutedForeground }]}>
              Tháng {now.getMonth() + 1}, {now.getFullYear()}
            </Text>
          </View>
        </View>
        <Pressable
          hitSlop={10}
          onPress={onOpenSettings}
          style={[styles.settingsButton, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name="settings" size={20} color={colors.foreground} />
        </Pressable>
      </View>

      <View style={styles.landingContent}>
        <Text style={[styles.landingTitle, { color: colors.foreground }]}>
          Thêm danh sách phát của bạn để bắt đầu
        </Text>
        <Text style={[styles.landingSubtitle, { color: colors.mutedForeground }]}>
          Chọn một nguồn IPTV để xem các kênh yêu thích.
        </Text>
        <Pressable
          onPress={onAddSource}
          style={({ pressed }) => [
            styles.addSourceCard,
            {
              backgroundColor: colors.secondary,
              borderColor: colors.border,
              opacity: pressed ? 0.78 : 1,
            },
          ]}
        >
          <View style={[styles.addSourceIcon, { backgroundColor: colors.primary }]}>
            <Feather name="plus" size={30} color={colors.primaryForeground} />
          </View>
          <Text style={[styles.addSourceText, { color: colors.foreground }]}>Thêm nguồn</Text>
        </Pressable>
        <View style={[styles.noticeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.noticeTitle, { color: colors.foreground }]}>Thông báo</Text>
          <Text style={[styles.noticeText, { color: colors.mutedForeground }]}>
            Hãy thêm playlist M3U hoặc Xtream Codes để bắt đầu trải nghiệm xem truyền hình.
          </Text>
          <Text style={[styles.noticeHint, { color: colors.mutedForeground }]}>
            {playlistUrl ? `Danh sách hiện tại: ${playlistName}` : 'Nguồn phát được lưu riêng trên thiết bị.'}
          </Text>
          <Pressable onPress={onAddSource} style={styles.noticeAction}>
            <Text style={[styles.noticeActionText, { color: colors.primary }]}>Thêm ngay</Text>
            <Feather name="arrow-right" size={14} color={colors.primary} />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const {
    channels,
    isFavorite,
    toggleFavorite,
    addPlaylist,
    playlistName,
    playlistUrl,
    hasPlaylist,
    isLoading,
    error,
    refreshPlaylist,
  } = useIptv();
  const [selectedGroup, setSelectedGroup] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [sourceVisible, setSourceVisible] = useState(false);
  const topInset = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;
  const columns = width >= 760 ? 3 : 2;
  const gridWidth = Math.max(width - 28, 260);
  const cardWidth = Math.max(108, Math.floor((gridWidth - (columns - 1) * 10) / columns));

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

  if (!hasPlaylist) {
    return (
      <>
        <View style={[styles.root, { backgroundColor: colors.background }]}>
          <PlaylistLanding
            playlistName={playlistName}
            playlistUrl={playlistUrl}
            onAddSource={() => setSourceVisible(true)}
            onOpenSettings={() => router.push('/(tabs)/settings')}
          />
        </View>
        <PlaylistSourceModal
          visible={sourceVisible}
          initialName={playlistName}
          initialUrl={playlistUrl}
          onClose={() => setSourceVisible(false)}
          onSave={(name, url) => {
            addPlaylist(name, url);
            setSourceVisible(false);
          }}
        />
      </>
    );
  }

  return (
    <>
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.catalogPage,
            { paddingTop: topInset + 10, paddingBottom: bottomInset + 24 },
          ]}
        >
          <View style={styles.catalogHeader}>
            <View style={styles.brand}>
              <View style={[styles.brandMark, { backgroundColor: colors.primary }]}>
                <Feather
                  name="play"
                  size={12}
                  color={colors.primaryForeground}
                  fill={colors.primaryForeground}
                />
              </View>
              <View>
                <Text style={[styles.brandText, { color: colors.foreground }]}>PLAYSPORT</Text>
                <Text style={[styles.playlistLabel, { color: colors.mutedForeground }]}>
                  {playlistName}
                </Text>
              </View>
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

          {(isLoading || error) && (
            <View
              style={[
                styles.syncNotice,
                {
                  backgroundColor: error ? colors.destructive + '18' : colors.secondary,
                  borderColor: error ? colors.destructive + '66' : colors.border,
                },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Feather name="alert-circle" size={17} color={colors.destructive} />
              )}
              <Text style={[styles.syncText, { color: colors.foreground }]}>
                {isLoading ? 'Đang tải playlist…' : error}
              </Text>
              {error && (
                <Pressable
                  accessibilityLabel="Tải lại playlist"
                  hitSlop={8}
                  onPress={() => void refreshPlaylist()}
                  style={[styles.retryButton, { backgroundColor: colors.primary }]}
                >
                  <Feather name="refresh-cw" size={15} color={colors.primaryForeground} />
                </Pressable>
              )}
            </View>
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.groupTabs}
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
                    styles.groupTab,
                    {
                      backgroundColor: selected ? colors.secondary : colors.card,
                      borderColor: selected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.groupTabText,
                      { color: selected ? colors.foreground : colors.mutedForeground },
                    ]}
                  >
                    {group}
                  </Text>
                  <Text style={[styles.groupTabCount, { color: colors.mutedForeground }]}>
                    {count}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.programHeader}>
            <View>
              <Text style={[styles.programKicker, { color: colors.primary }]}>KÊNH TRUYỀN HÌNH</Text>
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
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Không có kênh</Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                Thử chọn nhóm khác hoặc tìm kiếm lại.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
      <PlaylistSourceModal
        visible={sourceVisible}
        initialName={playlistName}
        initialUrl={playlistUrl}
        onClose={() => setSourceVisible(false)}
        onSave={(name, url) => {
          addPlaylist(name, url);
          setSourceVisible(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  landingPage: { paddingHorizontal: 18, flexGrow: 1 },
  landingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  landingDate: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  landingIcon: { width: 66, height: 66, borderRadius: 33 },
  weekday: { fontFamily: 'Inter_500Medium', fontSize: 13, textTransform: 'capitalize' },
  dateNumber: { fontFamily: 'Inter_700Bold', fontSize: 28, lineHeight: 32 },
  dateMeta: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  landingContent: { alignItems: 'center', width: '100%', maxWidth: 510, alignSelf: 'center', marginTop: 25 },
  landingTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 21,
    lineHeight: 28,
    textAlign: 'center',
    maxWidth: 390,
  },
  landingSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
  },
  addSourceCard: {
    width: 170,
    minHeight: 128,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  addSourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSourceText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  noticeCard: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 18,
    padding: 17,
    marginTop: 24,
  },
  noticeTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, marginBottom: 8 },
  noticeText: { fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 19 },
  noticeHint: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 16, marginTop: 10 },
  noticeAction: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 13 },
  noticeActionText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  catalogPage: { paddingHorizontal: 14 },
  catalogHeader: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandMark: {
    width: 25,
    height: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { fontFamily: 'Inter_700Bold', fontSize: 14, letterSpacing: 1.2 },
  playlistLabel: { fontFamily: 'Inter_400Regular', fontSize: 9, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  syncNotice: {
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 44,
    paddingHorizontal: 12,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  syncText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 17 },
  retryButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  groupTabs: { gap: 8, paddingBottom: 12 },
  groupTab: {
    minHeight: 40,
    borderRadius: 11,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    justifyContent: 'center',
  },
  groupTabText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  groupTabCount: { fontFamily: 'Inter_400Regular', fontSize: 9, marginTop: 2 },
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
  channelCard: { borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
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
  modalBackdrop: { flex: 1, justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 18, paddingTop: 11 },
  sheetHandle: { alignSelf: 'center', width: 38, height: 4, borderRadius: 4, marginBottom: 24 },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },
  sheetKicker: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.4, marginBottom: 6 },
  sheetTitle: { fontFamily: 'Inter_700Bold', fontSize: 24 },
  fieldLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, marginBottom: 7 },
  field: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginBottom: 16,
  },
  helper: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17, marginBottom: 18 },
  saveButton: { height: 48, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  saveText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
});