import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL, BACKGROUND_COLOR, CARD_COLOR, TEXT_COLOR, BLUE_COLOR, MAGENTA_COLOR } from '../constats';

export default function HomeScreen() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        alert('Aplikace potřebuje přístup k mikrofonu!');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording saved at', uri);
    uploadAudio(uri);
    setRecording(null);
  };

  const uploadAudio = async (uri) => {
    const formData = new FormData();
    formData.append('audio', {
      uri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    });

    try {
      const response = await fetch(API_URL + "recordings", {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const result = await response.json();
      console.log('Upload success:', result);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
      <View style={styles.container}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.name}>Alena Malá, 69</Text>
        <Text style={styles.location}>Plzeň Americká, pod mostem 5</Text>
        <TouchableOpacity
          style={styles.recordButton}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <MaterialCommunityIcons
            name={isRecording ? 'microphone-off' : 'microphone'}
            size={48}
            color='#0D1218'
          />
        </TouchableOpacity>
        <Text style={styles.recordText}>{isRecording ? 'nahrává se...' : 'začít nahrávat'}</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  logo: {
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT_COLOR,
  },
  location: {
    fontSize: 14,
    color: TEXT_COLOR,
    marginBottom: 50,
  },
  recordButton: {
    backgroundColor: TEXT_COLOR,
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordText: {
    color: TEXT_COLOR,
    marginTop: 10,
  },
});