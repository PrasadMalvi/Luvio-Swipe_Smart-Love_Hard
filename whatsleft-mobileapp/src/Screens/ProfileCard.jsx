import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const ProfileCard = ({ user, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getIconName = (field) => {
    switch (field) {
      case "occupation":
        return "briefcase";
      case "location":
        return "map-marker-alt";
      case "qualification":
        return "graduation-cap";
      case "height":
        return "ruler-vertical";
      case "lookingFor":
        return "search";
      case "relationshipPreference":
        return "heart";
      case "zodiacSign":
        return "star";
      case "sexualOrientation":
        return "transgender-alt";
      case "gender":
        return "user";
      case "hobbies":
        return "palette";
      case "interests":
        return "lightbulb";
      case "aboutMe":
        return "user-circle";
      case "pet":
        return "paw";
      case "drinking":
        return "wine-glass-alt";
      case "smoking":
        return "smoking";
      case "workout":
        return "dumbbell";
      case "sleepingHabits":
        return "bed";
      case "familyPlans":
        return "home";
      default:
        return "question";
    }
  };
  const fixImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400";
    if (url.startsWith("file:///")) {
        return url;
    }
    if (!url.startsWith("http")) {
        return `http://192.168.0.101:5050/${url}`;
    }
    return url;
};

const handleNextImage = () => {
    if (user?.profilePictures?.length > 1 && currentImageIndex < user.profilePictures.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
    }
};

const handlePrevImage = () => {
    if (currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
    }
};

return (
    <View style={styles.overlay}>
        <View style={styles.card}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.profileContainer}>
                    <View style={styles.imageContainer}>
                        <View style={styles.imageIndicatorContainer}>
                            {user?.profilePictures?.map((_, idx) => (
                                <View key={idx} style={[styles.imageIndicatorLine, idx === currentImageIndex && styles.activeImageIndicatorLine, { width: `${100 / user?.profilePictures?.length}%`, marginRight: idx < user?.profilePictures?.length - 1 ? '5px' : '0' }]} />
                            ))}
                        </View>
                        <Image source={{ uri: fixImageUrl(user?.profilePictures?.[currentImageIndex]) }} style={styles.profileImage} />
                        {user?.profilePictures?.length > 1 && (
                            <>
                                {currentImageIndex > 0 && (<TouchableOpacity style={styles.leftArrow} onPress={handlePrevImage}></TouchableOpacity>)}
                                {currentImageIndex < user.profilePictures.length - 1 && (<TouchableOpacity style={styles.rightArrow} onPress={handleNextImage}></TouchableOpacity>)}
                            </>
                        )}
                        <View style={styles.profileInfoGradient}>
                            <LinearGradient colors={["rgba(0,0,0,1)", "rgba(0,0,0,0.65)", "transparent"]} start={{ x: 0.5, y: 1 }} end={{ x: 0.5, y: 0 }} style={styles.profileInfoGradientContent}>
                                <Text style={styles.userNameAge}>
                                    {user?.name}, {new Date().getFullYear() - new Date(user?.age).getFullYear()}
                                    <View  style={styles.verifyIcon}>
                          <MaterialIcons name="verified" size={22} color="#b25776"/>
                          </View>
                                </Text>
                            </LinearGradient>
                        </View>
                    </View>
                    <View style={styles.sectionContainer}>
                        {["lookingFor", "relationshipPreference"].map((field, idx) => user?.[field] && (
                            <View key={idx} style={styles.section}>
                                <View style={styles.iconTitleContainer}>
                                    <Icon name={getIconName(field)} size={20} color="#c64d76" />
                                    <Text style={styles.sectionTitle}>{field.replace(/([A-Z])/g, " $1").trim().replace(/^./, (char) => char.toUpperCase())}</Text>
                                </View>
                                <View style={styles.chipContainer1}>
                                    <LinearGradient colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']} style={styles.gradientContainer} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}>
                                        <Text style={styles.chip}>{user[field]}</Text>
                                    </LinearGradient>
                                </View>
                            </View>
                        ))}
                    </View>
                    <View style={styles.sectionContainer}>
                        {user?.aboutMe && (
                            <View style={styles.section}>
                                <View style={styles.iconTitleContainer}>
                                    <Icon name={getIconName("aboutMe")} size={20} color="#c64d76" />
                                    <Text style={styles.sectionTitle}>About Me</Text>
                                </View>
                                <Text style={styles.sectionContent}>{user.aboutMe}</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Basic Info</Text>
                        <View style={styles.horizontalLine} />
                        {["occupation", "location", "height", "sexualOrientation", "gender", "zodiacSign"].map((field, idx, array) => user?.[field] && (
                            <React.Fragment key={idx}>
                                <View style={styles.section}>
                                    <View style={styles.iconTitleContainer}>
                                        <Icon name={getIconName(field)} size={20} color="#c64d76" />
                                    </View>
                                    <View style={styles.chipContainer}>
                                        <Text style={styles.chip}>{user[field]}</Text>
                                    </View>
                                </View>
                                {idx < array.length && <View style={styles.horizontalLine} />}
                            </React.Fragment>
                        ))}
                    </View>
                    <View style={styles.sectionContainer}>
                        {user?.hobbies?.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.iconTitleContainer}>
                                    <Icon name={getIconName("hobbies")} size={20} color="#c64d76" />
                                    <Text style={styles.sectionTitle}>Hobbies</Text>
                                </View>
                                <View style={styles.horizontalLine} />
                                <View style={styles.chipContainer1}>
                                    {user.hobbies.map((hobby, i) => (
                                        <LinearGradient key={i} colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']} style={styles.gradientContainer} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}>
                                            <Text style={styles.chip}>{hobby}</Text>
                                        </LinearGradient>
                                    ))}
                                </View>
                            </View>
                        )}
                        {user?.interests?.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.iconTitleContainer}>
                                    <Icon name={getIconName("interests")} size={20} color="#c64d76" />
                                    <Text style={styles.sectionTitle}>Interests</Text>
                                </View>
                                <View style={styles.horizontalLine} />
                                <View style={styles.chipContainer1}>
                                    {user.interests.map((interest, i) => (
                                        <LinearGradient key={i} colors={['#c64d76', 'rgba(178, 87, 118, 0.5)', '#111']} style={styles.gradientContainer} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}>
                                            <Text style={styles.chip}>{interest}</Text>
                                            </LinearGradient>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Life Style</Text>
                            <View style={styles.horizontalLine} />
                            {["pet", "drinking", "smoking", "workout", "sleepingHabits", "familyPlans"].map((field, idx, array) => user?.[field] && (
                                <React.Fragment key={idx}>
                                    <View style={styles.section}>
                                        <View style={styles.iconTitleContainer}>
                                            <Icon name={getIconName(field)} size={20} color="#c64d76" />
                                        </View>
                                        <View style={styles.chipContainer}>
                                            <Text style={styles.chip}>{user[field]}</Text>
                                        </View>
                                    </View>
                                    {idx < array.length && <View style={styles.horizontalLine} />}
                                </React.Fragment>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        backgroundColor:"#222",
        borderTopRightRadius:40,
        borderTopLeftRadius:40,
    },
    card: {
        borderTopRightRadius:40,
        borderTopLeftRadius:40,
        width: 390,
        backgroundColor: '#222',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 2,
        right: 25,
        zIndex:40
    },
    closeButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white'
    },
    scrollContainer: { paddingBottom: 20 },
    profileContainer: { alignItems: "center", paddingTop: 0 },
    imageContainer: {
        position: "relative",
        width: 350,
        height: 500,
        marginTop: 30,
    },
    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    leftArrow: {
        position: "absolute",
        left: 10,
        padding: 10,
        height: 700,
        width: 200,
    },
    rightArrow: {
        position: "absolute",
        left: 150,
        padding: 10,
        height: 700,
        width: 200,
    },
    profileInfoGradient: {
        position: "absolute",
        bottom: 0,
        left: -5,
        right: -5,
        zIndex: 10,
    },
    profileInfoGradientContent: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignItems: "flex-start",
        paddingBottom: 70
    },
    userNameAge: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
    },
    verifyIcon:{
        marginLeft: 140,
        marginTop: 13,
      },
    section: { marginBottom: 10, backgroundColor: "none", borderRadius: 5 },
    sectionContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#000",
        borderRadius: 10,
        width: 350,
    },
    iconTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 5,
        left: 10,
        top: 8
    },
    sectionTitle: { fontSize: 20, fontWeight: "bold", color: "white", padding: 10, textAlign: "center" },
    sectionContent: { fontSize: 16, backgroundColor: "#222", color: "#b25776", padding: 20, borderRadius: 15, minHeight: 100 },
    chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 5, padding: 10, marginTop: -35, marginLeft: 30, marginBottom: -10 },
    chipContainer1: { flexDirection: "row", flexWrap: "wrap", gap: 5, padding: 10 },
    chip: { color: "white", padding: 8, borderRadius: 10 },
    gradientContainer: {
        minHeight: 40,
        minWidth: 100,
        width: 'auto',
        height: "auto",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    imageIndicatorContainer: {
        position: "absolute",
        top: 2,
        left: 2,
        right: 2,
        flexDirection: "row",
        zIndex: 40,
    },
    imageIndicatorLine: {
        height: 3,
        backgroundColor: "white",
        borderRadius: 2,
    },
    activeImageIndicatorLine: {
        backgroundColor: "#b25776",
    },
    horizontalLine: {
        height: 1,
        backgroundColor: "#333",
        width: "100%",
        marginVertical: 2,
    },
});

export default ProfileCard;