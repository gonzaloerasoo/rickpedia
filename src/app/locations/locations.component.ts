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
  characterName = new FormControl('');

  showNameOverlay = true;
  nameFocused = false;

  showCharacterOverlay = true;
  characterFocused = false;

  showFilterPanel = false;

  constructor(private rickpedia: RickpediaService) {}

  ngOnInit(): void {
    this.rickpedia.getAllLocations().subscribe((data) => {
      this.locations = data;
      this.filteredLocations = data;
    });

    this.locationName.valueChanges.subscribe(() => {
      this.filterLocationsByName();
    });

    this.characterName.valueChanges.subscribe(() => {
      this.filterLocationsByCharacter();
    });
  }

  filterLocationsByName(): void {
    const name = this.locationName.value?.trim().toLowerCase();
    if (!name) {
      this.filteredLocations = this.locations;
      return;
    }

    this.filteredLocations = this.locations.filter((loc) =>
      loc.name.toLowerCase().includes(name)
    );
  }

  filterLocationsByCharacter(): void {
    const name = this.characterName.value?.trim().toLowerCase();
    if (!name) {
      this.filteredLocations = this.locations;
      return;
    }

    this.rickpedia.getAllCharacters().subscribe((characters: any[]) => {
      const match = characters.find((c) => c.name.toLowerCase().includes(name));
      if (!match || !match.location || !match.location.name) {
        this.filteredLocations = [];
        return;
      }

      this.filteredLocations = this.locations.filter(
        (loc) => loc.name === match.location.name
      );
    });
  }

  onNameFocus(): void {
    this.nameFocused = true;
    this.showNameOverlay = false;
  }

  onNameBlur(): void {
    this.nameFocused = false;
    if (!this.locationName.value) this.showNameOverlay = true;
  }

  onCharacterFocus(): void {
    this.characterFocused = true;
    this.showCharacterOverlay = false;
  }

  onCharacterBlur(): void {
    this.characterFocused = false;
    if (!this.characterName.value) this.showCharacterOverlay = true;
  }
}
