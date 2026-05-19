import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { API_URL } from '../config/api';

export default function HistoryScreen({ user }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/asistencias/usuario/${user.id}`)
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  const eliminarHistorial = async (id) => {
  Alert.alert(
    'Eliminar registro',
    '¿Deseas eliminar este historial?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/api/asistencias/${id}`, {
              method: 'DELETE',
            });

            if (res.ok) {
              setItems(items.filter((item) => item.id !== id));
            } else {
              Alert.alert('Error', 'No se pudo eliminar');
            }
          } catch (error) {
            Alert.alert('Error', 'Error de conexión');
          }
        },
      },
    ]
  );
};

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.empty}>No hay asistencias registradas.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>
            El estudiante {item.nombre} está registrado
            </Text>
            
            <Text>Hora: {item.hora.split('.')[0]}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => eliminarHistorial(item.id)}>
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f7fb' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 10 },
  date: { fontWeight: 'bold', fontSize: 16 },
  empty: { textAlign: 'center', marginTop: 30, color: '#555' },
  deleteButton: { marginTop: 10, backgroundColor: '#dc2626', padding: 10, borderRadius: 8,  alignItems: 'center' },
  deleteText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});
