import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { AppColors } from '@/utils/Theme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: AppColors.settings,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            paddingTop: 12,
            paddingBottom: 48,
          },
          default: {
            paddingTop: 12,
            paddingBottom: 48,
          },
        }),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name="pump.soap"
              color={focused ? AppColors.brandColor : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name="gearshape.fill"
              color={focused ? AppColors.brandColor : color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
