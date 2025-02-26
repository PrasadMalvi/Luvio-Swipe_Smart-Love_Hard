import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, StyleSheet, FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";  // Install this: npm install moment
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../Redux/slices/axiosSlice";

const SignUp = ({ navigation , setIsLoggedIn}) => {
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        mobileNumber: "",
        profileImage: [],
        age: "",
        location: "",
        qualification: "",
        occupation: "",
        relationshipPreference: "",
        lookingFor: "",
        interests: [],
        hobbies: [],
        aboutMe: "",
    });

    const [previewImages, setPreviewImages] = useState([]);

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleImagePick = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 6,
        quality: 1,
      });
    
      if (!result.canceled && result.assets.length > 0) {
        setFormData((prev) => ({
          ...prev,
          profileImage: [...prev.profileImage, ...result.assets.map((asset) => asset.uri)].slice(0, 6), 
        }));
      }
    };

    const handleRemoveImage = (index) => {
      setFormData((prev) => {
        const updatedImages = prev.profileImage.filter((_, i) => i !== index);
        return { ...prev, profileImage: updatedImages };
      });
    };
    
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return passwordRegex.test(password);
    };

    const validateStep = () => {
        if (step === 1) {
            if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
                Alert.alert("Error", "Please enter a valid email address.");
                return false;
            }
            if (!formData.mobileNumber.match(/^\d{10}$/)) {
                Alert.alert("Error", "Please enter a valid 10-digit mobile number.");
                return false;
            }
            if (!validatePassword(formData.password)) {
                Alert.alert("Error", "Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.");
                return false;
            }
        }
        
        if (step === 2 && formData.profileImage.length < 4) {
            Alert.alert("Error", "You must upload at least 4 profile pictures.");
            return false;
        }
        if (step === 3 && (!formData.age || !formData.location || !formData.qualification || !formData.occupation)) {
          Alert.alert("Error", "All fields are required in Personal Details.");
          return false;
      }
      
        if (step === 4 && (!formData.relationshipPreference || !formData.lookingFor || formData.interests.length === 0 || formData.hobbies.length === 0)) {
            Alert.alert("Error", "All fields are required in Preferences & Interests.");
            return false;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        setStep(step - 1);
    };
    const handleSelection = (key, option) => {
      setFormData((prev) => ({ ...prev, [key]: option }));
  };

  const handleMultiSelectToggle = (key, option) => {
    setFormData((prev) => {
        const updatedArray = prev[key].includes(option)
            ? prev[key].filter((item) => item !== option)
            : [...prev[key], option];
        return { ...prev, [key]: updatedArray };
    });
};

  const handleDateChange = (event, date) => {
    if (date) {
      const formattedDate = moment(date).format("YYYY-MM-DD"); // Format date
      const calculatedAge = moment().diff(moment(date), "years"); // Calculate age
  
      if (calculatedAge < 18) {
        Alert.alert("Error", "You must be at least 18 years old.");
      } else {
        setSelectedDate(date);
        setFormData((prev) => ({ ...prev, age: formattedDate })); // Store single date value
      }
    }
    setShowDatePicker(false);
  };

    const handleSubmit = async () => {
      setLoading(true);
      setError(null);
  
      try {
          const data = new FormData();
  
          formData.profileImage.forEach((uri, index) => {
              let localUri = uri;
              let filename = localUri.split('/').pop();
              let match = /\.(\w+)$/.exec(filename);
              let type = match ? `image/${match[1]}` : `image`;
  
              data.append('profileImage', {
                  uri: localUri,
                  name: filename,
                  type,
              });
          });
  
          Object.entries(formData).forEach(([key, value]) => {
            if (key !== 'profileImage' && key !== 'age') {
                if (Array.isArray(value)) {
                    data.append(key, JSON.stringify(value)); // Ensure it is a json string
                } else {
                    data.append(key, value);
                }
            }
        });

          if (formData.age) {
              data.append("age", formData.age);
          }
  
          const response = await axiosInstance.post(
              '/Authentication/signUp',
              data,
              {
                  headers: { 'Content-Type': 'multipart/form-data' },
              }
          );
          if (response.status === 201 && response.data.success) { //Check response.status
            const token = response.data.token;
            await AsyncStorage.setItem("authToken", token);
            setIsLoggedIn(true);
            navigation.navigate("MainApp");
        } else {
            console.log("Signup failed:", response.data);
            setError(response.data.message || 'Something went wrong.');
        }
    } catch (err) {
        console.error("Signup error:", err);
        console.error("Signup error response:", err.response); //Log error response.
        setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
        setLoading(false);
    }
  };

    
    


    return (
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>
                {["Basic Info", "Profile Pictures", "Personal Details", "Preferences"][step - 1]}
            </Text>

            {error && <Text style={styles.error}>{error}</Text>}

            {/* Step 1: Basic Info */}
            {step === 1 && (
    <>
        <TextInput
            placeholder="Full Name"
            style={styles.input}
            onChangeText={(value) => handleChange("name", value)}
            value={formData.name} // Added value prop
        />
        <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
            onChangeText={(value) => handleChange("email", value)}
            value={formData.email} // Added value prop
        />
        <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            onChangeText={(value) => handleChange("password", value)}
            value={formData.password} // Added value prop
        />
        <TextInput
            placeholder="Mobile Number"
            style={styles.input}
            keyboardType="phone-pad"
            onChangeText={(value) => handleChange("mobileNumber", value)}
            value={formData.mobileNumber} // Added value prop
        />
    </>
)}

            {/* Step 2: Profile Pictures */}
            {step === 2 && (
                <View style={styles.imageCardsContainer}>
                    {[...Array(6)].map((_, index) => (
                        <View key={index} style={styles.imageCard}>
                            {formData.profileImage[index] ? (
                                <>
                                    <Image source={{ uri: formData.profileImage[index] }} style={styles.image} />
                                    <TouchableOpacity onPress={() => handleRemoveImage(index)} style={styles.removeBtn}>
                                        <Text style={styles.removeText}>X</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <TouchableOpacity onPress={() => handleImagePick(index)} style={styles.emptyCard}>
                                    <Text style={styles.addText}>+</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* Step 3: Personal Details */}
            {step === 3 && (
                <>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
  <Text>{selectedDate ? moment(selectedDate).format("DD-MM-YYYY") : "Select Date of Birth"}</Text>
</TouchableOpacity>


                    {showDatePicker && (
                      <DateTimePicker
                        value={selectedDate || new Date()}
                        mode="date"
                        display="spinner"
                        maximumDate={moment().subtract(18, "years").toDate()} // Restrict to 18+ years old
                        onChange={handleDateChange}
                      />
                    )}

                    <TextInput placeholder="Location" value={formData.location} onChangeText={(value) => handleChange("location", value)} style={styles.input} />

                    {/* Qualification */}
                    <Text style={styles.label}>Select Education</Text>
                    <View style={styles.optionsContainer}>
                      <FlatList 
                        data={["High School", "Bachelor's Degree", "Master's Degree", "Doctorate"]} 
                        numColumns={2}  // Wraps options within screen
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                          <TouchableOpacity 
                            style={[styles.option, formData.qualification === item && styles.selectedOption]} 
                            onPress={() => handleSelection("qualification", item)}
                          >
                            <Text style={{ color: "#fff", textAlign: "center" }}>{item}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                    <TextInput placeholder="Occupation" value={formData.occupation} onChangeText={(value) => handleChange("occupation", value)} style={styles.input} />
                </>
            )}

            {/* Step 4: Preferences & Interests */}
            {step === 4 && (
              <>
                {/* About Me */}
                <TextInput 
                  placeholder="Tell us about yourself"
                  value={formData.aboutMe}
                  onChangeText={(value) => handleChange("aboutMe", value)}
                  style={[styles.input, { height: 80, textAlignVertical: "top" }]}
                  multiline
                />

                {/* Single Select Options */}
                {[
                  { key: "relationshipPreference", label: "Relationship Preference", options: ["Monogamy", "Polygamy", "Open to Explore", "Ethical Non-Monogamy"] },
                  { key: "lookingFor", label: "Looking For", options: ["Long-term", "Short-term", "New Friends", "Figuring Out"] },
                ].map(({ key, label, options }) => (
                  <View key={key}>
                    <Text style={styles.label}>{label}</Text>
                    <View style={styles.optionsContainer}>
                      {options.map((item) => (
                        <TouchableOpacity 
                          key={item}
                          style={[styles.option, formData[key] === item && styles.selectedOption]} 
                          onPress={() => handleSelection(key, item)}
                        >
                          <Text style={styles.optionText}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}

                {/* Multi-Select Options */}
                {[
                  { key: "interests", label: "Interests", options: ["Music", "Sports", "Traveling", "Gaming", "Fitness"] },
                  { key: "hobbies", label: "Hobbies", options: ["Reading", "Cooking", "Dancing", "Painting", "Photography"] },
                ].map(({ key, label, options }) => (
                  <View key={key}>
                    <Text style={styles.label}>{label}</Text>
                    <View style={styles.optionsContainer}>
                      {options.map((item) => (
                        <TouchableOpacity 
                          key={item}
                          style={[styles.option, formData[key].includes(item) && styles.selectedOption]} 
                          onPress={() => handleMultiSelectToggle(key, item)}
                        >
                          <Text style={styles.optionText}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </>
            )}


            {/* Next/Previous Buttons */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                {step > 1 && (
                    <TouchableOpacity onPress={prevStep} style={styles.button}>
                        <Text style={styles.buttonText}>Previous</Text>
                    </TouchableOpacity>
                )}
                {step < 4 && (
                    <TouchableOpacity onPress={nextStep} style={styles.button}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                )}
                {step === 4 && (
                    <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
  mainContainer:{
    padding: 20,
    marginTop:50,
    marginLeft:-10,
    marginRight:-20
  },
    container: {
      backgroundColor:"white",
      width:340,
      minHeight:400,
      borderRadius:10,
      
    },
    header: {
      marginTop:10,
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    error: {
        color: "red",
        marginBottom: 10,
        textAlign: "center",
    },
    input: {
        width: "90%",
        padding: 12,
        borderWidth: 2,
        borderColor: "#b25776",
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
        marginLeft:15
    },
    label: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
        marginLeft:10
    },
    optionsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center", // Center align options
      alignItems: "center",
    },
    option: { 
      padding: 10, 
      margin: 5, 
      backgroundColor: "#444", 
      borderRadius: 25,
      width: "40%",  // Ensures two options per row
      alignItems: "center",
    },
    selectedOption: { 
      backgroundColor: "#b25776" 
    },
    button: {
        backgroundColor: "#b25776",
        padding: 12,
        borderRadius: 10,
        minWidth:70,
        marginLeft:8,
        marginRight:8,
        marginBottom:10
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize:15,
        paddingLeft:7
    },
    uploadBtn: {
        backgroundColor: "#b25776",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 10,
    },
    uploadText: {
        color: "#fff",
        fontWeight: "bold",
    },
    imageCardsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        height:570,
        marginTop:-10,
        marginBottom:-20
    },
    imageCard: {
        width: "47%",
        aspectRatio: 1,
        margin: 5,
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 5,
    },
    removeBtn: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    removeText: {
        color: "white",
        fontSize: 12,
    },
    emptyCard: {
        width: "100%",
        height: 185,
        backgroundColor: "#eee",
        borderRadius:10
    },
    addText: {
      fontSize: 35,
      color: "#b25776",
      marginLeft:70,
      marginTop:70
  },
});

export default SignUp;