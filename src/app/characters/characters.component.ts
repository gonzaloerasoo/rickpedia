import { Component, OnInit } from '@angular/core';
import { RickpediaService } from '../services/rickpedia.service';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {
  characters: any[] = [];

  constructor(private rickpedia: RickpediaService) {}

  ngOnInit(): void {
    this.rickpedia.getAllCharacters().subscribe(data => {
      this.characters = data;
    });
  }
}