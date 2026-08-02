import { Injectable, computed, inject, signal } from '@angular/core';
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { FirebaseCoreService } from './firebase-core.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private core = inject(FirebaseCoreService);

  private readonly _user = signal<User | null>(null);
  private readonly _authReady = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly user = this._user.asReadonly();
  readonly authReady = this._authReady.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  constructor() {
    onAuthStateChanged(this.core.auth, (user) => {
      this._user.set(user);
      this._authReady.set(true);
    });
  }

  async loginWithGoogle(): Promise<void> {
    this._error.set(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.core.auth, provider);
    } catch (err) {
      this._error.set(err instanceof Error ? err.message : 'Sign-in failed');
    }
  }

  async logout(): Promise<void> {
    await signOut(this.core.auth);
  }
}
