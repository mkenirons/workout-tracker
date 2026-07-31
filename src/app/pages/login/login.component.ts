import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private auth = inject(AuthService);

  passcode = signal('');
  error = signal(false);
  checking = signal(false);

  async submit() {
    this.checking.set(true);
    this.error.set(false);
    const ok = await this.auth.tryLogin(this.passcode());
    this.checking.set(false);
    if (!ok) {
      this.error.set(true);
      this.passcode.set('');
    }
  }
}
