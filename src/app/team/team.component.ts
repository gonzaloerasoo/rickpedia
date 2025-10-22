import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit, OnDestroy {
  team = [
    {
      name: 'Justin Roiland',
      image: 'assets/team/justin.jpg',
      role: 'Creador',
      description: 'Creador principal y voz de Rick y Morty.'
    },
    {
      name: 'Dan Harmon',
      image: 'assets/team/dan.jpg',
      role: 'Creador',
      description: 'Co-creador y principal guionista de la serie.'
    },
    {
      name: 'Sarah Carbiener',
      image: 'assets/team/sarah.jpg',
      role: 'Guionista',
      description: 'Guionista destacada con episodios notables.'
    },
    {
      name: 'James McDermott',
      image: 'assets/team/james.jpg',
      role: 'Productor',
      description: 'Productor clave en la realización del show.'
    }
  ];

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }
}