import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  ImageBackground,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

type ChipItem = { id: string; title: string };
type CarouselItem = { id: string; title: string; image: string };
type PlaylistItem = { id: string; title: string; subtitle: string; image: string };

const chips: ChipItem[] = [
  { id: '1', title: 'New groove' },
  { id: '2', title: 'Fresh charts' },
  { id: '3', title: 'Christian culture' },
  { id: '4', title: 'Mood' },
  { id: '5', title: 'Exotic tastes' },
  { id: '6', title: 'Vibes' },
];

const carousels: CarouselItem[] = Array.from({ length: 6 }).map((_, i) => ({
  id: String(i),
  title: `Playlist ${i + 1}`,
  image: `https://picsum.photos/seed/carousel-${i + 1}/320/320`,
}));

const playlists: PlaylistItem[] = Array.from({ length: 6 }).map((_, i) => ({
  id: String(i),
  title: i % 2 ? 'Phil Wickham' : 'This is Great man Takit',
  subtitle: 'Playlist · Spotify',
  image: `https://picsum.photos/seed/playlist-${i + 1}/800/450`,
}));

function SegmentedControl(): React.JSX.Element {
  return (
    <View style={styles.segment}>
      <Pressable style={[styles.segmentButton, styles.segmentActive]} accessibilityRole="button" accessibilityLabel="All">
        <Text style={styles.segmentTextActive}>All</Text>
      </Pressable>
      <Pressable style={styles.segmentButton} accessibilityRole="button" accessibilityLabel="Music">
        <Text style={styles.segmentText}>Music</Text>
      </Pressable>
      <Pressable style={styles.segmentButton} accessibilityRole="button" accessibilityLabel="Following">
        <Text style={styles.segmentText}>Following</Text>
      </Pressable>
    </View>
  );
}

function SmallChip({ item }: { item: ChipItem }): React.JSX.Element {
  return (
    <View style={styles.chip}>
      <Image source={{ uri: `https://picsum.photos/seed/chip-${item.id}/64/64` }} style={styles.chipImg} />
      <Text style={styles.chipText}>{item.title}</Text>
    </View>
  );
}

function CarouselCard({ item }: { item: CarouselItem }): React.JSX.Element {
  return (
    <View style={styles.carouselCard}>
      <Image source={{ uri: item.image }} style={styles.carouselImg} />
      <Text style={styles.carouselTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </View>
  );
}

function DJCard(): React.JSX.Element {
  return (
    <ImageBackground 
      source={require('../assets/images/DJ.jpg')}
      style={styles.djCard}
      imageStyle={styles.djCardImage}
    >
      <LinearGradient 
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)', 'rgba(10,132,255,0.85)']} 
        style={styles.djCardGradient}
        locations={[0, 0.4, 1]}
      >
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={styles.djLabel}>Your own personal DJ</Text>
          <Text style={styles.djTitle}>Hey, its your favorite DJ, DJ X. Good to have you here.</Text>
        </View>
        <Pressable style={styles.playCircle} accessibilityRole="button" accessibilityLabel="Play DJ">
          <Text style={styles.playTriangle}>▶</Text>
        </Pressable>
      </LinearGradient>
    </ImageBackground>
  );
}

function PlaylistCard({ item }: { item: PlaylistItem }): React.JSX.Element {
  return (
    <ImageBackground source={{ uri: item.image }} style={styles.playlistCard} imageStyle={styles.playlistImage}>
      <View style={styles.playlistOverlay} />
      <View style={styles.playlistContent}>
        <View>
          <Text style={styles.playlistTitle}>{item.title}</Text>
          <Text style={styles.playlistSubtitle}>{item.subtitle}</Text>
        </View>
        <View style={styles.playlistButtons}>
          <Pressable style={styles.previewBtn} accessibilityRole="button" accessibilityLabel={`Preview ${item.title}`}>
            <Text style={styles.previewText}>Preview</Text>
          </Pressable>
          <View style={{ width: 8 }} />
          <Pressable style={styles.playBtn} accessibilityRole="button" accessibilityLabel={`Play ${item.title}`}>
            <Text style={styles.playText}>▶</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

export default function Dashboard(): React.JSX.Element {
  const router = useRouter();
  const [userInitial, setUserInitial] = useState('S');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        if (user.name) {
          setUserInitial(user.name.charAt(0).toUpperCase());
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable 
            style={styles.logoButton} 
            accessibilityRole="button" 
            accessibilityLabel="Open profile"
            onPress={() => router.push('/profile')}
          >
            <Text style={styles.logoInitial}>{userInitial}</Text>
          </Pressable>
          <SegmentedControl />
        </View>

        <View style={styles.chipGrid}>
          {chips.map((c) => (
            <SmallChip key={c.id} item={c} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Jump back in</Text>
        <FlatList
          data={carousels}
          horizontal
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          renderItem={({ item }) => <CarouselCard item={item} />}
        />

        <Text style={styles.sectionTitle}>Made for you</Text>
        <FlatList
          data={carousels}
          horizontal
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          renderItem={({ item }) => <CarouselCard item={item} />}
        />

        <Text style={styles.sectionTitle}>Your own personal DJ</Text>
        <DJCard />

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Made for you</Text>
        <View style={{ paddingHorizontal: 12 }}>
          {playlists.map((p) => (
            <PlaylistCard key={p.id} item={p} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_WIDTH = width - 24;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  container: { paddingBottom: 48 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 },
  logoButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1DB954', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  logoImage: { width: 40, height: 40, resizeMode: 'cover' },
  logoInitial: { color: '#000', fontSize: 20, fontWeight: '700' },
  segment: { flexDirection: 'row', backgroundColor: '#0b0b0b', padding: 4, borderRadius: 20 },
  segmentButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16 },
  segmentActive: { backgroundColor: '#00C853' },
  segmentText: { color: '#888' },
  segmentTextActive: { color: '#000', fontWeight: '600' },

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  chip: { width: (width - 48) / 2, backgroundColor: '#111', borderRadius: 8, padding: 10, margin: 6, flexDirection: 'row', alignItems: 'center' },
  chipImg: { width: 40, height: 40, borderRadius: 6, marginRight: 10 },
  chipText: { color: '#fff', fontSize: 14 },

  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginLeft: 12, marginTop: 18, marginBottom: 8 },

  carouselCard: { width: 120, marginRight: 12, alignItems: 'center' },
  carouselImg: { width: 120, height: 120, borderRadius: 8 },
  carouselTitle: { color: '#fff', marginTop: 8, width: 120, textAlign: 'left' },

  djCard: { marginHorizontal: 12, marginTop: 8, height: 160, borderRadius: 12, overflow: 'hidden' },
  djCardImage: { resizeMode: 'cover' },
  djCardGradient: { flex: 1, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  djLabel: { color: '#dfefff', fontSize: 12 },
  djTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginTop: 20 },
  playCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  playTriangle: { color: '#0a84ff', fontWeight: '700' },

  playlistCard: { width: CARD_WIDTH, height: 220, borderRadius: 14, overflow: 'hidden', marginBottom: 16 },
  playlistImage: { resizeMode: 'cover' },
  playlistOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  playlistContent: { flex: 1, justifyContent: 'space-between', padding: 16 },
  playlistTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  playlistSubtitle: { color: '#ddd', marginTop: 6 },
  playlistButtons: { flexDirection: 'row', alignItems: 'center' },
  previewBtn: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  previewText: { color: '#fff' },
  playBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  playText: { color: '#000', fontWeight: '700' },
});
