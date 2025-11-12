import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TeamService } from '../team.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeamMember } from '../team-member.model';

@Component({
  selector: 'app-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.scss'],
})
export class TeamCreateComponent implements OnInit {
  form!: FormGroup;
  backendError: string | null = null;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private dialogRef: MatDialogRef<TeamCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<TeamMember> | null
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.data) {
      this.patchFormData(this.data);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      id: [null, [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      species: ['', Validators.required],
      status: ['', Validators.required],
      origin: ['', Validators.required],
      location: ['', Validators.required],
      gender: ['', Validators.required],
      type: [''],
      image: [
        '',
        [
          Validators.required,
          Validators.pattern(/^https?:\/\/.+\.(jpg|jpeg|png)$/),
        ],
      ],
      created: [new Date().toISOString()],
    });
  }

  private patchFormData(data: Partial<TeamMember>): void {
    this.form.patchValue({
      id: data.id,
      name: data.name,
      species: data.species,
      status: data.status,
      origin: this.extractName(data.origin),
      location: this.extractName(data.location),
      gender: data.gender,
      type: data.type,
      image: data.image,
      created: data.created,
    });
    this.form.get('id')?.disable();
  }

  submit(): void {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.backendError = null;
    this.submitting = true;

    const payload = this.buildPayload();

    if (!this.data) {
      const id = Number(this.form.get('id')?.value);
      this.teamService.isIdTaken(id).subscribe((taken: boolean) => {
        if (taken) {
          this.backendError = 'ID ya existe en el equipo';
          this.submitting = false;
          return;
        }
        this.createOrUpdate(payload);
      });
    } else {
      this.createOrUpdate(payload);
    }
  }

  private createOrUpdate(payload: TeamMember): void {
    const request = this.data
      ? this.teamService.updateTeamMember(Number(this.data?.id), payload)
      : this.teamService.addToTeam(payload);

    request.subscribe({
      next: () => {
        this.submitting = false;
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        this.backendError =
          err?.error?.message || 'Error al guardar en el servidor';
        this.submitting = false;
      },
    });
  }

  private buildPayload(): TeamMember {
    const raw = this.form.getRawValue();
    return {
      ...raw,
      origin: this.extractName(raw.origin),
      location: this.extractName(raw.location),
    };
  }

  private extractName(value: unknown): string {
    return this.isNamedObject(value) ? value.name : (value as string);
  }

  private isNamedObject(value: unknown): value is { name: string } {
    return !!value && typeof value === 'object' && 'name' in value;
  }
}
