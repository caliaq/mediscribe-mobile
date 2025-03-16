import { Image, StyleSheet, View, FlatList, Text, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { API_URL, BACKGROUND_COLOR, BLUE_COLOR, MAGENTA_COLOR } from '../constats';
import { Link } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWithAuth } from '../../middleware/authMiddleware';
import { router } from 'expo-router';

// Define TypeScript interfaces for data
interface Address {
  street: string;
  city: string;
  zip: string;
}

interface Name {
  first: string;
  last: string;
}

interface Patient {
  _id: string;
  name: Name;
  address: Address;
  birthDate: string
  sex: 'M' | 'F';
}

interface CardItemProps {
  name: Name;
  address: Address;
  birthDate: string;
  sex: 'M' | 'F';
  _id: string;
}

const CardItem: React.FC<CardItemProps> = ({ name, address, birthDate, sex, _id }) => {
  const fullName = `${name.first} ${name.last}`;
  const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
  const location = `${address.street} ${address.city}, ${address.zip}`;

  return (
    <Card style={[styles.card, sex === 'F' ? styles.femaleBorder : styles.maleBorder]}>
      <Link href = {{pathname: '/recording/[id]', params: { id: _id }}}>
      <Card.Content style={styles.cardContent}>
        <MaterialCommunityIcons
          name={sex === 'F' ? 'human-female' : 'human-male'}
          size={32}
          color={sex === 'F' ? MAGENTA_COLOR : BLUE_COLOR}
          style={styles.icon}
        />
        <View>
          <Text style={styles.name}>{fullName}, {age}</Text>
          <Text style={styles.location}>{location}</Text>
        </View>
      </Card.Content>
      </Link>
    </Card>
  );
};

const HomeScreen: React.FC = () => {
  const [data, setData] = useState<Patient[]>([]);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(`${API_URL}patients`);
        const data = await response.json();
        if (data.data) {
          setData(data.data);
        }
      } catch (error) {
        console.error('Error fetching patients data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
        <View style={styles.headerButtons}>
          <MaterialIcons 
        name="qr-code-scanner" 
        size={24} 
        color="white" 
        style={styles.scannerIcon}
        onPress={() => router.push('/scanner')}
          />
          <Button 
        title="odhlásit se" 
        onPress={logout} 
          />
        </View>
      </View>
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => <CardItem {...item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BACKGROUND_COLOR
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    padding: 16,
    borderRadius: 16,
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 2,
    fontFamily: 'Outfit',
  },
  femaleBorder: {
    borderColor: MAGENTA_COLOR,
  },
  maleBorder: {
    borderColor: BLUE_COLOR,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: 'Outfit',
  },
  icon: {
    marginRight: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Outfit',
  },
  location: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Outfit',
  },
  logo: {
    height: 48,
    resizeMode: 'contain',
    marginBottom: 8,
    marginTop: 64,
  },
  scannerIcon: {
    marginRight: 16,
  },
});

export default HomeScreen;
