import { Component, OnInit } from '@angular/core';
import { CharactersService } from '../characters.service';
import { TeamService } from '../../team/team.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Character } from '../character.model';
import { TeamMember } from '../../team/team-member.model';

@Component({
  selector: 'app-characters-list',
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss'],
})
export class CharactersListComponent implements OnInit {
  characters: Character[] = [];
  filtered: Character[] = [];
  paginated: Character[] = [];

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
  totalPages = 1;
  visiblePageNumbers: number[] = [];
  showPrevEllipsis = false;
  showNextEllipsis = false;

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  selectedLetter: string | null = null;
  selectedSpecies: string | null = null;
  availableSpecies: string[] = [];

  showFilterPanel = false;

  constructor(
    private charactersService: CharactersService,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idsParam = this.route.snapshot.queryParamMap.get('ids');

    if (idsParam) {
      const ids = idsParam.split(',');
      this.charactersService.getCharactersByIds(ids).subscribe((data: Character[]) => {
        this.characters = Array.isArray(data) ? data : [data];
        this.filtered = this.characters;
        this.availableSpecies = [...new Set(this.characters.map((c) => c.species))].sort();
        this.currentPage = 1;
        this.updatePagination();
      });
    } else {
      this.charactersService.getAllCharacters().subscribe((data: Character[]) => {
        this.characters = data;
        this.filtered = data;
        this.availableSpecies = [...new Set(data.map((c) => c.species))].sort();
        this.currentPage = 1;
        this.updatePagination();
      });
    }

    this.nameFilter.valueChanges.subscribe(() => this.applyFilters());
    this.statusFilter.valueChanges.subscribe(() => this.applyFilters());
    this.speciesFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    const name = this.nameFilter.value?.toLowerCase() || '';
    const status = this.statusFilter.value?.toLowerCase() || '';
    const species = this.speciesFilter.value?.toLowerCase() || '';

    this.filtered = this.characters.filter(
      (c) =>
        c.name.toLowerCase().includes(name) &&
        c.status.toLowerCase().includes(status) &&
        c.species.toLowerCase().includes(species)
    );

    if (this.selectedLetter) {
      this.filtered = this.filtered.filter(
        (c) => c.name.charAt(0).toUpperCase() === this.selectedLetter
      );
    }

    if (this.selectedSpecies) {
      this.filtered = this.filtered.filter(
        (c) => c.species === this.selectedSpecies
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
    const totalItems = this.filtered.length;
    this.totalPages = Math.max(1, Math.ceil(totalItems / this.itemsPerPage));

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginated = this.filtered.slice(start, end);

    const maxVisible = 5;
    this.visiblePageNumbers = [];

    let startPage = Math.max(2, this.currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage >= this.totalPages) {
      endPage = this.totalPages - 1;
      startPage = Math.max(2, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      this.visiblePageNumbers.push(i);
    }

    this.showPrevEllipsis = startPage > 2;
    this.showNextEllipsis = endPage < this.totalPages - 1;
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

  goToDetail(id: number): void {
    this.router.navigate(['/characters', id]);
  }

  addToTeam(id: number): void {
    const original = this.characters.find((c) => c.id === id);
    if (!original) return;

    const character: TeamMember = {
      id: original.id,
      name: original.name,
      species: original.species,
      status: original.status,
      origin: original.origin?.name || 'Desconocido',
      location: original.location?.name || 'Desconocido',
      gender: original.gender || 'Desconocido',
      type: original.type || 'Desconocido',
      image: original.image,
      created: original.created || new Date().toISOString(),
    };

    this.teamService.addToTeam(character).subscribe();
  }
}
