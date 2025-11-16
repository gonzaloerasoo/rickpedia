import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationsService } from '../locations.service';
import { CharactersService } from '../../characters/characters.service';
import { Location } from '../location.model';
import { Character } from '../../characters/character.model';

@Component({
  selector: 'app-locations-detail',
  templateUrl: './locations-detail.component.html',
  styleUrls: ['./locations-detail.component.scss'],
})
export class LocationsDetailComponent implements OnInit {
  location: Location | null = null;
  residents: Character[] = [];
  paginatedResidents: Character[] = [];

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  visiblePageNumbers: number[] = [];
  showPrevEllipsis = false;
  showNextEllipsis = false;

  pageToReturn = 1;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locationsService: LocationsService,
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
      this.locationsService.getLocationById(id).subscribe({
        next: (loc: Location) => {
          this.location = loc;
          const ids = loc.residents.map((url: string) => url.split('/').pop()!);

          if (ids.length > 0) {
            this.charactersService.getCharactersByIds(ids).subscribe({
              next: (data: Character[]) => {
                this.residents = Array.isArray(data) ? data : [data];
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
    this.totalPages = Math.max(1, Math.ceil(this.residents.length / this.itemsPerPage));
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

    const sliceStart = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedResidents = this.residents.slice(sliceStart, sliceStart + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage(): void {
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
    this.router.navigate(['/locations'], {
      queryParams: { page: this.pageToReturn }
    });
  }
}
