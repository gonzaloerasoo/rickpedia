import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit, OnDestroy {
  team = [
    {
      name: 'Justin Roiland',
      alias: 'justin-roiland',
      image: 'assets/team/justin.jpg',
      role: 'Creador',
      description: 'Creador principal y voz de Rick y Morty.',
      priority: 'Alta',
    },
    {
      name: 'Dan Harmon',
      alias: 'dan-harmon',
      image: 'assets/team/dan.jpg',
      role: 'Creador',
      description: 'Co-creador y principal guionista de la serie.',
      priority: 'Alta',
    },
    {
      name: 'Sarah Carbiener',
      alias: 'sarah-carbiener',
      image: 'assets/team/sarah.jpg',
      role: 'Guionista',
      description: 'Guionista destacada con episodios notables.',
      priority: 'Media',
    },
    {
      name: 'James McDermott',
      alias: 'james-mcdermott',
      image: 'assets/team/james.jpg',
      role: 'Productor',
      description: 'Productor clave en la realización del show.',
      priority: 'Baja',
    },
  ];

  filteredTeam = [...this.team];

  alias = new FormControl('');
  note = new FormControl('');
  priority = new FormControl('');

  showAliasOverlay = true;
  showNoteOverlay = true;
  showPriorityOverlay = true;

  showFilterPanel = false;

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';

    this.alias.valueChanges.subscribe(() => this.applyFilters());
    this.note.valueChanges.subscribe(() => this.applyFilters());
    this.priority.valueChanges.subscribe(() => this.applyFilters());
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }

  applyFilters(): void {
    const aliasValue = this.alias.value?.trim().toLowerCase() || '';
    const noteValue = this.note.value?.trim().toLowerCase() || '';
    const priorityValue = this.priority.value?.trim().toLowerCase() || '';

    this.filteredTeam = this.team.filter(
      (member) =>
        member.name.toLowerCase().includes(aliasValue) &&
        member.description.toLowerCase().includes(noteValue) &&
        member.priority.toLowerCase().includes(priorityValue)
    );
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
