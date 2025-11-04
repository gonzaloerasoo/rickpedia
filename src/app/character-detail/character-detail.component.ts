import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RickpediaService } from '../services/rickpedia.service';
import { TeamService, TeamMember } from '../services/team.service';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss'],
})
export class CharacterDetailComponent implements OnInit {
  character: any;

  constructor(
    private route: ActivatedRoute,
    private rickpedia: RickpediaService,
    private team: TeamService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.rickpedia.getCharacterById(id).subscribe((data) => {
        this.character = data;
      });
    }
  }

  addToTeam(): void {
    const member: TeamMember = {
      name: this.character.name,
      alias: this.character.name.toLowerCase().replace(/\s+/g, '-'),
      image: this.character.image,
      role: 'Personaje',
      description: `${this.character.species} (${this.character.status})`,
      priority: 'Media',
    };
    this.team.addMember(member);
  }
}
