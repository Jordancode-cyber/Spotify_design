import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const spotifylogo = require('../assets/images/Spotify_Primary_Logo_RGB_Green.png');

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 1800);
    return () => clearTimeout(timer);
  }, [router]);
  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden={true} />
      <Image source={spotifylogo} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    alignItems: 'center',
    resizeMode: 'contain',
    marginTop: 20,
  }
});
