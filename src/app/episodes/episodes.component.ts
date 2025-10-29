import { Component, OnInit } from '@angular/core';
import { RickpediaService } from '../services/rickpedia.service';
import { FormControl } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-episodes',
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.scss'],
})
export class EpisodesComponent implements OnInit {
  episodes: any[] = [];
  filteredEpisodes: any[] = [];
  charactersInEpisode: any[] = [];
  selectedEpisodeTitle = '';

  episodeName = new FormControl('');
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
    this.rickpedia.getAllEpisodes().subscribe((data) => {
      this.episodes = data;
      this.filteredEpisodes = data;
      this.updatePagination();
    });

    this.episodeName.valueChanges.subscribe(() => {
      this.filterEpisodes();
      this.searchCharactersByEpisode();
    });

    this.characterName.valueChanges.subscribe(() => {
      this.searchEpisodesByCharacter();
    });
  }

  get paginatedEpisodes(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredEpisodes.slice(start, start + this.pageSize);
  }

  filterEpisodes(): void {
    const name = this.episodeName.value?.trim().toLowerCase();
    this.filteredEpisodes = name
      ? this.episodes.filter(
          (ep) =>
            ep.name.toLowerCase().includes(name) ||
            ep.episode.toLowerCase().includes(name)
        )
      : this.episodes;

    this.currentPage = 1;
    this.updatePagination();
  }

  searchCharactersByEpisode(): void {
    const name = this.episodeName.value?.trim();
    if (!name) {
      this.charactersInEpisode = [];
      this.selectedEpisodeTitle = '';
      return;
    }

    this.rickpedia
      .getEpisodeByName(name)
      .pipe(
        map((res: any) => res?.results?.[0] || null),
        catchError(() => of(null))
      )
      .subscribe((episode: any) => {
        if (!episode) {
          this.charactersInEpisode = [];
          this.selectedEpisodeTitle =
            'No se encontró ningún episodio con ese nombre.';
          return;
        }

        this.selectedEpisodeTitle = episode.name;
        const ids = episode.characters.map((url: string) =>
          url.split('/').pop()
        );
        if (ids.length === 0) {
          this.charactersInEpisode = [];
          return;
        }

        this.rickpedia.getCharactersByIds(ids).subscribe((characters: any) => {
          this.charactersInEpisode = Array.isArray(characters)
            ? characters
            : [characters];
        });
      });
  }

  searchEpisodesByCharacter(): void {
    const name = this.characterName.value?.trim().toLowerCase();
    if (!name) {
      this.filteredEpisodes = this.episodes;
      this.currentPage = 1;
      this.updatePagination();
      return;
    }

    this.rickpedia.getAllCharacters().subscribe((characters: any[]) => {
      const match = characters.find((c) => c.name.toLowerCase().includes(name));
      if (!match || !match.episode) {
        this.filteredEpisodes = [];
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

      this.currentPage = 1;
      this.updatePagination();
    });
  }

  updatePagination(): void {
    this.totalPages = Math.max(
      1,
      Math.ceil(this.filteredEpisodes.length / this.pageSize)
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
