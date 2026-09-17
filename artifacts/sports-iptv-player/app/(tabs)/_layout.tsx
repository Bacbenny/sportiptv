import React from 'react';
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { useColors } from '@/hooks/useColors';

export default function TabLayout() {
  const colors = useColors();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: isLandscape
          ? { display: 'none' }
          : {
              height: 78,
              paddingTop: 8,
              paddingBottom: 15,
              backgroundColor: colors.card,
              borderTopColor: colors.border,
              borderTopWidth: 1,
              elevation: 0,
            },
        tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather name="home" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <Feather name="heart" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Feather name="sliders" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}