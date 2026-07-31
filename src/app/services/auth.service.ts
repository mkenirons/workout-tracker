import { Injectable, signal } from '@angular/core';

const PASSCODE_HASH = '68c2ef1ad955c92bbcc9cd424c2a48cd2eace00e3e2ced2b2158329603ced7c1';
const AUTH_KEY = 'workout-tracker.auth';

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _isAuthenticated = signal(localStorage.getItem(AUTH_KEY) === 'true');
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  async tryLogin(passcode: string): Promise<boolean> {
    const hash = await sha256Hex(passcode);
    const ok = hash === PASSCODE_HASH;
    if (ok) {
      localStorage.setItem(AUTH_KEY, 'true');
      this._isAuthenticated.set(true);
    }
    return ok;
  }

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
    this._isAuthenticated.set(false);
  }
}
