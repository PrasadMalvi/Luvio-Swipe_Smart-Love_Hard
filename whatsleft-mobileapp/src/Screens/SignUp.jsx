import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

const SignupScreen = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    images: [],
    age: "",
    location: "",
    qualification: "",
    occupation: "",
    relationshipPreference: "",
    lookingFor: "",
    interests: [],
    hobbies: [],
  });

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, images: [...formData.images, ...result.assets.map((asset) => asset.uri)] });
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("mobile", formData.mobile);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("qualification", formData.qualification);
      formDataToSend.append("occupation", formData.occupation);
      formDataToSend.append("relationshipPreference", formData.relationshipPreference);
      formDataToSend.append("lookingFor", formData.lookingFor);
      formData.images.forEach((uri, index) => {
        formDataToSend.append("images", {
          uri,
          type: "image/jpeg",
          name: `profile_image_${index}.jpg`,
        });
      });

      const response = await fetch("https://your-api-endpoint.com/signup", {
        method: "POST",
        body: formDataToSend,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Signup successful!");
      } else {
        Alert.alert("Error", data.message || "Signup failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {step === 1 && (
        <View>
          <Text>Name</Text>
          <TextInput value={formData.name} onChangeText={(text) => setFormData({ ...formData, name: text })} />
          <Text>Email</Text>
          <TextInput value={formData.email} onChangeText={(text) => setFormData({ ...formData, email: text })} />
          <Text>Mobile</Text>
          <TextInput value={formData.mobile} onChangeText={(text) => setFormData({ ...formData, mobile: text })} />
          <Text>Password</Text>
          <TextInput secureTextEntry value={formData.password} onChangeText={(text) => setFormData({ ...formData, password: text })} />
        </View>
      )}

      {step === 2 && (
        <View>
          <Text>Upload Profile Pictures (Min 4)</Text>
          <TouchableOpacity onPress={handleImageUpload}><Text>Upload Image</Text></TouchableOpacity>
          <ScrollView horizontal>
            {formData.images.map((uri, index) => (
              <Image key={index} source={{ uri }} style={{ width: 100, height: 100 }} />
            ))}
          </ScrollView>
        </View>
      )}

      {step === 3 && (
        <View>
          <Text>Age</Text>
          <TextInput value={formData.age} onChangeText={(text) => setFormData({ ...formData, age: text })} />
          <Text>Location</Text>
          <TextInput value={formData.location} onChangeText={(text) => setFormData({ ...formData, location: text })} />
          <Text>Qualification</Text>
          <Picker selectedValue={formData.qualification} onValueChange={(value) => setFormData({ ...formData, qualification: value })}>
            <Picker.Item label="Graduate" value="Graduate" />
            <Picker.Item label="Postgraduate" value="Postgraduate" />
            <Picker.Item label="PhD" value="PhD" />
          </Picker>
          <Text>Occupation</Text>
          <TextInput value={formData.occupation} onChangeText={(text) => setFormData({ ...formData, occupation: text })} />
        </View>
      )}

      {step === 4 && (
        <View>
          <Text>Relationship Preference</Text>
          <Picker selectedValue={formData.relationshipPreference} onValueChange={(value) => setFormData({ ...formData, relationshipPreference: value })}>
            <Picker.Item label="Monogamy" value="Monogamy" />
            <Picker.Item label="Polygamy" value="Polygamy" />
            <Picker.Item label="Open to Explore" value="Open to Explore" />
          </Picker>
          <Text>Looking For</Text>
          <Picker selectedValue={formData.lookingFor} onValueChange={(value) => setFormData({ ...formData, lookingFor: value })}>
            <Picker.Item label="Long-term" value="Long-term" />
            <Picker.Item label="Short-term" value="Short-term" />
            <Picker.Item label="New Friends" value="New Friends" />
          </Picker>
        </View>
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
        {step > 1 && <TouchableOpacity onPress={handlePrev}><Text>Previous</Text></TouchableOpacity>}
        {step < 4 && <TouchableOpacity onPress={handleNext}><Text>Next</Text></TouchableOpacity>}
        {step === 4 && <TouchableOpacity onPress={handleSubmit}><Text>Submit</Text></TouchableOpacity>}
      </View>
    </ScrollView>
  );
};

export default SignupScreen;
  