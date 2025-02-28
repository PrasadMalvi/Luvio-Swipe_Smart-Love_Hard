import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../Redux/slices/axiosSlice";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [occupation, setOccupation] = useState("");
  const [location, setLocation] = useState("");
  const [qualification, setQualification] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [relationshipPreference, setRelationshipPreference] = useState("");
  const [height, setHeight] = useState("");
  const [zodiacSign, setZodiacSign] = useState("");
  const [sexualOrientation, setSexualOrientation] = useState("");
  const [gender, setGender] = useState("");
  const [hobbies, setHobbies] = useState([]);
  const [interests, setInterests] = useState([]);
  const [profilePictures, setProfilePictures] = useState([]);
  const [pet, setPet] = useState("");
  const [drinking, setDrinking] = useState("");
  const [smoking, setSmoking] = useState("");
  const [workout, setWorkout] = useState("");
  const [sleepingHabits, SetsleepingHabits] = useState("");
  const [familyPlans, setFamilyPlans] = useState("");
  const navigation = useNavigation();

  const [openLookingFor, setOpenLookingFor] = useState(true);
  const [openRelationshipPreference, setOpenRelationshipPreference] = useState(true);
  const [openZodiacSign, setOpenZodiacSign] = useState(true);
  const [openSexualOrientation, setOpenSexualOrientation] = useState(true);
  const [openGender, setOpenGender] = useState(true);
  const [openHobbies, setOpenHobbies] = useState(true);
  const [openInterests, setOpenInterests] = useState(true);

  const lookingForItems = ["Long-term", "Short-term", "New Friends", "Figuring Out"];
  const relationshipPreferenceItems = ["Monogamy", "Polygamy", "Open to Explore", "Ethical Non-Monogamy"];
  const zodiacSignItems = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const sexualOrientationItems = ["Straight", "Gay","Heterosexual", "Homosexual", "Bisexual", "Asexual","Pansexual"];
  const genderItems = ["Male", "Female", "Non-Binary", "Other"];
  const hobbyItems = ["Reading", "Gaming", "Traveling", "Cooking", "Dancing", "Painting", "Photography"];
  const interestItems = ["Technology", "Sports", "Art", "Food", "Music", "Traveling", "Gaming", "Fitness"];
  const qualifications = ["High School", "Bachelor's Degree", "Master's Degree", "Doctorate"];
  const heightDet = Array.from({ length: 35 }, (_, i) => `${4 + Math.floor(i / 12)}'${i % 12}`);
  const petsDet = ["Dog", "Cat", "Other", "None"];
  const drinkingDet = ["Never", "Occasionally", "Regularly"];
  const smokingDet = ["Never", "Occasionally", "Regularly"];
  const workoutDet = ["Never", "Occasionally", "Regularly"];
  const sleepingHabitsDet = ["Early Bird", "Night Owl", "Flexible"];
  const familyPlansDet = ["Want Kids", "Don't Want Kids","Don't Want Kids aleady have", "Not Sure"];
  const handleSelection = (key, option) => {
    if (key === "lookingFor") setLookingFor(option);
    if (key === "relationshipPreference") setRelationshipPreference(option);
    if (key === "zodiacSign") setZodiacSign(option);
    if (key === "sexualOrientation") setSexualOrientation(option);
    if (key === "gender") setGender(option);
    if (key === "height") setHeight(option);
    if (key === "pet") setPet(option);
    if (key === "drinking") setDrinking(option);
    if (key === "smoking") setSmoking(option);
    if (key === "workout") setWorkout(option);
    if (key === "sleepingHabits") SetsleepingHabits(option);
    if (key === "familyPlans") setFamilyPlans(option);
  };

  const handleMultiSelectToggle = (key, option) => {
    if (key === "hobbies") {
      setHobbies((prev) => (prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]));
    }
    if (key === "interests") {
      setInterests((prev) => (prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]));
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const res = await axiosInstance.get("/Authentication/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.user) {
          const userData = res.data.user;
          setUser(userData);
          setName(userData.name || "");
          setAge(userData.age ? new Date(userData.age).toISOString().split('T')[0] : "");
          setAboutMe(userData.aboutMe || "");
          setOccupation(userData.occupation || "");
          setLocation(userData.location || "");
          setQualification(userData.qualification || "");
          setLookingFor(userData.lookingFor || "");
          setRelationshipPreference(userData.relationshipPreference || "");
          setHeight(userData.height || "");
          setZodiacSign(userData.zodiacSign || "");
          setSexualOrientation(userData.sexualOrientation || "");
          setGender(userData.gender || "");
          setHobbies(userData.hobbies || []);
          setInterests(userData.interests || []);
          setProfilePictures(userData.profilePictures || []);
          setPet(userData.pet || ""); 
          setDrinking(userData.drinking || "");
          setSmoking(userData.smoking || "");
          setWorkout(userData.workout || "");
          SetsleepingHabits(userData.sleepingHabits || "");
          setFamilyPlans(userData.familyPlans || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      const updatedData = {
        aboutMe,
        occupation,
        location,
        qualification,
        lookingFor,
        relationshipPreference,
        height,
        zodiacSign,
        sexualOrientation,
        gender,
        hobbies,
        interests,
        profilePictures,
        pet,
        drinking,
        smoking,
        workout,
        sleepingHabits,
        familyPlans,
      };

      await axiosInstance.put("/Authentication/updateProfile", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 9,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfilePictures([...profilePictures, ...result.assets.map((asset) => asset.uri)].slice(0, 9));
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = profilePictures.filter((_, i) => i !== index);
    setProfilePictures(updatedImages);
  };

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#b25776" />
      </View>
    );

  return (
    <View style={styles.container}>
    <ScrollView style={styles.containerScroll}>
    <View style={styles.profileInfoGradient}>
  <LinearGradient
    colors={[
      'rgba(198, 77, 118, 0.8)', // [#c64d76]/90
      'rgba(178, 87, 118, 0.6)', // #b25776/60
      'rgba(198, 77, 118, 0.3)', // [#c64d76]/30
    ]}
    start={{ x: 0.5, y: 0.5 }}
    end={{ x: 1, y: 1 }}
    style={styles.profileInfoGradientContent}
  >
    <Text style={styles.userNameAge}>
      {user?.name}, {user?.age ? new Date().getFullYear() - new Date(user?.age).getFullYear() : 'Age Unknown'}
    </Text>
  </LinearGradient>
</View>
<View style={styles.imageCardsContainer}>
          {Array.from({ length: 9 }).map((_, index) => {
            if (index < profilePictures.length) {
              const imageUri = profilePictures[index];
              const isLocalFile = imageUri.startsWith("file:///");

              return (
                <View key={index} style={styles.imageCard}>
                  <Image
                    source={{
                      uri: isLocalFile
                        ? imageUri
                        : `http://192.168.0.101:5050/${imageUri}`,
                    }}
                    style={styles.image}
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveImage(index)}
                    style={styles.removeBtn}
                  >
                    <Text style={styles.removeText}>X</Text>
                  </TouchableOpacity>
                </View>
              );
            } else {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={handleImagePick}
                  style={styles.addImageCard}
                >
                  <Text style={styles.addText}>+</Text>
                </TouchableOpacity>
              );
            }
          })}
        </View>

      <View style={styles.formContainer}>
        <View style={styles.sectionContainer}>
        <View style={styles.iconTitleContainer}>
                                <Icon name="account-heart" size={20} color="#c64d76" />
                                <Text style={styles.sectionTitle}>About Me</Text>
                              </View>
        <TextInput
          style={styles.input}
          value={aboutMe}
          onChangeText={setAboutMe}
          placeholder="Tell us about yourself"
        />
        </View>
        <View style={styles.sectionContainer}>
          <View style={styles.iconTitleContainer}>
                  <Icon name="briefcase" size={20} color="#c64d76" />
                  <Text style={styles.sectionTitle}>Occupation</Text>
                </View>
        <TextInput
          style={styles.input}
          value={occupation}
          onChangeText={setOccupation}
          placeholder="Enter your occupation"
          placeholderTextColor={"white"}
        />

        <View style={styles.iconTitleContainer}>
                <Icon name="map-marker" size={20} color="#c64d76" />
                <Text style={styles.sectionTitle}>Location</Text>
              </View>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter your location"
          placeholderTextColor={"white"}

        />

<View style={styles.iconTitleContainer}>
    <Icon name="school" size={20} color="#c64d76" />
    <Text style={styles.sectionTitle}>Qualification</Text>
</View>
<View style={styles.optionsContainer}>
    {qualifications.map((item) => (
        <TouchableOpacity
            key={item}
            style={[styles.option, qualification === item && styles.selectedOption]}
            onPress={() => setQualification(item)} // Corrected line
        >
            <Text style={styles.optionText}>{item}</Text>
        </TouchableOpacity>
    ))}
</View>
        <View style={styles.iconTitleContainer}>
                <Icon name="account-search" size={20} color="#c64d76" />
                <Text style={styles.sectionTitle}>Looking For</Text>
              </View>
        <View style={styles.optionsContainer}>
          {lookingForItems.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, lookingFor === item && styles.selectedOption]}
              onPress={() => handleSelection("lookingFor", item)}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.iconTitleContainer}>
                                <Icon name="heart-multiple" size={20} color="#c64d76" />
                                <Text style={styles.sectionTitle}>Preferences</Text>
                                </View>
        <View style={styles.optionsContainer}>
          {relationshipPreferenceItems.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, relationshipPreference === item && styles.selectedOption]}
              onPress={() => handleSelection("relationshipPreference", item)}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        </View>
        <View style={styles.sectionContainer}>
            <View style={styles.iconTitleContainer}>
              <Icon name="human-male-height" size={20} color="#c64d76" />
              <Text style={styles.sectionTitle}>Height</Text>
            </View>
            <View style={styles.optionsContainer}>
              {heightDet.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.option, height === item && styles.selectedOption]}
                  onPress={() => handleSelection("height", item)} // Updated handleSelection
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>

        <View style={styles.iconTitleContainer}>
                <Icon name="star-outline" size={20} color="#c64d76" />
                <Text style={styles.sectionTitle}>Zodiac Sign</Text>
              </View>
        <View style={styles.optionsContainer}>
          {zodiacSignItems.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, zodiacSign === item && styles.selectedOption]}
              onPress={() => handleSelection("zodiacSign", item)}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.iconTitleContainer}>
                <Icon name="gender-male-female" size={20} color="#c64d76" />
                <Text style={styles.sectionTitle}>Sexual Orientation</Text>
              </View>
        <View style={styles.optionsContainer}>
          {sexualOrientationItems.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, sexualOrientation === item && styles.selectedOption]}
              onPress={() => handleSelection("sexualOrientation", item)}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>


        <View style={styles.iconTitleContainer}>
                <Icon name="gender-male" size={20} color="#c64d76" />
                <Text style={styles.sectionTitle}>Gender</Text>
              </View>
        <View style={styles.optionsContainer}>
          {genderItems.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, gender === item && styles.selectedOption]}
              onPress={() => handleSelection("gender", item)}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        </View>

                      <View style={styles.sectionContainer}>
                                      <View style={styles.iconTitleContainer}>
                                          <Icon name="palette" size={20} color="#c64d76" />
                                          <Text style={styles.sectionTitle}>Hobbies</Text>
                                      </View>
                                      <View style={styles.optionsContainer}>
                                          {hobbyItems.map((item) => (
                  <TouchableOpacity
                      key={item}
                      style={[styles.option, hobbies.some(hobby => hobby.toLowerCase() === item.toLowerCase()) && styles.selectedOption]}
                      onPress={() => handleMultiSelectToggle("hobbies", item)}
                  >
                      <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
              ))}
                        </View>

                        <View style={styles.iconTitleContainer}>
                            <Icon name="star" size={20} color="#c64d76" />
                            <Text style={styles.sectionTitle}>Interests</Text>
                        </View>
                        <View style={styles.optionsContainer}>
                            {interestItems.map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[styles.option, interests.includes(item) && styles.selectedOption]}
                                    onPress={() => handleMultiSelectToggle("interests", item)}
                                >
                                    <Text style={styles.optionText}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
        </View>
        <View style={styles.sectionContainer}>
        <View style={styles.iconTitleContainer}>
                <Icon name="gender-male-female" size={20} color="#c64d76" />
                <Text style={styles.sectionTitle}>Pets</Text>
              </View>
        <View style={styles.optionsContainer}>
          {petsDet.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, pet === item && styles.selectedOption]}
              onPress={() => handleSelection("pet", item)}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.iconTitleContainer}>
                <Icon name="gender-male-female" size={20} color="#c64d76" />
                <Text style={styles.sectionTitle}>Alcohol</Text>
              </View>
        <View style={styles.optionsContainer}>
          {drinkingDet.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, drinking === item && styles.selectedOption]}
              onPress={() => handleSelection("drinking", item)}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.iconTitleContainer}>
                <Icon name="gender-male-female" size={20} color="#c64d76" />
                <Text style={styles.sectionTitle}>Smoking</Text>
              </View>
        <View style={styles.optionsContainer}>
          {smokingDet.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, smoking === item && styles.selectedOption]}
              onPress={() => handleSelection("smoking", item)}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.iconTitleContainer}>
                <Icon name="gender-male-female" size={20} color="#c64d76" />
                <Text style={styles.sectionTitle}>WorkOut</Text>
              </View>
        <View style={styles.optionsContainer}>
          {workoutDet.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, workout === item && styles.selectedOption]}
              onPress={() => handleSelection("workout", item)}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.iconTitleContainer}>
                <Icon name="gender-male-female" size={20} color="#c64d76" />
                <Text style={styles.sectionTitle}>Sleeping Habbits</Text>
              </View>
        <View style={styles.optionsContainer}>
          {sleepingHabitsDet.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, sleepingHabits === item && styles.selectedOption]}
              onPress={() => handleSelection("sleepingHabits", item)}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.iconTitleContainer}>
                <Icon name="gender-male-female" size={20} color="#c64d76" />
                <Text style={styles.sectionTitle}>Family Plans</Text>
              </View>
        <View style={styles.optionsContainer}>
          {familyPlansDet.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, familyPlans === item && styles.selectedOption]}
              onPress={() => handleSelection("familyPlans", item)}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        </View>
      </View>
          
    </ScrollView>
    <View style={styles.updateButton}>
      <TouchableOpacity
        
        onPress={handleUpdateProfile}
      >
        <Text style={styles.updateButtonText}>Update Profile</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",

    },
    containerScroll:{
      flex: 1,
      padding: 20,
        
    },
    profileInfoGradient: {
      bottom: 0,
      left: -16,
      right: -2,
      zIndex: 10,
      top:10,
      marginBottom:-10,
      width:350
    },
    profileInfoGradientContent: {
      paddingVertical: 15,
      paddingHorizontal: 15,
      borderRadius: 10,
      alignItems: 'flex-start',
    },
    userNameAge: {
      color: 'white',
      fontSize: 25,
      fontWeight: 'bold',
    },
    formContainer: {
        width: "100%",
        marginBottom:50
    },
    sectionContainer: {
      marginTop: 10,
      padding: 10,
      backgroundColor: "#333",
      borderRadius: 10,
      width:350,
      marginLeft:-15
    },
    iconTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8, // Adds space between the icon and text
      marginTop:5
    },
    iconTitleContainerimg: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8, // Adds space between the icon and text
    },
    sectionTitle: {
      color: "#b25776",
      fontSize: 18,
      fontWeight: "bold",
    },
    sectionTitleimg: {
      color: "#b25776",
      fontSize: 20,
      fontWeight: "bold",
      marginBottom:-25
    },
    label: {
        color: "white",
        fontSize: 16,
        marginTop: 10,
        marginLeft: 10,
    },
    input: {
        backgroundColor: "#121212",
        color: "white",
        padding: 10,
        paddingLeft: 20,
        borderRadius: 15,
        marginTop: 5,
    },
    imageCardsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        marginTop: 30,
        marginBottom: -20,
        marginLeft: -20,
        height: 600,
        width: 360,
    },
    imageCard: {
        width: "30%",
        height: 180,
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
        top: 2,
        right: 2,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    removeText: {
        color: "#b25776",
        fontSize: 12,
    },
    addImageCard: {
        width: "30%",
        height: 180,
        backgroundColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        marginTop: 5,
    },
    addText: {
        fontSize: 40,
        color: "#b25776",
    },
    updateButton: {
        backgroundColor: "#b25776",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 0,
        position:"static",
        zIndex:40,
        width:200,
        marginLeft:80,
        borderRadius:25
    },
    updateButtonText: {
        color: "white",
        fontSize: 18,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    optionsContainer: {
      marginTop:5,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start", // Changed to flex-start for tighter layout
      alignItems: "flex-start", // Changed to flex-start for tighter layout
    },
    option: {
      padding: 10,
      margin: 5,
      backgroundColor: "#444",
      borderRadius: 25,
      width: "auto", // Changed to auto to fit content
      alignItems: "center",
    },
    
    selectedOption: {
        backgroundColor: "#b25776"
    },
    optionText: {
        color: "white",
        textAlign: "center"
    }
});

export default EditProfile;