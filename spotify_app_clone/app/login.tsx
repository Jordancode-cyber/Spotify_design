import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ImageBackground } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';


const spotifylogo1 = require('../assets/images/Spotify_Full_Logo_RGB_Green.png');
  

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  async function handleLogin() {
    setError(null);
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    try {
      setLoading(true);
      
      // Call backend login API
      const response = await fetch('http://192.168.1.13:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'Success') {
        // Save user token and full user data
        const token = 'token-' + Date.now();
        await AsyncStorage.setItem('userToken', token);
        
        // Save complete user data from backend
        const user = {
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
        };
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        // Navigate to dashboard
        router.replace('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Connection error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      
      <ImageBackground source={require('../assets/images/my-fav-songs.jpg')}
        style={styles.absoluteFill} >
        <View style={styles.overlay}>
        </View>
      </ImageBackground>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <TouchableOpacity style={styles.back} onPress={() => router.push('/')}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>


        <View style={styles.header}>
          <Image source={spotifylogo1} style={styles.logo} />
          <Text style={styles.brandWrap}>
          </Text>
          <Text style={styles.subtitle}>Log in to continue</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputRow}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
          </View>

          <View style={styles.rememberRow}>
            <Text style={styles.rememberText}>Remember me</Text>
            <Switch value={remember} onValueChange={setRemember} trackColor={{ true: '#1DB954' }} />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.85} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.loginButtonText}>LOG IN</Text>
            )}
          </TouchableOpacity>

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <View style={styles.linksRow}>
            <Text style={styles.linkText}>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={[styles.linkText, styles.linkBold]}>SIGN UP</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.resetRow} onPress={() => {}}>
            <Text style={styles.resetText}>RESET PASSWORD</Text>
          </TouchableOpacity>

          {/* Temporary: quick link to dashboard for testing */}
          <TouchableOpacity
            style={styles.tempButton}
            onPress={() => router.push('/dashboard')}
            accessibilityRole="button"
            accessibilityLabel="Go to dashboard temporary"
          >
            <Text style={styles.tempButtonText}>Go to Dashboard (temp)</Text>
          </TouchableOpacity>
        </View>
          {/* Temporary button ends here */}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.90)',
  },
  back: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    padding: 6,
  },
  backText: { color: '#fff', fontSize: 28 },
  header: {
    alignItems: 'center',
    marginTop: 36,
    paddingHorizontal: 20,
  },
  brandWrap: { flexDirection: 'row', alignItems: 'center' },
  brandLogo: { color: '#1DB954', fontSize: 34, fontWeight: '700' },
  subtitle: { color: '#fff', fontSize: 28, marginTop: 2, fontWeight: '700' },
  form: {
    marginTop: 30,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 1,
    alignItems: 'center',
  },
  inputRow: { width: '100%', marginBottom: 12 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: '#fff',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 18,
  },
  rememberRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  rememberText: { color: '#fff' },
  loginButton: {
    width: '80%',
    height: 48,
    borderRadius: 999,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: { color: '#000', fontWeight: '700' },
  linksRow: { flexDirection: 'row', marginTop: 15 },
  linkText: { color: '#fff' },
  linkBold: { textDecorationLine: 'underline', fontWeight: '700', marginLeft: 10 },
  resetRow: { marginTop: 22 },
  resetText: { color: '#fff', textDecorationLine: 'underline', fontWeight: '700' },
  errorText: { color: '#ff6b6b', marginTop: 10, fontWeight: '700' },
  tempButton: {
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  tempButtonText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
});
