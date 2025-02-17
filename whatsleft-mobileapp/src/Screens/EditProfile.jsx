import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Modal, FlatList, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "react-native-image-picker";

const EditProfile = ({ navigation }) => {
  const [user, setUser] = useState({
    profilePictures: [],
    aboutMe: "",
    lookingFor: "",
    relationshipPreference: "",
    height: "",
    location: "",
    qualification: "",
    occupation: "",
    basics: {
      zodiacSign: "",
      sexualOrientation: "",
      familyPlans: "",
    },
    lifestyle: {
      pets: "",
      drinking: "",
      smoking: "",
      workout: "",
      sleepingHabits: "",
    },
    hobbies: [],
    interests: [],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [originalUser, setOriginalUser] = useState(null);

  const options = {
    LookingFor: ["Long-term", "Short-term", "Friends", "Figuring Out"],
    RelationshipPreference: ["Monogamy", "Polygamy", "Open to Explore", "Ethical Non-Monogamy"],
    Height: Array.from({ length: 35 }, (_, i) => `${4 + Math.floor(i / 12)}'${i % 12}"`),
    Basics: {
      ZodiacSign: ["Aries", "Taurus", "Gemini", "Cancer", "Leo"],
      SexualOrientation: ["Straight", "Gay", "Bisexual", "Asexual", "Pansexual"],
      FamilyPlans: ["Want Kids", "Don't Want Kids", "Not Sure"],
    },
    Lifestyle: {
      Pets: ["Dog", "Cat", "Other", "None"],
      Drinking: ["Never", "Occasionally", "Regularly"],
      Smoking: ["Never", "Occasionally", "Regularly"],
      Workout: ["Never", "Occasionally", "Regularly"],
      SleepingHabits: ["Early Bird", "Night Owl", "Flexible"],
    },
    Hobbies: ["Reading", "Traveling", "Cooking", "Gaming"],
    Interests: ["Technology", "Fitness", "Movies", "Photography"],
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const res = await axios.get("http://localhost:5050/Authentication/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.user) {
          const fetchedUser = {
            ...res.data.user,
            profilePictures: res.data.user.profilePictures || [],
            aboutMe: res.data.user.aboutMe || "",
            hobbies: res.data.user.hobbies || [],
            interests: res.data.user.interests || [],
            occupation: res.data.user.occupation || "",
            location: res.data.user.location || "",
            lookingFor: res.data.user.lookingFor || "",
            relationshipPreference: res.data.user.relationshipPreference || "",
            height: res.data.user.height || "",
            zodiacSign: res.data.user.zodiacSign || "",
            lifestyle: res.data.user.lifestyle || {},
            sexualOrientation: res.data.user.sexualOrientation || "",
            qualification: res.data.user.qualification || "",
          };

          setUser(fetchedUser);
          setOriginalUser(fetchedUser);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const isEdited = () => JSON.stringify(user) !== JSON.stringify(originalUser);

  const saveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      await axios.put(
        "http://localhost:5050/Authentication/updateProfile",
        user,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
      navigation.navigate("Profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const pickImage = async () => {
    ImagePicker.launchImageLibrary({ mediaType: "photo", selectionLimit: 1 }, (response) => {
      if (!response.didCancel && response.assets) {
        setUser((prev) => ({
          ...prev,
          profilePictures: [...prev.profilePictures, response.assets[0].uri],
        }));
      }
    });
  };

  const removeImage = (index) => {
    setUser((prev) => ({
      ...prev,
      profilePictures: prev.profilePictures.filter((_, i) => i !== index),
    }));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: "#1a1a1a", flexGrow: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 10 }}>Edit Profile</Text>

      {/* Profile Pictures */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }}>
        {user.profilePictures.map((pic, index) => (
          <View key={index} style={{ marginRight: 10 }}>
            <Image source={{ uri: pic }} style={{ width: 80, height: 80, borderRadius: 10 }} />
            <Button title="Remove" onPress={() => removeImage(index)} color="red" />
          </View>
        ))}
        <TouchableOpacity onPress={pickImage} style={{ backgroundColor: "#b25776", padding: 10, borderRadius: 10 }}>
          <Text style={{ color: "white" }}>+ Add Image</Text>
        </TouchableOpacity>
      </View>

      {/* About Me */}
      <TextInput
        style={{ backgroundColor: "#333", color: "white", padding: 10, borderRadius: 5, marginBottom: 10 }}
        placeholder="About Me"
        placeholderTextColor="gray"
        value={user.aboutMe}
        onChangeText={(text) => setUser({ ...user, aboutMe: text })}
      />

      {/* Location */}
      <TextInput
        style={{ backgroundColor: "#333", color: "white", padding: 10, borderRadius: 5, marginBottom: 10 }}
        placeholder="Location"
        placeholderTextColor="gray"
        value={user.location}
        onChangeText={(text) => setUser({ ...user, location: text })}
      />

      {/* Select Fields */}
      <TouchableOpacity onPress={() => { setSelectedCategory("LookingFor"); setModalOpen(true); }}>
        <Text style={{ color: "white", marginBottom: 5 }}>Looking For: {user.lookingFor || "Select"}</Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity onPress={saveProfile} disabled={!isEdited()} style={{ backgroundColor: "#b25776", padding: 10, borderRadius: 5 }}>
        <Text style={{ color: "white", textAlign: "center" }}>Save Profile</Text>
      </TouchableOpacity>

      {/* Modal for Selecting Options */}
      <Modal visible={modalOpen} transparent>
        <View style={{ backgroundColor: "rgba(0,0,0,0.8)", flex: 1, justifyContent: "center", alignItems: "center" }}>
          <FlatList
            data={options[selectedCategory]}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { setUser({ ...user, [selectedCategory]: item }); setModalOpen(false); }}>
                <Text style={{ color: "white", padding: 10 }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

export default EditProfile;
