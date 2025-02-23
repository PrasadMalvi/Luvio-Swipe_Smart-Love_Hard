import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import * as Yup from "yup";

const Signup = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const SignupSchema = Yup.object().shape({
    name: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    mobileNumber: Yup.string()
      .matches(/^\d{10}$/, "Enter a valid 10-digit mobile number")
      .required("Mobile Number is required"),
    age: Yup.date().required("Age is required"),
    qualification: Yup.string().required("Qualification is required"),
    occupation: Yup.string().required("Occupation is required"),
    relationshipPreference: Yup.string().required("Select a relationship preference"),
    lookingFor: Yup.string().required("Select what you're looking for"),
    interests: Yup.array().min(1, "Select at least one interest"),
    hobbies: Yup.array().min(1, "Select at least one hobby"),
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleRegister = async (values) => {
    if (!profileImage) {
      Alert.alert("Error", "Please select a profile picture");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://192.168.0.101:5050/Authentication/signup", {
        ...values,
        profileImage,
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
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, backgroundColor: "#F8F9FA" }}>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          mobileNumber: "",
          age: "",
          qualification: "",
          occupation: "",
          relationshipPreference: "",
          lookingFor: "",
          interests: [],
          hobbies: [],
        }}
        validationSchema={SignupSchema}
        onSubmit={(values) => handleRegister(values)}
      >
        {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View>
            {step === 1 && (
              <>
                <TextInput placeholder="Full Name" value={values.name} onChangeText={handleChange("name")} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
                {touched.name && errors.name && <Text style={{ color: "red" }}>{errors.name}</Text>}
                <TextInput placeholder="Email" value={values.email} onChangeText={handleChange("email")} keyboardType="email-address" style={{ borderBottomWidth: 1, marginBottom: 10 }} />
                {touched.email && errors.email && <Text style={{ color: "red" }}>{errors.email}</Text>}
                <TouchableOpacity onPress={() => setStep(2)}><Text>Next</Text></TouchableOpacity>
              </>
            )}

            {step === 2 && (
              <>
                <TouchableOpacity onPress={pickImage}>
                  {profileImage ? <Image source={{ uri: profileImage }} style={{ width: 100, height: 100 }} /> : <Text>Select Profile Picture</Text>}
                </TouchableOpacity>
                <TextInput placeholder="Age" value={values.age} onChangeText={handleChange("age")} keyboardType="numeric" style={{ borderBottomWidth: 1, marginBottom: 10 }} />
                <TouchableOpacity onPress={() => setStep(3)}><Text>Next</Text></TouchableOpacity>
              </>
            )}

            {step === 3 && (
              <>
                <DropDownPicker
                  items={[{ label: "Graduate", value: "graduate" }, { label: "Postgraduate", value: "postgraduate" }]}
                  placeholder="Select Qualification"
                  open={false}
                  value={values.qualification}
                  setValue={(val) => setFieldValue("qualification", val)}
                />
                <TouchableOpacity onPress={() => setStep(4)}><Text>Next</Text></TouchableOpacity>
              </>
            )}

            {step === 4 && (
              <>
                <TextInput placeholder="Hobbies" value={values.hobbies} onChangeText={handleChange("hobbies")} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
                <TouchableOpacity onPress={handleSubmit}><Text>Register</Text></TouchableOpacity>
              </>
            )}
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default Signup;
