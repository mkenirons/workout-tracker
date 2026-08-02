import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../firebase.config';

@Injectable({ providedIn: 'root' })
export class FirebaseCoreService {
  readonly app: FirebaseApp = initializeApp(firebaseConfig);
  readonly auth: Auth = getAuth(this.app);
  readonly firestore: Firestore = getFirestore(this.app);
}
