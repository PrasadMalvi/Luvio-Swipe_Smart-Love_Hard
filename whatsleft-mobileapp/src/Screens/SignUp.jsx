import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator 
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons"; // For icons
import AsyncStorage from "@react-native-async-storage/async-storage";

const Signup = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [interests, setInterests] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);

  // Select Profile Picture
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  // Handle User Registration
  const handleRegister = async () => {
    if (!name || !email || !password || !mobileNumber) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters.");
      return;
    }

    if (mobileNumber.length !== 10) {
      Alert.alert("Error", "Enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://192.168.0.101:5050/Authentication/signup", {
        name,
        email,
        password,
        mobileNumber,
        profilePictures: [profilePicture], // Storing as an array
        interests: interests.split(",").map((i) => i.trim()), // Convert to array
      });

      if (response.data.success) {
        const token = response.data.token;
        await AsyncStorage.setItem("authToken", token);
        Alert.alert("Success", "Registration successful! Please log in.");
        navigation.navigate("MainPage");
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Registration failed. Try again later.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
    <Image source={require("../Components/assets/logo5.png")} style={{ width: 250, height: 150, marginBottom: 10, marginTop: 5, marginLeft:30 }} />
      

      {/* Profile Picture */}
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profileImage} />
        ) : (
          <Ionicons name="person-circle-outline" size={80} color="#999" />
        )}
        <Text style={styles.imagePickerText}>Select Profile Picture</Text>
      </TouchableOpacity>

      {/* Input Fields */}
      <TextInput placeholder="Full Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Mobile Number" value={mobileNumber} onChangeText={setMobileNumber} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Interests (comma separated)" value={interests} onChangeText={setInterests} style={styles.input} />

      {/* Register Button */}
      <TouchableOpacity onPress={handleRegister} style={styles.button} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Login Redirect */}
      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={{ color: "#b25776", fontWeight: "bold" }}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = {
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#b25776",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "grey",
    borderWidth: 1,
    backgroundColor: "#FFF",
    marginBottom: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    textAlign: "center",
    fontSize: 16,
  },
  imagePicker: {
    alignItems: "center",
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  imagePickerText: {
    fontSize: 14,
    color: "#b25776",
  },
  button: {
    backgroundColor: "#b25776",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
    color: "#1D3557",
  },
};

export default Signup;
