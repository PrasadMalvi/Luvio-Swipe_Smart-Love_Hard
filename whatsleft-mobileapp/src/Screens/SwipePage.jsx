import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import axios from "axios";
import { likeUser, dislikeUser } from "../Redux/slices/matchSlice";
import { GestureHandlerRootView, PanGestureHandler, State } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        } else {
          console.error("Error fetching users:", response.data.message);
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
      direction === "like" ? dispatch(likeUser(users[index])) : dispatch(dislikeUser(users[index]));
    }
    if (index < users.length - 1) {
      setIndex(index + 1);
      setCurrentImageIndex(0);
    } else {
      alert("No more profiles to swipe!");
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

  if (loading) return <ActivityIndicator size="large" color="#b25776" style={{ marginTop: 50 }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#111" }}>
      <PanGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.END) {
            if (nativeEvent.translationX > 50) handleSwipe("like");
            else if (nativeEvent.translationX < -50) handleSwipe("dislike");
          }
        }}
      >
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          {users[index]?.profilePictures?.length > 0 ? (
            <Image
              source={{ uri: `http://localhost:5050/${users[index].profilePictures[currentImageIndex].replace(/\\/g, "/")}` }}
              style={{ width: 300, height: 400, borderRadius: 10 }}
            />
          ) : (
            <Text style={{ color: "white", fontSize: 20 }}>No Images Available</Text>
          )}

          {/* Image Navigation Buttons */}
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity onPress={handlePrevImage} disabled={currentImageIndex === 0}>
              <FontAwesome name="arrow-left" size={24} color="white" style={{ marginHorizontal: 20 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNextImage} disabled={currentImageIndex >= users[index]?.profilePictures?.length - 1}>
              <FontAwesome name="arrow-right" size={24} color="white" style={{ marginHorizontal: 20 }} />
            </TouchableOpacity>
          </View>

          {/* Profile Details */}
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Text style={{ color: "#b25776", fontSize: 24, fontWeight: "bold" }}>{users[index]?.name}, {new Date().getFullYear() - new Date(users[index]?.age).getFullYear()}</Text>
            <Text style={{ color: "white", fontSize: 16, marginTop: 5 }}>{users[index]?.occupation || "Not specified"}</Text>
          </View>

          {/* Like & Dislike Buttons */}
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <TouchableOpacity onPress={() => handleSwipe("dislike")} style={{ backgroundColor: "red", padding: 15, borderRadius: 50, marginHorizontal: 20 }}>
              <FontAwesome name="times" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSwipe("like")} style={{ backgroundColor: "#b25776", padding: 15, borderRadius: 50, marginHorizontal: 20 }}>
              <FontAwesome name="heart" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default SwipePage;