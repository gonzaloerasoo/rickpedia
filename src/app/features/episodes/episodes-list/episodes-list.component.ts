import { Component, OnInit } from '@angular/core';
import { EpisodesService } from '../episodes.service';
import { CharactersService } from '../../characters/characters.service';
import { FormControl } from '@angular/forms';
import { Episode } from '../episode.model';
import { Character } from '../../characters/character.model';

@Component({
  selector: 'app-episodes-list',
  templateUrl: './episodes-list.component.html',
  styleUrls: ['./episodes-list.component.scss'],
})
export class EpisodesListComponent implements OnInit {
  episodes: Episode[] = [];
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

  constructor(
    private episodesService: EpisodesService,
    private charactersService: CharactersService
  ) {}

  ngOnInit(): void {
    this.loadAllEpisodes();

    this.episodeName.valueChanges.subscribe(() => {
      this.searchCharactersByEpisode();
    });

    this.characterName.valueChanges.subscribe(() => {
      this.searchEpisodesByCharacter();
    });
  }

  loadAllEpisodes(): void {
    this.episodes = [];
    this.episodesService.getAllEpisodes().subscribe((res: Episode[]) => {
      this.episodes = res;
      this.totalPages = Math.ceil(this.episodes.length / 10);
      this.currentPage = 1;
      this.updatePagination();
    });
  }

  get paginatedEpisodes(): Episode[] {
    const start = (this.currentPage - 1) * 10;
    const end = start + 10;
    return this.episodes.slice(start, end);
  }

  searchCharactersByEpisode(): void {
    const raw = this.episodeName.value?.trim() || '';
    const inputLower = raw.toLowerCase();
    const inputUpper = raw.toUpperCase();

    if (!raw) {
      this.charactersInEpisode = [];
      this.selectedEpisodeTitle = '';
      return;
    }

    let target: Episode | undefined;

    if (this.episodes.length === 1) {
      const ep = this.episodes[0];
      const exactName = ep.name.toLowerCase() === inputLower;
      const exactCode = ep.episode.toLowerCase() === inputLower;
      if (exactName || exactCode) {
        target = ep;
      }
    }

    if (!target && /^[sS]\d{2}[eE]\d{2}$/.test(raw)) {
      target = this.episodes.find(
        (ep) => ep.episode.toUpperCase() === inputUpper
      );
    }

    if (!target) {
      target = this.episodes.find((ep) => ep.name.toLowerCase() === inputLower);
    }

    if (!target) {
      this.charactersInEpisode = [];
      this.selectedEpisodeTitle = '';
      return;
    }

    this.selectedEpisodeTitle = target.name;

    const ids = target.characters
      .map((url: string) => url.split('/').pop()!)
      .filter(Boolean);

    if (ids.length === 0) {
      this.charactersInEpisode = [];
      return;
    }

    this.charactersService
      .getCharactersByIds(ids)
      .subscribe((characters: Character[]) => {
        this.charactersInEpisode = Array.isArray(characters)
          ? characters
          : [characters];
      });
  }

  searchEpisodesByCharacter(): void {
    const name = this.characterName.value?.trim().toLowerCase();
    if (!name) {
      this.loadAllEpisodes();
      return;
    }

    this.charactersService
      .getAllCharacters()
      .subscribe((characters: Character[]) => {
        const match = characters.find((c) =>
          c.name.toLowerCase().includes(name)
        );
        if (!match || !match.episode) {
          this.episodes = [];
          this.totalPages = 1;
          this.currentPage = 1;
          this.updatePagination();
          return;
        }

        const episodeIds = match.episode.map((url: string) =>
          url.split('/').pop()
        );
        this.episodes = this.episodes.filter((ep) =>
          episodeIds.includes(String(ep.id))
        );
        this.totalPages = Math.ceil(this.episodes.length / 10);
        this.currentPage = 1;
        this.updatePagination();
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
