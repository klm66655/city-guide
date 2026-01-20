// CategoryScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getPlacesByCategory } from '../services/api';

export default function CategoryScreen({ route, navigation }) {
  const { category } = route.params;
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaces();
  }, [category]);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPlacesByCategory(category);
      setPlaces(data);
    } catch (error) {
      console.error('Error fetching places:', error);
      setError('Failed to load places');
    } finally {
      setLoading(false);
    }
  };

  // Kategorija boje mapping
  const getCategoryColors = (cat) => {
    const colors = {
      'Cafe': ['#FF6B6B', '#FF8E53'],
      'Restaurants': ['#4ECDC4', '#44A08D'],
      'Stadium': ['#A8E6CF', '#3D8F7D'],
      'Hospital': ['#FFD93D', '#F7B731'],
      'School': ['#95E1D3', '#38A79E'],
      'Shop': ['#C7CEEA', '#6C7AC7'],
      'Apartments': ['#A78BFA', '#8B5CF6']
    };
    return colors[cat] || ['#667eea', '#764ba2'];
  };

  const getCategoryIcon = (cat) => {
    const icons = {
      'Cafe': '☕',
      'Restaurants': '🍽️',
      'Stadium': '🏟️',
      'Hospital': '🏥',
      'School': '🏫',
      'Shop': '🛍️',
      'Apartments': '🏢'
    };
    return icons[cat] || '📍';
  };

  const PlaceCard = ({ place }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.placeCard}
      onPress={() => navigation.navigate('Place Detail Screen', { placeId: place.id })}
    >
      {/* Slika mesta */}
      <Image
        source={{ uri: place.imageUrl || 'https://via.placeholder.com/400x200' }}
        style={styles.placeImage}
      />
      
      {/* Gradient Overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)']}
        style={styles.placeOverlay}
      >
        <View style={styles.placeInfo}>
          <View style={styles.placeTextContainer}>
            <Text style={styles.placeName} numberOfLines={1}>{place.name}</Text>
            {place.address && (
              <Text style={styles.placeAddress} numberOfLines={1}>📍 {place.address}</Text>
            )}
          </View>
          
          {place.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingStar}>⭐</Text>
              <Text style={styles.ratingText}>{place.rating}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Badge za quick info */}
      {place.price && (
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{place.price}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading {category}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchPlaces}
        >
          <LinearGradient
            colors={getCategoryColors(category)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.retryButtonGradient}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={getCategoryColors(category)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.categoryIcon}>{getCategoryIcon(category)}</Text>
          <Text style={styles.headerTitle}>{category}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{places.length} {places.length === 1 ? 'place' : 'places'}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Lista mesta */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {places.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>{getCategoryIcon(category)}</Text>
            <Text style={styles.emptyText}>No places found</Text>
            <Text style={styles.emptySubtext}>Check back later for updates in {category}</Text>
          </View>
        ) : (
          <View style={styles.placesGrid}>
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerContent: {
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 48,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  countText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 32,
  },
  placesGrid: {
    gap: 20,
  },
  placeCard: {
    height: 220,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  placeImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  placeOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  placeInfo: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  placeTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  placeName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  placeAddress: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingStar: {
    fontSize: 16,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '800',
    color: '#F57C00',
  },
  priceBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  retryButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
