import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const MatchedCard = ({
    myProfilePic,
    matchedUserProfilePic,
    onProfilePress,
    onClose,
    onConversationStart,
    matchedUser
}) => {


    const fixImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400"; // Placeholder for missing URLs

    if (url.startsWith("file:///")) {
        return url; // Return as is for local file URLs
    }

    if (url.startsWith("uploads\\") || url.startsWith("uploads/")) {
        // Construct the full URL for server images
        return `http://192.168.0.100:5050/${url.replace(/\\/g, "/")}`;
    }
    return url; // Return as is for valid HTTP/HTTPS URLs
};





    return (
        <View style={styles.overlay}>
            <LinearGradient colors={["#b25776", "#000"]} style={styles.card}>
                <Text style={styles.title}>💖 It's a Match! 💖</Text>
                <DotLottieReact
      src="https://lottie.host/750f00ae-4787-478e-bd77-a86e35fdfa4b/uoqUNu7K7q.lottie"
      loop
      autoplay
    />
                <Text style={styles.subtitle}>Start a conversation now!</Text>
                <Text style={styles.subtitle}>Say Hello to "{matchedUser.name}"</Text>

                <View style={styles.profilePicsContainer}>
                    <TouchableOpacity onPress={() => onProfilePress("Profile")}>
                        <Image source={{ uri: fixImageUrl(myProfilePic) }} style={[styles.profilePic, styles.leftPic]} />
                    </TouchableOpacity>
                    {matchedUserProfilePic ? (
                        <TouchableOpacity onPress={() => onProfilePress("matchedProfile")}>
                            <Image
                                source={{ uri: fixImageUrl(matchedUserProfilePic) }}
                                style={[styles.profilePic, styles.glow, styles.rightPic]}
                            />
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.errorText}>No image found</Text>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.chatButton} onPress={onConversationStart}>
                        <LinearGradient colors={["#333", "#b25776"]} style={styles.gradientButton}>
                            <Text style={styles.buttonText}>💬 Start Conversation</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.gradientCloseButton}>❌</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
  errorText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },
  card: {
    width: "95%",
    height:450,
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  profilePicsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    marginTop:10

  },
  profilePic: {
    width: 140,
    height: 200,
    borderRadius: 25,
    marginHorizontal: -18,
    borderWidth: 1.5,
    borderColor: "#000",
  },
  leftPic: {
    transform: [{ rotate: "-8deg" }],
    left: -30,
    zIndex: 1, 
  },
  rightPic: {
    transform: [{ rotate: "8deg" }],
    right: -30,
    zIndex: 2, 
  },
  glow: {
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  buttonContainer: {
    flexDirection: "col",
    justifyContent: "center",
  },
  chatButton: {
    marginRight: 10,
  },
  closeButton: {
    marginLeft: 10,
  },
  gradientButton: {
    padding: 12,
    borderRadius: 10,
    width: 240,
    alignItems: "center",
    marginLeft:210,
    marginTop:10
  },
  gradientCloseButton:{
    padding: 12,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
    marginTop:-438,
    marginLeft:450
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MatchedCard;
