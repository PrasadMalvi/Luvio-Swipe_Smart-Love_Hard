// ... [imports stay the same]
import React, { useState, useEffect, useRef } from "react"; 
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { setAuthToken } from "../Redux/slices/axiosSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocation } from "../Redux/slices/locationSlice";
import ProfileCard from "../Components/Profiles/ProfileCard";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/FontAwesome5";

const ExplorePage = () => {
  const [showMap, setShowMap] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newProfiles, setNewProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [exploreArea, setExploreArea] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
const [showProfileCard, setShowProfileCard] = useState(false);

  const mapRef = useRef(null);

  const dispatch = useDispatch();
  const area = useSelector((state) => state.location.area);
  const loadingArea = useSelector((state) => state.location.loading);
  const areaError = useSelector((state) => state.location.error);

  useEffect(() => {
    const fetchLocationAndProfiles = async () => {
      setIsLoading(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
        setMarkerPosition(location.coords);

        dispatch(fetchLocation());

        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.09,
          }, 10);
        }

        const token = await AsyncStorage.getItem("authToken");
        setAuthToken(token);
        const response = await axiosInstance.get("/Swipe/getUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.success) {
          setProfiles(response.data.users || []);
          setNewProfiles(response.data.newUsers || []);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationAndProfiles();
  }, []);



  const handleSearch = () => {
    setModalVisible(true);
  };
  

  const handleViewMatches = async () => {
    if (markerPosition) {
      const [address] = await Location.reverseGeocodeAsync(markerPosition);
      const newArea = address.city || address.name || address.region;
      setExploreArea(newArea); // manually ensure it's set
    }
  
    // Slight delay to ensure state updates
    setTimeout(() => {
      setModalVisible(false);
    }, 300);
  };
  

  const fixImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400";
    if (url.startsWith("file:///")) return url;
    if (!url.startsWith("http")) return `http://192.168.156.228:5050/${url}`;
    return url;
  };
  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
  
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  };
  const calculateDistance = (loc1, loc2) => {
    if (!loc1 || !loc2) return null;
  
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(loc2.latitude - loc1.latitude);
    const dLon = toRad(loc2.longitude - loc1.longitude);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(loc1.latitude)) *
        Math.cos(toRad(loc2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  const renderProfile = ({ item }) => {
    const imageUrl = item.profilePictures?.[0];
    const profileImageUri = fixImageUrl(imageUrl);
    const profileLocation = item.location; // assuming item.location = { latitude, longitude }
    const distance = profileLocation && userLocation
      ? calculateDistance(userLocation, profileLocation)
      : null;
    
    return (
      <View style={styles.profileWrapper}>
        <TouchableOpacity
          style={styles.profile}
          onPress={() => {
            setSelectedUser(item);
            setShowProfileCard(true);
          }}
        >
          <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
          <View style={styles.profileInfoGradient}>
            <LinearGradient
                                    colors={["rgba(0,0,0,1)", "rgba(0,0,0,0.65)", "transparent"]}
                                    start={{ x: 0.5, y: 1 }}
                                    end={{ x: 0.5, y: 0 }}
                                    style={styles.profileInfoGradientContent}
                                  >
          <Text style={styles.profileName}>
            {item.name}, {calculateAge(item.age)}
          </Text>

          <Text style={styles.profileLocation}>
            {distance ? `${distance.toFixed(1)} km away` : "Distance not available"}
          </Text>
          </LinearGradient>
          </View>

          
        </TouchableOpacity>
      </View>
    );
  };
  
  

  const handleResetToUserLocation = async () => {
    if (!userLocation || !mapRef.current) return;

    mapRef.current.animateToRegion({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });

    setMarkerPosition(userLocation);
    setExploreArea(null);
  };

  return (
    <View style={styles.explorecontainer}>
      <TouchableOpacity style={styles.explorePlacesContainer} onPress={handleSearch}>
        {/* Location indicator */}
        {loadingArea ? (
  <Text style={{ color: "#aaa", textAlign: "center", marginBottom: 10 }}>
    Getting your location...
  </Text>
) : exploreArea ? (
  <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
    <Text style={{ color: "#b25776", fontSize: 16 }}>
      📍 You're exploring {exploreArea}
    </Text>
    <TouchableOpacity
  onPress={() => {
    setExploreArea(null);
    setMarkerPosition(userLocation);
  }}
  style={{ marginLeft: 10 }}
>
  <Text style={{ color: "#b25776", fontSize: 20 }}>✕</Text>
</TouchableOpacity>

  </View>
) : area ? (
  <Text style={{ color: "#b25776", textAlign: "center", fontSize: 16, marginBottom: 10 }}>
    📍 You're in {area}
  </Text>
) : areaError ? (
  <Text style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
    Failed to get location
  </Text>
) : null}

      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.locationSearchHeader}>
          <TouchableOpacity
            onPress={() => {
              setTimeout(() => setModalVisible(false), 100); // ✅ delay to ensure re-render
            }}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Search places, cities......."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.modalContainer}>
          {userLocation && (
            <>
              <MapView
                ref={mapRef}
                style={styles.modalMap}
                initialRegion={{
                  latitude: markerPosition?.latitude || userLocation.latitude,
                  longitude: markerPosition?.longitude || userLocation.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                onRegionChangeComplete={async (region) => {
                  setMarkerPosition({
                    latitude: region.latitude,
                    longitude: region.longitude,
                  });

                  try {
                    const [address] = await Location.reverseGeocodeAsync({
                      latitude: region.latitude,
                      longitude: region.longitude,
                    });
                    const newArea = address.city || address.name || address.region;
                    setExploreArea(newArea);
                  } catch (error) {
                    console.error("Failed to get new location:", error);
                  }
                }}
              />
              <View style={styles.pinContainer}>
                <Image source={require("../../assets/pin.png")} style={styles.pin} />
              </View>
              <TouchableOpacity onPress={handleResetToUserLocation} style={styles.resetButton}>
                <Text style={styles.resetButtonText}> </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity onPress={handleViewMatches} style={styles.mapButton}>
          <Text style={styles.mapButtonText}>Explore Profiles</Text>
        </TouchableOpacity>
      </Modal>

      {/* New Profiles */}
      <View style={styles.exploreNewProfiles}>
        <Text style={styles.sectionTitle}>New Profiles</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <FlatList
            data={newProfiles}
            renderItem={renderProfile}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>

      {/* Explore Profiles */}
      <View style={styles.exploreProfiles}>
        <Text style={styles.sectionTitle}>Explore Profiles By Distance</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <FlatList
            data={profiles}
            renderItem={renderProfile}
            keyExtractor={(item) => item._id}
            numColumns={2}
          />
        )}
      </View>
      <Modal visible={!!selectedUser} transparent animationType="slide">
  <ProfileCard
    user={selectedUser}
    userLocation={userLocation}
    onClose={() => setSelectedUser(null)}
  />
</Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  profileview:{
    marginTop:100
  },
  explorecontainer: {
    backgroundColor: "#000",
    padding: 10,
    flex: 1,
  },
  explorePlacesContainer: {
    backgroundColor: "#28282B",
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  explorePlacesText: {
    color: "white",
    fontSize: 16,
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
    alignItems: "center",
    paddingBottom:5
  },
  map: {
    flex: 1,
    height: 300,
    marginBottom: 20,
    backgroundColor:"#222"
  },
  
  exploreNewProfiles: {
    marginBottom: 20,
  },
  exploreProfiles: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  profileWrapper: {
  flex: 1,
  margin: 8,
  maxWidth: "48%", // for 2 columns, gives margin space
},

profile: {
  borderRadius: 15,
  overflow: "hidden",
  backgroundColor: "#222",
  aspectRatio: 0.75, // keeps consistent height
},

profileImage: {
  width: "100%",
  height: "100%",
},

profileInfo: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: 8,
  justifyContent: "flex-end",
},

profileName: {
  color: "white",
  fontWeight: "bold",
  fontSize: 18,
},

profileLocation: {
  color: "#b25776",
  fontSize: 18,
  marginTop: 0,
},

  
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    backgroundColor: "#222",
  },
  locationSearchHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    gap: 10, // Adds space between back button & input
  },
  input: {
    textAlign: "center",
    fontSize: 18,
    width: 320,
    backgroundColor: "#333",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "#fff",
    zIndex: 30,
    marginLeft:-55,
    marginRight:-10 
   },
  backButton: {
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 25,
    zIndex: 35,
    height: 45,
    paddingTop:-25
  },
  backButtonText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",

  },  
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "100%",
  },
  modalMap: {
    width: "110%",
    height:1050,
    marginBottom: 10,
  },
  mapButton:{
    alignSelf:"center",
    textAlign: "center",
    fontSize:20,
    width: 200,
    backgroundColor: "#333",
    borderRadius: 25,
    paddingHorizontal: 5,
    paddingVertical: 12,
    color: "#fff",
    marginBottom: 10, 
    zIndex:40,
    marginTop:10
  },
  mapButtonText: {
    textAlign: "center",
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  pinContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -24, // half of pin width
    marginTop: -48, // adjust based on your pin's height
    zIndex: 10,
  },
  pin: {
    width: 108,
    height: 108,
  },
  resetButton: {
    position: "absolute",
    top: 625,
    right: 10,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 20,
    zIndex: 999,
    width: 35,
    height: 35,
  },
  resetButtonText: {
    backgroundColor:"#b25776",
    color: "#fff",
    fontWeight: "bold",
    width: 25,
    height: 25,
    borderRadius: 20,
    top:-5,
    right:5
  },
  
});

export default ExplorePage;