import { Stack, Redirect } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useAuth } from '@/context/AuthContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function StackLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();

  // Pokud se ověřuje autentizace, můžeme zobrazit loading stav
  if (isLoading) {
    return null;
  }

  // Pokud uživatel není přihlášen, přesměrujeme na login
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerTintColor: Colors[colorScheme ?? 'light'].tint,
        headerStyle: Platform.select({
          ios: {},
          default: {},
        }),
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="recording/[id]"
        options={({ navigation }) => ({
          title: 'Detaily',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Ionicons 
              name="arrow-back"
              size={24} 
              color={Colors[colorScheme ?? 'light'].tint}
              onPress={() => navigation.goBack()} 
              style={{ paddingLeft: 10 }}
            />
          ),
        })} 
      />
    </Stack>
  );
}