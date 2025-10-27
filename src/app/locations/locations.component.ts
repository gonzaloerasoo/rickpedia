import { Component, OnInit } from '@angular/core';
import { RickpediaService } from '../services/rickpedia.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {
  locations: any[] = [];
  filteredLocations: any[] = [];

  locationName = new FormControl('');
  showNameOverlay = true;
  nameFocused = false;
  showFilterPanel = false;

  constructor(private rickpedia: RickpediaService) {}

  ngOnInit(): void {
    this.rickpedia.getAllLocations().subscribe((data) => {
      this.locations = data;
      this.filteredLocations = data;
    });

    this.locationName.valueChanges.subscribe(() => {
      this.filterLocations();
    });
  }

  filterLocations(): void {
    const name = this.locationName.value?.trim().toLowerCase();
    if (!name) {
      this.filteredLocations = this.locations;
      return;
    }

    this.filteredLocations = this.locations.filter((loc) =>
      loc.name.toLowerCase().includes(name)
    );
  }

  onNameFocus(): void {
    this.nameFocused = true;
    this.showNameOverlay = false;
  }

  onNameBlur(): void {
    this.nameFocused = false;
    if (!this.locationName.value) this.showNameOverlay = true;
  }
}
