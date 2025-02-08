import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"; // Correct import
import { useNavigation } from "@react-navigation/native";

const FooterMenu = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("MallParkingScreen")}
      >
        <FontAwesome5
          name="building"
          color={"#096c90"}
          style={styles.iconStyle}
        />
        <Text style={styles.buttonText}>Mall Park</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("FastTag")}>
        <FontAwesome5 name="road" color={"#096c90"} style={styles.iconStyle} />
        <Text style={styles.buttonText}>Fastag</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("BookingScreen")}>
        <FontAwesome5
          name="calendar-plus"
          color={"#096c90"}
          style={styles.iconStyle}
        />
        <Text style={styles.buttonText}>Advance Book</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#0a1f29",
    width: 330,
    height: 60,
    borderRadius: 15,
    marginTop: 10,
  },
  iconStyle: {
    marginBottom: 3,
    alignSelf: "center",
    fontSize: 20,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "#096c90",
  },
});

export default FooterMenu;
