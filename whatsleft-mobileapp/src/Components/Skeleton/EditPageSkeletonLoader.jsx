import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

const EditPageSkeletonLoader = () => {
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
      {/* Header Bar */}
      <Animated.View style={[styles.header, { opacity: pulseAnim }]} />

      {/* Grid of Square Boxes */}
      <View style={styles.gridContainer}>
        {[...Array(9)].map((_, index) => (
          <Animated.View key={index} style={[styles.box, { opacity: pulseAnim }]} />
        ))}
      </View>

      {/* List of Rectangular Boxes */}
      <View style={styles.listContainer}>
        {[...Array(1)].map((_, index) => (
          <Animated.View key={index} style={[styles.listItem, { opacity: pulseAnim }]} />
        ))}
      </View>

      {/* Bottom Button */}
      <Animated.View style={[styles.button, { opacity: pulseAnim }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  header: {
    width: 320,
    height: 40,
    backgroundColor: "#222",
    borderRadius: 8,
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
  },
  box: {
    width: 100,
    height: 150,
    backgroundColor: "#111",
    borderRadius: 8,
    margin: 8,
  },
  listContainer: {
    width: "100%",
    paddingHorizontal: 16,
  },
  listItem: {
    marginTop:10,
    height: 100,
    backgroundColor: "#222",
    borderRadius: 8,
    marginBottom: 8,
  },
  button: {
    width: 160,
    height: 50,
    borderRadius: 8,
    marginTop: 16,
    position: "absolute",
    bottom: 10,
    left: "40%",
    transform: [{ translateX: -50 }],
    backgroundColor: "#111",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default EditPageSkeletonLoader;
