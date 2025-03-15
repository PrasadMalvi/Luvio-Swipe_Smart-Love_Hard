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
import MyChats from "./src/Components/Chats/MyChats";
import ExplorePage from "./src/Screens/ExplorePage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FilterModal from "./src/Components/Swipe/FilterModal";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterPreferences, setFilterPreferences] = useState({});
  return (
    <>
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(filters) => setFilterPreferences(filters)}
      />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            let IconComponent = FontAwesome5;
            if (route.name === "Swipe") iconName = "fire";
            else if (route.name === "Chats") iconName = "comment-alt";
            else if (route.name === "Profile") iconName = "user";
            else if (route.name === "Settings") iconName = "cog";
            else if (route.name === "Explore") {
              iconName = "near-me";
              IconComponent = MaterialIcons;
            }
            return <IconComponent name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#b25776",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "black",
            paddingTop: 5,
            height: 60,
            borderTopWidth: 0.17,
          },
          tabBarHideOnKeyboard: true,
          headerStyle: {
            backgroundColor: "#1a1a1a",
            height: 80,
          },
          headerTintColor: "#b25776",
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
          options={{
            headerTitle: () => (
              <Image
                source={require("./src/Components/assets/SMLogo.png")}
                style={{
                  width: 120,
                  height: 40,
                  resizeMode: "contain",
                  marginLeft: -30,
                }}
              />
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => setFilterVisible(true)}
                style={{ marginRight: 15 }}
              >
                <Ionicons name="options-sharp" size={30} color="#b25776" />
              </TouchableOpacity>
            ),
          }}
        />

        <Tab.Screen
          name="Explore"
          component={ExplorePage}
          options={{ title: "Explore" }}
        />
        <Tab.Screen
          name="Chats"
          component={ChatsPage}
          options={{ title: "Messages" }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfilePage}
          options={{ title: "My Profile" }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsPage}
          options={{ title: "Settings" }}
        />
      </Tab.Navigator>
    </>
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
          <Stack.Screen
            name="MyChats"
            component={MyChats}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
