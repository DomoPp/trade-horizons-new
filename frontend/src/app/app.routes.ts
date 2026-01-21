import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component';
import { MarketComponent } from './pages/market.component';
import { TradeComponent } from './pages/trade.component';
import { TurnResultComponent } from './pages/turn-result.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'market', component: MarketComponent },
  { path: 'trade', component: TradeComponent },
  { path: 'turn-result', component: TurnResultComponent },
  { path: '**', redirectTo: '' },
];
