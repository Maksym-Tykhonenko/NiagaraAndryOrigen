import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import {useIsFocused} from '@react-navigation/native';

export const ProfileScreen = () => {
  const focus = useIsFocused();
  const [name, setName] = useState<any>('');
  const [lastName, setLastName] = useState<any>('');
  const [avatar, setAvatar] = useState<string | any>(null);

  useEffect(() => {
    loadProfile();
  }, [focus]);

  const loadProfile = async () => {
    try {
      const storedName = await AsyncStorage.getItem('profileName');
      const storedLastName = await AsyncStorage.getItem('profileLastName');
      const storedAvatar = await AsyncStorage.getItem('profileAvatar');
      if (storedName) setName(storedName);
      if (storedLastName) setLastName(storedLastName);
      if (storedAvatar) setAvatar(storedAvatar);
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile data');
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('profileName', name);
      await AsyncStorage.setItem('profileLastName', lastName);
      if (avatar) await AsyncStorage.setItem('profileAvatar', avatar);
      Alert.alert('Success', 'Profile updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const selectAvatar = () => {
    const options: any = {mediaType: 'photo', quality: 1};

    launchImageLibrary(options, (response: any) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', 'Something went wrong!');
        return;
      }

      const newAvatar = response?.assets[0].uri;
      setAvatar(newAvatar);
    });
  };

  const logout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.clear();
          setName('');
          setAvatar(null);
          setLastName('');
          Alert.alert('Logged out', 'Your data has been cleared.');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <TouchableOpacity onPress={selectAvatar}>
        <Image source={avatar ? {uri: avatar} : {}} style={styles.avatar} />
        <Text style={styles.changeAvatarText}>Change Avatar</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />
      <Text style={styles.label}>Last Name:</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Enter your last name"
      />

      <TouchableOpacity style={styles.button} onPress={saveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    padding: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  header: {
    marginTop:10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#2E7D32',
    marginBottom: 10,
  },
  changeAvatarText: {
    color: '#388E3C',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#1B5E20',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#388E3C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ProfileScreen;
