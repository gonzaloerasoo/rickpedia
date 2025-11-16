import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EpisodesService } from '../episodes.service';
import { CharactersService } from '../../characters/characters.service';
import { Episode } from '../episode.model';
import { Character } from '../../characters/character.model';

@Component({
  selector: 'app-episodes-detail',
  templateUrl: './episodes-detail.component.html',
  styleUrls: ['./episodes-detail.component.scss'],
})
export class EpisodesDetailComponent implements OnInit {
  episode: Episode | null = null;
  characters: Character[] = [];
  paginatedCharacters: Character[] = [];

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  visiblePageNumbers: number[] = [];
  showPrevEllipsis = false;
  showNextEllipsis = false;

  pageToReturn = 1;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private episodesService: EpisodesService,
    private charactersService: CharactersService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const pageParam = this.route.snapshot.queryParamMap.get('page');
    if (pageParam) {
      this.pageToReturn = +pageParam;
    }

    if (id) {
      this.isLoading = true;
      this.episodesService.getEpisodeById(id).subscribe({
        next: (ep: Episode) => {
          this.episode = ep;
          const ids = ep.characters.map((url: string) => url.split('/').pop()!);

          if (ids.length > 0) {
            this.charactersService.getCharactersByIds(ids).subscribe({
              next: (data: Character[]) => {
                this.characters = Array.isArray(data) ? data : [data];
                this.currentPage = 1;
                this.updatePagination();
                this.isLoading = false;
              },
              error: () => {
                this.isLoading = false;
              },
            });
          } else {
            this.isLoading = false;
          }
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  updatePagination(): void {
    this.totalPages = Math.max(1, Math.ceil(this.characters.length / this.pageSize));
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

    const sliceStart = (this.currentPage - 1) * this.pageSize;
    this.paginatedCharacters = this.characters.slice(sliceStart, sliceStart + this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  handlePrevEllipsis(): void {
    this.goToPage(this.visiblePageNumbers[0] - 1);
  }

  handleNextEllipsis(): void {
    this.goToPage(this.visiblePageNumbers[this.visiblePageNumbers.length - 1] + 1);
  }

  goBack(): void {
    this.router.navigate(['/episodes'], {
      queryParams: { page: this.pageToReturn }
    });
  }
}
