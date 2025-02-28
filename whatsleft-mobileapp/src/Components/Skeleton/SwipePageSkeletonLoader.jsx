import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

const SwipePageSkeletonLoader = () => {
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
      <View style={styles.topIndicators}>
                <Animated.View style={[styles.indicator, { opacity: pulseAnim }]} />
                <Animated.View style={[styles.indicator, { opacity: pulseAnim }]} />
                <Animated.View style={[styles.indicator, { opacity: pulseAnim }]} />
              </View>
      <Animated.View style={[styles.largeBox, { opacity: pulseAnim }]} />
      <Animated.View style={[styles.smallBox, { opacity: pulseAnim }]} />
      <View style={styles.listContainer}>
        <Animated.View style={[styles.listItem, { opacity: pulseAnim }]} />
        <Animated.View style={[styles.listItem, { opacity: pulseAnim }]} />
      </View>
      <View style={styles.iconRow}>
        <Animated.View style={[styles.icon, { opacity: pulseAnim }]} />
        <Animated.View style={[styles.icon, { opacity: pulseAnim }]} />
        <Animated.View style={[styles.icon, { opacity: pulseAnim }]} />
        <Animated.View style={[styles.icon, { opacity: pulseAnim }]} />
        <Animated.View style={[styles.icon, { opacity: pulseAnim }]} />
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
  topIndicators: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    top:10,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  indicator: {
    height: 4,
    width: "28%",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  largeBox: {
    width: "100%",
    height: 300,
    backgroundColor: "#222",
    borderRadius: 10,
    marginBottom: 10,
  },
  mediumBox: {
    width: "100%",
    height: 48,
    backgroundColor: "#222",
    borderRadius: 10,
    marginBottom: 10,
  },
  smallBox: {
    width: "100%",
    height: 32,
    backgroundColor: "#111",
    borderRadius: 10,
    marginBottom: 10,
  },
  listContainer: {
    width: "100%",
  },
  listItem: {
    width: "100%",
    height: 150,
    backgroundColor: "#111",
    borderRadius: 10,
    marginBottom: 10,
  },
  iconRow: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 600,
  },
  icon: {
    width: 50,
    height: 50,
    backgroundColor: "#111",
    borderRadius: 50,
    marginHorizontal: 10,
  },
});

export default SwipePageSkeletonLoader;
