import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';

const spotifylogo = require('../assets/images/Spotify_Primary_Logo_RGB_Green.png');

export default function Index() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden={true} />
      <Image source={spotifylogo} style={styles.logo} />
       <Link href="/login" style={styles.button}>
        Login
      </Link>
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
  },
  button: {
    marginTop: 40,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#1DB954',
    borderRadius: 24,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  }
});
