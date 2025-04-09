import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Switch, TextInput, Modal, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import axiosInstance from "../Redux/slices/axiosSlice";

const SettingsScreen = ({ navigation }) => {
  const [user, setUser] = useState({ email: "", notifications: true, privacy: "Everyone" });
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const res = await axiosInstance.get("/Authentication/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.user) {
          setUser({
            email: res.data.user.email || "",
            notifications: res.data.user.notifications ?? true,
            privacy: res.data.user.privacy || "Everyone",
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchUserSettings();
  }, []);

  const toggleNotifications = async () => {
    const updatedNotifications = !user.notifications;
    setUser((prev) => ({ ...prev, notifications: updatedNotifications }));

    try {
      const token = await AsyncStorage.getItem("authToken");
      await axiosInstance.put(
        "/Authentication/updateSettings",
        { notifications: updatedNotifications },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error updating notifications:", error);
    }
  };

  const changePassword = async () => {
    if (!newPassword) return Alert.alert("Error", "Password cannot be empty");

    try {
      const token = await AsyncStorage.getItem("authToken");
      await axiosInstance.put(
        "/Authentication/changePassword",
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", "Password updated successfully");
      setModalVisible(false);
      setNewPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", "Failed to change password");
    }
  };

  const deleteAccount = async () => {
    Alert.alert("Confirm Deletion", "Are you sure you want to delete your account?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("authToken");
            await axiosInstance.delete("/Authentication/deleteAccount", {
              headers: { Authorization: `Bearer ${token}` },
            });
            await AsyncStorage.removeItem("authToken");
            navigation.replace("Login");
          } catch (error) {
            console.error("Error deleting account:", error);
            Alert.alert("Error", "Failed to delete account");
          }
        },
      },
    ]);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userId");
    navigation.replace("SignIn");
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: "#1a1a1a", flexGrow: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 10 }}>Settings</Text>

      {/* Account Settings */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "white", marginBottom: 10 }}>Account Settings</Text>

        {/* Email Display */}
        <Text style={{ color: "gray", marginBottom: 5 }}>Email: {user.email}</Text>

        {/* Change Password */}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ backgroundColor: "#b25776", padding: 10, borderRadius: 5 }}>
          <Text style={{ color: "white", textAlign: "center" }}>Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* Notification Settings */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "white", marginBottom: 10 }}>Notifications</Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ color: "white" }}>Enable Notifications</Text>
          <Switch value={user.notifications} onValueChange={toggleNotifications} />
        </View>
      </View>

      {/* Privacy Settings */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "white", marginBottom: 10 }}>Privacy</Text>
        <TouchableOpacity
          onPress={() => setUser((prev) => ({ ...prev, privacy: prev.privacy === "Everyone" ? "Friends Only" : "Everyone" }))}
          style={{ backgroundColor: "#b25776", padding: 10, borderRadius: 5 }}>
          <Text style={{ color: "white", textAlign: "center" }}>Profile Visibility: {user.privacy}</Text>
        </TouchableOpacity>
      </View>

      {/* Delete Account */}
      <TouchableOpacity onPress={deleteAccount} style={{ backgroundColor: "red", padding: 10, borderRadius: 5, marginBottom: 20 }}>
        <Text style={{ color: "white", textAlign: "center" }}>Delete Account</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity onPress={logout} style={{ backgroundColor: "gray", padding: 10, borderRadius: 5 }}>
        <Text style={{ color: "white", textAlign: "center" }}>Logout</Text>
      </TouchableOpacity>

      {/* Change Password Modal */}
      <Modal visible={modalVisible} transparent>
        <View style={{ backgroundColor: "rgba(0,0,0,0.8)", flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "#222", padding: 20, borderRadius: 10 }}>
            <Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>Change Password</Text>
            <TextInput
              style={{ backgroundColor: "#333", color: "white", padding: 10, borderRadius: 5, marginBottom: 10 }}
              placeholder="Enter new password"
              placeholderTextColor="gray"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={changePassword} style={{ backgroundColor: "#b25776", padding: 10, borderRadius: 5, marginBottom: 10 }}>
              <Text style={{ color: "white", textAlign: "center" }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ backgroundColor: "gray", padding: 10, borderRadius: 5 }}>
              <Text style={{ color: "white", textAlign: "center" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default SettingsScreen;
