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
import ProfileCard from '../Components/Profiles/ProfileCard';
import axiosInstance, { setAuthToken } from "../Redux/slices/axiosSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import EmptyChatSkeletonLoader from '../Components/Chats/EmptyChatSkeletonLoader';

export default function ChatsPage({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [matchedWithoutConversation, setMatchedWithoutConversation] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Recent");
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      setAuthToken(token);
      const response = await axiosInstance.get('/Chat/getMyChats', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        setConversationHistory(response.data.chats);
      } else {
        console.error('Failed to fetch conversation history:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching conversation history', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `<span class="math-inline">\{hours\}\:</span>{minutes}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  const fixImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400";
    if (url.startsWith("file:///")) {
      return url;
    }
    if (url.startsWith("uploads\\") || url.startsWith("uploads/")) {
      return `http://192.168.42.228:5050/${url.replace(/\\/g, "/")}`;
    }
    return url;
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (conversationHistory.length === 0 && matchedWithoutConversation.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noChatsContainer}>
          <Text style={styles.noChatsText}>No chats available.</Text>
          <Text style={styles.noChatsText}>Start swiping and matching!</Text>
          <TouchableOpacity
            style={styles.goToSwipeButton}
            onPress={() => navigation.navigate('Swipe')}
          >
            <Text style={styles.goToSwipeButtonText}>Go to Swipe Page</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            onPress={() => navigation.navigate('MyChats', { user: { ...user, matchedAt: user.matchedAt } })}
          >
            <Image source={{ uri: fixImageUrl(user.profilePictures[0]) }} style={styles.profilePic} />
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

        {conversationHistory.length > 0 ? (
          conversationHistory.map((chat) => {
            const otherUser = chat.participants.find(participant => participant._id !== chat.lastMessage.sender);

            return (
              <TouchableOpacity
                key={chat._id}
                style={styles.conversationItem}
                onPress={() => navigation.navigate('MyChats', { user: otherUser })}
              >
                <Image source={{ uri: otherUser.profilePictures[0] }} style={styles.conversationPic} />
                <View style={styles.conversationDetails}>
                  <Text style={styles.conversationName}>{otherUser.name}</Text>
                  <Text style={styles.lastMessage}>{chat.lastMessage.content}</Text>
                  <View style={styles.timeDateContainer}>
                    <Text style={styles.time}>{formatTime(chat.lastMessage.createdAt)}</Text>
                    <Text style={styles.date}>{formatDate(chat.lastMessage.createdAt)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
         <EmptyChatSkeletonLoader />
        )}
      </ScrollView>

      {selectedProfile && (<ProfileCard user={selectedProfile} onClose={() => setSelectedProfile(null)} />
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
  noChatsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChatsText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  goToSwipeButton: {
    backgroundColor: '#b25776',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  goToSwipeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginTop: '50%'
  },
});