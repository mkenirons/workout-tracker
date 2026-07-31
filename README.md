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

All data is stored locally in the browser (`localStorage`) — no backend
required.

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

Angular 19, standalone components, signals for state management, SCSS.
