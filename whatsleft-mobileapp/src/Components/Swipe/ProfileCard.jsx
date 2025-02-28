import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");

const ProfileCard = ({ user, onSwipe }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    if (user?.profilePictures?.length > currentImageIndex + 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <View style={styles.profileImageContainer}>
      <View style={styles.imageIndicatorContainer}>
        {user?.profilePictures?.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.imageIndicatorLine,
              idx === currentImageIndex && styles.activeImageIndicatorLine,
              { width: `${98 / user?.profilePictures?.length}%` },
            ]}
          />
        ))}
      </View>
      {user?.profilePictures?.length > 0 ? (
        <Image
          source={{
            uri: `http://192.168.0.101:5050/${user.profilePictures[
              currentImageIndex
            ].replace(/\\/g, "/")}`,
          }}
          style={styles.profileImage}
        />
      ) : (
        <Text style={styles.noImagesText}>No Images Available</Text>
      )}

      {currentImageIndex > 0 && (
        <TouchableOpacity
          onPress={handlePrevImage}
          style={styles.imageArrowLeft}
        />
      )}

      {user?.profilePictures?.length > currentImageIndex + 1 && (
        <TouchableOpacity
          onPress={handleNextImage}
          style={styles.imageArrowRight}
        />
      )}

      <View style={styles.profileInfoGradient}>
        <LinearGradient
          colors={["rgba(0,0,0,1)", "rgba(0,0,0,0.65)", "transparent"]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={styles.profileInfoGradientContent}
        >
          <Text style={styles.userNameAge}>
            {user?.name},{" "}
            {new Date().getFullYear() - new Date(user?.age).getFullYear()}
          </Text>
          <Text style={styles.userOccupation}>
            <Icon name="briefcase" size={20} />
            {user?.occupation || "Not specified"}
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.profileDetailsContainer}>
        {user?.aboutMe && (
          <Section title="About Me" icon="account-heart" text={user.aboutMe} />
        )}
        {user?.qualification && (
          <Section
            title="Qualification"
            icon="school"
            text={user.qualification}
          />
        )}
        {user?.location && (
          <Section title="Location" icon="map-marker" text={user.location} />
        )}
        {user?.height && (
          <Section title="Height" icon="human-male-height" text={user.height} />
        )}
        {user?.gender && (
          <Section
            title="Gender"
            icon="gender-male-female"
            text={user.gender}
          />
        )}
        {user?.relationshipPreference && (
          <Section
            title="Preferences"
            icon="heart-multiple"
            text={user.relationshipPreference}
          />
        )}
        {user?.lookingFor && (
          <Section
            title="Looking For"
            icon="account-search"
            text={user.lookingFor}
          />
        )}
        {user?.hobbies?.length > 0 && (
          <ChipsSection title="Hobbies" icon="palette" items={user.hobbies} />
        )}
        {user?.interests?.length > 0 && (
          <ChipsSection title="Interests" icon="star" items={user.interests} />
        )}
        {user?.zodiacSign && (
          <Section
            title="Zodiac Sign"
            icon="star-outline"
            text={user.zodiacSign}
          />
        )}
        {user?.sexualOrientation && (
          <Section
            title="Sexual Orientation"
            icon="gender-male-female"
            text={user.sexualOrientation}
          />
        )}
        {user?.familyPlans && (
          <Section
            title="Family Plans"
            icon="home-heart"
            text={user.familyPlans}
          />
        )}
        {user?.pet && <Section title="Pet" icon="paw" text={user.pet} />}
        {user?.drinking && (
          <Section
            title="Drinking"
            icon="glass-cocktail"
            text={user.drinking}
          />
        )}
        {user?.smoking && (
          <Section title="Smoking" icon="smoking" text={user.smoking} />
        )}
        {user?.workout && (
          <Section title="Workout" icon="dumbbell" text={user.workout} />
        )}
        {user?.sleepingHabits && (
          <Section
            title="Sleeping Habits"
            icon="bed"
            text={user.sleepingHabits}
          />
        )}
      </View>
    </View>
  );
};

const Section = ({ title, icon, text }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.iconTitleContainer}>
      <Icon name={icon} size={20} color="#c64d76" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.preferenceChipsContainer}>
      <View style={styles.preferenceChip}>
        <LinearGradient
          colors={["#c64d76", "rgba(178, 87, 118, 0.5)", "#111"]}
          style={styles.gradientContainer}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        >
          <Text style={styles.preferenceChipText}>{text}</Text>
        </LinearGradient>
      </View>
    </View>
  </View>
);

const ChipsSection = ({ title, icon, items }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.iconTitleContainer}>
      <Icon name={icon} size={20} color="#c64d76" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.preferenceChipsContainer}>
      {items.map((item, i) => (
        <View key={i} style={styles.preferenceChip}>
          <LinearGradient
            colors={["#c64d76", "rgba(178, 87, 118, 0.5)", "#111"]}
            style={styles.gradientContainer}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          >
            <Text style={styles.preferenceChipText}>{item}</Text>
          </LinearGradient>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  profileImageContainer: {
    width: width * 1.0,
    height: height * 0.8,
    position: "relative",
    marginTop: 5,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  noImagesText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    marginTop: "50%",
  },
  imageArrowLeft: {
    position: "absolute",
    left: 10,
    padding: 10,
    height: 700,
    width: 200,
  },
  imageArrowRight: {
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
    paddingBottom: -10,
  },
  userNameAge: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
  userOccupation: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
    paddingBottom: 40,
  },
  profileDetailsContainer: {
    width: width * 1.0,
    marginTop: 50,
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 10,
  },
  sectionContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 10,
  },
  sectionTitle: {
    color: "#b25776",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionText: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
  },
  preferenceChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    marginTop: 5,
  },
  preferenceChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 2,
  },
  preferenceChipText: {
    color: "white",
    fontSize: 14,
  },
  noProfilesText: {
    fontSize: 22,
    color: "white",
    marginTop: 100,
    textAlign: "center",
  },
  imageIndicatorContainer: {
    position: "absolute",
    top: 2,
    left: 2,
    right: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  gradientContainer: {
    minHeight: 40,
    minWidth: 100,
    width: "auto",
    height: "auto", // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  iconTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // Adds space between the icon and text
  },
});

export default ProfileCard;
