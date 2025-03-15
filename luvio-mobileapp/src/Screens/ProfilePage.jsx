import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import axiosInstance from "../Redux/slices/axiosSlice";
import ProfilePageSkeletonLoader from "../Components/Skeleton/ProfilePageSkeletonLoader";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from 'react-native-vector-icons/Octicons';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVerified, setIsVerified] = useState(false); // Add verification state
  const [verificationLoading, setVerificationLoading] = useState(false);
  const navigation = useNavigation();
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
        return "question"; // Default icon
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const res = await axiosInstance.get("/Authentication/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.user) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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

  const fixImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400"; // Default placeholder image
    if (url.startsWith("file:///")) {
      return url; // Return local file URI as is
    }
    if (!url.startsWith("http")) {
      return `http://192.168.0.101:5050/${url}`; // Prefix server-relative URI
    }
    return url; // Return absolute HTTP URL as is
  };

  const verifyFace = async () => {
    setVerificationLoading(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to make this work!');
            return;
        }
      let result = await ImagePicker.launchCameraAsync({
        base64: true,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        cameraType: ImagePicker.CameraType.front
      });
  
      if (!result.canceled) {
          const response = await axiosInstance.post('/faceRecognition/verify', {
              userId: user._id,
              selfie: result.assets[0].base64,
          });

          if (response.data.verified) {
              setIsVerified(true);
              // Optionally update the user object or database to reflect verification
              // Example: await axiosInstance.put('/users/verify', { userId: user._id });
          } else {
              alert('Verification failed. Please try again.');
          }
      }
    } catch (error) {
        console.error('Verification error:', error);
        alert('An error occurred during verification.');
    } finally {
        setVerificationLoading(false);
    }
  };

  if (loading)
    return (
      <ProfilePageSkeletonLoader />
    );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          {/* Image Section */}
          <View style={styles.imageContainer}>
          <View style={styles.imageIndicatorContainer}>
            
              {user?.profilePictures?.map((_, idx) => (
                
                <View
                  key={idx}
                  style={[
                    styles.imageIndicatorLine,
                    idx === currentImageIndex && styles.activeImageIndicatorLine,
                    { width: `${100 / user?.profilePictures?.length}%`, marginRight: idx < user?.profilePictures?.length - 1 ? '5px' : '0' },
                  ]}
                />
              ))}
            </View>
            <Image
              source={{ uri: fixImageUrl(user?.profilePictures?.[currentImageIndex]) }}
              style={styles.profileImage}
            />

            {/* Navigation Buttons */}
            {user?.profilePictures?.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <TouchableOpacity style={styles.leftArrow} onPress={handlePrevImage}>

                  </TouchableOpacity>
                )}
                {currentImageIndex < user.profilePictures.length - 1 && (
                  <TouchableOpacity style={styles.rightArrow} onPress={handleNextImage}>

                  </TouchableOpacity>
                )}
              </>
            )}
              <View style={styles.profileInfoGradient}>
                <LinearGradient
                  colors={["rgba(0,0,0,1)", "rgba(0,0,0,0.65)", "transparent"]}
                  start={{ x: 0.5, y: 1 }}
                  end={{ x: 0.5, y: 0 }}
                  style={styles.profileInfoGradientContent}
                >
                  <Text style={styles.userNameAge}>
                    {user?.name}, {new Date().getFullYear() - new Date(user?.age).getFullYear()}
                    <View style={styles.verifyIcon}>
                      {isVerified ? (
                        <MaterialIcons name="verified" size={22} color="#b25776" />
                      ) : (
                        <TouchableOpacity
                          style={styles.verifyButton}
                          onPress={verifyFace}
                          disabled={verificationLoading}
                        >
                          {verificationLoading ? (
                            <ActivityIndicator color="white" />
                          ) : (
                            <Octicons style={styles.unverifiedButton} name="unverified" size={20} color="red" />
                          )}
                        </TouchableOpacity>
                      )}
                    </View>                                         
                  </Text>
                </LinearGradient>
              </View>
            </View>

            {/* User Info */}
            <View style={styles.sectionContainer}>
              
            {["lookingFor", "relationshipPreference",].map(
              (field, idx) =>
                user?.[field] && (
                  <View key={idx} style={styles.section}>
                    <View style={styles.iconTitleContainer}>
                      <Icon name={getIconName(field)} size={20} color="#c64d76" />
                      <Text style={styles.sectionTitle}>
                        {field.replace(/([A-Z])/g, " $1").trim().replace(/^./, (char) => char.toUpperCase())}
                      </Text>
                    </View>
                    <View style={styles.chipContainer1}>
                      <LinearGradient
                        colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                        style={styles.gradientContainer}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                      >
                      <Text style={styles.chip}>{user[field]}</Text>
                      </LinearGradient>
                    </View>
                  </View>
                )
            )}
            </View>
            <View style={styles.sectionContainer}>
              {/* About Me Section */}
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
            {/* Dynamic Fields */}
            {["occupation", "location", "height","sexualOrientation", "gender","zodiacSign"].map(
              (field, idx, array) =>
                user?.[field] && (
                  <React.Fragment key={idx}>
                    <View style={styles.section}>
                      <View style={styles.iconTitleContainer}>
                        <Icon name={getIconName(field)} size={20} color="#c64d76" />
                      </View>
                      <View style={styles.chipContainer}>
                        <Text style={styles.chip}>{user[field]}</Text>
                      </View>
                    </View>
                    {idx < array.length  && <View style={styles.horizontalLine} />}
                  </React.Fragment>
                )
            )}
            </View>

            <View style={styles.sectionContainer}>
           {/* Hobbies */}
           {user?.hobbies?.length > 0 && (
              <View style={styles.section}>
                <View style={styles.iconTitleContainer}>
                      <Icon name={getIconName("hobbies")} size={20} color="#c64d76" />
                      <Text style={styles.sectionTitle}>Hobbies</Text>
                    </View>
                    <View style={styles.horizontalLine} />
                <View style={styles.chipContainer1}>
                  {user.hobbies.map((hobby, i) => (
                    <LinearGradient
                      key={i}
                      colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                      style={styles.gradientContainer}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                    >
                      <Text style={styles.chip}>{hobby}</Text>
                    </LinearGradient>
                  ))}
                </View>
              </View>
            )}

            {/* Interests */}
            {user?.interests?.length > 0 && (
              <View style={styles.section}>
                <View style={styles.iconTitleContainer}>
                      <Icon name={getIconName("interests")} size={20} color="#c64d76" />
                      <Text style={styles.sectionTitle}>Interests</Text>
                    </View>
                    <View style={styles.horizontalLine} />
                <View style={styles.chipContainer1}>
                  {user.interests.map((interest, i) => (
                    <LinearGradient
                      key={i}
                      colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                      style={styles.gradientContainer}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                    >
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
              {["pet", "drinking", "smoking", "workout", "sleepingHabits", "familyPlans"].map(
                (field, idx, array) =>
                  user?.[field] && (
                    <React.Fragment key={idx}>
                      <View style={styles.section}>
                        <View style={styles.iconTitleContainer}>
                          <Icon name={getIconName(field)} size={20} color="#c64d76" />
                        </View>
                        <View style={styles.chipContainer}>
                          <Text style={styles.chip}>{user[field]}</Text>
                        </View>
                      </View>
                      {idx < array.length  && <View style={styles.horizontalLine} />}
                    </React.Fragment>
                  )
              )}
            </View>
        </View>
      </ScrollView>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditProfile")}>
        <Icon name="edit" size={20} color="white" />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  scrollContainer: { paddingBottom: 80 },
  profileContainer: { alignItems: "center", paddingTop: 0, },
  imageContainer: { 
    position: "relative",
    width:359,
    height:650,
    marginTop: 5,

   },
  profileImage: {
    width: "100%",
    height: "95%",
    borderRadius: 10,
  },
  leftArrow: { position: "absolute",
    left: 10,
    padding: 10,
    height:700,
    width:200,},
  rightArrow: {   position: "absolute",
    left: 150,
    padding: 10,
    height:700,
    width:200,},
  infoContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 10,
    width:350,
    marginLeft:-10
  },
  profileInfoGradient: {
    position: "absolute",
    bottom: 0,
    left: -5,
    right: -5,
    zIndex: 10,
  },
  profileInfoGradientContent: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "flex-start",
    paddingBottom:80
  },
  userNameAge: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
  verifyIcon:{
    marginLeft: 0,
    marginTop: 13,
  },
  unverifiedButton: {
      marginLeft: 0,
      marginTop: -2,
    },
    verifyButton: {
      padding: 0,
      backgroundColor: 'transparent',
    },
  name: { fontSize: 24, fontWeight: "bold", color: "white", textAlign: "center" },
  age: { fontSize: 18, color: "#ccc", textAlign: "center", marginBottom: 10 },
  section: { marginBottom: 10, backgroundColor: "none", borderRadius: 5 },
  sectionContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#000",
    borderRadius: 10,
    width:350,
  },
  iconTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom:5,
    left:10,
    top:8
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "white", padding: 10, textAlign:"center" },
  sectionContent: { fontSize: 16, backgroundColor: "#222", color: "#b25776", padding: 20, borderRadius:15, minHeight:100},
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 5, padding: 10, marginTop:-35, marginLeft:30, marginBottom:-10 },
  chipContainer1: { flexDirection: "row", flexWrap: "wrap", gap: 5, padding: 10 },
  chip: { color: "white", padding: 8, borderRadius: 10},
  editButton: { position: "absolute", bottom: 20, backgroundColor: "#b25776", flexDirection: "row", alignItems: "center", padding: 15, borderRadius: 30, alignSelf: "center" },
  editButtonText: { color: "white", marginLeft: 10, fontSize: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
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

export default ProfileScreen;
