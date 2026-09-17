import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChannelLogo } from '@/components/ChannelLogo';
import { useIptv } from '@/context/iptv-context';
import { useColors } from '@/hooks/useColors';

export default function ChannelScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { channels, isFavorite, toggleFavorite } = useIptv();
  const channel = channels.find((item) => item.id === id) ?? channels[0];
  const [playing, setPlaying] = useState(false);
  const [quality, setQuality] = useState('Auto');
  const favorite = isFavorite(channel.id);

  const togglePlay = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPlaying((value) => !value);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}
      >
        <ImageBackground
          source={channel.image}
          style={[styles.player, { paddingTop: insets.top + 12 }]}
          imageStyle={styles.playerImage}
        >
          <View style={styles.playerShade} />
          <View style={styles.playerTop}>
            <Pressable onPress={() => router.back()} style={styles.playerButton}>
              <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </Pressable>
            <View style={styles.playerTools}>
              <Pressable
                onPress={() =>
                  setQuality(quality === 'Auto' ? channel.quality : 'Auto')
                }
                style={styles.qualityButton}
              >
                <Text style={styles.qualityText}>{quality}</Text>
                <Feather name="chevron-down" size={13} color="#FFFFFF" />
              </Pressable>
              <Pressable
                onPress={() => toggleFavorite(channel.id)}
                style={styles.playerButton}
              >
                <Feather
                  name="heart"
                  size={18}
                  color={favorite ? colors.destructive : '#FFFFFF'}
                  fill={favorite ? colors.destructive : 'transparent'}
                />
              </Pressable>
            </View>
          </View>
          <View style={styles.playerCenter}>
            <Pressable
              testID="player-toggle"
              onPress={togglePlay}
              style={[styles.mainPlay, { backgroundColor: colors.primary }]}
            >
              <Feather
                name={playing ? 'pause' : 'play'}
                size={25}
                color={colors.primaryForeground}
                fill={colors.primaryForeground}
              />
            </Pressable>
            <Text style={styles.previewLabel}>
              {playing ? 'PLAYING DEMO PREVIEW' : 'DEMO PREVIEW'}
            </Text>
          </View>
          <View style={styles.playerBottom}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary,
                    width: playing ? '48%' : '22%',
                  },
                ]}
              />
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.time}>00:{playing ? '18' : '00'}</Text>
              <Text style={styles.time}>LIVE</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.info}>
          <View style={styles.infoTop}>
            <View style={styles.channelTitle}>
              <ChannelLogo channel={channel} size={52} />
              <View style={styles.infoCopy}>
                <View style={styles.liveLine}>
                  {channel.isLive && (
                    <View
                      style={[styles.liveDot, { backgroundColor: colors.destructive }]}
                    />
                  )}
                  <Text
                    style={[
                      styles.liveLabel,
                      {
                        color: channel.isLive
                          ? colors.destructive
                          : colors.mutedForeground,
                      },
                    ]}
                  >
                    {channel.isLive ? 'LIVE NOW' : 'UP NEXT'}
                  </Text>
                </View>
                <Text style={[styles.title, { color: colors.foreground }]}>
                  {channel.name}
                </Text>
                <Text style={[styles.schedule, { color: colors.mutedForeground }]}>
                  {channel.schedule}
                </Text>
              </View>
            </View>
            <Pressable onPress={() => toggleFavorite(channel.id)}>
              <Feather
                name="heart"
                size={21}
                color={favorite ? colors.destructive : colors.mutedForeground}
                fill={favorite ? colors.destructive : 'transparent'}
              />
            </Pressable>
          </View>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            {channel.description}
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Now playing
          </Text>
          <View
            style={[
              styles.program,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.programTime,
                { backgroundColor: channel.accent + '1F' },
              ]}
            >
              <Text style={[styles.programTimeText, { color: channel.accent }]}>
                20:30
              </Text>
              <Text style={[styles.programTimeMeta, { color: colors.mutedForeground }]}>
                LIVE
              </Text>
            </View>
            <View style={styles.programCopy}>
              <Text style={[styles.programTitle, { color: colors.foreground }]}>
                {channel.schedule.split(' · ')[0]}
              </Text>
              <Text style={[styles.programMeta, { color: colors.mutedForeground }]}>
                Main event coverage and analysis
              </Text>
            </View>
            <Feather name="more-horizontal" size={19} color={colors.mutedForeground} />
          </View>
          <View style={[styles.infoPill, { backgroundColor: colors.secondary }]}>
            <Feather name="info" size={15} color={colors.primary} />
            <Text style={[styles.infoPillText, { color: colors.secondaryForeground }]}>
              Connect your playlist in Settings for real playback.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  player: {
    height: 365,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
  },
  playerImage: { opacity: 0.96 },
  playerShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(5,12,23,0.48)',
  },
  playerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerTools: { flexDirection: 'row', gap: 9, alignItems: 'center' },
  playerButton: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(5,12,23,0.54)',
  },
  qualityButton: {
    height: 35,
    borderRadius: 10,
    paddingHorizontal: 10,
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5,12,23,0.54)',
  },
  qualityText: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 10 },
  playerCenter: { alignItems: 'center', gap: 10 },
  mainPlay: {
    width: 65,
    height: 65,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 1.3,
  },
  playerBottom: { width: '100%' },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: 3, borderRadius: 4 },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  time: {
    color: 'rgba(255,255,255,0.75)',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
  },
  info: { padding: 18 },
  infoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  channelTitle: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  infoCopy: { gap: 4 },
  liveLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 6 },
  liveLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.8 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 22, letterSpacing: -0.5 },
  schedule: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 17,
  },
  divider: { height: 1, marginVertical: 23 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, marginBottom: 11 },
  program: {
    minHeight: 74,
    borderRadius: 17,
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  programTime: {
    width: 58,
    height: 53,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  programTimeText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  programTimeMeta: { fontFamily: 'Inter_700Bold', fontSize: 8, letterSpacing: 0.7 },
  programCopy: { flex: 1, gap: 5 },
  programTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  programMeta: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 13,
    marginTop: 17,
  },
  infoPillText: { fontFamily: 'Inter_500Medium', fontSize: 11, flex: 1 },
});