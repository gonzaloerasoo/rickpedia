import { Component } from '@angular/core';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent {
  characters = [
    {
      name: 'Rick Sanchez',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      role: 'Científico loco',
      description: 'Genio interdimensional y protagonista de la serie.'
    },
    {
      name: 'Morty Smith',
      image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
      role: 'Nieto de Rick',
      description: 'Inseguro pero valiente en sus aventuras.'
    },
    {
      name: 'Summer Smith',
      image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
      role: 'Hermana de Morty',
      description: 'Decidida, curiosa y siempre lista para la acción.'
    },
    {
      name: 'Beth Smith',
      image: 'https://rickandmortyapi.com/api/character/avatar/4.jpeg',
      role: 'Madre de Morty',
      description: 'Veterinaria especializada en caballos y con carácter fuerte.'
    }
  ];
}