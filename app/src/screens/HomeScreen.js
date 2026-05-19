import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation, user, setUser }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola, {user.nombre}</Text>
      <Text style={styles.subtitle}>Rol: {user.rol}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Scanner')}>
        <Text style={styles.buttonText}>Registrar asistencia</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonAlt} onPress={() => navigation.navigate('History')}>
        <Text style={styles.buttonAltText}>Ver mi historial</Text>
      </TouchableOpacity>
      {user.rol === 'admin' ? (
        <TouchableOpacity style={styles.admin} onPress={() => navigation.navigate('Admin')}>
          <Text style={styles.buttonText}>Panel admin</Text>
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity style={styles.logout} onPress={() => setUser(null)}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f4f7fb' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { textAlign: 'center', marginBottom: 24, color: '#555' },
  button: { backgroundColor: '#2563eb', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  buttonAlt: { backgroundColor: '#fff', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#2563eb' },
  buttonAltText: { color: '#2563eb', fontWeight: 'bold' },
  admin: { backgroundColor: '#9333ea', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  logout: { alignItems: 'center', marginTop: 15 },
  logoutText: { color: '#dc2626', fontWeight: 'bold' }
});
