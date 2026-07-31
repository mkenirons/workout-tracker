import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  links = [
    { path: '/', label: 'Dashboard' },
    { path: '/log', label: 'Log Workout' },
    { path: '/history', label: 'History' },
    { path: '/exercises', label: 'Exercises' },
    { path: '/body-stats', label: 'Body Stats' },
  ];
}
