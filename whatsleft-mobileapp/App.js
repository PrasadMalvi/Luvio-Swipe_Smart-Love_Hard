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
import EditProfile from "./src/Screens/EditProfile";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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

        // ✅ Customize header design
        headerStyle: {
          backgroundColor: "#1a1a1a", // Change header background color
          height: 80,
        },
        headerTintColor: "#b25776", // Change text/icon color
        headerTitleStyle: {
          marginBottom: 10,
          fontSize: 25,
          fontWeight: "bold",
        },
      })}
    >
      <Tab.Screen
        name="Swipe"
        component={SwipePage}
        options={{ title: "WhatsLeft" }} // ✅ Custom header title
      />
      <Tab.Screen
        name="Chats"
        component={ChatsPage}
        options={{ title: "Conversations" }} // ✅ Custom header title
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{ title: "My Profile" }} // ✅ Custom header title
      />
      <Tab.Screen
        name="Settings"
        component={SettingsPage}
        options={{ title: "Preferences" }} // ✅ Custom header title
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

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
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isLoggedIn ? "MainApp" : "SignIn"}>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Signup" options={{ headerShown: false }}>
            {(props) => <Signup {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
          <Stack.Screen
            name="MainApp"
            component={BottomTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
