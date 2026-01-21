import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>Market Prices</h2>
      <p *ngIf="!activeSave">Load or create a save first.</p>
      <div *ngIf="activeSave">
        <p>Turn {{ activeSave.current_turn }} | Region {{ activeSave.region_id }}</p>
        <button (click)="loadMarket()">Refresh Prices</button>
        <table *ngIf="prices.length">
          <thead>
            <tr>
              <th>Good</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of prices">
              <td>{{ item.name }}</td>
              <td>{{ item.price | number: '1.2-2' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrl: './market.component.css',
})
export class MarketComponent {
  activeSave: any = null;
  prices: Array<{ name: string; price: number }> = [];

  constructor(private readonly api: ApiService) {
    const stored = localStorage.getItem('activeSave');
    if (stored) {
      this.activeSave = JSON.parse(stored);
      this.loadMarket();
    }
  }

  loadMarket() {
    if (!this.activeSave) {
      return;
    }
    this.api
      .getMarketState(this.activeSave.id, this.activeSave.current_turn, this.activeSave.region_id)
      .subscribe((response) => {
        this.prices = response.data.prices;
      });
  }
}
