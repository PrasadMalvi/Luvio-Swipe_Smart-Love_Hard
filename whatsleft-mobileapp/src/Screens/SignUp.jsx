import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Formik } from 'formik';
import * as Yup from "yup";
import axios from "axios";
import { StyleSheet } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

const Signup = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profilePictures, setProfilePictures] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Pick Image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && profilePictures.length < 10) {
      setProfilePictures([...profilePictures, result.assets[0].uri]);
    } else {
      Alert.alert("Limit Reached", "You can upload a maximum of 10 images.");
    }
  };

  // Remove Image
  const removeImage = (index) => {
    setProfilePictures(profilePictures.filter((_, i) => i !== index));
  };

  // Function to calculate age
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(8, "Must be at least 8 characters")
      .matches(/[A-Z]/, "Must include an uppercase letter")
      .matches(/[a-z]/, "Must include a lowercase letter")
      .matches(/[0-9]/, "Must include a number")
      .matches(/[!@#$%^&*]/, "Must include a special character")
      .required("Required"),
    mobileNumber: Yup.string()
      .matches(/^\d{10}$/, "Enter a valid 10-digit mobile number")
      .required("Required"),
    age: Yup.date()
      .test("age", "You must be at least 18 years old", (value) => calculateAge(value) >= 18)
      .required("Required"),
    location: Yup.string().required("Required"),
    qualification: Yup.string().required("Required"),
    occupation: Yup.string().required("Required"),
    relationshipPreference: Yup.string().required("Required"),
    lookingFor: Yup.string().required("Required"),
    interests: Yup.array().min(1, "Select at least one interest"),
    hobbies: Yup.array().min(1, "Select at least one hobby"),
  });

  // Submit Form
  const handleRegister = async (values) => {
    if (profilePictures.length < 4) {
      Alert.alert("Error", "You must upload at least 4 profile pictures.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://192.168.0.101:5050/Authentication/signup", {
        ...values,
        profilePictures,
      });

      if (response.data.success) {
        await AsyncStorage.setItem("authToken", response.data.token);
        Alert.alert("Success", "Registration successful!");
        navigation.navigate("MainPage");
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Registration failed. Try again later.");
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: "#F8F9FA" }}>
      <Image source={require("../Components/assets/logo5.png")} style={{ width: 250, height: 150, alignSelf: "center" }} />
      
      <Formik
        initialValues={{
          name: "", email: "", password: "", mobileNumber: "",
          age: "", location: "", qualification: "", occupation: "",
          relationshipPreference: "", lookingFor: "", interests: [], hobbies: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleSubmit, values, errors, setFieldValue }) => (
          <>
            {step === 1 && (
              <>
                <TextInput placeholder="Full Name" value={values.name} onChangeText={handleChange("name")} style={styles.input} />
                <Text style={styles.error}>{errors.name}</Text>

                <TextInput placeholder="Email" value={values.email} onChangeText={handleChange("email")} keyboardType="email-address" style={styles.input} />
                <Text style={styles.error}>{errors.email}</Text>

                <TextInput placeholder="Password" value={values.password} onChangeText={handleChange("password")} secureTextEntry style={styles.input} />
                <Text style={styles.error}>{errors.password}</Text>

                <TextInput placeholder="Mobile Number" value={values.mobileNumber} onChangeText={handleChange("mobileNumber")} keyboardType="numeric" style={styles.input} />
                <Text style={styles.error}>{errors.mobileNumber}</Text>
              </>
            )}

            {step === 3 && (
              <>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                  <Text>{values.age ? new Date(values.age).toDateString() : "Select Date of Birth"}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setDate(selectedDate);
                        setFieldValue("age", selectedDate.toISOString());
                      }
                    }}
                  />
                )}
                <Text style={styles.error}>{errors.age}</Text>
              </>
            )}

            <TouchableOpacity onPress={step === 4 ? handleSubmit : () => setStep(step + 1)} style={styles.button}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{step === 4 ? "Sign Up" : "Next"}</Text>}
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginVertical: 5, borderRadius: 5 },
  error: { color: "red", fontSize: 12, marginBottom: 5 },
  button: { backgroundColor: "#b25776", padding: 15, borderRadius: 5, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16 },
});

export default Signup;
