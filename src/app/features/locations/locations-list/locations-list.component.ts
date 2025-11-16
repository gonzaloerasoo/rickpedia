import { Component, OnInit } from '@angular/core';
import { LocationsService } from '../locations.service';
import { CharactersService } from '../../characters/characters.service';
import { FormControl } from '@angular/forms';
import { Location } from '../location.model';
import { Character } from '../../characters/character.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss'],
})
export class LocationsListComponent implements OnInit {
  locations: Location[] = [];
  filteredLocations: Location[] = [];

  locationName = new FormControl('');
  characterName = new FormControl('');

  showNameOverlay = true;
  nameFocused = false;

  showCharacterOverlay = true;
  characterFocused = false;

  showFilterPanel = false;

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  visiblePageNumbers: number[] = [];
  showPrevEllipsis = false;
  showNextEllipsis = false;

  isLoading = false;

  constructor(
    private locationsService: LocationsService,
    private charactersService: CharactersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const pageParam = this.route.snapshot.queryParamMap.get('page');
    if (pageParam) {
      this.currentPage = +pageParam;
    }

    this.loadAllLocations();

    this.locationName.valueChanges.subscribe(() => {
      this.filterLocationsByName();
    });

    this.characterName.valueChanges.subscribe(() => {
      this.filterLocationsByCharacter();
    });
  }

  loadAllLocations(): void {
    this.isLoading = true;
    this.locationsService.getAllLocations().subscribe({
      next: (data: Location[]) => {
        this.locations = data;
        this.filteredLocations = data;
        this.totalPages = Math.ceil(this.filteredLocations.length / this.pageSize);
        this.updatePagination();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  get paginatedLocations(): Location[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredLocations.slice(start, start + this.pageSize);
  }

  filterLocationsByName(): void {
    const name = this.locationName.value?.trim().toLowerCase();
    this.filteredLocations = name
      ? this.locations.filter((loc) => loc.name.toLowerCase().includes(name))
      : this.locations;

    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredLocations.length / this.pageSize);
    this.updatePagination();
  }

  filterLocationsByCharacter(): void {
    const name = this.characterName.value?.trim().toLowerCase();

    if (!name) {
      this.filteredLocations = this.locations;
      this.totalPages = Math.ceil(this.filteredLocations.length / this.pageSize);
      this.currentPage = 1;
      this.updatePagination();
      return;
    }

    if (name.length < 2) {
      return;
    }

    this.charactersService.getAllCharacters().subscribe({
      next: (characters: Character[]) => {
        const match = characters.find((c) => c.name.toLowerCase().includes(name));
        this.filteredLocations = match?.location?.name
          ? this.locations.filter((loc) => loc.name === match.location.name)
          : [];

        this.currentPage = 1;
        this.totalPages = Math.max(1, Math.ceil(this.filteredLocations.length / this.pageSize));
        this.updatePagination();
      },
      error: () => {},
    });
  }

  updatePagination(): void {
    this.totalPages = Math.max(
      1,
      Math.ceil(this.filteredLocations.length / this.pageSize)
    );
    const maxVisible = 5;
    this.visiblePageNumbers = [];

    let start = Math.max(2, this.currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end >= this.totalPages) {
      end = this.totalPages - 1;
      start = Math.max(2, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      this.visiblePageNumbers.push(i);
    }

    this.showPrevEllipsis = start > 2;
    this.showNextEllipsis = end < this.totalPages - 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  handlePrevEllipsis(): void {
    this.goToPage(this.visiblePageNumbers[0] - 1);
  }

  handleNextEllipsis(): void {
    this.goToPage(this.visiblePageNumbers[this.visiblePageNumbers.length - 1] + 1);
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
