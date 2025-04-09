import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  likeUser,
  dislikeUser,
  superLikeUser,
} from "../Redux/slices/matchSlice";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import axiosInstance, { setAuthToken } from "../Redux/slices/axiosSlice";
import Icon from "react-native-vector-icons/FontAwesome5";
import Icon6 from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SwipePageSkeletonLoader from "../Components/Skeleton/SwipePageSkeletonLoader";
import NoProfiles from "../Components/Swipe/NoProfileCard";
import LoadingProfilesScreen from "../Components/Swipe/LoadingProfilesScreen";
import io from "socket.io-client";
import MatchedCard from "../Components/Swipe/MatchedCard";
import * as Location from "expo-location";
const { width, height } = Dimensions.get("window");

const SwipePage = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [noProfilesLoading, setNoProfilesLoading] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [previousIndexes, setPreviousIndexes] = useState([]);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state) => state.auth.user?._id);
  const [matchedUser, setMatchedUser] = useState(null);
  const [showProfileDetails, setShowProfileDetails] = useState(null);
  const [distance, setDistance] = useState(null);
  const loggedInCoords = useSelector((state) => state.location.coords);
  const [resolvedLocations, setResolvedLocations] = useState({});

  const baseUrl = "http://192.168.156.228:5050/";
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
  let fetchUsers;
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("authToken");
        setAuthToken(token);
  
        const [usersRes, swipeDataRes] = await Promise.all([
          axiosInstance.get("/Swipe/getUsers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosInstance.get("/Swipe/getSwipeData", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
  
        if (usersRes.data.success && swipeDataRes.data.success) {
          const liked = swipeDataRes.data.swipeData.likedUsers;
          const disliked = swipeDataRes.data.swipeData.dislikedUsers;
          const superLiked = swipeDataRes.data.swipeData.superLikedUsers;
  
          const filteredUsers = usersRes.data.users.filter((user) => {
            return (
              !liked.includes(user._id) &&
              !disliked.includes(user._id) &&
              !superLiked.includes(user._id)
            );
          });
          
          const usersWithDistance = filteredUsers.map((user) => {
            const userLat = user?.location?.latitude;
            const userLon = user?.location?.longitude;
          
            // 🔍 Debug: Log user location and coords
            console.log(`User ${user._id} location =>`, user.location);
            console.log(`User ${user._id} lat/lon =>`, userLat, userLon);
          
            if (
              typeof loggedInCoords.lat === 'number' &&
              typeof loggedInCoords.lon === 'number' &&
              typeof userLat === 'number' &&
              typeof userLon === 'number'
            ) {
              const distance = calculateDistance(
                { latitude: loggedInCoords.lat, longitude: loggedInCoords.lon },
                { latitude: userLat, longitude: userLon }
              );
              return { ...user, distance };
            } else {
              console.warn(
                `Skipping distance for user ${user._id} due to invalid coordinates:`,
                user.location
              );
              return { ...user, distance: null };
            }
          });
          
  
          setUsers(usersWithDistance);
  
          // 🔁 Reverse geocode only for users with coordinates
          const locationPromises = usersWithDistance.map(async (user) => {
            const coords = user?.location;
            if (
              coords &&
              typeof coords === "object" &&
              typeof coords.latitude === "number" &&
              typeof coords.longitude === "number"
            ) {
              const area = await reverseGeocodeUserLocation(user._id, coords);
              return { userId: user._id, area };
            } else {
              console.warn(
                `Skipping reverse geocode for user ${user._id} due to invalid coordinates:`,
                coords
              );
              return { userId: user._id, area: typeof coords === "string" ? coords : "Unknown" };
            }
          });
  
          const resolved = await Promise.all(locationPromises);
          const locationMap = {};
          resolved.forEach(({ userId, area }) => {
            locationMap[userId] = area;
          });
  
          setResolvedLocations(locationMap);
        }
      } catch (error) {
        console.error("Fetch users error:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
    fetchUserProfilePic();
  }, []);
  


  const reverseGeocodeUserLocation = async (userId, coords) => {
    try {
      const geocodes = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
  
      if (geocodes.length > 0) {
        const { street, district, name, city, region, subregion } = geocodes[0];
        const locality = street || district || name || subregion || "Area";
        const cityName = city || region || "City";
        return `${locality}, ${cityName}`;
      }
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
    }
  
    return "Unknown Location";
  };
  
  const fetchUserProfilePic = async () => {
    try {
        const token = await AsyncStorage.getItem("authToken");
        setAuthToken(token);
        const res = await axiosInstance.get("/Authentication/getUser", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (
            res.data.success &&
            res.data.user &&
            res.data.user.profilePictures &&
            res.data.user.profilePictures.length > 0
        ) {
            let profilePicUrl = res.data.user.profilePictures[0];
            setUserProfilePic(profilePicUrl); // Set without adding baseUrl here
        }
    } catch (error) {
        console.error("Error fetching user profile pic:", error);
    }
};

  useEffect(() => {
    if (users.length > 0 && index === users.length - 1 && !noProfilesLoading) {
      setNoProfilesLoading(true);
      setTimeout(() => {
        setNoProfilesLoading(false);
        setIndex(index + 1);
      }, 3000);
    }
  }, [index, users.length, noProfilesLoading]);

  const fetchMatchedUserDetails = async (matchedUserId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axiosInstance.get(
        `/Authentication/getUserById/${matchedUserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data.user) {
        const matchedUser = response.data.user;
        Alert.alert("Congrats You matched....!");
      } else {
        console.log("Error fetching matched user details from user details API");
      }
    } catch (error) {
      console.error(
        "Error fetching matched user details from user details API:",
        error
      );
    }
  };
  useEffect(() => {
    if (loggedInUserId) {
      const newSocket = io(axiosInstance);
      setSocket(newSocket);

      newSocket.on("match", (match) => {
        if (match.user1 === loggedInUserId || match.user2 === loggedInUserId) {
          Alert.alert(
            "It's a Match!",
            `You matched with ${
              match.user1 === loggedInUserId ? match.user2 : match.user1
            }`
          );
        }
      });

      return () => {
        newSocket.off("match");
        newSocket.disconnect();
      };
    }
  }, [loggedInUserId]);

  const handleSwipe = async (direction) => {
    if (users[index]) {
      const targetUserId = users[index]._id;
      try {
        const token = await AsyncStorage.getItem("authToken");
        let response;

        switch (direction) {
          case "like":
            response = await axiosInstance.post(
              "/Swipe/like",
              { likedUserId: targetUserId },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
              console.log("Swipe action success:", direction, response.data); 
              dispatch(likeUser(users[index]));
              console.log("Match endpoint URL:", `${axiosInstance.defaults.baseURL}/Swipe/match`);
              const responseMatch = await axiosInstance.post(
                "/Swipe/match",
                { matchedUserId: targetUserId },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (
                responseMatch.data.success &&
                responseMatch.data.message === "It's a match!"
              ) {
                const matchedUserData = users.find(
                  (user) => user._id === targetUserId
                );
                setMatchedUser(matchedUserData);
              }
            }
            break;
          case "superlike":
            response = await axiosInstance.post(
              "/Swipe/superlike",
              { superLikedUserId: targetUserId },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
              console.log("Swipe action success:", direction, response.data); 
              dispatch(superLikeUser(users[index]));
              const responseMatch = await axiosInstance.post(
                "/Swipe/match",
                { matchedUserId: targetUserId },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (
                responseMatch.data.success &&
                responseMatch.data.message === "It's a match!"
              ) {
                const matchedUserData = users.find(
                  (user) => user._id === targetUserId
                );
                setMatchedUser(matchedUserData);
              }
            }
            break;
            case "dislike":
              try {
                  response = await axiosInstance.post(
                      "/Swipe/dislike",
                      { dislikedUserId: targetUserId },
                      { headers: { Authorization: `Bearer ${token}` } }
                  );
                  if (response.data.success) {
                      dispatch(dislikeUser(users[index]));
                  }
              } catch (error) {
                  console.error("Dislike action error:", error); // Log the error here
              }
              break;
          case "block":
            response = await axiosInstance.post(
              "/Swipe/block",
              { blockedUserId: targetUserId },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
              Alert.alert("User Blocked");
              fetchUsers();
            }
            break;
          case "report":
            Alert.prompt(
              "Report User",
              "Enter report reason:",
              async (reason) => {
                if (reason) {
                  const reportResponse = await axiosInstance.post(
                    "/Swipe/report",
                    { reportedUserId: targetUserId, reason: reason },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  if (reportResponse.data.success) {
                    Alert.alert("User Reported");
                  }
                }
              },
              "plain-text"
            );
            break;
          default:
            break;
        }
        if (direction !== "report" && direction !== "block") {
          if (index < users.length - 1) {
            setPreviousIndexes((prev) => [...prev, index]);
            setIndex(index + 1);
            setCurrentImageIndex(0);
          }
        }
      } catch (error) {
        console.error("Swipe action error:", error);
        Alert.alert("Error", "An error occurred during the action.");
      }
    }
  };
  const closeMatchCard = () => {
    setMatchedUser(null);
  };
  const startConversation = () => {
    console.log("Start conversation");
    closeMatchCard();
  };

  const handleProfilePress = (profileType) => {
    if (profileType === "myProfile") {
      setShowProfileDetails("myProfile");
    } else if (profileType === "matchedProfile") {
      setShowProfileDetails("matchedProfile");
    }
  };
  const handleGoBack = () => {
    if (previousIndexes.length > 0) {
      const prevIndex = previousIndexes[previousIndexes.length - 1];
      setIndex(prevIndex);
      setPreviousIndexes((prev) => prev.slice(0, prev.length - 1));
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
    if (!url) return "https://via.placeholder.com/400";
    if (url.startsWith("file:///")) {
      return url;
    }
    if (!url.startsWith("http")) {
      return `http://192.168.156.228:5050/${url}`;
    }
    return url;
  };
  

  function calculateDistance(coord1, coord2) {
    const toRad = (value) => (value * Math.PI) / 180;
  
    const R = 6371; // km
    const dLat = toRad(coord2.latitude - coord1.latitude);
    const dLon = toRad(coord2.longitude - coord1.longitude);
  
    const lat1 = toRad(coord1.latitude);
    const lat2 = toRad(coord2.latitude);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) *
        Math.sin(dLon / 2) *
        Math.cos(lat1) *
        Math.cos(lat2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
  
    return distance.toFixed(1); // e.g. 5.4 km
  }
  
  
  return (
    <View style={styles.container}>
      {matchedUser && (
      <MatchedCard
        myProfilePic={userProfilePic}
        matchedUserProfilePic={matchedUser.profilePictures[0]}
        onProfilePress={handleProfilePress}
        onClose={closeMatchCard}
        onConversationStart={startConversation}
        matchedUser={matchedUser}
      />
    )}
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
              {noProfilesLoading ? (  
                <LoadingProfilesScreen userProfilePic={userProfilePic} message="Loading more profiles..." />
              ) : users.length > 0 && users[index] ? (
                <>
                 
                 <View style={styles.profileImageContainer}>
                    <View style={styles.imageIndicatorContainer}>
                      {users[index]?.profilePictures?.map((_, idx) => (
                                      
                                      <View
                                        key={idx}
                                        style={[
                                          styles.imageIndicatorLine,
                                          idx === currentImageIndex && styles.activeImageIndicatorLine,
                                          { width: `${95 / users[index]?.profilePictures?.length}%`, marginRight: idx < users[index]?.profilePictures?.length - 1 ? '5px' : '0' },
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
                          {users[index]?.name}{" , "}{new Date().getFullYear() - new Date(users[index]?.age).getFullYear()}
                          <View  style={styles.verifyIcon}>
                          <MaterialIcons name="verified" size={22} color="#b25776"/>
                          </View>
                        </Text>
                        <View style={styles.distanceContainer}>
  <MaterialIcons name="near-me" size={22} color="#b25776" />
  <Text style={styles.userDistance}>
    {users[index]?.distance != null
      ? `${users[index].distance} km away`
      : "Calculating distance..."}
  </Text>
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
                                    {["height", "sexualOrientation", "gender", "zodiacSign"].map(
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
        {idx < array.length && <View style={styles.horizontalLine} />}
      </React.Fragment>
    )
)}
{/* Location (at the top or bottom) */}
{resolvedLocations[users[index]?._id] && (
  <>
    <View style={styles.section}>
      <View style={styles.iconTitleContainer1}>
        <Icon name="map-marker-alt" size={20} color="#c64d76" />
      </View>
      <View style={styles.chipContainer}>
        <Text style={styles.chip}>{resolvedLocations[users[index]?._id]}</Text>
      </View>
    </View>
    <View style={styles.horizontalLine} />
  </>
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
                              <View style={styles.cautionImp}>
                              <TouchableOpacity
                                  onPress={() => handleSwipe("block")}
                                  style={styles.cautionButton}
                                >
                                  <Text style={styles.cautionText}>Block {users[index]?.name}</Text>
                                </TouchableOpacity>
                              <TouchableOpacity
                                  onPress={() => handleSwipe("report")}
                                  style={styles.cautionButton}
                                >
                                  <Text style={styles.cautionText}>Report {users[index]?.name}</Text>
                                </TouchableOpacity>
                                
                              </View>
               
              </>
            ) : (
              <NoProfiles />
            )}
          </ScrollView>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </ScrollView>
    <View style={styles.swipeButtonsContainer}>
    <TouchableOpacity
          onPress={() => handleGoBack()}
          style={styles.goBackButton}
        >
          <FontAwesome name="rotate-left" size={19} color="yellow" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSwipe("dislike")}
          style={styles.dislikeButton}
        >
          <FontAwesome name="times" size={25} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSwipe("superlike")}
          style={styles.superLike}
        >
          <Icon6 name="heart-circle-bolt" size={30} color="#a594f9" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSwipe("like")}
          style={styles.likeButton}
        >
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
profileDetailsContainer:{
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
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
  height: height * 0.88,
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
  fontSize: 30,
  fontWeight: "bold",
  alignSelf:"center"

},
verifyIcon:{
  marginLeft: 140,
  marginTop: 13,
},
distanceContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf:"center"
},
userLocation: {
  color: "white",
  fontSize: 22,
  alignSelf:"center"

},
userDistance: {
  color: "white",
  fontSize: 22,
  alignSelf:"center"

},
scrollDown:{
  marginLeft: 270,
  marginTop: -100,
  zIndex:50,
  textAlign:"center",
  justifyContent:"center",
  alignItems:"center"
},
userOccupation: {
  color: "white",
  fontSize: 18,
  marginTop: 5,
  paddingBottom: 50,
  alignSelf:"center"

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
  sectionContent: { fontSize: 16, backgroundColor: "#222", color: "#b25776", padding: 20, borderRadius:15, minHeight:100},
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
  cautionImp:{
    marginTop: 10,
    padding: 30,
    paddingLeft: 50,
    backgroundColor: "#000",
    borderRadius: 10,
    width:350,
  },
  cautionButton:{
    marginTop: 10,
    padding: 10,
    backgroundColor: "#222",
    borderRadius: 20,
    width:250,
    height:50,
  },
  cautionText:{
    fontSize:20,
    textAlign:"center",
    color:"red"
  }
});

export default SwipePage;