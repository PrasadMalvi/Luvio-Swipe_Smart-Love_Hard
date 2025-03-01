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

export default function ChatsPage() {
  const [searchText, setSearchText] = useState('');
  const [matchedWithoutConversation, setMatchedWithoutConversation] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    fetchChatData();
  }, []);

  const fetchChatData = async () => {
    // Replace with your API calls to fetch data
    try {
      const token = await AsyncStorage.getItem("authToken");
      setAuthToken(token);
      const response = await axiosInstance.get('/YourChatDataEndpoint', { // Replace with your API endpoint
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        // Assume API response has:
        // - usersWithoutConversation (array of users)
        // - usersWithConversation (array of users with conversation history)
        setMatchedWithoutConversation(response.data.usersWithoutConversation);
        setConversationHistory(response.data.usersWithConversation);
      } else {
        console.error('Failed to fetch chat data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching chat data:', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 2% - Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* 10% - Matched Profiles (No Conversation) */}
      <ScrollView horizontal style={styles.matchedProfiles}>
        {matchedWithoutConversation.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.profileItem}
            onPress={() => setSelectedProfile(user)}
          >
            <Image source={{ uri: user.profilePic[0] }} style={styles.profilePic} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 78% - Conversation History */}
      <ScrollView style={styles.conversationHistory}>
        {conversationHistory.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.conversationItem}
            onPress={() => setSelectedProfile(user)}
          >
            <Image source={{ uri: user.profilePic[0] }} style={styles.conversationPic} />
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

// ... (styles)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: '2%',
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 10,
    padding: 8,
    borderRadius: 8,
  },
  matchedProfiles: {
    height: '10%',
    padding: 10,
  },
  profileItem: {
    alignItems: 'center',
    marginRight: 10,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  conversationHistory: {
    height: '78%',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
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