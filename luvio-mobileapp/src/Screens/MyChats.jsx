import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Image, Modal, Alert, Platform, ActionSheetIOS } from 'react-native';
import axiosInstance, { setAuthToken } from '../Redux/slices/axiosSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import ProfileCard from '../Components/Profiles/ProfileCard';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { io } from 'socket.io-client';
import moment from 'moment';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const MyChats = ({ route, navigation }) => {
  const { user } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
  const [socket, setSocket] = useState(null);
  const [initialMatch, setInitialMatch] = useState(true);
  const scrollViewRef = useRef();
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [renderTrigger, setRenderTrigger] = useState(false);

  useEffect(() => {
    if (chatId) {
      const newSocket = io('http://localhost:5050', { transports: ['websocket'] });
    setSocket(newSocket);
    newSocket.on('connect', () => {
      console.log('Socket connected successfully (WebSocket)');
    });
    newSocket.on('error', (error) => {
      console.log('Socket connection error:', error);
    });
    newSocket.on('connect_error', (error) => {
      console.log('Socket connect_error:', error);
    });
      newSocket.emit('joinChat', user.id);
      newSocket.emit('joinRoom', chatId);
      newSocket.on('newMessage', (message) => {
        if (message.sender !== user.id) {
          setMessages((prevMessages) => [...prevMessages, message]);
          setInitialMatch(false);
        } else {
          console.log("Message from self, not updating UI");
        }
      });
      return () => {
        newSocket.disconnect();
      };
    }
  }, [user.id, chatId]);
  
  useEffect(() => {
    fetchChatAndMessages();
  }, [user]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);


  const fetchChatAndMessages = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const url = `/Chat/getChat/${user._id}`;
      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.messages) {
        setMessages(response.data.messages);
        setInitialMatch(response.data.messages.length === 0);
        setChatId(response.data.chatId);
        setLoading(false);
      } else {
        setInitialMatch(true);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching chat and messages:', error);
      setInitialMatch(true);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() && chatId) {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setAuthToken(token);
        const dataToSend = {
          content: newMessage,
          chatId: chatId,
        };
        await axiosInstance.post(`/Chat/sendMessage/${user._id}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message', error);
      }
    }
  };

  const handleSendMessage = () => {
    if (chatId) {
      sendMessage();
    } else {
      console.log("Chat ID is not available yet.");
    }
  };

  const calculateTimeDifference = (matchedAt) => {
    if (!matchedAt) return 'Match time not available';
    const matchDate = new Date(matchedAt);
    if (isNaN(matchDate.getTime())) return 'Invalid match time';
    const now = new Date();
    const diffInMilliseconds = now - matchDate;
    const diffInSeconds = diffInMilliseconds / 1000;
    const diffInMinutes = diffInSeconds / 60;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
        return 'just now';
    } else if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)} minutes ago`;
    } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInDays === 1) {
        return 'Yesterday';
    } else if (diffInDays === 2) {
        return '2 days ago';
    } else {
        return moment(matchDate).format('MMMM DD, YYYY');
    }
};

  const startVideoCall = () => {
    Alert.alert('Video Call', 'Video call functionality not implemented yet.');
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Take Photo', 'Choose from Library', 'Cancel'],
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            launchCamera(options, handleImageResponse);
          } else if (buttonIndex === 1) {
            launchImageLibrary(options, handleImageResponse);
          }
        }
      );
    } else {
      Alert.alert(
        'Choose an Option',
        'Select an option to send an image.',
        [
          { text: 'Take Photo', onPress: () => launchCamera(options, handleImageResponse) },
          { text: 'Choose from Library', onPress: () => launchImageLibrary(options, handleImageResponse) },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: true }
      );
    }
  };

  const handleImageResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else {
      const source = { uri: response.assets[0].uri };
      console.log('Selected image:', source);
    }
  };

  const handleMoreOptions = (option) => {
    setMoreOptionsVisible(false);
    Alert.alert('Option Selected', `${option} functionality not implemented yet.`);
  };

  const isSameDay = (date1, date2) => {
    return moment(date1).isSame(date2, 'day');
  };

  const formatMessageDate = (date) => {
    if (moment().isSame(date, 'day')) {
      return 'Today';
    } else if (moment().subtract(1, 'days').isSame(date, 'day')) {
      return 'Yesterday';
    } else {
      return moment(date).format('MMMM DD, YYYY');
    }
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
  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="#b25776" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedProfile(user)}>
                    <Image source={{ uri: fixImageUrl(user.profilePictures[0]) }} style={styles.profilePic} />
                </TouchableOpacity>
                <Text style={styles.userName}>{user.name}</Text>
                <View style={styles.verifyIcon}>
                    <MaterialIcons name="verified" size={22} color="#b25776" />
                </View>
                <View style={styles.rightHeaderButtons}>
                    <TouchableOpacity onPress={startVideoCall}>
                        <AntDesign name="videocamera" size={24} color="#b25776" style={styles.videoCamera} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setMoreOptionsVisible(true)}>
                        <Entypo name="dots-three-vertical" size={24} color="#b25776" style={styles.moreOption} />
                    </TouchableOpacity>
                </View>
            </View>
      <ScrollView key={renderTrigger.toString()} // Force re-render on trigger change
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {initialMatch && messages.length === 0 ? (
          <View style={styles.emptyChatContainer}>
          <Text style={styles.emptyChatText}>You matched with {user.name} 😍</Text>
          {user.matchedAt && ( // Check if matchedAt exists
              <Text style={styles.emptyChatTime}>{calculateTimeDifference(user.matchedAt)}</Text>
          )}
          <TouchableOpacity onPress={() => setSelectedProfile(user)}>
          <Image source={{ uri: fixImageUrl(user.profilePictures[0]) }} style={styles.emptyChatPic} />
          </TouchableOpacity>
          <Text style={styles.emptyChatText}>Start Conversation and</Text>
          <Text style={styles.emptyChatText}>plan for a Date ❤️!</Text>
      </View>
        ) : (
          messages.reduce((acc, message, index, array) => {
            const messageDate = moment(message.createdAt);
            const prevMessage = array[index - 1];
            const showDate = !prevMessage || !isSameDay(messageDate, moment(prevMessage.createdAt));

            if (showDate) {
              acc.push(
                <Text key={`date-${messageDate.format()}`} style={styles.dateSeparator}>
                  {formatMessageDate(messageDate)}
                </Text>
              );
            }

            acc.push(
              <View
                  key={message._id} // Use a unique key
                  style={[
                      styles.message,
                      message.sender === user.id ? styles.receivedMessage : styles.sentMessage,
                  ]}
              >
                <Text style={styles.messageText}>{message.content}</Text>
                <Text style={styles.messageTime}>
                  {moment(message.createdAt).format('h:mm a')}
                </Text>
              </View>
            );
            return acc;
          }, [])
        )}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={openImagePicker}>
          <AntDesign name="camera" size={30} color="#b25776" style={styles.camera} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          editable={!loading}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={loading || !chatId}
        >
          <FontAwesome5 name="paper-plane" size={24} color="#b25776" />
        </TouchableOpacity>

        <Modal visible={moreOptionsVisible} transparent animationType="slide">
    <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => handleMoreOptions('Unmatch')} style={styles.modalOption}>
                <View style={styles.optionRow}>
                    <MaterialIcons name="cancel" size={30} color="#b25776" />
                    <View style={styles.textContainer}>
                        <Text style={styles.modalOptionText}>Unmatch With {user.name}</Text>
                        <Text style={styles.optionText}>No longer interested? Umatch them from your Matches...</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMoreOptions('Block')} style={styles.modalOption}>
                <View style={styles.optionRow}>
                    <MaterialIcons name="block" size={30} color="#777" />
                    <View style={styles.textContainer}>
                        <Text style={styles.modalOptionText}>Block {user.name}</Text>
                        <Text style={styles.optionText}>You wont be able to see them, and they wont be able to see you.</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMoreOptions('Report')} style={styles.modalOption}>
                <View style={styles.optionRow}>
                    <MaterialIcons name="report" size={30} color="red" />
                    <View style={styles.textContainer}>
                        <Text style={styles.modalOptionText}>Report {user.name}</Text>
                        <Text style={styles.optionText}>Dont worry - We wont tell {user.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMoreOptionsVisible(false)} style={styles.modalOption}>
                <View style={styles.optionRow1}>
                    <MaterialIcons name="close" size={30} color="red" />
                    <Text style={styles.modalOptionText}>Cancel</Text>                 
                </View>
            </TouchableOpacity>
        </View>
    </View>
</Modal>
      </View>

      {selectedProfile && (
        <ProfileCard user={selectedProfile} onClose={() => setSelectedProfile(null)} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginTop: 30,
    justifyContent: 'space-between',
},
rightHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
},
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: -50,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    marginLeft: -50,

  },
  verifyIcon: {
    marginLeft: -50,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  message: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  sentMessage: {
    backgroundColor: '#b25776',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#333',
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageText: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    color: '#fff',
  },
  sendButton: {
    padding: 10,
  },
  videoCamera: {
    padding: 10,
    marginLeft: 10,
  },
  moreOption: {
    padding: 10,
    marginLeft: -10,
    marginRight: -10,
  },
  camera: {
    padding: 10,
  },
  emptyChatContainer: {
    paddingTop: 120,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyChatPic: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
    borderWidth:2 ,
    borderColor:"#b25776"
  },
  emptyChatText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  emptyChatTime: {
    color: 'gray',
    fontSize: 14,
    marginBottom:20
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
},
optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
},
optionRow1: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent:"center"
},
modalOptionText: {
    color: '#fff',
    fontSize: 20,
},
optionText: {
    color: '#888',
    fontSize: 15,
},
textContainer: {
    flex: 1, // Allow the text container to take up remaining space
},
  dateSeparator: {
    color: '#888',
    textAlign: 'center',
    paddingVertical: 10,
  },
  messageTime: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
});

export default MyChats;