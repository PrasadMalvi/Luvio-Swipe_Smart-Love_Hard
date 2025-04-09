// Inside ExplorePage.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

const LocationButton = () => {
  const [location, setLocation] = useState(null);
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      let reverseGeocode = await Location.reverseGeocodeAsync(loc.coords);
      if (reverseGeocode.length > 0) {
        const { name, city } = reverseGeocode[0];
        setArea(`${name}, ${city}`);
      }
    } catch (error) {
      console.error("Location error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={fetchLocation}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Ionicons name="location-sharp" size={24} color="white" />
            <Text style={styles.text}>
              {area ? area : "Fetching location..."}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LocationButton;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  button: {
    backgroundColor: "#b25776",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    elevation: 5,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
