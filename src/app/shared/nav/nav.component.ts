import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  private auth = inject(AuthService);

  links = [
    { path: '/', label: 'Dashboard' },
    { path: '/log', label: 'Log Workout' },
    { path: '/history', label: 'History' },
    { path: '/exercises', label: 'Exercises' },
    { path: '/body-stats', label: 'Body Stats' },
  ];

  logout() {
    this.auth.logout();
  }
}
