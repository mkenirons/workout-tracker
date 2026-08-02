# Workout Tracker

A personal workout tracker built with Angular. Seeded from a dumbbell training
programme spreadsheet, it lets you log sets/reps/weight per session, track
progress against personal records, and follow bodyweight & body-fat goals over
time.

## Features

- **Dashboard** — quick stats, goal progress, and last workout summary.
- **Log Workout** — pick a date, add exercises, record sets (weight × reps).
- **History** — browse and expand past sessions, delete if needed.
- **Exercise Library** — muscle-group-grouped exercises with target sets/reps
  and auto-calculated personal records; add/edit/remove exercises.
- **Body Stats** — track weight & body fat over time against a goal, with a
  progress bar.
- **Progress** — per-exercise strength chart (top set weight per session) with
  hover detail and a data table.
- **Quick-start templates** — one-tap presets for a regular training split
  that pre-fill the exercise list for that day.

Sign-in is via Google (Firebase Authentication), and all data is stored in
Firestore, scoped to your account and synced in real time across devices.
Firestore security rules restrict read/write to a single allow-listed
account — see `firestore.rules`.

## Development

```bash
npm install
npm start        # ng serve, http://localhost:4200
```

```bash
npm run build     # production build to dist/
npm test          # unit tests (Karma/Jasmine)
```

## Tech stack

Angular 19, standalone components, signals for state management, SCSS,
Firebase (Authentication + Firestore).
