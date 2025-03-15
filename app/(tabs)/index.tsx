import { Image, StyleSheet, View, FlatList, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Constants } from 'expo-constants';

const DATA = [
  { id: '1', name: 'Alena Malá', age: 69, location: 'Plzeň Americká, pod mostem 5', gender: 'female' },
  { id: '2', name: 'Pepa Novák', age: 134, location: 'Plzeň Americká, pod mostem 1', gender: 'male' },
  { id: '3', name: 'Alena Malá', age: 69, location: 'Plzeň Americká, pod mostem 5', gender: 'female' },
  { id: '4', name: 'Pepa Novák', age: 134, location: 'Plzeň Americká, pod mostem 1', gender: 'male' },
  { id: '5', name: 'Alena Malá', age: 69, location: 'Plzeň Americká, pod mostem 5', gender: 'female' },
  { id: '6', name: 'Pepa Novák', age: 134, location: 'Plzeň Americká, pod mostem 1', gender: 'male' },
  { id: '7', name: 'Pepa Novák', age: 134, location: 'Plzeň Americká, pod mostem 1', gender: 'male' },
  { id: '8', name: 'Pepa Novák', age: 134, location: 'Plzeň Americká, pod mostem 1', gender: 'male' },
];

const CardItem = ({ name, age, location, gender }) => (
  <Card style={[styles.card, gender === 'female' ? styles.femaleBorder : styles.maleBorder]}>
    <Card.Content style={styles.cardContent}>
      <MaterialCommunityIcons
        name={gender === 'female' ? 'human-female' : 'human-male'}
        size={24}
        color={gender === 'female' ? '#ff007f' : '#4a90e2'}
        style={styles.icon}
      />
      <View>
        <Text style={styles.name}>{name}, {age}</Text>
        <Text style={styles.location}>{location}</Text>
      </View>
    </Card.Content>
  </Card>
);

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.container}>
        <FlatList
          data={DATA}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CardItem {...item} />}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1218',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D1218'
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#1E1E1E',
    borderWidth: 2,
  },
  femaleBorder: {
    borderColor: '#ff007f',
  },
  maleBorder: {
    borderColor: '#4a90e2',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  location: {
    fontSize: 14,
    color: 'white',
  },
  logo: {
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
    marginTop: 48,
  },
});
