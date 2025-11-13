import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  pages: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private episodesService: EpisodesService,
    private charactersService: CharactersService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.episodesService.getEpisodeById(id).subscribe((ep: Episode) => {
        this.episode = ep;

        const ids = ep.characters.map((url: string) => url.split('/').pop()!);

        this.charactersService
          .getCharactersByIds(ids)
          .subscribe((data: Character[]) => {
            this.characters = Array.isArray(data) ? data : [data];
            this.totalPages = Math.max(
              1,
              Math.ceil(this.characters.length / this.pageSize)
            );
            this.pages = Array.from(
              { length: this.totalPages },
              (_, i) => i + 1
            );
            this.updatePagination();
          });
      });
    }
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedCharacters = this.characters.slice(
      start,
      start + this.pageSize
    );
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
}
