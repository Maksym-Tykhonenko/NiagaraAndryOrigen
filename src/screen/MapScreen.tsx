import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, {Marker, Callout} from 'react-native-maps';
import {launchImageLibrary} from 'react-native-image-picker';
import {useIsFocused} from '@react-navigation/native';

export const MapScreen = () => {
  const focus = useIsFocused();
  const [customWaterfalls, setCustomWaterfalls] = useState<any[]>([
    {
      id: 1,
      name: 'Niagara Falls',
      description: 'One of the most famous waterfalls in the world.',
      latitude: 43.0799,
      longitude: -79.0747,
      image:
        'https://cdn.britannica.com/41/129941-050-7A7D1027/Niagara-Falls-cities-River-Ontario-New-York.jpg',
    },
    {
      id: 2,
      name: 'Angel Falls',
      description: "The world's highest uninterrupted waterfall.",
      latitude: 5.9675,
      longitude: -62.5356,
      image:
        'https://cdn.britannica.com/81/155181-050-CE1B56BF/Angel-Falls-waterfall-world-Rio-Churun-Venezuela.jpg',
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newWaterfall, setNewWaterfall] = useState({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    image: '',
  });

  useEffect(() => {
    loadWaterfalls();
  }, [focus]);

  const saveWaterfalls = async (waterfalls: any[]) => {
    try {
      await AsyncStorage.setItem(
        'customWaterfalls',
        JSON.stringify(waterfalls),
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save waterfalls');
    }
  };

  const loadWaterfalls = async () => {
    try {
      const storedData = await AsyncStorage.getItem('customWaterfalls');
      if (storedData) {
        setCustomWaterfalls(JSON.parse(storedData));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load waterfalls');
    }
  };

  const addCustomWaterfall = () => {
    const lat = parseFloat(newWaterfall.latitude);
    const lon = parseFloat(newWaterfall.longitude);

    if (
      !newWaterfall.name ||
      !newWaterfall.description ||
      !newWaterfall.image
    ) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (isNaN(lat) || isNaN(lon)) {
      Alert.alert('Error', 'Invalid coordinates.');
      return;
    }

    const updatedWaterfalls = [
      ...customWaterfalls,
      {...newWaterfall, id: Date.now(), latitude: lat, longitude: lon},
    ];
    setCustomWaterfalls(updatedWaterfalls);
    saveWaterfalls(updatedWaterfalls);

    setModalVisible(false);
    setNewWaterfall({
      name: '',
      description: '',
      latitude: '',
      longitude: '',
      image: '',
    });
  };

  const deleteWaterfall = (id: number) => {
    Alert.alert('Delete Waterfall', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        onPress: async () => {
          const updatedWaterfalls = customWaterfalls.filter(
            item => item.id !== id,
          );
          setCustomWaterfalls(updatedWaterfalls);
          await saveWaterfalls(updatedWaterfalls);
        },
      },
    ]);
  };

  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo'}, (response: any) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', 'Something went wrong with the image picker');
        return;
      }
      setNewWaterfall({...newWaterfall, image: response.assets[0].uri});
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 0,
          longitude: 0,
          latitudeDelta: 100,
          longitudeDelta: 100,
        }}
        onLongPress={event => {
          const {latitude, longitude} = event.nativeEvent.coordinate;
          setNewWaterfall({
            ...newWaterfall,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          });
          setModalVisible(true);
        }}>
        {customWaterfalls.map(waterfall => (
          <Marker
            key={waterfall.id}
            coordinate={{
              latitude: waterfall.latitude,
              longitude: waterfall.longitude,
            }}
            title={waterfall.name}>
            <Callout>
              <View style={styles.calloutContainer}>
                <Image
                  source={{uri: waterfall.image}}
                  style={styles.calloutImage}
                />
                <Text style={styles.calloutTitle}>{waterfall.name}</Text>
                <Text style={styles.calloutDescription}>
                  {waterfall.description}
                </Text>
                {/* <TouchableOpacity
                  onPress={() => deleteWaterfall(waterfall.id)}
                  style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity> */}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newWaterfall.name}
              onChangeText={text =>
                setNewWaterfall({...newWaterfall, name: text})
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newWaterfall.description}
              onChangeText={text =>
                setNewWaterfall({...newWaterfall, description: text})
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Latitude"
              keyboardType="numeric"
              value={newWaterfall.latitude}
              onChangeText={text =>
                setNewWaterfall({...newWaterfall, latitude: text})
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Longitude"
              keyboardType="numeric"
              value={newWaterfall.longitude}
              onChangeText={text =>
                setNewWaterfall({...newWaterfall, longitude: text})
              }
            />
            <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
              <Text style={styles.imageButtonText}>
                {newWaterfall.image ? '✅ Image Selected' : '📸 Select Image'}
              </Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={addCustomWaterfall}>
                <Text style={styles.confirmButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  calloutContainer: {
    width: 200,
    alignItems: 'center',
    padding: 10,
  },
  calloutImage: {
    width: 180,
    height: 120,
    borderRadius: 10,
    marginBottom: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  calloutDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2E7D32',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addButtonText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1B5E20',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#388E3C',
    marginBottom: 10,
    padding: 5,
    fontSize: 16,
    color: '#333',
  },
  imageButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginLeft: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MapScreen;
