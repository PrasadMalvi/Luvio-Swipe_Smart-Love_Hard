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


const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigation = useNavigation();

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
    if (!url.startsWith("http")) {
      return `http://192.168.0.101:5050/${url}`;
    }
    return url;
  };

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#b25776" />
      </View>
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
          </View>

          {/* User Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.age}>
              {user?.age ? new Date().getFullYear() - new Date(user.age).getFullYear() : "N/A"} years old
            </Text>

            {/* About Me Section */}
            {user?.aboutMe && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About Me</Text>
                <Text style={styles.sectionContent}>{user.aboutMe}</Text>
              </View>
            )}

            {/* Dynamic Fields */}
            {["occupation", "location", "qualification", "lookingFor", "relationshipPreference", "height", "zodiacSign", "sexualOrientation", "gender"].map(
              (field, idx) =>
                user?.[field] && (
                  <View key={idx} style={styles.section}>
                    <Text style={styles.sectionTitle}>
                    {field
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                        .replace(/^./, (char) => char.toUpperCase())}
                    </Text>
                    <View style={styles.chipContainer}>
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


           {/* Hobbies */}
           {user?.hobbies?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Hobbies</Text>
                <View style={styles.chipContainer}>
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
                <Text style={styles.sectionTitle}>Interests</Text>
                <View style={styles.chipContainer}>
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
  profileContainer: { alignItems: "center", paddingTop: 20 },
  imageContainer: { position: "relative" },
  profileImage: { width: 350, height: 450, borderRadius: 10 },
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
  infoContainer: { width: "97%", backgroundColor: "#000", padding: 15, borderRadius: 10, marginTop: 8 },
  name: { fontSize: 24, fontWeight: "bold", color: "white", textAlign: "center" },
  age: { fontSize: 18, color: "#ccc", textAlign: "center", marginBottom: 10 },
  section: { marginBottom: 10, backgroundColor: "#222", borderRadius: 5 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "white", padding: 10 },
  sectionContent: { fontSize: 16, color: "#bbb", color: "#b25776", padding: 10 },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 5, padding: 10 },
  chip: { color: "white", padding: 8, borderRadius: 10 },
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
});

export default ProfileScreen;
