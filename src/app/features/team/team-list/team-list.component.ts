import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RickpediaService } from '../../../core/rickpedia.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TeamCreateComponent } from '../team-create/team-create.component';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
})
export class TeamListComponent implements OnInit {
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
  pageSize = 5;
  totalPages = 1;
  pages: number[] = [];

  constructor(
    private rickpedia: RickpediaService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const pageParam = this.route.snapshot.queryParamMap.get('page');
    if (pageParam) {
      this.currentPage = +pageParam;
    }

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

  removeFromTeam(id: number): void {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres eliminar este personaje del equipo?'
    );

    if (!confirmed) return;

    this.rickpedia.removeFromTeam(id).subscribe(() => {
      this.team = this.team.filter((member) => member.id !== id);
      if (this.currentPage > Math.ceil(this.team.length / this.pageSize)) {
        this.currentPage = Math.max(1, this.currentPage - 1);
      }
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
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

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
    this.router.navigate(['/team', id], {
      queryParams: { page: this.currentPage },
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(TeamCreateComponent, {
      width: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((created) => {
      if (created) {
        this.loadTeam();
      }
    });
  }

  openEditDialog(member: any): void {
    const dialogRef = this.dialog.open(TeamCreateComponent, {
      width: '500px',
      disableClose: true,
      data: member,
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.loadTeam();
      }
    });
  }
}
