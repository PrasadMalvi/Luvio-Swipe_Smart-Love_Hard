import React from "react";
import { View, StyleSheet } from "react-native";

const EmptyChatSkeletonLoader = () => {
  return (
    <View style={styles.container}>
      {[...Array(4)].map((_, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.avatar} />
          <View style={styles.textContainer}>
            <View style={styles.textShort} />
            <View style={styles.textLong} />
          </View>
          <View style={styles.smallBox} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111",
    padding: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    paddingVertical: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 45,
    backgroundColor: "#222",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  textShort: {
    width: 80,
    height: 15,
    backgroundColor: "#222",
    marginBottom: 5,
    borderRadius: 4,
  },
  textLong: {
    width: 120,
    height: 20,
    backgroundColor: "#222",
    borderRadius: 4,
  },
  smallBox: {
    width: 60,
    height: 15,
    backgroundColor: "#222",
    borderRadius: 4,
    marginTop:-25
  },
});

export default EmptyChatSkeletonLoader;
