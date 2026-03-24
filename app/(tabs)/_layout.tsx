import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SectionColors } from '@/constants/Theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const tabColors = {
    beauty: SectionColors.beauty,       // Purple  
    settings: SectionColors.settings    // Grey
  };

  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            paddingTop: 12,
          },
          default: {
            paddingTop: 12,
          },
        }),
      }}>
      <Tabs.Screen
        name="beauty"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name="pump.soap" 
              color={focused ? tabColors.beauty : color} 
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
              color={focused ? tabColors.settings : color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
