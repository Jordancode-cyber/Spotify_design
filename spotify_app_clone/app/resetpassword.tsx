import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ImageBackground } from 'expo-image';

const spotifylogo1 = require('../assets/images/Spotify_Full_Logo_RGB_Green.png');

export default function ResetPassword() {
  const [step, setStep] = useState<'email' | 'newPassword'>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  async function handleEmailSubmit() {
    setError(null);
    setSuccess(null);

    if (!email) {
      setError('Please enter your email');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    try {
      setLoading(true);

      // Check if email exists in database
      const response = await fetch('http://192.168.1.15:3000/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.exists) {
        setSuccess('Email verified! Enter your new password.');
        setStep('newPassword');
      } else {
        setError('Email not found. Please check and try again.');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setError('Connection error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset() {
    setError(null);
    setSuccess(null);

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('http://192.168.1.15:3000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'Success') {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          router.replace('/login');
        }, 2000);
      } else {
        setError(data.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ImageBackground
        source={require('../assets/images/my-fav-songs.jpg')}
        style={styles.absoluteFill}
      >
        <View style={styles.overlay}></View>
      </ImageBackground>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <TouchableOpacity style={styles.back} onPress={() => router.push('/login')}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Image source={spotifylogo1} style={styles.logo} />
          <Text style={styles.subtitle}>Reset Password</Text>
          <Text style={styles.description}>
            {step === 'email'
              ? 'Enter your email to reset your password'
              : 'Enter your new password'}
          </Text>
        </View>

        <View style={styles.form}>
          {step === 'email' ? (
            <>
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

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleEmailSubmit}
                activeOpacity={0.85}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.submitButtonText}>VERIFY EMAIL</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="New Password"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Confirm New Password"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={styles.input}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handlePasswordReset}
                activeOpacity={0.85}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.submitButtonText}>RESET PASSWORD</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>{success}</Text> : null}

          <TouchableOpacity
            style={styles.backToLogin}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
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
  logo: {
    width: 250,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 1,
    alignItems: 'center',
  },
  subtitle: {
    color: '#fff',
    fontSize: 28,
    marginTop: 2,
    fontWeight: '700',
  },
  description: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    marginTop: 30,
    paddingHorizontal: 20,
    width: '100%',
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
  submitButton: {
    width: '80%',
    height: 48,
    borderRadius: 999,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  errorText: {
    color: '#ff6b6b',
    marginTop: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  successText: {
    color: '#1DB954',
    marginTop: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  backToLogin: {
    marginTop: 20,
  },
  backToLoginText: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
});
