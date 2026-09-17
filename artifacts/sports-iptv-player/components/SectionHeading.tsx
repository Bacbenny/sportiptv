import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
type Props = { title: string; action?: string; onAction?: () => void };
export function SectionHeading({ title, action, onAction }: Props) { const colors = useColors(); return <View style={styles.wrap}><Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>{action && <Pressable onPress={onAction} hitSlop={10} style={styles.action}><Text style={[styles.actionText, { color: colors.primary }]}>{action}</Text><Feather name="arrow-up-right" size={14} color={colors.primary} /></Pressable>}</View>; }
const styles = StyleSheet.create({ wrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }, title: { fontFamily: 'Inter_700Bold', fontSize: 19, letterSpacing: -0.4 }, action: { flexDirection: 'row', alignItems: 'center', gap: 4 }, actionText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 } });
