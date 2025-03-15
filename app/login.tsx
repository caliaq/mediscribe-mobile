import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { BACKGROUND_COLOR, TEXT_COLOR, API_URL } from './constats';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    // Input validation
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Ensure data is stringified before storage
        const authData = JSON.stringify(data.data);
        await login(authData);
        router.replace('/(tabs)');
      } else {
        Alert.alert(
          'Login Failed', 
          data.message || 'Invalid credentials'
        );
      }
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert(
        'Error', 
        'Connection failed. Please check your internet connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={TEXT_COLOR}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={TEXT_COLOR}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color={TEXT_COLOR} />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: BACKGROUND_COLOR,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: TEXT_COLOR,
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
    color: TEXT_COLOR,
  },
});