import { Component } from '@angular/core';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent {
  team = [
    {
      name: 'Justin Roiland',
      image: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Justin_Roiland_2010.jpg',
      role: 'Creador',
      description: 'Creador principal y voz de Rick y Morty.'
    },
    {
      name: 'Dan Harmon',
      image: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Dan_Harmon_2013.jpg',
      role: 'Creador',
      description: 'Co-creador y principal guionista de la serie.'
    },
    {
      name: 'Sarah Carbiener',
      image: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Sarah_Carbiener.jpg',
      role: 'Guionista',
      description: 'Guionista destacada con episodios notables.'
    },
    {
      name: 'James McDermott',
      image: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/James_McDermott.jpg',
      role: 'Productor',
      description: 'Productor clave en la realización del show.'
    }
  ];
}