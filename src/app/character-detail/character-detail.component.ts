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
      this.isInTeam = team.some(
        (member) => member.name === this.character.name
      );
    });
  }

  addToTeam(): void {
    if (!this.character) return;

    this.rickpedia.addToTeam(this.character).subscribe({
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

    this.rickpedia.getTeam().subscribe((team) => {
      const match = team.find((member) => member.name === this.character.name);
      if (!match) {
        console.warn('Personaje no encontrado en el equipo');
        return;
      }

      this.rickpedia.removeFromTeam(String(match.id)).subscribe({
        next: () => {
          this.isInTeam = false;
        },
        error: (err) => {
          console.error('Error al eliminar personaje:', err);
        },
      });
    });
  }
}
