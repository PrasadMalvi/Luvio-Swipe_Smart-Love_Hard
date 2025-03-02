import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Animated, PanResponder, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Location from 'expo-location'; // Import location services

const { height: screenHeight } = Dimensions.get('window');

const ProfileCard = ({ user, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const translateY = useRef(new Animated.Value(screenHeight)).current;
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > screenHeight / 4) {
                    Animated.timing(translateY, {
                        toValue: screenHeight,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(onClose);
                } else {
                    Animated.timing(translateY, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const [userLocation, setUserLocation] = useState(null);
    const [distance, setDistance] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setUserLocation(location.coords);
            if (user?.locationCoordinates) {
                calculateDistance(location.coords, user.locationCoordinates);
            } else {
                const electronicCityCoordinates = { latitude: 12.8452, longitude: 77.6602 };
                calculateDistance(location.coords, electronicCityCoordinates);
            }


        })();

        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();

    }, [user]);

    const calculateDistance = (currentLocation, targetLocation) => {
        const toRadians = (angle) => (angle * Math.PI) / 180;
        const earthRadiusKm = 6371;

        const dLat = toRadians(targetLocation.latitude - currentLocation.latitude);
        const dLon = toRadians(targetLocation.longitude - currentLocation.longitude);

        const lat1 = toRadians(currentLocation.latitude);
        const lat2 = toRadians(targetLocation.latitude);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const calculatedDistance = earthRadiusKm * c;
        setDistance(calculatedDistance.toFixed(2));
    };
    
  const getIconName = (field) => {
    switch (field) {
      case "occupation":
        return "briefcase";
      case "location":
        return "map-marker-alt";
      case "qualification":
        return "graduation-cap";
      case "height":
        return "ruler-vertical";
      case "lookingFor":
        return "search";
      case "relationshipPreference":
        return "heart";
      case "zodiacSign":
        return "star";
      case "sexualOrientation":
        return "transgender-alt";
      case "gender":
        return "user";
      case "hobbies":
        return "palette";
      case "interests":
        return "lightbulb";
      case "aboutMe":
        return "user-circle";
      case "pet":
        return "paw";
      case "drinking":
        return "wine-glass-alt";
      case "smoking":
        return "smoking";
      case "workout":
        return "dumbbell";
      case "sleepingHabits":
        return "bed";
      case "familyPlans":
        return "home";
      default:
        return "question";
    }
  };
  const fixImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400";
    if (url.startsWith("file:///")) {
        return url;
    }
    if (!url.startsWith("http")) {
        return `http://192.168.0.101:5050/${url}`;
    }
    return url;
};

const handleNextImage = () => {
    if (user?.profilePictures?.length > 1 && currentImageIndex < user.profilePictures.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
    }
};

const handlePrevImage = () => {
    if (currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
    }
};

return (
    <Animated.View style={[styles.overlay, { transform: [{ translateY }] }]}>
    <View style={styles.card} {...panResponder.panHandlers}>
        <View style={styles.dragIndicator} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.profileContainer}>
                    <View style={styles.imageContainer}>
                        <View style={styles.imageIndicatorContainer}>
                            {user?.profilePictures?.map((_, idx) => (
                                <View key={idx} style={[styles.imageIndicatorLine, idx === currentImageIndex && styles.activeImageIndicatorLine, { width: `${100 / user?.profilePictures?.length}%`, marginRight: idx < user?.profilePictures?.length - 1 ? '5px' : '0' }]} />
                            ))}
                        </View>
                        <Image source={{ uri: fixImageUrl(user?.profilePictures?.[currentImageIndex]) }} style={styles.profileImage} />
                        {user?.profilePictures?.length > 1 && (
                            <>
                                {currentImageIndex > 0 && (<TouchableOpacity style={styles.leftArrow} onPress={handlePrevImage}></TouchableOpacity>)}
                                {currentImageIndex < user.profilePictures.length - 1 && (<TouchableOpacity style={styles.rightArrow} onPress={handleNextImage}></TouchableOpacity>)}
                            </>
                        )}
                        <View style={styles.profileInfoGradient}>
                        <LinearGradient
                            colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.5)", "transparent"]}
                            start={{ x: 0.5, y: 1 }}
                            end={{ x: 0.5, y: 0 }}
                            style={styles.profileInfoGradientContent}
                        >
                            <View style={styles.userInfoContainer}>
                                <Text style={styles.userNameAge}>
                                    {user?.name}, {new Date().getFullYear() - new Date(user?.age).getFullYear()}
                                    <View style={styles.verifyIcon}>
                                        <MaterialIcons name="verified" size={30} color="#b25776" />
                                    </View>
                                </Text>
                                <View style={styles.distanceContainer}>
                                    <MaterialIcons name="near-me" size={22} color="#b25776" />
                                    <Text style={styles.userDistance}>{distance ? `${distance} km away` : 'Calculating distance...'}</Text>
                                </View>
                                <View style={styles.locationContainer}>
                                    <MaterialIcons name="location-on" size={22} color="#b25776" />
                                    <Text style={styles.userLocation}>{user?.location}</Text>
                                </View>
                                
                            </View>
                        </LinearGradient>
                    </View>
                    </View>
                    <View style={styles.sectionContainer}>
                        {["lookingFor", "relationshipPreference"].map((field, idx) => user?.[field] && (
                            <View key={idx} style={styles.section}>
                                <View style={styles.iconTitleContainer}>
                                    <Icon name={getIconName(field)} size={20} color="#c64d76" />
                                    <Text style={styles.sectionTitle}>{field.replace(/([A-Z])/g, " $1").trim().replace(/^./, (char) => char.toUpperCase())}</Text>
                                </View>
                                <View style={styles.chipContainer1}>
                                    <LinearGradient colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']} style={styles.gradientContainer} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}>
                                        <Text style={styles.chip}>{user[field]}</Text>
                                    </LinearGradient>
                                </View>
                            </View>
                        ))}
                    </View>
                    <View style={styles.sectionContainer}>
                        {user?.aboutMe && (
                            <View style={styles.section}>
                                <View style={styles.iconTitleContainer}>
                                    <Icon name={getIconName("aboutMe")} size={20} color="#c64d76" />
                                    <Text style={styles.sectionTitle}>About Me</Text>
                                </View>
                                <Text style={styles.sectionContent}>{user.aboutMe}</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Basic Info</Text>
                        <View style={styles.horizontalLine} />
                        {["occupation", "height", "sexualOrientation", "gender", "zodiacSign"].map((field, idx, array) => user?.[field] && (
                            <React.Fragment key={idx}>
                                <View style={styles.section}>
                                    <View style={styles.iconTitleContainer}>
                                        <Icon name={getIconName(field)} size={20} color="#c64d76" />
                                    </View>
                                    <View style={styles.chipContainer}>
                                        <Text style={styles.chip}>{user[field]}</Text>
                                    </View>
                                </View>
                                {idx < array.length && <View style={styles.horizontalLine} />}
                            </React.Fragment>
                        ))}
                    </View>
                    <View style={styles.sectionContainer}>
                        {user?.hobbies?.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.iconTitleContainer}>
                                    <Icon name={getIconName("hobbies")} size={20} color="#c64d76" />
                                    <Text style={styles.sectionTitle}>Hobbies</Text>
                                </View>
                                <View style={styles.horizontalLine} />
                                <View style={styles.chipContainer1}>
                                    {user.hobbies.map((hobby, i) => (
                                        <LinearGradient key={i} colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']} style={styles.gradientContainer} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}>
                                            <Text style={styles.chip}>{hobby}</Text>
                                        </LinearGradient>
                                    ))}
                                </View>
                            </View>
                        )}
                        {user?.interests?.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.iconTitleContainer}>
                                    <Icon name={getIconName("interests")} size={20} color="#c64d76" />
                                    <Text style={styles.sectionTitle}>Interests</Text>
                                </View>
                                <View style={styles.horizontalLine} />
                                <View style={styles.chipContainer1}>
                                    {user.interests.map((interest, i) => (
                                        <LinearGradient key={i} colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']} style={styles.gradientContainer} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}>
                                            <Text style={styles.chip}>{interest}</Text>
                                            </LinearGradient>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Life Style</Text>
                            <View style={styles.horizontalLine} />
                            {["pet", "drinking", "smoking", "workout", "sleepingHabits", "familyPlans"].map((field, idx, array) => user?.[field] && (
                                <React.Fragment key={idx}>
                                    <View style={styles.section}>
                                        <View style={styles.iconTitleContainer}>
                                            <Icon name={getIconName(field)} size={20} color="#c64d76" />
                                        </View>
                                        <View style={styles.chipContainer}>
                                            <Text style={styles.chip}>{user[field]}</Text>
                                        </View>
                                    </View>
                                    {idx < array.length && <View style={styles.horizontalLine} />}
                                </React.Fragment>
                            ))}
                        </View>
                    </View>
                    </ScrollView>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
        backgroundColor: "#222",
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        height: screenHeight,
    },
    card: {
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        width: "100%",
        backgroundColor: '#222',
        alignItems: 'center',
        flex: 1,
    },
    dragIndicator: {
        width: 60,
        height: 5,
        backgroundColor: 'gray',
        borderRadius: 2.5,
        marginTop: 10,
        marginBottom: 10,
    },

    closeButton: {
        position: 'absolute',
        top: 2,
        right: 25,
        zIndex:40
    },
    closeButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white'
    },
    scrollContainer: { paddingBottom: 20 },
    profileContainer: { alignItems: "center", paddingTop: 0 },
    imageContainer: {
        position: "relative",
        width: 350,
        height: 500,
        marginTop: 30,
        borderRadius: 10,
    },
    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    leftArrow: {
        position: "absolute",
        left: 10,
        padding: 10,
        height: 700,
        width: 200,
    },
    rightArrow: {
        position: "absolute",
        left: 150,
        padding: 10,
        height: 700,
        width: 200,
    },
    profileInfoGradient: {
        position: "absolute",
        bottom: 0,
        left: -5,
        right: -5,
        zIndex: 10,
    },
    profileInfoGradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    profileInfoGradientContent: {
        padding: 20,
        alignItems: "center",
    },
    userInfoContainer: {
        flex: 1,
        flexDirection: 'column', // Arranging items vertically
        justifyContent: 'flex-start', // Aligning to the top
    },
    userNameAge: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
        marginLeft: 10, // Added spacing
    },
    verifyIcon: {
        marginLeft: 10,
        marginTop: 5, // Added spacing
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5, // Added spacing
        marginLeft: 55, // Added spacing

    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 40, // Added spacing
    },
    userLocation: {
        color: "white",
        fontSize: 16,
        marginLeft: 5, // Added spacing
    },
    userDistance: {
        color: "white",
        fontSize: 16,
        marginLeft: 5, // Added spacing
    },
    section: { marginBottom: 10, backgroundColor: "none", borderRadius: 5 },
    sectionContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#000",
        borderRadius: 10,
        width: 350,
    },
    iconTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 5,
        left: 10,
        top: 8
    },
    sectionTitle: { fontSize: 20, fontWeight: "bold", color: "white", padding: 10, textAlign: "center" },
    sectionContent: { fontSize: 16, backgroundColor: "#222", color: "#b25776", padding: 20, borderRadius: 15, minHeight: 100 },
    chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 5, padding: 10, marginTop: -35, marginLeft: 30, marginBottom: -10 },
    chipContainer1: { flexDirection: "row", flexWrap: "wrap", gap: 5, padding: 10 },
    chip: { color: "white", padding: 8, borderRadius: 10 },
    gradientContainer: {
        minHeight: 40,
        minWidth: 100,
        width: 'auto',
        height: "auto",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    imageIndicatorContainer: {
        position: "absolute",
        top: 2,
        left: 2,
        right: 2,
        flexDirection: "row",
        zIndex: 40,
    },
    imageIndicatorLine: {
        height: 3,
        backgroundColor: "white",
        borderRadius: 2,
    },
    activeImageIndicatorLine: {
        backgroundColor: "#b25776",
    },
    horizontalLine: {
        height: 1,
        backgroundColor: "#333",
        width: "100%",
        marginVertical: 2,
    },
});

export default ProfileCard;