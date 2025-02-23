import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux";
import { store } from "./src/Redux/slices/store";
import SignIn from "./src/Screens/SignIn";
import Signup from "./src/Screens/SignUp";
import SwipePage from "./src/Screens/SwipePage";
import ChatsPage from "./src/Screens/ChatsPage";
import ProfilePage from "./src/Screens/ProfilePage";
import SettingsPage from "./src/Screens/SettingsPage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs (Main App Navigation)
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Swipe") iconName = "fire";
          else if (route.name === "Chats") iconName = "comment-alt";
          else if (route.name === "Profile") iconName = "user";
          else if (route.name === "Settings") iconName = "cog";
          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#b25776",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "black", paddingTop: 5, height: 60 },
      })}
    >
      <Tab.Screen name="Swipe" component={SwipePage} />
      <Tab.Screen name="Chats" component={ChatsPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
      <Tab.Screen name="Settings" component={SettingsPage} />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // Check login state on app launch
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setIsLoggedIn(token ? true : false);
    };
    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) return null;

  return (
    <Provider store={store}>
      {" "}
      {/* ✅ Wrap with Provider */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isLoggedIn ? "MainApp" : "SignIn"}>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainApp"
            component={BottomTabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
