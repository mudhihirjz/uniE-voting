# University E-Voting

A React and Vite prototype for a university student election portal. The interface includes the public voter landing page and live participation trend, candidate applications and portal, plus an NEC admin dashboard for reviewing applications, scheduling elections, and printing reports.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## Demo behavior

This is a frontend-only prototype. Election schedule, applications, approvals, and ballots are held in browser memory and are not shared with other users or persisted to a server. The live trend is simulated; connect an authenticated backend before using this for a real election.
