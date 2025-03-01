import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import axiosInstance, { setAuthToken } from '../Redux/slices/axiosSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import ProfileCard from './ProfileCard';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const MyChats = ({ route, navigation }) => {
    const { user } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      setAuthToken(token);
      const response = await axiosInstance.get(`/Chat/getMessages/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        setMessages(response.data.messages);
      } else {
        console.error('Failed to fetch messages:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching messages', error);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const token = await AsyncStorage.getItem("authToken");
        setAuthToken(token);
        const response = await axiosInstance.post(`/Chat/sendMessage/${user._id}`, {
          message: newMessage,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.success) {
          setNewMessage('');
          fetchMessages();
        } else {
          console.error('Failed to send message:', response.data.message);
        }
      } catch (error) {
        console.error('Error sending message', error);
      }
    }
  };

  const calculateTimeDifference = (matchTime) => {
    if (!matchTime) return '';
    const matchDate = new Date(matchTime);
    const now = new Date();
    const diffInDays = Math.floor((now - matchDate) / (1000 * 60 * 60 * 24));
    return diffInDays > 0 ? `${diffInDays} days` : 'less than a day';
  };
  const startVideoCall = () => {
    // Implement video call logic here (e.g., using react-native-webrtc)
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
      // Handle the selected image (e.g., upload it to your server)
      const source = { uri: response.assets[0].uri };
      console.log('Selected image:', source);
    }
  };

  const handleMoreOptions = (option) => {
    setMoreOptionsVisible(false);
    Alert.alert('Option Selected', `${option} functionality not implemented yet.`);
    // Implement logic for unmatch, block, report
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#b25776" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedProfile(user)}>
          <Image source={{ uri: user.profilePictures[0] }} style={styles.profilePic} />
        </TouchableOpacity>
        <Text style={styles.userName}>{user.name}</Text>
        <View style={styles.verifyIcon}>
          <MaterialIcons name="verified" size={22} color="#b25776" />
        </View>
        <TouchableOpacity onPress={startVideoCall}>
          <AntDesign name="videocamera" size={24} color="#b25776" style={styles.videoCamera} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMoreOptionsVisible(true)}>
          <Entypo name="dots-three-vertical" size={24} color="#b25776" style={styles.moreOption} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <View style={styles.emptyChatContainer}>
            <Text style={styles.emptyChatText}>
              You matched with {user.name} 😍
            </Text>
            {user.matchTime && (
              <Text style={styles.emptyChatTime}>
                {calculateTimeDifference(user.matchTime)} ago
              </Text>
            )}
            <Image source={{ uri: user.profilePictures[0] }} style={styles.emptyChatPic} />
            <Text style={styles.emptyChatText}>
              Start Conversation and
            </Text>
            <Text style={styles.emptyChatText}>
              plan for a Date ❤️!
            </Text>
          </View>
        ) : (
          messages.map((message) => (
            <View key={message._id} style={[
              styles.message,
              message.sender === user._id ? styles.receivedMessage : styles.sentMessage
            ]}>
              <Text style={styles.messageText}>{message.message}</Text>
            </View>
          ))
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
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <FontAwesome5 name="paper-plane" size={24} color="#b25776" />
        </TouchableOpacity>

      {/* More Options Modal */}
      <Modal visible={moreOptionsVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => handleMoreOptions('Unmatch')} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>Unmatch</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMoreOptions('Block')} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>Block</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMoreOptions('Report')} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>Report</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMoreOptionsVisible(false)} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>Cancel</Text>
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
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
  },
  verifyIcon: {
    marginLeft: 5,
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
  },
  receivedMessage: {
    backgroundColor: '#333',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
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
  },
  camera: {
    padding: 10,
  },
  emptyChatContainer: {
    paddingTop:200,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyChatPic: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 10,
  },
  emptyChatText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
},
emptyChatTime: {
  color: 'gray',
  fontSize: 14,
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
  modalOptionText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MyChats;