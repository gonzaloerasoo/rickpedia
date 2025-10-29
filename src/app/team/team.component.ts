import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

interface TeamMember {
  name: string;
  image: string;
  role: string;
  description: string;
  priority: string;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  team: TeamMember[] = [
    {
      name: 'Justin Roiland',
      image: 'assets/team/justin.jpg',
      role: 'Creador',
      description: 'Creador principal y voz de Rick y Morty.',
      priority: 'Alta',
    },
    {
      name: 'Dan Harmon',
      image: 'assets/team/dan.jpg',
      role: 'Creador',
      description: 'Co-creador y principal guionista de la serie.',
      priority: 'Alta',
    },
    {
      name: 'Sarah Carbiener',
      image: 'assets/team/sarah.jpg',
      role: 'Guionista',
      description: 'Guionista destacada con episodios notables.',
      priority: 'Media',
    },
    {
      name: 'James McDermott',
      image: 'assets/team/james.jpg',
      role: 'Productor',
      description: 'Productor clave en la realización del show.',
      priority: 'Baja',
    },
    // Podés agregar más miembros si querés probar la paginación
  ];

  alias = new FormControl('');
  note = new FormControl('');
  priority = new FormControl('');

  showAliasOverlay = true;
  showNoteOverlay = true;
  showPriorityOverlay = true;
  showFilterPanel = false;

  filteredTeam: TeamMember[] = [];
  currentPage = 1;
  pageSize = 2;
  totalPages = 1;

  ngOnInit(): void {
    this.applyFilters();

    this.alias.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });

    this.note.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });

    this.priority.valueChanges.subscribe(() => {
      this.currentPage = 1;
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
        member.description.toLowerCase().includes(noteValue) &&
        member.priority.toLowerCase().includes(priorityValue)
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
}
