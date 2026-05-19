import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import AdminScreen from './src/screens/AdminScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen name="Login" options={{ title: 'Iniciar sesión' }}>
              {(props) => <LoginScreen {...props} setUser={setUser} />}
            </Stack.Screen>
            <Stack.Screen name="Register" options={{ title: 'Registro' }} component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" options={{ title: 'Asistencia QR' }}>
              {(props) => <HomeScreen {...props} user={user} setUser={setUser} />}
            </Stack.Screen>
            <Stack.Screen name="Scanner" options={{ title: 'Escanear QR' }}>
              {(props) => <ScannerScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="History" options={{ title: 'Mi historial' }}>
              {(props) => <HistoryScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="Admin" options={{ title: 'Panel administrador' }} component={AdminScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
