import { Component, OnInit } from '@angular/core';
import { RickpediaService } from '../../../core/rickpedia.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss'],
})
export class LocationsListComponent implements OnInit {
  locations: any[] = [];
  filteredLocations: any[] = [];

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

  constructor(private rickpedia: RickpediaService) {}

  ngOnInit(): void {
    this.rickpedia.getAllLocations().subscribe((data) => {
      this.locations = data;
      this.filteredLocations = data;
      this.updatePagination();
    });

    this.locationName.valueChanges.subscribe(() => {
      this.filterLocationsByName();
    });

    this.characterName.valueChanges.subscribe(() => {
      this.filterLocationsByCharacter();
    });
  }

  get paginatedLocations(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredLocations.slice(start, start + this.pageSize);
  }

  filterLocationsByName(): void {
    const name = this.locationName.value?.trim().toLowerCase();
    this.filteredLocations = name
      ? this.locations.filter((loc) => loc.name.toLowerCase().includes(name))
      : this.locations;

    this.currentPage = 1;
    this.updatePagination();
  }

  filterLocationsByCharacter(): void {
    const name = this.characterName.value?.trim().toLowerCase();
    if (!name) {
      this.filteredLocations = this.locations;
      this.currentPage = 1;
      this.updatePagination();
      return;
    }

    this.rickpedia.getAllCharacters().subscribe((characters: any[]) => {
      const match = characters.find((c) => c.name.toLowerCase().includes(name));
      this.filteredLocations = match?.location?.name
        ? this.locations.filter((loc) => loc.name === match.location.name)
        : [];

      this.currentPage = 1;
      this.updatePagination();
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
    this.goToPage(
      this.visiblePageNumbers[this.visiblePageNumbers.length - 1] + 1
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

  onCharacterFocus(): void {
    this.characterFocused = true;
    this.showCharacterOverlay = false;
  }

  onCharacterBlur(): void {
    this.characterFocused = false;
    if (!this.characterName.value) this.showCharacterOverlay = true;
  }
}
