import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {useIsFocused} from '@react-navigation/native';

export const AlbumsScreen = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const focus = useIsFocused();

  useEffect(() => {
    loadPhotos();
  }, [focus]);

  const savePhotos = async (newPhotos: string[]) => {
    try {
      await AsyncStorage.setItem('albumPhotos', JSON.stringify(newPhotos));
    } catch (error) {
      Alert.alert('Error', 'Failed to save photos');
    }
  };

  const loadPhotos = async () => {
    try {
      const storedPhotos = await AsyncStorage.getItem('albumPhotos');
      if (storedPhotos) {
        setPhotos(JSON.parse(storedPhotos));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load photos');
    }
  };

  const addPhoto = (fromCamera: boolean) => {
    const options: any = {mediaType: 'photo', quality: 1};

    const callback = (response: any) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', 'Something went wrong!');
        return;
      }

      const newPhoto = response.assets[0].uri;
      const updatedPhotos = [...photos, newPhoto];
      setPhotos(updatedPhotos);
      savePhotos(updatedPhotos);
    };

    fromCamera
      ? launchCamera(options, callback)
      : launchImageLibrary(options, callback);
  };

  const deletePhoto = (photoUri: string) => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        onPress: async () => {
          const updatedPhotos = photos.filter(photo => photo !== photoUri);
          setPhotos(updatedPhotos);
          await savePhotos(updatedPhotos);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Albums</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => addPhoto(false)}>
          <Text style={styles.buttonText}>📁 Add from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => addPhoto(true)}>
          <Text style={styles.buttonText}>📷 Take a Photo</Text>
        </TouchableOpacity>
      </View>

      {photos.length === 0 ? (
        <Text style={styles.emptyText}>No photos yet. Add some!</Text>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => deletePhoto(item)}>
              <Image source={{uri: item}} style={styles.photo} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    padding: 20,
    paddingVertical: 40,
  },
  header: {
    marginTop:10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#388E3C',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    color: '#8E8E8E',
    fontSize: 16,
  },
  photo: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
});

export default AlbumsScreen;
