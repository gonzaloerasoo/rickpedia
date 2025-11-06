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
        (member) => String(member.id) === String(this.character.id)
      );
    });
  }

  addToTeam(): void {
    this.rickpedia.addToTeam(String(this.character.id)).subscribe(() => {
      this.isInTeam = true;
    });
  }

  removeFromTeam(): void {
    this.rickpedia.removeFromTeam(String(this.character.id)).subscribe(() => {
      this.isInTeam = false;
    });
  }
}
