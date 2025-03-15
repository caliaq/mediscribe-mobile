import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL, BACKGROUND_COLOR, TEXT_COLOR } from '../constats';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';

export default function HomeScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);

  const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  const startRecording = async () => {
    if (recordingUri) return;
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('Přístup k mikrofonu je nutný!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Chyba při nahrávání:', error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    if (uri) {
      setRecordingUri(uri);
    }
  };

  const uploadAudio = async () => {
    if (!recordingUri) return;
    try {
      const base64Audio = await FileSystem.readAsStringAsync(recordingUri, { encoding: FileSystem.EncodingType.Base64 });

      const response = await fetch(API_URL + "recordings", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: base64Audio,
          patientId: '12345',
          fileType: 'm4a',
        }),
      });

      const result = await response.json();
      console.log('Nahrávání úspěšné:', result);
      setRecordingUri(null);
    } catch (error) {
      console.error('Nahrávání selhalo:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.name}>Alena Malá, 69</Text>
      <Text style={styles.location}>Plzeň Americká, pod mostem 5</Text>
      <TouchableOpacity 
        style={[styles.recordButton, recordingUri && styles.disabledButton]} 
        onPress={() => {
          haptic();
          isRecording ? stopRecording() : startRecording();
        }}
        disabled={!!recordingUri}
      >
        <MaterialCommunityIcons name={isRecording ? 'microphone-off' : 'microphone'} size={48} color='#0D1218' />
      </TouchableOpacity>
      <Text style={styles.recordText}>{recordingUri ? 'Chcete odeslat??' : isRecording ? 'Nahrává se...' : 'Začít nahrávat'}</Text>
      {recordingUri && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setRecordingUri(null)}>
            <MaterialCommunityIcons name='close' size={40} color='red' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={uploadAudio}>
            <MaterialCommunityIcons name='check' size={40} color='green' />
          </TouchableOpacity>
        </View>
      )}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: TEXT_COLOR,
  },
  location: {
    fontSize: 14,
    color: TEXT_COLOR,
    marginBottom: 48,
  },
  recordButton: {
    backgroundColor: TEXT_COLOR,
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  recordText: {
    color: TEXT_COLOR,
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  actionButton: {
    marginHorizontal: 20,
    padding: 10,
  },
});
