
import { Injectable } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places';
import { PlacesApiClient } from '../api';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [number, number];
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady():boolean{
    return !!this.userLocation;
  }

  constructor(
    private placesApi:PlacesApiClient,
    private mapService: MapService
  ) {
    this.getUserLocation();
   }

  public async getUserLocation(): Promise<[number,number]> {
    return new Promise((resolve,reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];
          resolve(this.userLocation);
        },
        (err) => {
          alert('error');
          console.log(err);
          reject();
        }
      );
    });
  }

  getPlacesByQuery(query: string = ''){

    if (query.length === 0) {
      this.places = [];
      this.isLoadingPlaces = false;
      return;
    }

    if (!this.userLocation) throw Error('No hay userLocation')

    this.isLoadingPlaces = true;

    //this.http.get<PlacesResponse>(`https://api.mapbox.com/search/geocode/v6/forward?q=${query}&limit=5&proximity=ip&language=es&access_token=pk.eyJ1IjoibWF1emFyaSIsImEiOiJjbGdncmNlNXMwZWV5M2RvMmw5NGU1YWxkIn0.oDc-sBJDwNNYaH4sPJNrxg`)
    this.placesApi.get<PlacesResponse>(`?q=${query}`, {
      params:{
        proximity: this.userLocation?.join(',')
      }
    })
    .subscribe(resp => {
        console.log(resp.features)
        this.isLoadingPlaces = false;
        this.places = resp.features;

        this.mapService.createMarkersFromPlaces(this.places, this.userLocation!  );
    });
  }

  deletePlaces(){
    this.places = [];
  }
}
