// PlaceDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
  Dimensions,
  StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getPlaceById } from '../services/api';

const { width } = Dimensions.get('window');

export default function PlaceDetailScreen({ route, navigation }) {
  const { placeId } = route.params;
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaceDetails();
  }, [placeId]);

  const fetchPlaceDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPlaceById(placeId);
      setPlace(data);
    } catch (error) {
      console.error('Error fetching place details:', error);
      setError('Failed to load place details');
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = () => {
    if (place?.latitude && place?.longitude) {
        navigation.navigate('Map', { 
        location: { lat: Number(place.latitude), lng: Number(place.longitude) },
        focusPlaceId: place.id   // opciono, ako želiš da označiš marker
        });
    }
    };

  const callPhone = () => {
    if (place?.phone) {
      Linking.openURL(`tel:${place.phone}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (!place) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Place not found</Text>
        <TouchableOpacity
          style={styles.backToHomeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.backToHomeText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroImageContainer}>
          <Image
            source={{ uri: place.imageUrl || 'https://via.placeholder.com/800x400' }}
            style={styles.heroImage}
          />
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
            style={styles.heroOverlay}
          />

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{place.category}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Rating */}
          <View style={styles.titleSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.placeName}>{place.name}</Text>
              {place.rating && (
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingStar}>⭐</Text>
                  <Text style={styles.ratingText}>{place.rating}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Info Cards */}
          <View style={styles.infoCards}>
            {/* Address Card */}
            {place.address && (
              <TouchableOpacity
                style={styles.infoCard}
                activeOpacity={0.8}
                onPress={openInMaps}
              >
                <View style={styles.infoIconContainer}>
                  <Text style={styles.infoIcon}>📍</Text>
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{place.address}</Text>
                </View>
                <Text style={styles.infoArrow}>›</Text>
              </TouchableOpacity>
            )}

            {/* Phone Card */}
            {place.phone && (
              <TouchableOpacity
                style={styles.infoCard}
                activeOpacity={0.8}
                onPress={callPhone}
              >
                <View style={styles.infoIconContainer}>
                  <Text style={styles.infoIcon}>📞</Text>
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{place.phone}</Text>
                </View>
                <Text style={styles.infoArrow}>›</Text>
              </TouchableOpacity>
            )}

            {/* Working Hours Card */}
            {place.workingHours && (
              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <Text style={styles.infoIcon}>🕒</Text>
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Working Hours</Text>
                  <Text style={styles.infoValue}>{place.workingHours}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Description */}
          {place.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.descriptionText}>{place.description}</Text>
            </View>
          )}

          {/* Amenities / Features */}
          {place.amenities && place.amenities.length > 0 && (
            <View style={styles.amenitiesSection}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {place.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityItem}>
                    <Text style={styles.amenityIcon}>✓</Text>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={openInMaps}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.primaryButtonIcon}>🗺️</Text>
                <Text style={styles.primaryButtonText}>Open in Maps</Text>
              </LinearGradient>
            </TouchableOpacity>

            {place.phone && (
              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.8}
                onPress={callPhone}
              >
                <Text style={styles.secondaryButtonIcon}>📞</Text>
                <Text style={styles.secondaryButtonText}>Call</Text>
              </TouchableOpacity>
            )}
          </View>
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
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 20,
  },
  backToHomeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#667eea',
    borderRadius: 20,
  },
  backToHomeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  heroImageContainer: {
    height: 350,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  categoryBadge: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    padding: 24,
    marginTop: -30,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  titleSection: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  placeName: {
    flex: 1,
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A2E',
    lineHeight: 38,
    marginRight: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  ratingStar: {
    fontSize: 18,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 18,
    fontWeight: '800',
    color: '#F57C00',
  },
  infoCards: {
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  infoIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#1A1A2E',
    fontWeight: '700',
  },
  infoArrow: {
    fontSize: 24,
    color: '#667eea',
    fontWeight: '700',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
  amenitiesSection: {
    marginBottom: 24,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  amenityIcon: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 8,
  },
  amenityText: {
    fontSize: 14,
    color: '#1A1A2E',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
  },
  primaryButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#667eea',
  },
  secondaryButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  secondaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '700',
  },
});