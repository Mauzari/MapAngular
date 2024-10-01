import { Component } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { Feature } from '../../interfaces/places';
import { MapService } from '../../services';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {

  public selectedId: string = '';

  constructor(
    private placesService:PlacesService,
    private mapService: MapService
  ){}

  get isLoadingPlaces(): boolean {
    return this.placesService.isLoadingPlaces;
  }

  get places():Feature[] {
    return this.placesService.places;
  }

  flyTo(place: Feature){

    this.selectedId = place.id;

    const latitude = place.properties.coordinates.latitude;
    const longitude = place.properties.coordinates.longitude;

    this.mapService.flyTo([longitude, latitude]);

  }

  getDirections(place: Feature){

    if (!this.placesService.userLocation) throw Error('No hay userLocation')

      this.placesService.deletePlaces();

    const start = this.placesService.userLocation;
    const end = place.geometry.coordinates as [number,number];

    this.mapService.getRouteBetweenPoints(start,end);
  }
}
