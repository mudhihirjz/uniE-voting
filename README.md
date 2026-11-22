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

This is a frontend-only prototype. Election schedule, applications, approvals, and demo ballot totals are saved in the current browser's local storage; they are not shared with other browsers or devices. The registered-voter total is sample data, while trends and candidate results are calculated only from ballots recorded in this browser.

There is no sign-in or role authorization. Local browser storage can be edited or cleared, so this demo must not be used to run a real election or to protect real voter identities and ballots.

To restart the demo, clear this site's local storage in the browser's developer tools.
