package com.backend.backend.controllers;

import com.backend.backend.model.Place;
import com.backend.backend.services.PlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
public class PlaceController {

    private final PlaceService placeService;

    @Autowired
    public PlaceController(PlaceService placeService) {
        this.placeService = placeService;
    }


    @PostMapping
    public Place createPlace(@RequestBody Place place) {
        return placeService.createPlace(place);
    }


    @GetMapping
    public List<Place> getAllPlaces(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            return placeService.getPlacesByCategory(category);
        }
        return placeService.getAllPlaces();
    }


    @GetMapping("/{id}")
    public ResponseEntity<Place> getPlaceById(@PathVariable Integer id) {
        return placeService.getPlaceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("/{id}")
    public ResponseEntity<Place> updatePlace(@PathVariable Integer id, @RequestBody Place place) {
        try {
            Place updatedPlace = placeService.updatePlace(id, place);
            return ResponseEntity.ok(updatedPlace);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Brisanje mesta
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlace(@PathVariable Integer id) {
        placeService.deletePlace(id);
        return ResponseEntity.noContent().build();
    }
}
