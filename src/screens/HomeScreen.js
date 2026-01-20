// HomeScreen.js
import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from "react-native";

import uvacImg from "../assets/uvac.png";

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const categories = [
    { id: 1, name: 'Cafe', icon: '☕', colors: ['#FF6B6B', '#FF8E53'], screen: 'Cafe' },
    { id: 2, name: 'Restaurants', icon: '🍽️', colors: ['#4ECDC4', '#44A08D'], screen: 'Restaurants' },
    { id: 3, name: 'Stadium', icon: '🏟️', colors: ['#A8E6CF', '#3D8F7D'], screen: 'Stadium' },
    { id: 4, name: 'Hospital', icon: '🏥', colors: ['#FFD93D', '#F7B731'], screen: 'Hospital' },
    { id: 5, name: 'School', icon: '🏫', colors: ['#95E1D3', '#38A79E'], screen: 'School' },
    { id: 6, name: 'Shop', icon: '🛍️', colors: ['#C7CEEA', '#6C7AC7'], screen: 'Shop' },
    { id: 7, name: 'Apartments', icon: '🏢', colors: ['#A78BFA', '#8B5CF6'], screen: 'Apartments' }
  ];

  const featured = [
    { id: 1, name: 'Uvac Canyon', rating: 4.9, image: uvacImg, visitors: '2.5k', lat: 43.3333, lng: 19.9167 },
    { id: 2, name: 'Old Town Center', rating: 4.7, image: uvacImg, visitors: '1.8k', lat: 43.2722, lng: 20.0000 },
    { id: 3, name: 'Local Cuisine', rating: 4.8, image: uvacImg, visitors: '3.2k', lat: 43.2750, lng: 19.9950 }
  ];

  const CategoryCard = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.8}
      style={styles.categoryCard}
      onPress={() => {
        if (item.screen === 'Map') {
          navigation.navigate('Map');
        } else {
          navigation.navigate('Category', { category: item.name });
        }
      }}
    >
      <LinearGradient
        colors={item.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.categoryGradient}
      >
        <Text style={styles.categoryIcon}>{item.icon}</Text>
        <Text style={styles.categoryText}>{item.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const FeaturedCard = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.9}
      style={styles.featuredCard}
      onPress={() => {
        navigation.navigate('Map', { 
          location: { lat: item.lat, lng: item.lng },
          name: item.name 
        });
      }}
    >
      <Image 
        source={item.image} 
        style={styles.featuredImage} 
      />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
        style={styles.featuredOverlay}
      >
        <View style={styles.featuredContent}>
          <View style={styles.featuredHeader}>
            <Text style={styles.featuredName}>{item.name}</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.star}>⭐</Text>
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
          <View style={styles.featuredFooter}>
            <Text style={styles.trendIcon}>📈</Text>
            <Text style={styles.visitorsText}>{item.visitors} visitors</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <Text style={styles.welcomeText}>WELCOME TO</Text>
          <Text style={styles.titleText}>Sjenica Guide</Text>
          <Text style={styles.titleText}>Tour</Text>
          <Text style={styles.descriptionText}>
            Discover the beauty and culture of Sjenica - your personal guide to unforgettable experiences
          </Text>
        </LinearGradient>

        {/* Quick Map Access Button */}
        <TouchableOpacity 
          style={styles.mapQuickAccess}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Map')}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mapQuickAccessGradient}
          >
            <Text style={styles.mapQuickAccessIcon}>🗺️</Text>
            <View style={styles.mapQuickAccessText}>
              <Text style={styles.mapQuickAccessTitle}>Explore Map</Text>
              <Text style={styles.mapQuickAccessSubtitle}>View all locations on map</Text>
            </View>
            <Text style={styles.mapQuickAccessArrow}>›</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <CategoryCard key={category.id} item={category} />
            ))}
          </View>
        </View>

        {/* Featured Section */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>View All</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {featured.map((item) => (
              <FeaturedCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    letterSpacing: 3,
    marginBottom: 8,
  },
  titleText: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -1,
  },
  descriptionText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 24,
    marginTop: 8,
  },
  mapQuickAccess: {
    marginHorizontal: 24,
    marginTop: -20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  mapQuickAccessGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  mapQuickAccessIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  mapQuickAccessText: {
    flex: 1,
  },
  mapQuickAccessTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  mapQuickAccessSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  mapQuickAccessArrow: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.5,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginRight: 4,
  },
  chevron: {
    fontSize: 20,
    color: '#667eea',
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 72) / 3,
    aspectRatio: 1,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 15,
    elevation: 8,
  },
  categoryGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  featuredSection: {
    marginTop: 36,
    marginBottom: 20,
  },
  featuredScroll: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  featuredCard: {
    width: width - 100,
    height: 240,
    marginRight: 20,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  featuredOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  featuredContent: {
    padding: 20,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
    letterSpacing: -0.3,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  star: {
    fontSize: 14,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '700',
    color: '#F57C00',
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    fontSize: 16,
  },
  visitorsText: {
    marginLeft: 6,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
});