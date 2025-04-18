import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { setAuthToken } from "../Redux/slices/axiosSlice";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/slices/authSlice"
const SignIn = ({ navigation }) => {
  const dispatch = useDispatch();

  const [loginType, setLoginType] = useState("email"); // "email" or "mobile"
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axiosInstance.post("/Authentication/signIn", {
        email,
        password,
      });
  
      if (response.data.success) {
        const { token, user } = response.data; // ✅ Destructuring the response
        console.log("Login user object:", user); // 👈 Add this line here
      
        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("userId", user.id); // Assuming user._id is correct
        console.log("Stored token:", token);
        console.log("Stored userId:", user.id);
        setAuthToken(token);
        dispatch(setUser({ user, token }));
        console.log("✅ Logged in:", res.data);
        navigation.navigate("MainApp");
      } else {
        Alert.alert("Error", response.data.message);
      }
      
    } catch (error) {
      Alert.alert("Error", "Login failed. Try again later.");
      console.error("❌ Login failed:", error.response?.status, error.response?.data);
    }
    setLoading(false);
  };
  


  // Function to Send OTP
  const handleSendOtp = async () => {
    if (mobileNumber.length !== 10) {
      Alert.alert("Error", "Enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/Authentication/send-otp", {
        mobileNumber,
      });

      if (response.data.success) {
        Alert.alert("Success", "OTP sent successfully!");
        setOtpSent(true); // Show OTP input field
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP. Try again later.");
      console.error(error);
    }
    setLoading(false);
  };

  // Function to Verify OTP
  const handleVerifyOtp = async () => {
    if (!mobileNumber || otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid mobile number and 6-digit OTP.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axiosInstance.post("/Authentication/signIn", {
        mobileNumber,
        otp,
      });
  
      if (response.data.success) {
        const { token, user } = response.data;
  
        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("userId", user.id);
        setAuthToken(token);
        dispatch(setUser({ user, token }));
        Alert.alert("Success", "Logged in successfully!");
        navigation.navigate("MainApp");
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.");
      console.error("❌ OTP Login Error:", error.response?.data || error.message);
    }
    setLoading(false);
  };
  

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center", alignItems: "center" }}>
      <Image source={require("../Components/assets/logo5.png")} style={{ width: 250, height: 150, marginBottom: 20, marginTop: -100 }} />

      {/* Toggle between Email and Mobile Login */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => { setLoginType("email"); setOtpSent(false); }}
          style={[styles.toggleButton, loginType === "email" && styles.activeButton]}>
          <Text style={loginType === "email" ? styles.activeText : styles.inactiveText}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setLoginType("mobile"); setOtpSent(false); }}
          style={[styles.toggleButton, loginType === "mobile" && styles.activeButton]}>
          <Text style={loginType === "mobile" ? styles.activeText : styles.inactiveText}>Mobile</Text>
        </TouchableOpacity>
      </View>

      {/* Email Login Fields */}
      {loginType === "email" && (
        <>
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
          <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
          <TouchableOpacity onPress={handleEmailLogin} style={styles.button} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: "white", fontSize: 16 }}>Login</Text>}
          </TouchableOpacity>
        </>
      )}

      {/* Mobile Login Fields */}
      {loginType === "mobile" && (
        <>
          <TextInput placeholder="Mobile Number" value={mobileNumber} onChangeText={setMobileNumber} keyboardType="numeric" style={styles.input} />

          {/* If OTP is not sent yet, show "Send OTP" button */}
          {!otpSent ? (
            <TouchableOpacity onPress={handleSendOtp} style={styles.button} disabled={loading}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: "white", fontSize: 16 }}>Send OTP</Text>}
            </TouchableOpacity>
          ) : (
            <>
              {/* OTP Input Field */}
              <TextInput placeholder="Enter OTP" value={otp} onChangeText={setOtp} keyboardType="numeric" maxLength={6} style={styles.input} />
              <TouchableOpacity onPress={handleVerifyOtp} style={styles.button} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: "white", fontSize: 16 }}>Verify OTP & Continue</Text>}
              </TouchableOpacity>
            </>
          )}
        </>
      )}

      {/* Signup Navigation */}
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={{ textAlign: "center", marginTop: 15 }}>
          New user? <Text style={{ color: "#b25776" }}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 25,
    width: 300,
    textAlign: "center",
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 50,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 25,
    width: 100,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#b25776",
  },
  inactiveText: {
    color: "gray",
  },
  activeText: {
    color: "white",
  },
  button: {
    backgroundColor: "#b25776",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderRadius: 25,
    width: 300,
  },
};

export default SignIn;
