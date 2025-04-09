import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const LoadingProfilesScreen = ({ userProfilePic, message }) => {
  const waveAnimation1 = useRef(new Animated.Value(0)).current;
  const waveAnimation2 = useRef(new Animated.Value(0)).current;
  const waveAnimation3 = useRef(new Animated.Value(0)).current;
  const waveAnimation4 = useRef(new Animated.Value(0)).current;
  const waveAnimation5 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimations = () => {
      const createWaveAnimation = (animation) =>
        Animated.loop(
          Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        );

      Animated.parallel([
        createWaveAnimation(waveAnimation1),
        Animated.sequence([
          Animated.delay(500),
          createWaveAnimation(waveAnimation2),
        ]),
        Animated.sequence([
          Animated.delay(1000),
          createWaveAnimation(waveAnimation3),
        ]),
        Animated.sequence([
          Animated.delay(1500),
          createWaveAnimation(waveAnimation4),
        ]),
        Animated.sequence([
          Animated.delay(2000),
          createWaveAnimation(waveAnimation5),
        ]),
      ]).start();
    };

    startAnimations();
  }, [waveAnimation1, waveAnimation2, waveAnimation3, waveAnimation4, waveAnimation5]);

  const createWaveStyle = (animation) => ({
    position: 'absolute',
    top: -1,
    left: -1,
    width: width * 0.4 + 2,
    height: width * 0.4 + 2,
    borderRadius: width * 0.2 + 1,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2.5],
        }),
      },
    ],
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 0],
    }),
  });

  return (
    <View style={styles.container}>
      {userProfilePic && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: userProfilePic }}
            style={styles.image}
            resizeMode="cover"
            onError={(error) => console.error('Image load error:', error)}
          />
          <Animated.View style={createWaveStyle(waveAnimation1)} />
          <Animated.View style={createWaveStyle(waveAnimation2)} />
          <Animated.View style={createWaveStyle(waveAnimation3)} />
          <Animated.View style={createWaveStyle(waveAnimation4)} />
          <Animated.View style={createWaveStyle(waveAnimation5)} />
        </View>
      )}
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
    height: width * 1.8,
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
  message: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
  },
});

export default LoadingProfilesScreen;