package com.backend.backend.services;

import com.backend.backend.model.Place;
import com.backend.backend.repository.PlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlaceService {

    private final PlaceRepository placeRepository;

    @Autowired
    public PlaceService(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    public List<Place> getPlacesByCategory(String category) {
        return placeRepository.findByCategory(category);
    }


    // Kreiranje novog mesta
    public Place createPlace(Place place) {
        return placeRepository.save(place);
    }

    // Dohvatanje svih mesta
    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    // Dohvatanje jednog mesta po ID
    public Optional<Place> getPlaceById(Integer id) {
        return placeRepository.findById(id);
    }

    // Ažuriranje mesta
    public Place updatePlace(Integer id, Place updatedPlace) {
        return placeRepository.findById(id)
                .map(place -> {
                    place.setName(updatedPlace.getName());
                    place.setDescription(updatedPlace.getDescription());
                    place.setCategory(updatedPlace.getCategory());
                    place.setLatitude(updatedPlace.getLatitude());
                    place.setLongitude(updatedPlace.getLongitude());
                    place.setImageUrl(updatedPlace.getImageUrl());
                    return placeRepository.save(place);
                })
                .orElseThrow(() -> new RuntimeException("Place not found with id " + id));
    }

    // Brisanje mesta
    public void deletePlace(Integer id) {
        placeRepository.deleteById(id);
    }
}
