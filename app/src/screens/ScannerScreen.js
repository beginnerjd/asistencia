import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { API_URL } from '../config/api';

export default function ScannerScreen({ user, navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [message, setMessage] = useState('Escanea el QR del carnet');

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const handleBarcodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);
    try {
      const res = await fetch(`${API_URL}/api/asistencias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qr_code: data })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'QR inválido');
      setMessage(`${result.mensaje}: ${result.usuario.nombre} - ${result.asistencia.hora}`);
      Alert.alert('Registro exitoso', result.mensaje);
      
    } catch (error) {
      setMessage(error.message);
      Alert.alert('Error', error.message);
    }
  };

  if (!permission) return <Text style={styles.center}>Solicitando permiso...</Text>;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.center}>Necesitamos permiso para usar la cámara.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}><Text style={styles.buttonText}>Dar permiso</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={scanned ? undefined : handleBarcodeScanned} />
      <Text style={styles.message}>{message}</Text>
      {scanned ? <TouchableOpacity style={styles.button} onPress={() => { setScanned(false); setMessage('Escanea el QR del carnet'); }}><Text style={styles.buttonText}>Escanear otro</Text></TouchableOpacity> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827', padding: 20, justifyContent: 'center' },
  camera: { height: 360, borderRadius: 20, overflow: 'hidden' },
  message: { color: '#fff', fontSize: 18, textAlign: 'center', marginVertical: 20 },
  center: { textAlign: 'center', margin: 20, fontSize: 16 },
  button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
