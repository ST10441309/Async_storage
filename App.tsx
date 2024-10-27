import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function App() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [userCount, setUserCount] = useState<number>(0);

  const storeUsers = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Name and Email are required')
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email
    };

    try {
      const storedUsers = await AsyncStorage.getItem('@users');
      const usersArray = storedUsers ? JSON.parse(storedUsers) : [];
      usersArray.push(newUser);
      await AsyncStorage.setItem('@users', JSON.stringify(usersArray))

      setName('');
      setEmail('');
      Alert.alert('Success', 'User has been registered')
    } catch (error) {
      Alert.alert('Error', 'Failed to register user');
    }
  };

  const fetchUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('@users');
      const usersArray = storedUsers ? JSON.parse(storedUsers) : [];
      setUsers(usersArray);
      setUserCount(usersArray.length);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch users');
    }
  };

  const clearUsers = async () => {
    try {
      await AsyncStorage.removeItem('@users');
      setUsers([]);
      setUserCount(0);
    } catch (error) {
      Alert.alert('Error', 'Failed to remove users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return(
    <View style={styles.container}>
      <Text style={styles.header}>USER REGISTRATION</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableHighlight 
          style={[styles.button, styles.registerButton]}
          onPress={storeUsers}
          underlayColor="#45a049">
          <Text style={styles.buttonText}>Register</Text>
        </TouchableHighlight>

        <TouchableHighlight 
          style={[styles.button, styles.displayButton]}
          onPress={fetchUsers}
          underlayColor="#2196F3">
          <Text style={styles.buttonText}>Display Users</Text>
        </TouchableHighlight>

        <TouchableHighlight 
          style={[styles.button, styles.clearButton]}
          onPress={clearUsers}
          underlayColor="#d32f2f">
          <Text style={styles.buttonText}>Clear All Users</Text>
        </TouchableHighlight>
      </View>

      <Text style={styles.userCount}>Total Users: {userCount}</Text>
      
      <FlatList
        style={styles.userList}
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({item}: {item: User}) => (
          <View style={styles.userCard}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    fontSize: 16,
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
  },
  displayButton: {
    backgroundColor: '#2196F3',
  },
  clearButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userCount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  userList: {
    flex: 1,
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  separator: {
    height: 10,
  },
});