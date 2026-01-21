import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-turn-result',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>Turn Result</h2>
      <p *ngIf="!result">Play a turn to see results.</p>
      <div *ngIf="result">
        <p>Turn: {{ result.turn }}</p>
        <p>Region: {{ result.regionId }}</p>
        <p>Money: {{ result.money | number: '1.2-2' }}</p>
        <p>Event: {{ result.eventTriggered || 'None' }}</p>
        <h3>Transactions</h3>
        <table *ngIf="result.transactions?.length">
          <thead>
            <tr>
              <th>Good</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let tx of result.transactions">
              <td>{{ tx.goodId }}</td>
              <td>{{ tx.quantity }}</td>
              <td>{{ tx.price | number: '1.2-2' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrl: './turn-result.component.css',
})
export class TurnResultComponent {
  result: any = null;

  constructor() {
    const stored = localStorage.getItem('lastTurnResult');
    if (stored) {
      this.result = JSON.parse(stored);
    }
  }
}
