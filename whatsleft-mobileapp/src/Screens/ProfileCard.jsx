import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon6 from 'react-native-vector-icons/FontAwesome6';

const ProfileCard = ({ user, onClose }) => {
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
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <Image source={{ uri: user.profilePic }} style={styles.profilePic} />
        <Text style={styles.name}>{user.name}</Text>
        <ScrollView style={styles.detailsContainer}>
          {Object.entries(user).map(([key, value]) => {
            if (
              value &&
              typeof value === "string" &&
              key !== "id" &&
              key !== "name" &&
              key !== "profilePic" &&
              key !== "lastMessage" &&
              key !== "lastSent"
            ) {
              const iconName = getIconName(key);
              return (
                <View key={key} style={styles.detailRow}>
                  <Icon6 name={iconName} size={18} color="#000" style={styles.detailIcon} />
                  <Text style={styles.detailText}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                  </Text>
                </View>
              );
            }
            return null;
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsContainer: {
    width: '100%',
    maxHeight: 300,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailIcon: {
    marginRight: 10,
  },
  detailText: {
    fontSize: 16,
  },
});

export default ProfileCard;