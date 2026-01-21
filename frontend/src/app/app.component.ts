import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="container">
      <h1>Trade Horizons</h1>
      <nav>
        <a routerLink="/">Dashboard</a>
        <a routerLink="/market">Market</a>
        <a routerLink="/trade">Trade Plan</a>
        <a routerLink="/turn-result">Turn Result</a>
      </nav>
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent {}
