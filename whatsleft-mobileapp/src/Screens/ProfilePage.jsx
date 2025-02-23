import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "react-native-vector-icons";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const res = await axios.get("http://192.168.0.101:5050/Authentication/getUser", {
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

  if (loading) return <ActivityIndicator size="large" color="#b25776" />;

  return (
    <View style={{ flex: 1, backgroundColor: "#000", alignItems: "center", padding: 20 }}>
      <Image
        source={{ uri: user?.profilePictures?.[currentImageIndex] || "https://via.placeholder.com/150" }}
        style={{ width: 300, height: 400, borderRadius: 10 }}
      />
      <Text style={{ color: "white", fontSize: 24, marginTop: 10 }}>{user?.name}</Text>
      <Text style={{ color: "gray", fontSize: 18 }}>{user?.age} years old</Text>

      {/* Navigation Buttons */}
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        {currentImageIndex > 0 && (
          <TouchableOpacity onPress={() => setCurrentImageIndex(currentImageIndex - 1)}>
            <FontAwesome name="arrow-left" size={30} color="white" />
          </TouchableOpacity>
        )}
        {currentImageIndex < (user?.profilePictures?.length || 1) - 1 && (
          <TouchableOpacity onPress={() => setCurrentImageIndex(currentImageIndex + 1)}>
            <FontAwesome name="arrow-right" size={30} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Profile;
