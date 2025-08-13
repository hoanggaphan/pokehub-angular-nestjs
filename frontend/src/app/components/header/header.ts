import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import AuthService from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './header.html',
})
export class Header {
  private readonly auth = inject(AuthService);
  isMenuOpen = signal(false);

  get loggedIn(): boolean {
    return this.auth.isLogged();
  }

  get username(): string {
    try {
      const data = this.auth.getUser();
      if (!data) return '';
      const parsed = JSON.parse(data);
      return parsed?.username ?? '';
    } catch {
      return '';
    }
  }

  onLogout(): void {
    this.auth.logout();
  }
}
