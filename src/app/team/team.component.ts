import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RickpediaService } from '../services/rickpedia.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  team: any[] = [];
  filteredTeam: any[] = [];

  alias = new FormControl('');
  note = new FormControl('');
  priority = new FormControl('');

  showAliasOverlay = true;
  showNoteOverlay = true;
  showPriorityOverlay = true;
  showFilterPanel = false;

  currentPage = 1;
  pageSize = 20;
  totalPages = 1;

  constructor(private rickpedia: RickpediaService, private router: Router) {}

  ngOnInit(): void {
    this.loadTeam();

    this.alias.valueChanges.subscribe(() => this.applyFilters());
    this.note.valueChanges.subscribe(() => this.applyFilters());
    this.priority.valueChanges.subscribe(() => this.applyFilters());
  }

  loadTeam(): void {
    this.rickpedia.getTeam().subscribe((data) => {
      this.team = data;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const aliasValue = this.alias.value?.trim().toLowerCase() || '';
    const noteValue = this.note.value?.trim().toLowerCase() || '';
    const priorityValue = this.priority.value?.trim().toLowerCase() || '';

    const filtered = this.team.filter(
      (member) =>
        member.name.toLowerCase().includes(aliasValue) &&
        member.species.toLowerCase().includes(noteValue) &&
        member.status.toLowerCase().includes(priorityValue)
    );

    this.totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    const start = (this.currentPage - 1) * this.pageSize;
    this.filteredTeam = filtered.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  onFocus(field: 'alias' | 'note' | 'priority'): void {
    if (field === 'alias') this.showAliasOverlay = false;
    if (field === 'note') this.showNoteOverlay = false;
    if (field === 'priority') this.showPriorityOverlay = false;
  }

  onBlur(field: 'alias' | 'note' | 'priority'): void {
    if (field === 'alias' && !this.alias.value) this.showAliasOverlay = true;
    if (field === 'note' && !this.note.value) this.showNoteOverlay = true;
    if (field === 'priority' && !this.priority.value)
      this.showPriorityOverlay = true;
  }

  goToDetail(id: number): void {
    this.router.navigate(['/characters', id]);
  }

  removeFromTeam(id: number): void {
    this.rickpedia.removeFromTeam(String(id)).subscribe(() => {
      this.team = this.team.filter((member) => member.id !== id);
      this.applyFilters();
    });
  }
}
