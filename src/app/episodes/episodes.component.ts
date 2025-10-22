import { Component } from '@angular/core';

@Component({
  selector: 'app-episodes',
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.scss']
})
export class EpisodesComponent {
  episodes = [
    {
      title: 'Pilot',
      number: 'Episodio 1',
      image: 'assets/episodes/pilot.jpg',
      description: 'Rick lleva a Morty a una misión peligrosa para extraer unas semillas.'
    },
    {
      title: 'Close Rick-Counters of the Rick Kind',
      number: 'Episodio 10',
      image: 'assets/episodes/close-rick.jpg',
      description: 'El Consejo de Ricks busca al Rick responsable de una serie de asesinatos de Ricks de otras dimensiones interdimensionales.'
    },
    {
      title: 'Total Rickall',
      number: 'Episodio 4',
      image: 'assets/episodes/total-rickall.jpg',
      description: 'Una invasión de parásitos altera la memoria familiar.'
    }
  ];
}