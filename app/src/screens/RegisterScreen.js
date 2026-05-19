import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { API_URL } from '../config/api';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ nombre: '', codigo_estudiante: '', documento_identidad: '', email: '' });
  const [qrCode, setQrCode] = useState('');

  const setValue = (key, value) => setForm({ ...form, [key]: value });

  const register = async () => {
    try {
      const res = await fetch(`${API_URL}/api/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rol: 'estudiante' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo registrar');
      setQrCode(data.usuario.qr_code);
      Alert.alert('Registro creado', 'Guarda este código QR para generar el carnet.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar usuario</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={form.nombre} onChangeText={(v) => setValue('nombre', v)} />
      <TextInput style={styles.input} placeholder="Código estudiante" value={form.codigo_estudiante} onChangeText={(v) => setValue('codigo_estudiante', v)} />
      <TextInput style={styles.input} placeholder="Documento" value={form.documento_identidad} onChangeText={(v) => setValue('documento_identidad', v)} />
      <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={(v) => setValue('email', v)} autoCapitalize="none" />
      <TouchableOpacity style={styles.button} onPress={register}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
      {qrCode ? <View style={styles.card}><Text style={styles.label}>Contenido para el QR:</Text><Text selectable style={styles.qr}>{qrCode}</Text></View> : null}
      <TouchableOpacity style={styles.link} onPress={() => navigation.goBack()}><Text style={styles.linkText}>Volver al login</Text></TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#f4f7fb', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#16a34a', padding: 15, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginTop: 18 },
  label: { fontWeight: 'bold', marginBottom: 8 },
  qr: { color: '#111827' },
  link: { alignItems: 'center', marginTop: 16 },
  linkText: { color: '#2563eb', fontWeight: 'bold' }
});
