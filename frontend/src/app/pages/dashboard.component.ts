import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="card">
      <h2>Create Save</h2>
      <div class="form-row">
        <input [(ngModel)]="newSaveName" placeholder="Captain name" />
        <button (click)="createSave()">Create</button>
      </div>
    </div>

    <div class="card">
      <h2>Load Save</h2>
      <div class="form-row">
        <input [(ngModel)]="loadId" type="number" placeholder="Save ID" />
        <button class="secondary" (click)="loadSave()">Load</button>
      </div>
    </div>

    <div class="card" *ngIf="activeSave">
      <h3>Active Save</h3>
      <p>ID: {{ activeSave.id }}</p>
      <p>Name: {{ activeSave.name }}</p>
      <p>Turn: {{ activeSave.current_turn }}</p>
      <p>Region: {{ activeSave.region_id }}</p>
      <p>Money: {{ activeSave.money | number: '1.2-2' }}</p>
    </div>
  `,
})
export class DashboardComponent {
  newSaveName = 'New Captain';
  loadId = 1;
  activeSave: any = null;

  constructor(private readonly api: ApiService) {
    const stored = localStorage.getItem('activeSave');
    if (stored) {
      this.activeSave = JSON.parse(stored);
    }
  }

  createSave() {
    this.api.createSave(this.newSaveName).subscribe((response) => {
      this.activeSave = response.data;
      localStorage.setItem('activeSave', JSON.stringify(this.activeSave));
    });
  }

  loadSave() {
    this.api.loadSave(this.loadId).subscribe((response) => {
      this.activeSave = response.data;
      localStorage.setItem('activeSave', JSON.stringify(this.activeSave));
    });
  }
}
