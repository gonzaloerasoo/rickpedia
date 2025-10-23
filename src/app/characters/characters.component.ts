import { Component, OnInit } from '@angular/core';
import { RickpediaService } from '../services/rickpedia.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {
  characters: any[] = [];
  filtered: any[] = [];

  nameFilter = new FormControl('');
  statusFilter = new FormControl('');
  speciesFilter = new FormControl('');

  showNameOverlay = true;
  showStatusOverlay = true;
  showSpeciesOverlay = true;

  nameFocused = false;
  statusFocused = false;
  speciesFocused = false;

  constructor(private rickpedia: RickpediaService) {}

  ngOnInit(): void {
    this.rickpedia.getAllCharacters().subscribe(data => {
      this.characters = data;
      this.filtered = data;
    });

    this.nameFilter.valueChanges.subscribe(() => this.applyFilters());
    this.statusFilter.valueChanges.subscribe(() => this.applyFilters());
    this.speciesFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    const name = this.nameFilter.value?.toLowerCase() || '';
    const status = this.statusFilter.value?.toLowerCase() || '';
    const species = this.speciesFilter.value?.toLowerCase() || '';

    this.filtered = this.characters.filter(c =>
      c.name.toLowerCase().includes(name) &&
      c.status.toLowerCase().includes(status) &&
      c.species.toLowerCase().includes(species)
    );
  }

  onNameFocus(): void {
    this.nameFocused = true;
    this.showNameOverlay = false;
  }

  onNameBlur(): void {
    this.nameFocused = false;
    if (!this.nameFilter.value) {
      this.showNameOverlay = true;
    }
  }

  onStatusFocus(): void {
    this.statusFocused = true;
    this.showStatusOverlay = false;
  }

  onStatusBlur(): void {
    this.statusFocused = false;
    if (!this.statusFilter.value) {
      this.showStatusOverlay = true;
    }
  }

  onSpeciesFocus(): void {
    this.speciesFocused = true;
    this.showSpeciesOverlay = false;
  }

  onSpeciesBlur(): void {
    this.speciesFocused = false;
    if (!this.speciesFilter.value) {
      this.showSpeciesOverlay = true;
    }
  }
}