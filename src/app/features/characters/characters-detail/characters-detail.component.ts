import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharactersService } from '../characters.service';
import { TeamService } from '../../team/team.service';
import { Character } from '../character.model';
import { TeamMember } from '../../team/team-member.model';

@Component({
  selector: 'app-characters-detail',
  templateUrl: './characters-detail.component.html',
  styleUrls: ['./characters-detail.component.scss'],
})
export class CharactersDetailComponent implements OnInit {
  character: Character | null = null;
  isInTeam = false;
  pageToReturn: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private charactersService: CharactersService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const pageParam = this.route.snapshot.queryParamMap.get('page');
    if (pageParam) {
      this.pageToReturn = +pageParam;
    }
    if (id) {
      this.charactersService
        .getCharacterById(id)
        .subscribe((data: Character) => {
          this.character = data;
          this.checkIfInTeam();
        });
    }
  }

  checkIfInTeam(): void {
    this.teamService.getTeam().subscribe((team: TeamMember[]) => {
      if (this.character) {
        this.isInTeam = team.some((member) => member.id === this.character!.id);
      }
    });
  }

  addToTeam(): void {
    if (!this.character) return;
    const payload: TeamMember = {
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
    this.teamService.addToTeam(payload).subscribe({
      next: () => {
        this.isInTeam = true;
      },
      error: () => {
        console.error('Error al guardar personaje');
      },
    });
  }

  removeFromTeam(): void {
    if (!this.character) return;
    this.teamService.removeFromTeam(this.character.id).subscribe({
      next: () => {
        this.isInTeam = false;
      },
      error: () => {
        console.error('Error al eliminar personaje');
      },
    });
  }

  goBack(): void {
    if (!this.character) {
      this.router.navigate(['/characters'], {
        queryParams: { page: this.pageToReturn },
      });
      return;
    }
    this.router.navigate(['/characters'], {
      queryParams: { page: this.pageToReturn },
      fragment: 'character-' + this.character.id,
    });
  }
}
