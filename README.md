# University E-Voting

A React and Vite prototype for a university student election portal. The public landing page follows `uni.jpeg` with the campus hero, role menu, and voter entry point. Separate role pages provide the live voting trend, candidate application and portal, and NEC tools for reviewing applications, scheduling elections, and printing reports.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## GitHub Pages

The GitHub Actions workflow builds the app with the `/uniE-voting/` base path and deploys `dist`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. Each push to `main` then deploys the site.

## Demo behavior

This is a frontend-only prototype. Election schedule, applications, approvals, and ballots are held in browser memory and are not shared with other users or persisted to a server. The live trend is simulated; connect an authenticated backend before using this for a real election.
