import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-trade',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <h2>Trade Plan</h2>
      <p *ngIf="!activeSave">Load or create a save first.</p>
      <form *ngIf="activeSave" [formGroup]="form" (ngSubmit)="submitPlan()">
        <table>
          <thead>
            <tr>
              <th>Good</th>
              <th>Price</th>
              <th>Quantity (+buy / -sell)</th>
            </tr>
          </thead>
          <tbody formArrayName="quantities">
            <tr *ngFor="let good of goods; index as i">
              <td>{{ good.name }}</td>
              <td>{{ good.price | number: '1.2-2' }}</td>
              <td>
                <input type="number" [formControlName]="i" />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="actions">
          <button type="submit">Submit Plan</button>
          <button type="button" class="secondary" (click)="nextTurn()">Next Turn</button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './trade.component.css',
})
export class TradeComponent {
  activeSave: any = null;
  form = this.fb.group({
    quantities: this.fb.array([] as number[]),
  });
  goods: Array<{ goodId: number; name: string; price: number }> = [];

  constructor(
    private readonly api: ApiService,
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {
    const stored = localStorage.getItem('activeSave');
    if (stored) {
      this.activeSave = JSON.parse(stored);
      this.loadMarket();
    }
  }

  get items() {
    return this.form.get('quantities') as FormArray;
  }

  loadMarket() {
    if (!this.activeSave) {
      return;
    }
    this.api
      .getMarketState(this.activeSave.id, this.activeSave.current_turn, this.activeSave.region_id)
      .subscribe((response) => {
        this.goods = response.data.prices;
        this.items.clear();
        this.goods.forEach(() => this.items.push(this.fb.control(0)));
      });
  }

  submitPlan() {
    if (!this.activeSave) {
      return;
    }
    const items = this.goods.map((good, index) => ({
      goodId: good.goodId,
      quantity: Number(this.items.at(index).value || 0),
    }));
    const payload = {
      saveId: this.activeSave.id,
      turn: this.activeSave.current_turn,
      regionId: this.activeSave.region_id,
      items,
    };
    this.api.createTradePlan(payload).subscribe(() => {
      this.form.markAsPristine();
    });
  }

  nextTurn() {
    if (!this.activeSave) {
      return;
    }
    this.api.nextTurn(this.activeSave.id).subscribe((response) => {
      const summary = response.data;
      this.activeSave.current_turn = summary.turn + 1;
      this.activeSave.money = summary.money;
      localStorage.setItem('activeSave', JSON.stringify(this.activeSave));
      localStorage.setItem('lastTurnResult', JSON.stringify(summary));
      this.router.navigate(['/turn-result']);
    });
  }
}
