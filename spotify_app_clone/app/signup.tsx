import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ImageBackground, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const spotifylogo = require('../assets/images/Spotify_Primary_Logo_RGB_Green.png');

export default function SignUp() {
    const router = useRouter();

    return (
    <SafeAreaView style={styles.container}>
        <StatusBar style="light" hidden={true} />
            <View style={styles.container}>
        <ImageBackground source={require('../assets/images/my-fav-songs.jpg')}
                style={styles.absoluteFill} >
        <View style={styles.overlay}>
        </View>
    </ImageBackground>

    <Image source={spotifylogo} style={styles.logo} />      
        <Text style={styles.headline}>
            Millions of Songs
        </Text>
        <Text style={styles.headline}>
            Free on Spotify
        </Text>
        
    <TouchableOpacity 
        style={styles.signUpPrimary}
        onPress={() => router.push('/signupformpage')}
    >
        <Text style={styles.signUpPrimaryText}>Sign Up Free</Text>
    </TouchableOpacity>

      <TouchableOpacity style ={styles.socialButtonFacebook}>
        <Text style={styles.socialButtonText}>Continue with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style ={styles.socialButtonGoogle}>
        <Text style={styles.socialButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style ={styles.socialButtonApple}>
        <Text style={styles.socialButtonText}>Continue with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.logInText}>Log In</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0.2,0.9)',
  },
    logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginTop: 12,
  },
    headline: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 4,
  },
    signUpPrimary: {
    marginTop: 65,
    paddingVertical: 15,
    paddingHorizontal: 108,
    backgroundColor: '#1DB954',
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
    signUpPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    alignItems: 'center',
    },
    socialButtonFacebook: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 69,
    backgroundColor: '#3b5998',
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
    socialButtonGoogle: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 78,
    backgroundColor: '#db4437',
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    },
    socialButtonApple: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 78,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    },
    socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    alignItems: 'center',
    },
    logInText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    alignItems: 'center',
    },
});
