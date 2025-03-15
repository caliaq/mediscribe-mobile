import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';  // Importujeme Ionicons pro šipku

import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function StackLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
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
          headerShown: false,  // Skrýt header na obrazovce "index"
        }}
      />
      <Stack.Screen
        name="recording/[id]"
        options={({ navigation }) => ({
          title: 'Detaily',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Ionicons 
              name="arrow-back"  // Ikona šipky zpět
              size={24} 
              color={Colors[colorScheme ?? 'light'].tint}  // Barva ikony dle tématu
              onPress={() => navigation.goBack()} 
              style={{ paddingLeft: 10 }}  // Padding pro lepší rozložení
            />
          ),
        })} 
      />
    </Stack>
  );
}
