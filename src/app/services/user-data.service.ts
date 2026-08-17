import { Injectable, effect, inject, signal } from '@angular/core';
import { DocumentReference, Unsubscribe, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { FirebaseCoreService } from './firebase-core.service';
import { AuthService } from './auth.service';
import { Exercise } from '../models/exercise.model';
import { WorkoutSession } from '../models/workout.model';
import { BodyGoal, BodyStatEntry } from '../models/body-stat.model';
import { EXERCISE_SEED } from '../data/exercises.seed';
import { BODY_GOAL_SEED } from '../data/body-stats.seed';

export interface UserData {
  exercises: Exercise[];
  sessions: WorkoutSession[];
  bodyStats: BodyStatEntry[];
  bodyGoal: BodyGoal;
}

function defaultUserData(): UserData {
  return {
    exercises: EXERCISE_SEED,
    sessions: [],
    bodyStats: [],
    bodyGoal: BODY_GOAL_SEED,
  };
}

/** Legacy per-device data from the old passcode-gated (localStorage-only) version of the app. */
function readLegacyLocalData(): UserData {
  const parse = <T>(key: string, fallback: T): T => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  };
  return {
    exercises: parse('workout-tracker.exercises', EXERCISE_SEED),
    sessions: parse('workout-tracker.sessions', []),
    bodyStats: parse('workout-tracker.body-stats', []),
    bodyGoal: parse('workout-tracker.body-goal', BODY_GOAL_SEED),
  };
}

@Injectable({ providedIn: 'root' })
export class UserDataService {
  private core = inject(FirebaseCoreService);
  private authService = inject(AuthService);

  private readonly _data = signal<UserData>(defaultUserData());
  private readonly _loaded = signal(false);
  private readonly _error = signal<string | null>(null);
  private unsubscribe: Unsubscribe | null = null;
  private docRef: DocumentReference | null = null;

  readonly data = this._data.asReadonly();
  readonly loaded = this._loaded.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {
    effect((onCleanup) => {
      const user = this.authService.user();
      this.unsubscribe?.();
      this.unsubscribe = null;
      this.docRef = null;
      this._loaded.set(false);
      this._error.set(null);

      if (!user) {
        this._data.set(defaultUserData());
        return;
      }

      const ref = doc(this.core.firestore, 'users', user.uid);
      this.docRef = ref;
      this.unsubscribe = onSnapshot(
        ref,
        async (snap) => {
          if (snap.exists()) {
            const raw = snap.data() as Partial<UserData>;
            this._data.set({
              exercises: raw.exercises ?? EXERCISE_SEED,
              sessions: raw.sessions ?? [],
              bodyStats: raw.bodyStats ?? [],
              bodyGoal: raw.bodyGoal ?? BODY_GOAL_SEED,
            });
          } else {
            const seed = readLegacyLocalData();
            await setDoc(ref, seed);
          }
          this._loaded.set(true);
        },
        (err) => {
          this._error.set(err.message ?? 'Failed to load your data from Firestore.');
        },
      );

      onCleanup(() => this.unsubscribe?.());
    });
  }

  async persist(partial: Partial<UserData>): Promise<void> {
    if (!this.docRef) return;
    await setDoc(this.docRef, partial, { merge: true });
  }
}
