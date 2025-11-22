import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserData = {
  name: string;
  email: string;
  phone: string;
};

export default function Profile() {
  const router = useRouter();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        setUserData(user);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const getUserInitial = () => {
    if (userData && userData.name) {
      return userData.name.charAt(0).toUpperCase();
    }
    return 'S';
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
      console.error('Logout error:', error);
    }
  };

  const handleDeleteAccount = () => {
    setDeleteModalVisible(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      // TODO: Add API call to delete account from backend
      await AsyncStorage.clear();
      setDeleteModalVisible(false);
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to delete account. Please try again.');
      console.error('Delete account error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back/Close Button */}
      <Pressable 
        style={styles.closeButton}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.closeIcon}>✕</Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            style={styles.profileImageContainer}
            onPress={() => setInfoModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="View user info"
          >
            <Text style={styles.profileInitial}>{getUserInitial()}</Text>
          </Pressable>
          <Text style={styles.userName}>{userData?.name || 'User'}</Text>
          <Pressable onPress={() => setInfoModalVisible(true)}>
            <Text style={styles.viewProfile}>View profile</Text>
          </Pressable>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Pressable style={styles.menuItem}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>+</Text>
            </View>
            <Text style={styles.menuText}>Add account</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.iconContainer}>
              <Image 
                source={require('../assets/images/Spotify_Primary_Logo_RGB_White.png')} 
                style={styles.spotifyIcon}
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Your Premium</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Individual</Text>
            </View>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.iconText}>⚡</Text>
            <Text style={styles.menuText}>What&apos;s new</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.iconText}>📊</Text>
            <Text style={styles.menuText}>Listening stats</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.iconText}>🕐</Text>
            <Text style={styles.menuText}>Recents</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.iconText}>🔔</Text>
            <Text style={styles.menuText}>Your updates</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.iconText}>⚙️</Text>
            <Text style={styles.menuText}>Settings and privacy</Text>
          </Pressable>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable 
            style={styles.logoutButton}
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel="Logout"
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </Pressable>

          <Pressable 
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            accessibilityRole="button"
            accessibilityLabel="Delete Account"
          >
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* User Info Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.infoModalContent}>
            <View style={styles.infoHeader}>
              <View style={styles.infoProfileCircle}>
                <Text style={styles.infoProfileInitial}>{getUserInitial()}</Text>
              </View>
              <Pressable 
                style={styles.infoCloseButton}
                onPress={() => setInfoModalVisible(false)}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.infoContent}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>
                  {userData?.name || 'No name provided'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>
                  {userData?.email || 'No email provided'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>
                  {userData?.phone || 'No phone number provided'}
                </Text>
              </View>
            </View>

            <Pressable 
              style={styles.infoCloseBtn}
              onPress={() => setInfoModalVisible(false)}
            >
              <Text style={styles.infoCloseBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Account?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete your account? This action cannot be undone.
            </Text>
            
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmDeleteAccount}
              >
                <Text style={styles.confirmButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '300',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInitial: {
    color: '#000',
    fontSize: 36,
    fontWeight: '700',
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  viewProfile: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  menuContainer: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#282828',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '300',
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  spotifyIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  iconText: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
    textAlign: 'center',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  badge: {
    backgroundColor: '#d4a574',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingTop: 32,
    gap: 16,
  },
  logoutButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: 'rgba(255,59,48,0.15)',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  deleteButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: '#282828',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    color: '#b3b3b3',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#404040',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#ff3b30',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  infoModalContent: {
    backgroundColor: '#282828',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
  },
  infoHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  infoProfileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  infoProfileInitial: {
    color: '#000',
    fontSize: 36,
    fontWeight: '700',
  },
  infoCloseButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    padding: 24,
  },
  infoRow: {
    marginBottom: 20,
  },
  infoLabel: {
    color: '#b3b3b3',
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  infoCloseBtn: {
    margin: 16,
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  infoCloseBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
