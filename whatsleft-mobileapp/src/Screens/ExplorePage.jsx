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
  Button,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { setAuthToken } from "../Redux/slices/axiosSlice";

const ExplorePage = () => {
  const [showMap, setShowMap] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [profiles, setProfiles] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [newProfiles, setNewProfiles] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchLocationAndProfiles = async () => {
      setIsLoading(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
        setMarkerPosition(location.coords);
  
        // Zoom to user location
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.09,  // Reduced delta for zoom-in effect
            longitudeDelta: 0.09,
          }, 10);
        }
  
        const token = await AsyncStorage.getItem("authToken");
        setAuthToken(token);
        const response = await axiosInstance.get("/Swipe/getUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.success) {
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

  const handleMapPress = (event) => {
    setMarkerPosition(event.nativeEvent.coordinate);
  };

  const handleSearchQueryChange = (text) => {
    setSearchQuery(text);
  };

  const handleViewMatches = () => {
    // TODO: Implement logic to view matches based on searchQuery and markerPosition
    console.log("View Matches button pressed");
    setModalVisible(false);
  };

  const fixImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400";
    if (url.startsWith("file:///")) {
      return url;
    }
    if (!url.startsWith("http")) {
      return `http://192.168.0.100:5050/${url}`;
    }
    return url;
  };

  const renderProfile = ({ item }) => {
    const imageUrl =
      item.profilePictures && item.profilePictures.length > 0
        ? item.profilePictures[0]
        : null;
    const profileImageUri = fixImageUrl(imageUrl);

    return (
      <View style={styles.profile}>
        <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
        <Text style={styles.profileName}>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.explorecontainer}>
      
      <TouchableOpacity
        style={styles.explorePlacesContainer}
        onPress={handleSearch}
      >
        <Text style={styles.explorePlacesText}>Explore More Places...</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" >
      <View style={styles.locationSearchHeader}>
  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.backButton}>
    <Text style={styles.backButtonText}>←</Text>
  </TouchableOpacity>
  <TextInput
    style={styles.input}
    placeholder="Search places, cities......."
    placeholderTextColor="#888"
    value={searchQuery}
    onChangeText={handleSearchQueryChange}
  />
</View>

        <View style={styles.modalContainer}>
          {userLocation && (
            <MapView
              ref={mapRef}
              style={styles.modalMap}
              initialRegion={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={handleMapPress}
            >
              <Marker
                draggable
                coordinate={markerPosition}
                onDragEnd={(event) =>
                  setMarkerPosition(event.nativeEvent.coordinate)
                }
              />
            </MapView>
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
    </View>
  );
};

const styles = StyleSheet.create({
  explorecontainer: {
    backgroundColor: "#000",
    padding: 10,
    flex: 1,
  },
  explorePlacesContainer: {
    backgroundColor: "#28282B",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  explorePlacesText: {
    color: "white",
    fontSize: 16,
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
  profile: {
    backgroundColor: "#28282B",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginRight: 5,
    width: "48%",
  },
  profileImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 5,
  },
  profileName: {
    color: "white",
    fontSize: 16,
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
    paddingTop:-20
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
  
});

export default ExplorePage;