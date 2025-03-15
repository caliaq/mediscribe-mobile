import { Image, StyleSheet, View, FlatList, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL, BACKGROUND_COLOR, CARD_COLOR, TEXT_COLOR, BLUE_COLOR, MAGENTA_COLOR } from '../constats';

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
        size={32}
        color={gender === 'female' ? MAGENTA_COLOR : BLUE_COLOR}
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
    backgroundColor: BACKGROUND_COLOR,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BACKGROUND_COLOR
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    padding: 16,
    borderRadius: 16,
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 2,
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
  },
  icon: {
    marginRight: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  location: {
    fontSize: 14,
    color: 'white',
  },
  logo: {
    height: 48,
    resizeMode: 'contain',
    marginBottom: 8,
    marginTop: 64,
  },
});
