import { Component, OnInit } from '@angular/core';
import { EpisodesService } from '../episodes.service';
import { CharactersService } from '../../characters/characters.service';
import { FormControl } from '@angular/forms';
import { Episode } from '../episode.model';
import { Character } from '../../characters/character.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-episodes-list',
  templateUrl: './episodes-list.component.html',
  styleUrls: ['./episodes-list.component.scss'],
})
export class EpisodesListComponent implements OnInit {
  episodes: Episode[] = [];
  filteredEpisodes: Episode[] = [];
  charactersInEpisode: Character[] = [];
  selectedEpisodeTitle = '';

  episodeName = new FormControl('');
  characterName = new FormControl('');

  showNameOverlay = true;
  nameFocused = false;

  showCharacterOverlay = true;
  characterFocused = false;

  showFilterPanel = false;

  currentPage = 1;
  totalPages = 1;
  visiblePageNumbers: number[] = [];
  showPrevEllipsis = false;
  showNextEllipsis = false;

  isLoading = false;

  constructor(
    private episodesService: EpisodesService,
    private charactersService: CharactersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const pageParam = this.route.snapshot.queryParamMap.get('page');
    if (pageParam) {
      this.currentPage = +pageParam;
    }

    this.loadAllEpisodes();

    this.episodeName.valueChanges.subscribe(() => {
      this.filterEpisodesByNameOrCode();
    });

    this.characterName.valueChanges.subscribe(() => {
      this.filterEpisodesByCharacter();
    });
  }

  loadAllEpisodes(): void {
    this.isLoading = true;
    this.episodesService.getAllEpisodes().subscribe({
      next: (res: Episode[]) => {
        this.episodes = res;
        this.filteredEpisodes = res;
        this.totalPages = Math.ceil(this.filteredEpisodes.length / 10);
        this.updatePagination();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  get paginatedEpisodes(): Episode[] {
    const start = (this.currentPage - 1) * 10;
    const end = start + 10;
    return this.filteredEpisodes.slice(start, end);
  }

  filterEpisodesByNameOrCode(): void {
    const raw = this.episodeName.value?.trim() || '';
    const inputLower = raw.toLowerCase();
    const inputUpper = raw.toUpperCase();

    if (!raw) {
      this.filteredEpisodes = this.episodes;
      this.totalPages = Math.ceil(this.filteredEpisodes.length / 10);
      this.currentPage = 1;
      this.updatePagination();
      return;
    }

    if (/^[sS]\d{2}[eE]\d{2}$/.test(raw)) {
      this.filteredEpisodes = this.episodes.filter(
        (ep) => ep.episode.toUpperCase() === inputUpper
      );
    } else {
      this.filteredEpisodes = this.episodes.filter(
        (ep) =>
          ep.name.toLowerCase().includes(inputLower) ||
          ep.episode.toLowerCase().includes(inputLower)
      );
    }

    this.currentPage = 1;
    this.totalPages = Math.max(1, Math.ceil(this.filteredEpisodes.length / 10));
    this.updatePagination();
  }

  filterEpisodesByCharacter(): void {
    const name = this.characterName.value?.trim().toLowerCase();

    if (!name) {
      this.filteredEpisodes = this.episodes;
      this.totalPages = Math.ceil(this.filteredEpisodes.length / 10);
      this.currentPage = 1;
      this.updatePagination();
      return;
    }

    if (name.length < 2) {
      return;
    }

    this.charactersService.getAllCharacters().subscribe({
      next: (characters: Character[]) => {
        const match = characters.find((c) =>
          c.name.toLowerCase().includes(name)
        );
        if (!match || !match.episode) {
          this.filteredEpisodes = [];
          this.totalPages = 1;
          this.currentPage = 1;
          this.updatePagination();
          return;
        }

        const episodeIds = match.episode.map((url: string) =>
          url.split('/').pop()
        );
        this.filteredEpisodes = this.episodes.filter((ep) =>
          episodeIds.includes(String(ep.id))
        );
        this.totalPages = Math.max(1, Math.ceil(this.filteredEpisodes.length / 10));
        this.currentPage = 1;
        this.updatePagination();
      },
      error: () => {},
    });
  }

  updatePagination(): void {
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
    if (!this.episodeName.value) this.showNameOverlay = true;
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
