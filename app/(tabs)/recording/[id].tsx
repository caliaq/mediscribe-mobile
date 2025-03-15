import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL, BACKGROUND_COLOR, TEXT_COLOR } from '../../constats';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams } from 'expo-router';

export default function HomeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [patient, setPatient] = useState<any>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  useEffect(() => {
    if (id) {
      console.log('Fetching patient data for ID:', id);
      setIsLoading(true); // Zapneme loading indikátor při načítání pacienta
      fetch(`${API_URL}patients/${id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Patient data received:', data);
          if (data.data) {
            setPatient(data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching patient data:", error);
        })
        .finally(() => {
          setIsLoading(false); // Po dokončení načítání vypneme loading indikátor
        });
    }
  }, [id]);

  interface IPatient {
    _id: string;
    name: {
      first: string;
      last: string;
    };
    address: {
      street: string;
      city: string;
      zip: string;
    };
    birthDate: string;
    sex: 'M' | 'F';
  }

  const Patient: React.FC<IPatient> = ({ name, address, birthDate, sex, _id }) => {
    const fullName = `${name.first} ${name.last}`;
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    const location = `${address.street} ${address.city}, ${address.zip}`;

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
        setIsLoading(true); // Zapneme loading indikátor při nahrávání
        const base64Audio = await FileSystem.readAsStringAsync(recordingUri, { encoding: FileSystem.EncodingType.Base64 });

        const response = await fetch(API_URL + "recordings", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: base64Audio,
            patientId: id,
            fileType: 'm4a',
          }),
        });

        const result = await response.json();

        if (result.success) {
          console.log('Nahrávání úspěšné:', result);
          setRecordingUri(null);
        } else {
          console.error('Nahrávání selhalo:', result.data.message);
          Alert.alert('Chyba', result.data.message || 'Něco se pokazilo při nahrávání.');
        }
      } catch (error) {
        console.error('Nahrávání selhalo:', error);
        Alert.alert('Chyba', 'Došlo k chybě při nahrávání.');
      } finally {
        setIsLoading(false); // Po dokončení nahrávání vypneme loading indikátor
      }
    };

    return (
      <View style={styles.container}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.name}>{fullName}, {age}</Text>
        <Text style={styles.location}>{location}</Text>
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
        <Text style={styles.recordText}>
          {recordingUri ? 'Chcete odeslat?' : isRecording ? 'Nahrává se...' : 'Začít nahrávat'}
        </Text>
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
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={TEXT_COLOR}/>
      ) : patient ? (
        <Patient {...patient} />
      ) : (
        <Text style={styles.recordText}>Načítání pacienta...</Text>
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
