import { Stack, Redirect, useRouter } from 'expo-router';
import { Platform, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return null;
  }

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
        name="scanner"
        options={{
          title: 'Scanner',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="recording/[id]"
        options={{
          title: 'Detaily',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Pressable 
              onPress={() => router.back()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                paddingLeft: 15
              })}
            >
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={Colors[colorScheme ?? 'light'].tint}
              />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable 
              onPress={() => router.push('/scanner')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                paddingRight: 15
              })}
            >
              <MaterialIcons 
                name="qr-code-scanner" 
                size={24} 
                color={Colors[colorScheme ?? 'light'].tint}
              />
            </Pressable>
          )
        }}
      />
    </Stack>
  );
}