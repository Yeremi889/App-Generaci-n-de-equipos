import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button } from 'react-native';
import { Storage } from '../utils/storage';

export default function HomeScreen({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');

  // Cargar grupos al iniciar
  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    const data = await Storage.getGroups();
    setGroups(data);
  };

  const handleCreateGroup = async () => {
    if (newGroupName.trim().length > 0) {
      await Storage.saveGroup(newGroupName);
      setNewGroupName('');
      loadGroups(); // Refrescar lista
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Grupos</Text>
      
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder="Nombre del grupo (ej: Voley Lunes)"
          value={newGroupName}
          onChangeText={setNewGroupName}
        />
        <Button title="Crear" onPress={handleCreateGroup} />
      </View>

      <FlatList 
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.groupCard}
            onPress={() => navigation.navigate('PlayerList', { groupId: item.id, groupName: item.name })}
          >
            <Text style={styles.groupText}>{item.name}</Text>
            <Text style={styles.subText}>{item.players.length} jugadores</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, marginRight: 10, borderRadius: 5, backgroundColor: '#fff' },
  groupCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  groupText: { fontSize: 18, fontWeight: '500' },
  subText: { color: '#666', fontSize: 14 }
});