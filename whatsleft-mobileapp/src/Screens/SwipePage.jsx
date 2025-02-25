import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useDispatch } from "react-redux";
import axios from "axios";
import { likeUser, dislikeUser } from "../Redux/slices/matchSlice";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const SwipePage = () => {
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.get("http://192.168.0.101:5050/Swipe/getUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error("Fetch users error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSwipe = (direction) => {
    if (users[index]) {
      direction === "like"
        ? dispatch(likeUser(users[index]))
        : dispatch(dislikeUser(users[index]));
    }
    if (index < users.length - 1) {
      setIndex(index + 1);
      setCurrentImageIndex(0);
    }
  };

  const handleNextImage = () => {
    if (users[index]?.profilePictures?.length > currentImageIndex + 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#b25776" style={styles.loadingIndicator} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <GestureHandlerRootView style={styles.gestureRootView}>
          <PanGestureHandler
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === State.END) {
                if (nativeEvent.translationX > 50) handleSwipe("like");
                else if (nativeEvent.translationX < -50) handleSwipe("dislike");
              }
            }}
          >
            <ScrollView
              style={styles.contentScrollView}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
            >
              {users.length > 0 ? (
                <>
                 
                 <View style={styles.profileImageContainer}>
                    <View style={styles.imageIndicatorContainer}>
                      {users[index]?.profilePictures?.map((_, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.imageIndicatorLine,
                            idx === currentImageIndex && styles.activeImageIndicatorLine,
                            { width: `${98 / users[index]?.profilePictures?.length}%` }, // Dynamic width
                          ]}
                        />
                      ))}
                    </View>
                    {users[index]?.profilePictures?.length > 0 ? (
                      <Image
                        source={{
                          uri: `http://192.168.0.101:5050/${users[index].profilePictures[currentImageIndex].replace(/\\/g, "/")}`,
                        }}
                        style={styles.profileImage}
                      />
                      
                    ) : (
                      <Text style={styles.noImagesText}>No Images Available</Text>
                    )}

                    {currentImageIndex > 0 && (
                      <TouchableOpacity onPress={handlePrevImage} style={styles.imageArrowLeft}>
                      </TouchableOpacity>
                    )}

                    {users[index]?.profilePictures?.length > currentImageIndex + 1 && (
                      <TouchableOpacity onPress={handleNextImage} style={styles.imageArrowRight}>
                      </TouchableOpacity>
                    )}
                    <View style={styles.profileInfoGradient}>
                      <LinearGradient
                        colors={["rgba(0,0,0,1)", "rgba(0,0,0,0.65)", "transparent"]}
                        start={{ x: 0.5, y: 1 }}
                        end={{ x: 0.5, y: 0 }}
                        style={styles.profileInfoGradientContent}
                      >
                        <Text style={styles.userNameAge}>
                          {users[index]?.name}, {new Date().getFullYear() - new Date(users[index]?.age).getFullYear()}
                        </Text>
                        <Text style={styles.userOccupation}>
                          {users[index]?.occupation || "Not specified"}
                        </Text>
                      </LinearGradient>
                    </View>
                  </View>
                  <View style={styles.profileDetailsContainer}>
                    {users[index]?.aboutMe && (
                      <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>About Me</Text>
                        <Text style={styles.sectionText}>{users[index].aboutMe}</Text>
                      </View>
                    )}

                    {users[index]?.relationshipPreference && (
                      <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Preferences</Text>
                        <View style={styles.preferenceChipsContainer}>
                          <View style={styles.preferenceChip}>
                          <LinearGradient
                            colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                            style={styles.gradientContainer}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                          >
                            <Text style={styles.preferenceChipText}>
                              {users[index].relationshipPreference}
                            </Text>
                            </LinearGradient>
                          </View>
                        </View>
                      </View>
                    )}

                    {users[index]?.qualification && (
                      <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Qualification</Text>
                        <View style={styles.preferenceChipsContainer}>
                          <View style={styles.preferenceChip}>
                          <LinearGradient
                            colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                            style={styles.gradientContainer}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                          >
                            <Text style={styles.preferenceChipText}>{users[index].qualification}</Text>
                            </ LinearGradient >
                          </View>
                        </View>
                      </View>
                    )}

                    {users[index]?.lookingFor && (
                      <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Looking For</Text>
                        <View style={styles.preferenceChipsContainer}>
                          <View style={styles.preferenceChip}>
                          <LinearGradient
                            colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                            style={styles.gradientContainer}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                          >
                            <Text style={styles.preferenceChipText}>{users[index].lookingFor}</Text>
                            </ LinearGradient >
                          </View>
                        </View>
                      </View>
                    )}

                    {users[index]?.hobbies?.length > 0 && (
                      <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Hobbies</Text>
                        <View style={styles.preferenceChipsContainer}>
                          {users[index].hobbies.map((hobby, i) => (
                            <View key={i} style={styles.preferenceChip}>
                              <LinearGradient
                            colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                            style={styles.gradientContainer}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                          >
                              <Text style={styles.preferenceChipText}>{hobby}</Text>
                              </ LinearGradient >
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {users[index]?.interests?.length > 0 && (
                      <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Interests</Text>
                        <View style={styles.preferenceChipsContainer}>
                          {users[index].interests.map((interests, i) => (
                            <View key={i} style={styles.preferenceChip}>
                              <LinearGradient
                            colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                            style={styles.gradientContainer}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                          >
                              <Text style={styles.preferenceChipText}>{interests}</Text>
                              </ LinearGradient >
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {users[index]?.location && (
                      <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Location</Text>
                        <View style={styles.preferenceChipsContainer}>
                          <View style={styles.preferenceChip}>
                          <LinearGradient
                            colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                            style={styles.gradientContainer}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                          >
                            <Text style={styles.preferenceChipText}>{users[index].location}</Text>
                            </ LinearGradient >
                          </View>
                        </View>
                      </View>
                    )}

                    {users[index]?.height && (
                      <View style={styles.sectionContainer}>
                      <Text style={styles.sectionTitle}>Height</Text>
                      <View style={styles.preferenceChipsContainer}>
                        <View style={styles.preferenceChip}>
                        <LinearGradient
                            colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                            style={styles.gradientContainer}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                          >
                          <Text style={styles.preferenceChipText}>{users[index].height}</Text>
                          </ LinearGradient >
                        </View>
                      </View>
                    </View>
                  )}

                  {users[index]?.zodiacSign && (
                    <View style={styles.sectionContainer}>
                      <Text style={styles.sectionTitle}>ZodiacSign</Text>
                      <View style={styles.preferenceChipsContainer}>
                        <View style={styles.preferenceChip}>
                        <LinearGradient
                            colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                            style={styles.gradientContainer}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                          >
                          <Text style={styles.preferenceChipText}>{users[index].zodiacSign}</Text>
                          </ LinearGradient >
                        </View>
                      </View>
                    </View>
                  )}

                  {users[index]?.sexualOrientation && (
                    <View style={styles.sectionContainer}>
                      <Text style={styles.sectionTitle}>Sexual Orientation</Text>
                      <View style={styles.preferenceChipsContainer}>
                        <View style={styles.preferenceChip}>
                        <LinearGradient
                            colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                            style={styles.gradientContainer}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                          >
                          <Text style={styles.preferenceChipText}>{users[index].sexualOrientation}</Text>
                          </ LinearGradient >
                        </View>
                      </View>
                    </View>
                  )}

                  {users[index]?.familyPlans && (
                    <View style={styles.sectionContainer}>
                      <Text style={styles.sectionTitle}>FamilyPlans</Text>
                      <View style={styles.preferenceChipsContainer}>
                        <View style={styles.preferenceChip}>
                        <LinearGradient
                            colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                            style={styles.gradientContainer}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                          >
                          <Text style={styles.preferenceChipText}>{users[index].familyPlans}</Text>
                          </ LinearGradient >
                        </View>
                      </View>
                    </View>
                  )}

                  {users[index]?.pets && (
                    <View style={styles.sectionContainer}>
                      <Text style={styles.sectionTitle}>Pets</Text>
                      <View style={styles.preferenceChipsContainer}>
                        <View style={styles.preferenceChip}>
                        <LinearGradient
                            colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                            style={styles.gradientContainer}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                          >
                          <Text style={styles.preferenceChipText}>{users[index].pets}</Text>
                          </ LinearGradient >
                        </View>
                      </View>
                    </View>
                  )}

                  {users[index]?.drinking && (
                    <View style={styles.sectionContainer}>
                      <Text style={styles.sectionTitle}>Drinking</Text>
                      <View style={styles.preferenceChipsContainer}>
                        <View style={styles.preferenceChip}>
                        <LinearGradient
                            colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                            style={styles.gradientContainer}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                          >
                          <Text style={styles.preferenceChipText}>{users[index].drinking}</Text>
                          </ LinearGradient >
                        </View>
                      </View>
                    </View>
                  )}

                  {users[index]?.smoking && (
                    <View style={styles.sectionContainer}>
                      <Text style={styles.sectionTitle}>Smoking</Text>
                      <View style={styles.preferenceChipsContainer}>
                        <View style={styles.preferenceChip}>
                        <LinearGradient
                            colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                            style={styles.gradientContainer}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                          >
                          <Text style={styles.preferenceChipText}>{users[index].smoking}</Text>
                          </ LinearGradient >
                        </View>
                      </View>
                    </View>
                  )}

                  {users[index]?.workout && (
                    <View style={styles.sectionContainer}>
                      <Text style={styles.sectionTitle}>Workout</Text>
                      <View style={styles.preferenceChipsContainer}>
                        <View style={styles.preferenceChip}>
                        <LinearGradient
                            colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                            style={styles.gradientContainer}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                          >
                          <Text style={styles.preferenceChipText}>{users[index].workout}</Text>
                          </ LinearGradient >
                        </View>
                      </View>
                    </View>
                  )}

                  {users[index]?.sleepingHabits && (
                    <View style={styles.sectionContainer}>
                      <Text style={styles.sectionTitle}>Sleeping Habits</Text>
                      <View style={styles.preferenceChipsContainer}>
                        <View style={styles.preferenceChip}>
                        <LinearGradient
                            colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                            style={styles.gradientContainer}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                          >
                          <Text style={styles.preferenceChipText}>{users[index].sleepingHabits}</Text>
                          </ LinearGradient >
                        </View>
                      </View>
                    </View>
                  )}

                  {users[index]?.gender && (
                    <View style={styles.sectionContainer}>
                      <Text style={styles.sectionTitle}>Gender</Text>
                      <View style={styles.preferenceChipsContainer}>
                        <View style={styles.preferenceChip}>
                        <LinearGradient
                            colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']}
                            style={styles.gradientContainer}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                          >
                            <Text style={styles.preferenceChipText}>{users[index].gender}</Text>
                          </ LinearGradient >
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </>
            ) : (
              <Text style={styles.noProfilesText}>No More Profiles Available</Text>
            )}
          </ScrollView>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </ScrollView>
    <View style={styles.swipeButtonsContainer}>
      <TouchableOpacity onPress={() => handleSwipe("dislike")} style={styles.dislikeButton}>
        <FontAwesome name="times" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleSwipe("like")} style={styles.likeButton}>
        <FontAwesome name="heart" size={30} color="white" />
      </TouchableOpacity>
    </View>
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: "#111",
},
loadingIndicator: {
  marginTop: 50,
},
gestureRootView: {
  flex: 1,
  backgroundColor: "#111",
},
contentScrollView: {
  flex: 1,
},
contentContainer: {
  alignItems: "center",
  paddingBottom: 80,
},
profileImageContainer: {
  width: width * 1.0,
  height: height * 0.8,
  position: "relative",
  marginTop: 5,
},
profileImage: {
  width: "100%",
  height: "100%",
  borderRadius: 10,
},
noImagesText: {
  color: "white",
  fontSize: 20,
  textAlign: 'center',
  marginTop: '50%'
},
imageArrowLeft: {
  position: "absolute",
  left: 10,
  padding: 10,
  height:700,
  width:200,
},
imageArrowRight: {
  position: "absolute",
  left: 150,
  padding: 10,
  height:700,
  width:200,
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
},
userNameAge: {
  color: "white",
  fontSize: 25,
  fontWeight: "bold",
},
userOccupation: {
  color: "white",
  fontSize: 16,
  marginTop: 5,
  paddingBottom: 40,
},
profileDetailsContainer: {
  width: width * 1.0,
  marginTop: 50,
  backgroundColor: "#222",
  padding: 20,
  borderRadius: 10,
},
sectionContainer: {
  marginTop: 10,
  padding: 10,
  backgroundColor: "#333",
  borderRadius: 10,
},
sectionTitle: {
  color: "#b25776",
  fontSize: 18,
  fontWeight: "bold",
},
sectionText: {
  color: "white",
  fontSize: 16,
  marginTop: 5,
},
preferenceChipsContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 2,
  marginTop: 5,
},
preferenceChip: {
  paddingVertical: 5,
  paddingHorizontal: 10,
  borderRadius: 2,
},
preferenceChipText: {
  color: "white",
  fontSize: 14,
},
noProfilesText: {
  fontSize: 22,
  color: "white",
  marginTop: 100,
  textAlign: 'center'
},
swipeButtonsContainer: {
  flexDirection: "row",
  marginTop: -70,
  marginLeft: 80,
  marginBottom: 50,
  position: "static",
  },
  dislikeButton: {
    top:40,
    backgroundColor: "red",
    padding: 15,
    borderRadius: 50,
    width: 60,
    paddingLeft: 18,
    marginHorizontal: 20,
  },
  likeButton: {
    top:40,
    backgroundColor: "#b25776",
    padding: 15,
    borderRadius: 50,
    marginHorizontal: 20,
  },
  imageIndicatorContainer: {
    position: "absolute",
    top: 2,
    left: 2,
    right: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  gradientContainer: {
    minHeight:40,
    minWidth:100,
    width: 'auto',
    height: "auto", // Adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:25
  },
});

export default SwipePage;