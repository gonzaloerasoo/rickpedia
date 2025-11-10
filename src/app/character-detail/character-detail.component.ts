import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RickpediaService } from '../services/rickpedia.service';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss'],
})
export class CharacterDetailComponent implements OnInit {
  character: any;
  isInTeam = false;

  constructor(
    private route: ActivatedRoute,
    private rickpedia: RickpediaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.rickpedia.getCharacterById(id).subscribe((data) => {
        this.character = data;
        this.checkIfInTeam();
      });
    }
  }

  checkIfInTeam(): void {
    this.rickpedia.getTeam().subscribe((team) => {
      this.isInTeam = team.some((member) => member.id === this.character.id);
    });
  }

  addToTeam(): void {
    if (!this.character) return;

    const payload = {
      id: this.character.id,
      name: this.character.name,
      species: this.character.species,
      status: this.character.status,
      origin: this.character.origin?.name || 'Desconocido',
      location: this.character.location?.name || 'Desconocido',
      gender: this.character.gender || 'Desconocido',
      type: this.character.type || 'Desconocido',
      image: this.character.image,
      created: this.character.created || new Date().toISOString(),
    };

    this.rickpedia.addToTeam(payload).subscribe({
      next: () => {
        this.isInTeam = true;
      },
      error: (err) => {
        console.error('Error al guardar personaje:', err);
      },
    });
  }

  removeFromTeam(): void {
    if (!this.character) return;

    this.rickpedia.removeFromTeam(this.character.id).subscribe({
      next: () => {
        this.isInTeam = false;
      },
      error: (err) => {
        console.error('Error al eliminar personaje:', err);
      },
    });
  }
}
