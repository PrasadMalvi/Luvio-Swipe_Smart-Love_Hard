import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import LoadingProfilesScreen from './LoadingProfilesScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance, { setAuthToken } from '../../Redux/slices/axiosSlice'; // Adjust the path

const { width, height } = Dimensions.get('window');


const NoProfiles = () => {
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Loading more profiles...');
  const [userProfilePic, setUserProfilePic] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setAuthToken(token);
        const res = await axiosInstance.get('/Authentication/getUser', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.user && res.data.user.profilePictures && res.data.user.profilePictures.length > 0) {
          setUserProfilePic(res.data.user.profilePictures[0]);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("You've seen all the available profiles for now.");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingProfilesScreen userProfilePic={userProfilePic}/>;
  }

  return (
    <View style={styles.container}>
       <View style={styles.imageContainer}>
                <Image
                  source={{ uri: userProfilePic }}
                  style={styles.image}
                  resizeMode="cover"
                  onError={(error) => console.error('Image load error:', error)}
                />
        </View>
      <Text style={styles.title}>No More Profiles</Text>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.suggestion}>Try again later or adjust your filters.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 20,
    width: width * 1.0,
    height: width * 1.6,
  },
  imageContainer: {
    position: 'relative',
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.5,
    // overflow: 'hidden', // REMOVED THIS LINE
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.6,
  },
  title: {
    
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 20,
    textAlign: 'center',
  },
  suggestion: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default NoProfiles;