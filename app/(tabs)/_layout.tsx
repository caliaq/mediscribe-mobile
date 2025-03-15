import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function StackLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,  // Skrytí hlavičky na všech obrazovkách
        headerTintColor: Colors[colorScheme ?? 'light'].tint,
        headerStyle: Platform.select({
          ios: {
            // Customize for iOS if needed
          },
          default: {},
        }),
      }}>
      <Stack.Screen
        name="index"
        
        options={{
          title: 'home',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <IconSymbol size={32} name="house.fill" color={Colors[colorScheme ?? 'light'].tint} />
          ),
        }}
      />
      <Stack.Screen
        name="recording/[id]"
        options={{
          title: 'recording',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <IconSymbol size={32} name="paperplane.fill" color={Colors[colorScheme ?? 'light'].tint} />
          ),
        }}
      />
    </Stack>
  );
}
