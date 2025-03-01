// ChatsPage.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import ProfileCard from './ProfileCard';
import axiosInstance, { setAuthToken } from "../Redux/slices/axiosSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function ChatsPage({ navigation }) { // Receive navigation prop
  const [searchText, setSearchText] = useState('');
  const [matchedWithoutConversation, setMatchedWithoutConversation] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Recent");

  const filterOptions = ['Recent', 'Nearby', 'Unread'];

  const handleFilterClick = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  const handleOptionSelect = (option) => {
    setSelectedFilter(option);
    setShowFilterOptions(false);
    console.log(`Selected filter: ${option}`);
  };

  useEffect(() => {
    fetchMatchedUsers();
  }, []);

  const fetchMatchedUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      setAuthToken(token);
      const response = await axiosInstance.get('/Swipe/getMatchedUsers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        const matchedUsers = response.data.matchedUsers;
        const usersWithConversation = matchedUsers.filter(user => user.hasConversation);
        const usersWithoutConversation = matchedUsers.filter(user => !user.hasConversation);

        setMatchedWithoutConversation(usersWithoutConversation);
        setConversationHistory(usersWithConversation);
      } else {
        console.error('Failed to fetch matched users...:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching matched users', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `<span class="math-inline">\{hours\}\:</span>{minutes}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchInput}>
        <MaterialIcons name="person-search" size={24} color="#b25776" />
        <TextInput style={styles.textInput}
          placeholder="Search about your matches......."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={"#b25776"}
        />
      </View>

      <Text style={styles.title1}>New Matches</Text>
      <ScrollView horizontal style={styles.matchedProfiles}>
        <View style={styles.dummyPicCard}>
          <FontAwesome5 name="hand-holding-heart" size={24} color="#b25776" style={styles.countText} />
        </View>

        {matchedWithoutConversation.map((user) => (
          <TouchableOpacity
            key={user._id}
            style={styles.profileItem}
            onPress={() => navigation.navigate('MyChats', { user })} // Navigate to MyChats
          >
            <Image source={{ uri: user.profilePictures[0] }} style={styles.profilePic} />
          </TouchableOpacity>
        ))}
        <View style={styles.dummyPicCard1}></View>
        <View style={styles.dummyPicCard1}></View>
        <View style={styles.dummyPicCard1}></View>
      </ScrollView>

      <ScrollView style={styles.conversationHistory}>
        <Text style={styles.title}>Your Conversations</Text>

        <View style={styles.chatheader}>
          {selectedFilter && (
            <Text style={styles.selectedFilterText}>{selectedFilter}</Text>
          )}
          <TouchableOpacity onPress={handleFilterClick}>
            <FontAwesome name="filter" size={18} color="#b25776" />
          </TouchableOpacity>

          {showFilterOptions && (
            <View style={styles.filterOptionsContainer}>
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.filterOption}
                  onPress={() => handleOptionSelect(option)}
                >
                  <Text></Text>
                  <Text style={styles.filterOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {conversationHistory.map((user) => (
          <TouchableOpacity
            key={user._id}
            style={styles.conversationItem}
            onPress={() => setSelectedProfile(user)}
          >
            <Image source={{ uri: user.profilePictures[0] }} style={styles.conversationPic} />
            <View style={styles.conversationDetails}>
              <Text style={styles.conversationName}>{user.name}</Text>
              <Text style={styles.lastMessage}>{user.lastMessage}</Text>
              <View style={styles.timeDateContainer}>
                <Text style={styles.time}>{formatTime(user.lastSent)}</Text>
                <Text style={styles.date}>{formatDate(user.lastSent)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedProfile && (
        <ProfileCard user={selectedProfile} onClose={() => setSelectedProfile(null)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    color: "#b25776",
    margin: 10,
    padding: 8,
    borderRadius: 8,
    height: 50,
  },
  textInput: {
    flex: 1,
    color: "#b25776",
    paddingLeft: 5,
    borderWidth: 0,
    paddingTop: 15,
    height: 50,
  },
  title: {
    color: "#fff",
    fontSize: 17,
  },
  title1: {
    color: "#fff",
    fontSize: 17,
    marginLeft: 10,
  },
  dummyPicCard: {
    borderRadius: 10,
    marginBottom: 5,
    width: 65,
    height: 82,
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "#333",
  },
  countText: {
    textAlign: "center",
    color: "#b25776",
    marginTop: 30,
  },
  dummyPicCard1: {
    borderRadius: 10,
    marginBottom: 5,
    width: 65,
    height: 82,
    backgroundColor: "#000",
    marginLeft: 10,
    borderWidth: 2,
    borderColor: "#222",
  },
  card: {
    width: 60,
    height: 85,
    borderRadius: 15,
  },
  matchedProfiles: {
    height: '15%',
    padding: 10,
    marginBottom: 10,
  },
  profileItem: {
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  profilePic: {
    width: 60,
    height: 80,
    borderRadius: 10,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: "#b25776",
  },
  conversationHistory: {
    height: '78%',
    padding: 10,
    marginTop: -8,
  },
  chatheader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
    position: 'relative',
    marginTop: -22,
  },
  selectedFilterText: {
    color: '#b25776',
    marginRight: 10,
    fontSize: 16,
  },
  filterOptionsContainer: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
  filterOption: {
    padding: 10,
  },
  filterOptionText: {
    color: '#333',
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  conversationPic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  conversationDetails: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 12,
    color: 'gray',
  },
  timeDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  time: {
    fontSize: 10,
    color: 'gray',
  },
  date: {
    fontSize: 10,
    color: 'gray',
  },
});