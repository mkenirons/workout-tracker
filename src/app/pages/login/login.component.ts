import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  auth = inject(AuthService);

  signingIn = signal(false);

  async signIn() {
    this.signingIn.set(true);
    await this.auth.loginWithGoogle();
    this.signingIn.set(false);
  }
}
