import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [completedQuests, setCompletedQuests] = useState(0);

  const focus = useIsFocused();

  useEffect(() => {
    loadCompletedQuests();
  }, [focus]);

  const loadCompletedQuests = async () => {
    try {
      const storedQuests = await AsyncStorage.getItem('completedQuests');

      if (storedQuests) {
        const parsedQuests = JSON.parse(storedQuests);
        console.log(parsedQuests, 'storedQuests');

        setCompletedQuests(Object.keys(parsedQuests).length);
      }
    } catch (error) {
      console.log('Failed to load completed quests:', error);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to Niagara: Nature Quest!</Text>
      <Text style={styles.description}>
        Discover the beauty of waterfalls, learn more about nature, and
        experience unique eco-quests.
      </Text>

      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Your Progress</Text>
        <Text style={styles.progressText}>
          Completed Quests: {completedQuests}
        </Text>
      </View>

      <View style={styles.featuredCard}>
        <Image
          source={require('../assets/one.webp')}
          style={styles.featuredImage}
          resizeMode="cover"
        />
        <View style={styles.featuredOverlay}>
          <Text style={styles.featuredTitle}>
            Featured Quest: Waterfall Adventure
          </Text>
          <TouchableOpacity
            style={styles.featuredButton}
            onPress={() => navigation.navigate('Quests')}>
            <Text style={styles.featuredButtonText}>Explore Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Waterfalls</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            {
              name: 'Waterfall Explorer',
              image:
                'https://cdn.britannica.com/41/129941-050-7A7D1027/Niagara-Falls-cities-River-Ontario-New-York.jpg',
            },
            {
              name: 'Eco Protector',
              image:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjbnK3cvEKE18isJtTwL0lFgl5iolD-_RBiw&s',
            },
            {
              name: 'Wildlife Observer',
              image:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShWlhTgddD9O7mHyO74PxOoAN7RzKQP8JEZw&s',
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.waterfallCard}
              onPress={() => navigation.navigate('Map')}>
              <Image source={{uri: item.image}} style={styles.waterfallImage} />
              <Text style={styles.waterfallName}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest News</Text>
        <Text style={styles.item}>New waterfall added to the list!</Text>
        <Text style={styles.item}>
          Eco-quest "The Power of Nature" is now available!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tips & Tricks</Text>
        <Text style={styles.item}>🔹 Pack light but carry essentials.</Text>
        <Text style={styles.item}>
          🔹 Check weather conditions before visiting.
        </Text>
        <Text style={styles.item}>
          🔹 Use eco-friendly products to preserve nature.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingVertical: 40,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
  },
  title: {
    marginTop:10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressCard: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  progressText: {
    fontSize: 16,
    color: '#388E3C',
    marginTop: 5,
  },
  featuredCard: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(46, 125, 50, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  featuredButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  featuredButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  section: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
    color: '#388E3C',
    marginBottom: 5,
  },
  waterfallCard: {
    width: 120,
    marginRight: 10,
    alignItems: 'center',
  },
  waterfallImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
  },
  waterfallName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default HomeScreen;
