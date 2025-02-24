import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
import React from 'react';

export default function ChatsPage() {
  const chats = [
    { id: '1', name: 'Sophia', lastMessage: 'Hey, how are you?' },
    { id: '2', name: 'Jake', lastMessage: 'Let’s meet up soon!' },
    { id: '3', name: 'Olivia', lastMessage: 'Had a great time chatting!' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.chatItem}>
            <Text style={styles.chatName}>{item.name}</Text>
            <Text style={styles.chatMessage}>{item.lastMessage}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatMessage: {
    fontSize: 14,
    color: 'gray',
  },
});
