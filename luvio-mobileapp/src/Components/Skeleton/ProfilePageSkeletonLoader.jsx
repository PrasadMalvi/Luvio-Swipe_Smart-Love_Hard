import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

const ProfilePageSkeletonLoader = () => {
  const pulseAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      {/* Large Animated Box */}
      <View style={styles.relative}>
        <View style={styles.topIndicators}>
          <Animated.View style={[styles.indicator, { opacity: pulseAnim }]} />
          <Animated.View style={[styles.indicator, { opacity: pulseAnim }]} />
          <Animated.View style={[styles.indicator, { opacity: pulseAnim }]} />
        </View>
        <Animated.View style={[styles.largeBox, { opacity: pulseAnim }]} />
        <View style={styles.absoluteBottom}>
          <Animated.View style={[styles.footerBox, { opacity: pulseAnim }]} />
        </View>
      </View>

      {/* Multiple Info Sections */}
      {[...Array(4)].map((_, index) => (
        <View key={index} style={styles.infoBox}>
          <View style={styles.infoHeader}>
            <Animated.View style={[styles.circle, { opacity: pulseAnim }]} />
            <Animated.View
              style={[styles.smallBar, { opacity: pulseAnim }]}
            />
          </View>
          <Animated.View style={[styles.largeBar, { opacity: pulseAnim }]} />
        </View>
      ))}

      {/* Floating Action Button */}
      <View style={styles.floatingButton}>
        <Animated.View style={[styles.circle, { opacity: pulseAnim }]} />
        <Animated.View
          style={[styles.smallBar, { opacity: pulseAnim }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
    alignItems: "center",
    padding: 5,
  },
  relative: {
    position: "relative",
    width: 350,
    height: 380,
    marginBottom: 16,
  },
  topIndicators: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  indicator: {
    height: 4,
    width: "32%",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  largeBox: {
    width: "100%",
    height: "100%",
    backgroundColor: "#222",
    borderRadius: 10,
  },
  absoluteBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  footerBox: {
    height: 24,
    backgroundColor: "#111",
    borderRadius: 6,
  },
  infoBox: {
    width: 320,
    padding: 12,
    backgroundColor: "#222",
    borderRadius: 10,
    marginBottom: 12,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  circle: {
    width: 20,
    height: 20,
    backgroundColor: "#111",
    borderRadius: 50,
    marginRight: 10,
  },
  smallBar: {
    height: 16,
    backgroundColor: "#111",
    borderRadius: 6,
    width: "50%",
  },
  largeBar: {
    height: 16,
    backgroundColor: "#111",
    borderRadius: 6,
    width: "75%",
  },
  floatingButton: {
    position: "absolute",
    bottom: 16,
    left: "40%",
    transform: [{ translateX: -50 }],
    backgroundColor: "#222",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ProfilePageSkeletonLoader;
