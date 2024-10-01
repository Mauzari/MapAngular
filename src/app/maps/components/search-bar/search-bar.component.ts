import { Component } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  constructor(private placesServie: PlacesService){}

  private debounceTimer?: NodeJS.Timeout;

  onQueryChanged(query: string = ''){
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
      this.placesServie.getPlacesByQuery(query);
    }, 500);
  }
}
