// Map.js
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllPlaces } from '../services/api'; // Prilagodi putanju

const { width, height } = Dimensions.get('window');

export default function MapScreen({ navigation, route }) {
  const mapRef = useRef(null);
  
  // Sjenica centar
  const sjenicaCenter = {
    latitude: 43.2722,
    longitude: 20.0000,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const passedLocation = route?.params?.location;

  const [region, setRegion] = useState(
    passedLocation 
      ? {
          latitude: passedLocation.lat,
          longitude: passedLocation.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }
      : sjenicaCenter
  );

  // State za places iz backend-a
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Učitavanje places pri prvom renderu
  useEffect(() => {
    fetchPlaces();
  }, []);

  // Ako je prosleđena lokacija, animiraj do nje
  useEffect(() => {
    if (passedLocation) {
      const matchedLocation = locations.find(
        loc => Math.abs(loc.latitude - passedLocation.lat) < 0.001 &&
               Math.abs(loc.longitude - passedLocation.lng) < 0.001
      );
      if (matchedLocation) {
        handleMarkerPress(matchedLocation);
      }
    }
  }, [passedLocation, locations]);

  


  // Fetch places from backend
  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const placesData = await getAllPlaces();
      
      // Transformacija backend podataka
      const transformedPlaces = placesData.map(place => {
        const categoryName = place.category || 'Other'; // koristi string iz baze
        return {
            id: place.id,
            name: place.name,
            description: place.description || 'No description available',
            latitude: parseFloat(place.latitude),
            longitude: parseFloat(place.longitude),
            icon: getCategoryIcon(categoryName),
            type: categoryName.toLowerCase(),
            imageUrl: place.imageUrl,
            createdAt: place.createdAt
        };
    });

      
      setLocations(transformedPlaces);
    } catch (error) {
      console.error('Error loading places:', error);
      
      // Proveri da li je network error
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
        Alert.alert(
          'Connection Error',
          'Cannot connect to server. Please check your connection.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Retry', onPress: fetchPlaces }
          ]
        );
      } else {
        Alert.alert(
          'Error',
          'Failed to load places. Please try again.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Retry', onPress: fetchPlaces }
          ]
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh funkcija
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPlaces();
  };

  // Mapiranje kategorija na emoji ikone
  const getCategoryIcon = (category) => {
    if (!category) return '📍';
    
    const categoryLower = category.toLowerCase();
    const iconMap = {
      'nature': '🏞️',
      'restaurant': '🍽️',
      'hotel': '🏨',
      'attraction': '🏛️',
      'park': '⛰️',
      'cafe': '☕',
      'museum': '🏛️',
      'shopping': '🛍️',
      'entertainment': '🎭',
      'sport': '⚽',
      'beach': '🏖️',
      'mountain': '⛰️',
      'lake': '🌊',
      'viewpoint': '👁️',
      'church': '⛪',
      'mosque': '🕌',
      'monument': '🗿',
      'food': '🍴',
      'bar': '🍺',
      'nightlife': '🌃',
      'culture': '🎨',
      'history': '📜',
      'adventure': '🎢',
      'relaxation': '🧘',
    };
    return iconMap[categoryLower] || '📍';
  };

  const handleMarkerPress = (location) => {
    setSelectedMarker(location);
    mapRef.current?.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 1000);
  };

  const handleRecenterMap = () => {
    mapRef.current?.animateToRegion(sjenicaCenter, 1000);
    setSelectedMarker(null);
  };

  const getMarkerColor = (type) => {
    if (!type) return '#9C27B0';
    
    const colorMap = {
      'nature': '#4CAF50',
      'restaurant': '#FF9800',
      'hotel': '#2196F3',
      'attraction': '#E91E63',
      'cafe': '#795548',
      'museum': '#9C27B0',
      'shopping': '#FF5722',
      'entertainment': '#00BCD4',
      'sport': '#CDDC39',
      'park': '#4CAF50',
      'beach': '#03A9F4',
      'mountain': '#8BC34A',
      'lake': '#0097A7',
      'viewpoint': '#FFC107',
      'church': '#9E9E9E',
      'mosque': '#757575',
      'monument': '#A1887F',
      'food': '#FF6F00',
      'bar': '#D84315',
      'nightlife': '#4A148C',
      'culture': '#6A1B9A',
      'history': '#5D4037',
      'adventure': '#E65100',
      'relaxation': '#1B5E20',
    };
    return colorMap[type.toLowerCase()] || '#9C27B0';
  };

  // Dobijanje unique kategorija za legend
  const getUniqueCategories = () => {
    const uniqueTypes = [...new Set(locations.map(l => l.type))];
    return uniqueTypes.slice(0, 6); // Prikaži prvih 6 kategorija
  };

  // Loading screen
  if (loading && locations.length === 0) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading places...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            onPress={() => handleMarkerPress(location)}
            pinColor={getMarkerColor(location.type)}
          >
            <View style={styles.markerContainer}>
              <View style={[styles.markerCircle, { backgroundColor: getMarkerColor(location.type) }]}>
                <Text style={styles.markerIcon}>{location.icon}</Text>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <LinearGradient
            colors={['#FFFFFF', '#F5F5F5']}
            style={styles.backButtonGradient}
          >
            <Text style={styles.backIcon}>←</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#F5F5F5']}
            style={styles.headerTitle}
          >
            <Text style={styles.headerText}>🗺️ Explore Sjenica</Text>
            {locations.length > 0 && (
              <Text style={styles.headerSubtext}>{locations.length} places</Text>
            )}
          </LinearGradient>
        </View>

        {/* Refresh button */}
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={refreshing}
        >
          <LinearGradient
            colors={['#FFFFFF', '#F5F5F5']}
            style={styles.backButtonGradient}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#667eea" />
            ) : (
              <Text style={styles.refreshIcon}>↻</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Recenter Button */}
      <TouchableOpacity 
        style={styles.recenterButton}
        onPress={handleRecenterMap}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.recenterButtonGradient}
        >
          <Text style={styles.recenterIcon}>📍</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Selected Location Card */}
      {selectedMarker && (
        <View style={styles.locationCard}>
          <LinearGradient
            colors={['#FFFFFF', '#F9F9F9']}
            style={styles.locationCardGradient}
          >
            <TouchableOpacity 
              style={styles.closeCardButton}
              onPress={() => setSelectedMarker(null)}
            >
              <Text style={styles.closeCardIcon}>✕</Text>
            </TouchableOpacity>
            
            <View style={styles.locationCardContent}>
              <Text style={styles.locationCardIcon}>{selectedMarker.icon}</Text>
              <View style={styles.locationCardInfo}>
                <Text style={styles.locationCardTitle}>{selectedMarker.name}</Text>
                <Text style={styles.locationCardDescription}>
                  {selectedMarker.description}
                </Text>
                <View style={styles.locationCardBadge}>
                  <View style={[styles.typeBadge, { backgroundColor: getMarkerColor(selectedMarker.type) + '20' }]}>
                    <Text style={[styles.typeBadgeText, { color: getMarkerColor(selectedMarker.type) }]}>
                      {selectedMarker.type}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.directionsButton}
              onPress={() => {
                // Otvori u Google Maps
                const url = Platform.select({
                  ios: `maps://app?daddr=${selectedMarker.latitude},${selectedMarker.longitude}`,
                  android: `google.navigation:q=${selectedMarker.latitude},${selectedMarker.longitude}`
                });
                
                Alert.alert(
                  'Directions',
                  `Navigate to ${selectedMarker.name}?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Maps', onPress: () => {
                      // Linking.openURL(url); // Treba importovati Linking
                      console.log('Opening maps:', url);
                    }}
                  ]
                );
              }}
            >
              
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}

      {/* Legend */}
      {locations.length > 0 && (
        <View style={styles.legend}>
          <LinearGradient
            colors={['#FFFFFF', '#F9F9F9']}
            style={styles.legendGradient}
          >
            <Text style={styles.legendTitle}>Categories</Text>
            <View style={styles.legendItems}>
              {getUniqueCategories().map((type, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: getMarkerColor(type) }]} />
                  <Text style={styles.legendText}>{type}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Empty State */}
      {!loading && locations.length === 0 && (
        <View style={styles.emptyState}>
          <LinearGradient
            colors={['#FFFFFF', '#F9F9F9']}
            style={styles.emptyStateGradient}
          >
            <Text style={styles.emptyStateIcon}>📍</Text>
            <Text style={styles.emptyStateTitle}>No places found</Text>
            <Text style={styles.emptyStateText}>
              There are no places to display yet.
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={handleRefresh}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.emptyStateButtonGradient}
              >
                <Text style={styles.emptyStateButtonText}>Refresh</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  map: {
    width: width,
    height: height,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  backButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#667eea',
    fontWeight: '600',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  headerSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  refreshButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  refreshIcon: {
    fontSize: 24,
    color: '#667eea',
    fontWeight: '600',
  },
  recenterButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  recenterButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recenterIcon: {
    fontSize: 24,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerIcon: {
    fontSize: 20,
  },
  locationCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 10,
  },
  locationCardGradient: {
    padding: 20,
  },
  closeCardButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  closeCardIcon: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  locationCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationCardIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  locationCardInfo: {
    flex: 1,
  },
  locationCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  locationCardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  locationCardBadge: {
    flexDirection: 'row',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  directionsButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  directionsButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  directionsButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  directionsButtonIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  legend: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 90,
    right: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  legendGradient: {
    padding: 12,
    maxHeight: 200,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  legendItems: {
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  emptyState: {
    position: 'absolute',
    top: '40%',
    left: 40,
    right: 40,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  emptyStateGradient: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyStateButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});