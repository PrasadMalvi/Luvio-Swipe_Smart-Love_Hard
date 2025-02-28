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
import axiosInstance from "../Redux/slices/axiosSlice";
import Icon from "react-native-vector-icons/FontAwesome5";
import Icon6 from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SwipePageSkeletonLoader from "../Components/Skeleton/SwipePageSkeletonLoader";

const { width, height } = Dimensions.get("window");

const SwipePage = () => {
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useDispatch();
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
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("authToken");
        const response = await axiosInstance.get("/Swipe/getUsers", {
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
    return <SwipePageSkeletonLoader />;
  }
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
                                          { width: `${100 / users[index]?.profilePictures?.length}%`, marginRight: idx < users[index]?.profilePictures?.length - 1 ? '5px' : '0' },
                                        ]}
                                      />
                                    ))}
                                  </View>
                                  <Image
                                    source={{ uri: fixImageUrl(users[index]?.profilePictures?.[currentImageIndex]) }}
                                    style={styles.profileImage}
                                  />
                      
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
                          {users[index]?.name} {new Date().getFullYear() - new Date(users[index]?.age).getFullYear()}
                         
                        </Text>
                        <View  style={styles.verifyIcon}>
                          <MaterialIcons name="verified" size={22} color="#b25776"/>
                          </View>
                        <Text style={styles.userOccupation}> 
                        <Icon name="briefcase" size={25} color={"#b25776"}/>{"  "}
                          {users[index]?.occupation || "Not specified"}
                        </Text>
                      </LinearGradient>
                    </View>
                  </View>
                  
                 

                  {/* User Info */}
                              <View style={styles.sectionContainer}>
                                
                              {["lookingFor", "relationshipPreference",].map(
                                (field, idx) =>
                                  users[index]?.[field] && (
                                    <View key={idx} style={styles.section}>
                                      <View style={styles.iconTitleContainer1}>
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
                                        <Text style={styles.chip}>{users[index][field]}</Text>
                                        </LinearGradient>
                                      </View>
                                    </View>
                                  )
                              )}
                              </View>
                              <View style={styles.sectionContainer}>
                                {/* About Me Section */}
                                {users[index]?.aboutMe && (
                                  <View style={styles.section}>
                                  <View style={styles.iconTitleContainer1}>
                                    <Icon name={getIconName("aboutMe")} size={20} color="#c64d76" />
                                    <Text style={styles.sectionTitle}>About Me</Text>
                                  </View>
                                <Text style={styles.sectionContent}>{users[index].aboutMe}</Text>
                                </View>
                                )}
                              </View>
                  
                              <View style={styles.sectionContainer}>
                                 <Text style={styles.sectionTitle}>Basic Info</Text>
                                 <View style={styles.horizontalLine} />
                              {/* Dynamic Fields */}
                              {["location", "height","sexualOrientation", "gender","zodiacSign"].map(
                                (field, idx, array) =>
                                  users[index]?.[field] && (
                                    <React.Fragment key={idx}>
                                      <View style={styles.section}>
                                        <View style={styles.iconTitleContainer1}>
                                          <Icon name={getIconName(field)} size={20} color="#c64d76" />
                                        </View>
                                        <View style={styles.chipContainer}>
                                          <Text style={styles.chip}>{users[index]?.[field]}</Text>
                                        </View>
                                      </View>
                                      {idx < array.length  && <View style={styles.horizontalLine} />}
                                    </React.Fragment>
                                  )
                              )}
                              </View>
                  
                              
                              
                              <View style={styles.sectionContainer}>
                             {/* Hobbies */}
                             {users[index]?.hobbies?.length > 0 && (
                                <View style={styles.section}>
                                  <View style={styles.iconTitleContainer1}>
                                        <Icon name={getIconName("hobbies")} size={20} color="#c64d76" />
                                        <Text style={styles.sectionTitle}>Hobbies</Text>
                                      </View>
                                      <View style={styles.horizontalLine} />
                                  <View style={styles.chipContainer1}>
                                    {users[index]?.hobbies.map((hobby, i) => (
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
                              {users[index]?.interests?.length > 0 && (
                                <View style={styles.section}>
                                  <View style={styles.iconTitleContainer1}>
                                        <Icon name={getIconName("interests")} size={20} color="#c64d76" />
                                        <Text style={styles.sectionTitle}>Interests</Text>
                                      </View>
                                      <View style={styles.horizontalLine} />
                                  <View style={styles.chipContainer1}>
                                    {users[index].interests.map((interest, i) => (
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
                                    users[index]?.[field] && (
                                      <React.Fragment key={idx}>
                                        <View style={styles.section}>
                                          <View style={styles.iconTitleContainer1}>
                                            <Icon name={getIconName(field)} size={20} color="#c64d76" />
                                          </View>
                                          <View style={styles.chipContainer}>
                                            <Text style={styles.chip}>{users[index]?.[field]}</Text>
                                          </View>
                                        </View>
                                        {idx < array.length  && <View style={styles.horizontalLine} />}
                                      </React.Fragment>
                                    )
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
  <TouchableOpacity onPress={() => handleSwipe("goback")} style={styles.goBackButton}>
    <FontAwesome name="rotate-left" size={19} color="yellow" />
  </TouchableOpacity>
  <TouchableOpacity onPress={() => handleSwipe("dislike")} style={styles.dislikeButton}>
    <FontAwesome name="times" size={25} color="red" />
  </TouchableOpacity>
  <TouchableOpacity onPress={() => handleSwipe("superlike")} style={styles.superLike}>
    <Icon6 name="heart-circle-bolt" size={30} color="#a594f9" />
  </TouchableOpacity>
  <TouchableOpacity onPress={() => handleSwipe("like")} style={styles.likeButton}>
    <FontAwesome name="heart" size={25} color="#b25776" />
  </TouchableOpacity>
  <TouchableOpacity onPress={() => handleSwipe("share")} style={styles.shareButton}>
    <FontAwesome name="share-alt" size={19} color="#abc4ff" />
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
  marginBottom:35

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
  height: height * 0.85,
  position: "relative",
  marginTop: 5,
},
profileImage: {
  width: "100%",
  height: "95%",
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
  paddingBottom:50
},
userNameAge: {
  color: "white",
  fontSize: 25,
  fontWeight: "bold",
},
verifyIcon:{
  marginLeft: 145,
  marginTop: -27,
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
section: { marginBottom: 10, backgroundColor: "none", borderRadius: 5 },
  sectionContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#000",
    borderRadius: 10,
    width:350,
  },
  iconTitleContainer1: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom:5,
    left:10,
    top:8
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "white", padding: 10, textAlign:"center" },
  sectionContent: { fontSize: 16, backgroundColor: "#333", color: "#b25776", padding: 20, borderRadius:15, minHeight:100},
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 5, padding: 10, marginTop:-35, marginLeft:30, marginBottom:-10 },
  chipContainer1: { flexDirection: "row", flexWrap: "wrap", gap: 5, padding: 10 },
  chip: { color: "white", padding: 8, borderRadius: 10},
sectionText: {
  color: "white",
  fontSize: 16,
  marginTop: 5,
},
noProfilesText: {
  fontSize: 22,
  color: "white",
  marginTop: 100,
  textAlign: 'center'
},
swipeButtonsContainer: {
    flexDirection: "row",
    marginTop: -110, // Adjust overlap
    marginBottom: 20,
    marginLeft:25
  },
  dislikeButton: {
    backgroundColor: "#333",
    borderRadius: 50,
    width: 55,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  likeButton: {
    backgroundColor: "#333",
    borderRadius: 50,
    width: 55,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  superLike:{
    backgroundColor: "#333",
    borderRadius: 50,
    width: 55,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  goBackButton: {
    backgroundColor: "#333",
    marginTop:5,
    borderRadius: 50,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  shareButton: {
    backgroundColor: "#333",
    marginTop:5,
    borderRadius: 50,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  gradientContainer: {
    minHeight: 40,
    minWidth: 100,
    width: "auto",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
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
  iconTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // Adds space between the icon and text
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#333",
    width: "100%",
    marginVertical: 2,    
  },
});

export default SwipePage;