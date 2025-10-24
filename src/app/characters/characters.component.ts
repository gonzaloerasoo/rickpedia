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
  paginated: any[] = [];

  nameFilter = new FormControl('');
  statusFilter = new FormControl('');
  speciesFilter = new FormControl('');

  showNameOverlay = true;
  showStatusOverlay = true;
  showSpeciesOverlay = true;

  nameFocused = false;
  statusFocused = false;
  speciesFocused = false;

  currentPage = 1;
  itemsPerPage = 20;

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  selectedLetter: string | null = null;
  selectedSpecies: string | null = null;
  availableSpecies: string[] = [];

  showFilterPanel = false;

  constructor(private rickpedia: RickpediaService) {}

  ngOnInit(): void {
    this.rickpedia.getAllCharacters().subscribe(data => {
      this.characters = data;
      this.filtered = data;
      this.availableSpecies = [...new Set(data.map(c => c.species))].sort();
      this.updatePagination();
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

    if (this.selectedLetter) {
      this.filtered = this.filtered.filter(c =>
        c.name.charAt(0).toUpperCase() === this.selectedLetter
      );
    }

    if (this.selectedSpecies) {
      this.filtered = this.filtered.filter(c =>
        c.species === this.selectedSpecies
      );
    }

    this.currentPage = 1;
    this.updatePagination();
  }

  selectLetter(letter: string): void {
    this.selectedLetter = letter;
    this.applyFilters();
  }

  clearLetter(): void {
    this.selectedLetter = null;
    this.applyFilters();
  }

  selectSpecies(species: string): void {
    this.selectedSpecies = species;
    this.applyFilters();
  }

  clearSpecies(): void {
    this.selectedSpecies = null;
    this.applyFilters();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginated = this.filtered.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filtered.length / this.itemsPerPage);
  }

  get visiblePageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    if (current < 5) {
      pages.push(1, 2, 3, 4, 5);
    } else if (current >= total - 2) {
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(current, current + 1, current + 2);
    }

    return pages;
  }

  get showPrevEllipsis(): boolean {
    return this.totalPages > 7 && this.currentPage >= 5;
  }

  get showNextEllipsis(): boolean {
    return this.totalPages > 7 && this.currentPage < this.totalPages - 2;
  }

  handlePrevEllipsis(): void {
    const target = Math.max(2, this.currentPage - 3);
    this.goToPage(target);
  }

  handleNextEllipsis(): void {
    const target = Math.min(this.totalPages - 1, this.currentPage + 3);
    this.goToPage(target);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  onNameFocus(): void {
    this.nameFocused = true;
    this.showNameOverlay = false;
  }

  onNameBlur(): void {
    this.nameFocused = false;
    if (!this.nameFilter.value) this.showNameOverlay = true;
  }

  onStatusFocus(): void {
    this.statusFocused = true;
    this.showStatusOverlay = false;
  }

  onStatusBlur(): void {
    this.statusFocused = false;
    if (!this.statusFilter.value) this.showStatusOverlay = true;
  }

  onSpeciesFocus(): void {
    this.speciesFocused = true;
    this.showSpeciesOverlay = false;
  }

  onSpeciesBlur(): void {
    this.speciesFocused = false;
    if (!this.speciesFilter.value) this.showSpeciesOverlay = true;
  }
}