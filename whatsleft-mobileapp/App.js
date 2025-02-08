import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SignIn from "./src/Screens/SignIn";
import Signup from "./src/Screens/SignUp";
import SwipePage from "./src/Screens/SwipePage";
import ChatsPage from "./src/Screens/ChatsPage";
import ProfilePage from "./src/Screens/ProfilePage";
import SettingsPage from "./src/Screens/SettingsPage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

// Stack for authentication (SignIn, Signup)
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator (Fixed Navbar)
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
        tabBarStyle: {
          backgroundColor: "black",
          paddingTop: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Swipe" component={SwipePage} />
      <Tab.Screen name="Chats" component={ChatsPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
      <Tab.Screen name="Settings" component={SettingsPage} />
    </Tab.Navigator>
  );
}

// Main App Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
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
  );
}
