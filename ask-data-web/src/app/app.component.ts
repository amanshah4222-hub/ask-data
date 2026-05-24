import { Component, inject, signal } from '@angular/core';
import { NgIf, NgFor, AsyncPipe, JsonPipe } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

import { ApiService } from './core/app.service';
import { AskInputComponent } from './ask-input/ask-input.component';
import { ResultGridComponent } from './result-grid/result-grid.component';
import { ExplainPanelComponent } from './explain-panel/explain-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    JsonPipe,
    AskInputComponent,
    ResultGridComponent,
    ExplainPanelComponent,
  ],
})
export class AppComponent {
  auth = inject(AuthService);

  busy = signal(false);
  rows = signal<any[]>([]);
  columns = signal<string[]>([]);
  explain = signal<any | null>(null);
  error = signal<string | null>(null);

  constructor(private api: ApiService) {}

  login() {
    this.auth.loginWithRedirect();
  }

  signup() {
    this.auth.loginWithRedirect({
      authorizationParams: { screen_hint: 'signup' },
    });
  }

  logout() {
    this.auth.logout({
      logoutParams: { returnTo: 'https://amanshah8.github.io/LLM-Driven-Analytics-Platform/' },
    });
  }

  onAsk(question: string) {
  if (this.busy()) return;

    const trimmed = question?.trim();
    if (!trimmed) {
      this.error.set('Please enter a question.');
      return;
    }

    this.busy.set(true);
    this.error.set(null);

    this.api.ask(trimmed, 10).subscribe({
      next: (res) => {
        const data = res?.data ?? [];
        this.rows.set(data);
        this.columns.set(data.length ? Object.keys(data[0]) : []);
        this.explain.set(res?.explain ?? null);
      },
      error: () => {
        this.error.set('Request failed');
      },
      complete: () => this.busy.set(false),
    });
  }
}