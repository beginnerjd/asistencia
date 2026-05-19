import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { API_URL } from '../config/api';

export default function AdminScreen() {
  const today = new Date().toISOString().slice(0, 10);
  const [fecha, setFecha] = useState(today);
  const [persona, setPersona] = useState('');
  const [items, setItems] = useState([]);

  const load = async () => {
    const url = `${API_URL}/api/asistencias?fecha=${fecha}&persona=${encodeURIComponent(persona)}`;
    const res = await fetch(url);
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  };

  useEffect(() => { load(); }, []);
  const eliminarAsistencia = async (id) => {
  try {
    await fetch(`${API_URL}/api/asistencias/${id}`, {
      method: 'DELETE',
    });

    load();

    Alert.alert('Éxito', 'Registro eliminado');
  } catch (error) {
    Alert.alert('Error', 'No se pudo eliminar');
  }
};
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} value={fecha} onChangeText={setFecha} placeholder="YYYY-MM-DD" />
      <TextInput style={styles.input} value={persona} onChangeText={setPersona} placeholder="Filtrar por nombre o código" />
      <TouchableOpacity style={styles.button} onPress={load}><Text style={styles.buttonText}>Filtrar</Text></TouchableOpacity>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.empty}>No hay registros.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nombre}</Text>
            <Text>Código: {item.codigo_estudiante}</Text>
            <Text>Fecha: {item.fecha.split('T')[0]}</Text>
            <Text>Hora: {item.hora.split('.')[0]}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => eliminarAsistencia(item.id)}>
              <Text style={styles.buttonText}>Eliminar registro</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f7fb' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#9333ea', padding: 13, borderRadius: 10, alignItems: 'center', marginBottom: 14 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 10 },
  name: { fontWeight: 'bold', fontSize: 16 },
  empty: { textAlign: 'center', marginTop: 30, color: '#555' },
  deleteButton: { backgroundColor: '#dc2626', padding: 10, borderRadius: 10, marginTop: 10}
});
