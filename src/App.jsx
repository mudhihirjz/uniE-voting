import React, { useEffect, useMemo, useState } from "react";

const initialApplications = [
  { id: 1, name: "Amina Joseph", studentId: "UE/2024/0182", position: "Student President", status: "Pending", manifesto: "I will advocate for students and improve the quality of our campus community." },
  { id: 2, name: "Brian Mwangi", studentId: "UE/2023/0097", position: "Dean of Students", status: "Pending", manifesto: "I will strengthen student support and make university services easier to access." },
  { id: 3, name: "Neema Peter", studentId: "UE/2024/0241", position: "Treasurer", status: "Pending", manifesto: "I will promote transparent budgeting and regular financial updates for students." },
];

const positions = ["Student President", "Dean of Students", "Treasurer", "Academic Representative"];
const adminSections = [
  ["Overview", "chart"],
  ["Applications", "users"],
  ["Election settings", "clock"],
  ["Results & reports", "file"],
];
const appPages = new Set(["home", "application", "candidate", "vote", "ballot", "admin"]);

function getPageFromHash() {
  const pageFromHash = window.location.hash.slice(1);
  return appPages.has(pageFromHash) ? pageFromHash : "home";
}
const registeredVoters = 2450;
const storagePrefix = "unie-voting-demo:";

function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = window.localStorage.getItem(`${storagePrefix}${key}`);
    if (stored === null) return typeof initialValue === "function" ? initialValue() : initialValue;
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error(`Could not read saved ${key} data.`, error);
      return typeof initialValue === "function" ? initialValue() : initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(`${storagePrefix}${key}`, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

const defaultSchedule = () => {
  const start = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
  start.setHours(8, 0, 0, 0);
  const end = new Date(start.getTime() + 9 * 60 * 60 * 1000);
  return { start: toLocalDateTime(start), end: toLocalDateTime(end), cancelled: false };
};

function toLocalDateTime(date) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function Icon({ name, size = 20 }) {
  const paths = {
    cap: <><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11v5c3.5 2.5 8.5 2.5 12 0v-5M21 10v6" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    back: <><path d="M19 12H5M12 19l-7-7 7-7" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v1" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    trophy: <><path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 7H4v2a4 4 0 0 0 4 4m9-6h3v2a4 4 0 0 1-4 4" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    chart: <><path d="M3 3v18h18M8 15l4-4 4 3 5-7" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    person: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    support: <><path d="M4 13v-2a8 8 0 0 1 16 0v2" /><path d="M4 13h3v6H6a2 2 0 0 1-2-2v-4Zm16 0h-3v6h1a2 2 0 0 0 2-2v-4ZM12 21h3" /></>,
    info: <><circle cx="12" cy="12" r="10" /><path d="M12 11v5m0-8h.01" /></>,
    bolt: <path d="m13 2-3 8h7l-6 12 2-9H6l7-11Z" />,
    ballot: <><path d="M9 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" /><path d="M9 3h6v5H9zM8 14l2 2 5-5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    x: <path d="m6 6 12 12M18 6 6 18" />,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    print: <><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v8H6z" /></>,
  };
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function formatDate(value, options = { dateStyle: "medium", timeStyle: "short" }) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not scheduled" : new Intl.DateTimeFormat("en", options).format(date);
}

function getElectionState(schedule, now) {
  if (schedule.cancelled) return "cancelled";
  const start = new Date(schedule.start).getTime();
  const end = new Date(schedule.end).getTime();
  if (!start || !end || end <= start) return "unscheduled";
  if (now < start) return "upcoming";
  if (now < end) return "live";
  return "ended";
}

function Countdown({ target, now }) {
  const remaining = Math.max(0, new Date(target).getTime() - now);
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1_000);
  return (
    <div className="countdown" aria-label={`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}>
      {[[days, "days"], [hours, "hours"], [minutes, "mins"], [seconds, "secs"]].map(([value, label]) => (
        <span className="countdown-unit" key={label}><strong>{String(value).padStart(2, "0")}</strong><small>{label}</small></span>
      ))}
    </div>
  );
}

function TrendChart({ history }) {
  const samples = history.slice(-12);
  const maxVotes = Math.max(4, ...samples.map((sample) => sample.votes));
  const points = samples.map((sample, index) => ({
    x: samples.length === 1 ? 18 : 18 + index * 324 / (samples.length - 1),
    y: 130 - sample.votes / maxVotes * 105,
    ...sample,
  }));
  const pointList = points.map(({ x, y }) => `${x},${y}`).join(" ");
  const yLabels = [maxVotes, Math.round(maxVotes * .75), Math.round(maxVotes * .5), Math.round(maxVotes * .25), 0];
  const xLabels = [...new Set([0, Math.floor((points.length - 1) / 2), points.length - 1])]
    .map((index) => points[index])
    .filter(Boolean);

  return (
    <div className="chart-wrap">
      <div className="chart-y-labels">{yLabels.map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}</div>
      <svg className="trend-chart" viewBox="0 0 360 142" role="img" aria-label="Ballot submissions recorded in this browser">
        <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#6559eb" stopOpacity=".24" /><stop offset="100%" stopColor="#6559eb" stopOpacity="0" /></linearGradient></defs>
        {[25, 52, 79, 106, 133].map((y) => <line key={y} x1="18" x2="342" y1={y} y2={y} className="chart-grid" />)}
        {points.length > 1 && <>
          <polygon points={`18,133 ${pointList} 342,133`} fill="url(#chartFill)" />
          <polyline points={pointList} className="chart-line" />
        </>}
        {points.map(({ x, y, at }) => <circle key={at} cx={x} cy={y} r="3.3" className="chart-dot" />)}
      </svg>
      <div className="chart-x-labels">{xLabels.length ? xLabels.map((sample) => <span key={sample.at}>{new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(sample.at)}</span>) : <span>No local demo ballots yet</span>}</div>
    </div>
  );
}

function TrendPanel({ votes, electionState, candidates, voteCounts, history, compact = false }) {
  const stateLabel = electionState === "live" ? "Live" : electionState === "ended" ? "Ended" : electionState === "cancelled" ? "Cancelled" : "Scheduled";
  return (
    <section className={`trend-panel${compact ? " trend-panel--compact" : ""}`}>
      <div className="panel-title-row">
        <div className="panel-title"><span className="icon-tile"><Icon name="chart" size={18} /></span><div><h2>Live voting trend</h2><p>Ballots recorded in this browser</p></div></div>
        <span className={`live-pill${electionState !== "live" ? " live-pill--scheduled" : ""}`}><i /> {stateLabel}</span>
      </div>
      <div className="trend-total"><strong>{votes.toLocaleString()}</strong><span>votes cast so far</span></div>
      <TrendChart history={history} />
      <div className="trend-positions">
        {positions.map((position) => {
          const positionCandidates = candidates.filter((candidate) => candidate.position === position);
          const positionVotes = positionCandidates.reduce((total, candidate) => total + (voteCounts[candidate.id] || 0), 0);
          return positionCandidates.length ? positionCandidates.map((candidate) => {
            const count = voteCounts[candidate.id] || 0;
            const percentage = positionVotes ? Math.round(count / positionVotes * 100) : 0;
            return <div className="trend-position" key={candidate.id}>
              <span>{candidate.name} · {position}</span><div className="progress-track"><i style={{ width: `${percentage}%` }} /></div><strong>{percentage}%</strong>
            </div>;
          }) : <div className="trend-position" key={position}><span>{position}</span><span className="trend-empty">No approved candidates</span></div>;
        })}
      </div>
    </section>
  );
}

function Brand({ compact = false, onNavigate }) {
  return (
    <a className="brand" href="#home" aria-label="University E-Voting home" onClick={(event) => { event.preventDefault(); onNavigate("home"); }}>
      <span className="brand-mark"><Icon name="cap" size={30} /></span>
      {!compact && <span className="brand-text"><strong>UNIVERSITY</strong><strong>E-VOTING SYSTEM</strong><small>Your voice. Our university.</small></span>}
    </a>
  );
}

function App() {
  const [page, setPage] = useState(getPageFromHash);
  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [schedule, setSchedule] = useStoredState("schedule", defaultSchedule);
  const [applications, setApplications] = useStoredState("applications", initialApplications);
  const [candidateApplicationId, setCandidateApplicationId] = useStoredState("candidate-application-id", null);
  const [votes, setVotes] = useStoredState("ballots-cast", 0);
  const [voteCounts, setVoteCounts] = useStoredState("vote-counts", {});
  const [voteHistory, setVoteHistory] = useStoredState("vote-history", []);
  const [hasVoted, setHasVoted] = useStoredState("has-voted", false);
  const [voteChoices, setVoteChoices] = useState({});
  const [notice, setNotice] = useState("");
  const [adminTab, setAdminTab] = useState("Overview");
  const [candidateTab, setCandidateTab] = useState("My Profile");
  const [scheduleDraft, setScheduleDraft] = useState(schedule);
  const [expandedApplicationId, setExpandedApplicationId] = useState(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    function syncPageFromHistory() {
      setPage(getPageFromHash());
      setMenuOpen(false);
      setNotice("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.addEventListener("popstate", syncPageFromHistory);
    return () => window.removeEventListener("popstate", syncPageFromHistory);
  }, []);

  const application = useMemo(
    () => applications.find((item) => item.id === candidateApplicationId) || null,
    [applications, candidateApplicationId],
  );
  const candidates = useMemo(() => applications.filter((item) => item.status === "Approved"), [applications]);
  const applicationDeadline = new Date(schedule.start).getTime() - 24 * 60 * 60 * 1000;
  const appClosed = now >= applicationDeadline;
  const electionState = getElectionState(schedule, now);
  const startTime = new Date(schedule.start).getTime();
  const canCancel = electionState === "upcoming" && now < startTime - 60 * 60 * 1000;
  const votingPositions = positions.filter((position) => candidates.some((candidate) => candidate.position === position));

  function navigate(nextPage, replace = false) {
    const nextHash = `#${nextPage}`;
    if (window.location.hash !== nextHash) {
      const historyMethod = replace ? "replaceState" : "pushState";
      window.history[historyMethod]({ page: nextPage }, "", `${window.location.pathname}${window.location.search}${nextHash}`);
    }
    setPage(nextPage);
    setMenuOpen(false);
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function logout() {
    setAdminTab("Overview");
    setCandidateTab("My Profile");
    navigate("home", true);
  }

  function submitApplication(event) {
    event.preventDefault();
    if (appClosed) {
      setNotice("The application period has ended.");
      return;
    }
    const formData = new FormData(event.currentTarget);
    const studentId = formData.get("studentId").trim();
    if (applications.some((item) => item.studentId.toLowerCase() === studentId.toLowerCase())) {
      setNotice("An application with this student ID has already been submitted.");
      return;
    }
    const candidate = {
      id: Date.now(),
      name: formData.get("fullName").trim(),
      studentId,
      position: formData.get("position"),
      status: "Pending",
      manifesto: formData.get("manifesto").trim(),
    };
    setApplications((items) => [candidate, ...items]);
    setCandidateApplicationId(candidate.id);
    setCandidateTab("My Profile");
    navigate("candidate");
    setNotice("Maombi yako yamepokelewa. Utapata taarifa baada ya NEC kuyapitia.");
  }

  function decideApplication(id, status) {
    if (electionState === "live" || electionState === "ended") {
      setNotice("Applications can no longer be changed after voting starts.");
      return;
    }
    setApplications((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    setNotice(`Ombi lime${status === "Approved" ? "idhinishwa" : "kataliwa"}.`);
  }

  function saveSchedule(event) {
    event.preventDefault();
    if (electionState === "live") {
      setNotice("The schedule cannot be changed while voting is live.");
      return;
    }
    const start = new Date(scheduleDraft.start).getTime();
    const end = new Date(scheduleDraft.end).getTime();
    if (!start || !end || end <= start) {
      setNotice("Muda wa mwisho lazima uwe baada ya muda wa kuanza.");
      return;
    }
    if (start <= Date.now()) {
      setNotice("Chagua muda wa kuanza ulio mbele ya sasa.");
      return;
    }
    setSchedule({ ...scheduleDraft, cancelled: false });
    setVotes(0);
    setVoteCounts({});
    setVoteHistory([]);
    setHasVoted(false);
    setVoteChoices({});
    setNotice("Ratiba ya uchaguzi imehifadhiwa.");
  }

  function cancelElection() {
    if (!canCancel) return;
    setSchedule((current) => ({ ...current, cancelled: true }));
    setNotice("Uchaguzi umeghairiwa.");
  }

  function castVote(event) {
    event.preventDefault();
    if (electionState !== "live" || hasVoted) {
      setNotice("A ballot can only be submitted once while voting is open.");
      return;
    }
    const validChoices = votingPositions.every((position) =>
      candidates.some((candidate) => candidate.position === position && String(candidate.id) === String(voteChoices[position])),
    );
    if (!votingPositions.length || !validChoices) {
      setNotice("Select one approved candidate for each available position.");
      return;
    }
    setVoteCounts((current) => Object.entries(voteChoices).reduce((nextCounts, [position, candidateId]) => (
      votingPositions.includes(position) ? { ...nextCounts, [candidateId]: (nextCounts[candidateId] || 0) + 1 } : nextCounts
    ), current));
    setVotes((count) => count + 1);
    setVoteHistory((current) => [...current, { at: Date.now(), votes: (current.at(-1)?.votes || 0) + 1 }].slice(-30));
    setHasVoted(true);
    setNotice("Kura yako imepokelewa kwa mafanikio.");
  }

  function renderElectionState() {
    if (electionState === "cancelled") return <span className="status-badge status-badge--cancelled">Election cancelled</span>;
    if (electionState === "live") return <span className="status-badge status-badge--live"><i /> Voting is live</span>;
    if (electionState === "ended") return <span className="status-badge status-badge--ended">Election ended</span>;
    return <span className="status-badge"><i /> Election scheduled</span>;
  }

  return (
    <div className="app-shell">
      <header className={`site-header${page === "home" ? " site-header--landing" : ""}`}>
        <Brand onNavigate={navigate} />
        <div className="header-right">
          {page !== "home" && renderElectionState()}
          {page !== "home" && <>
            {page === "candidate" && <span className="header-user-chip"><Icon name="person" size={16} /> {application?.name || "Candidate"} <span aria-hidden="true">⌄</span></span>}
            {page === "vote" && <span className="header-user-chip"><Icon name="person" size={16} /> Guest Voter <span aria-hidden="true">⌄</span></span>}
            {page === "admin" && <>
              <button className={`menu-toggle admin-menu-toggle${menuOpen ? " is-open" : ""}`} type="button" aria-label={menuOpen ? "Close Admin menu" : "Open Admin menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
                <Icon name={menuOpen ? "close" : "menu"} />
              </button>
              {menuOpen && <><button className="menu-scrim admin-menu-scrim" aria-label="Dismiss Admin menu overlay" onClick={() => setMenuOpen(false)} /><nav className="admin-mobile-menu" aria-label="Admin menu">
                {adminSections.map(([item, icon]) => <button key={item} onClick={() => { setAdminTab(item); setMenuOpen(false); }}><Icon name={icon} size={17} />{item}</button>)}
              </nav></>}
            </>}
            <button className="header-page-action" type="button" aria-label="Back to portal" onClick={() => navigate("home")}><Icon name="back" size={17} /><span>Back</span></button>
            <button className="header-page-action header-logout" type="button" aria-label="Logout" onClick={logout}><Icon name="logout" size={17} /><span>Logout</span></button>
          </>}
          {page === "home" && <>
            <button className={`menu-toggle${menuOpen ? " is-open" : ""}`} type="button" aria-label={menuOpen ? "Close role menu" : "Open role menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
              <Icon name={menuOpen ? "close" : "menu"} />
            </button>
            {menuOpen && <><button className="menu-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} /><nav className="role-menu" aria-label="Role menu">
              {!appClosed && <button onClick={() => navigate("application")}><Icon name="file" size={17} /> Application</button>}
              {appClosed && <button onClick={() => navigate("candidate")}><Icon name="trophy" size={17} /> Candidate</button>}
              <button onClick={() => navigate("admin")}><Icon name="shield" size={17} /> Admin</button>
            </nav></>}
          </>}
        </div>
      </header>

      <div className="main-wrapper">
      {page === "home" && (
        <main id="home">
          <section className="hero">
            <div className="hero-overlay" />
            <div className="hero-inner">
              <h1>Welcome to<br /><span>University E-Voting</span></h1>
              <p className="hero-copy">Vote. Choose. Build a Better University.</p>
            </div>
            <section className="voter-section">
              <button className="voter-card" onClick={() => navigate("vote")} type="button">
                <span className="voter-icon"><Icon name="users" size={29} /></span>
                <span className="voter-copy"><strong>Voters</strong><small>Click to Start Voting</small></span>
                <span className="voter-arrow"><Icon name="arrow" size={19} /></span>
              </button>
            </section>
            <div className="hero-bottom">
              <div className="hero-bottom-inner">
                <span className="landing-footer-copy"><Icon name="shield" size={19} /> Our University · Our Future</span>
                <span className="landing-copyright">© 2026 University E-Voting. All rights reserved.</span>
              </div>
            </div>
          </section>
        </main>
      )}

      {["application", "ballot"].includes(page) && <div className="role-live-trend"><TrendPanel votes={votes} electionState={electionState} candidates={candidates} voteCounts={voteCounts} history={voteHistory} compact /></div>}

      {page === "application" && (
        <main className="subpage">
          <div className="subpage-heading"><p className="eyebrow eyebrow--blue">CANDIDATE APPLICATION</p><h1>Stand for something.</h1><p>Tell your fellow students why you’re the right person to represent them.</p></div>
          {notice && <p className="inline-notice" role="status">{notice}</p>}
          {appClosed ? <div className="notice-card"><span className="notice-icon"><Icon name="clock" /></span><div><strong>Applications are closed</strong><p>The application period has ended. The candidate portal is now available.</p></div><button className="button button--primary" onClick={() => navigate("candidate")}>Candidate portal</button></div> : (
            <form className="form-card application-form" onSubmit={submitApplication}>
              <div className="form-card-heading"><span className="icon-tile"><Icon name="file" /></span><div><h2>Candidate application</h2><p>All fields marked * are required.</p></div><span className="deadline-chip"><Icon name="clock" size={15} /> Closes {formatDate(applicationDeadline, { dateStyle: "medium" })}</span></div>
              <div className="form-grid">
                <label>Full name *<input autoComplete="name" name="fullName" placeholder="e.g. Amina Joseph" required /></label>
                <label>Student ID / Registration no. *<input name="studentId" placeholder="e.g. UE/2024/0182" required /></label>
                <label className="full-field">Position you want to contest *<select name="position" defaultValue="" required><option value="" disabled>Select a position</option>{positions.map((position) => <option key={position}>{position}</option>)}</select></label>
                <label className="full-field">Your manifesto *<textarea name="manifesto" rows="5" minLength="30" placeholder="Share your plans and priorities for students (at least 30 characters)..." required /></label>
              </div>
              <div className="form-footer"><span><Icon name="shield" size={16} /> Your application is reviewed by the NEC.</span><button className="button button--primary" type="submit"><Icon name="arrow" size={17} /> Submit application</button></div>
            </form>
          )}
          <div className="page-note"><Icon name="clock" size={17} /><span>Applications close 24 hours before the scheduled election start. After the deadline, this menu changes to the Candidate portal.</span></div>
        </main>
      )}

      {page === "candidate" && (
        <main className="candidate-layout">
          <aside className="candidate-sidebar" aria-label="Candidate portal navigation">
            <div className="candidate-sidebar-profile"><span className="candidate-portrait"><Icon name="person" size={34} /></span><strong>Candidate Portal</strong><small>Be the change.</small></div>
            <nav className="candidate-nav">
              {[
                ["My Profile", "person"],
                ["My Application", "file"],
                ["Election Info", "calendar"],
                ["Live Results", "chart"],
                ["Help & Support", "support"],
              ].map(([label, icon]) => <button key={label} className={`candidate-nav-link${candidateTab === label ? " is-active" : ""}`} onClick={() => setCandidateTab(label)}><Icon name={icon} size={17} />{label}</button>)}
            </nav>
          </aside>
          <section className="candidate-main">
            {candidateTab === "My Profile" ? (
              <>
                <section className="candidate-hero">
                  <div className="candidate-hero-copy"><span className="candidate-approved-mark"><Icon name="check" size={22} /></span><div><p className="eyebrow">YOUR CAMPAIGN</p><h1>Candidate Portal</h1><p>Manage your application and stay updated on the election process.</p></div></div>
                </section>
                <section className="candidate-profile-card">
                  <span className="candidate-portrait candidate-portrait--large"><Icon name="person" size={39} /></span>
                  <div className="candidate-profile-info">
                    <strong>{application?.name || "No application found"}</strong>
                    <span>{application ? application.position : "No application is saved in this browser."}</span>
                    {application && <span className={`candidate-status candidate-status--${application.status.toLowerCase()}`}><Icon name="check" size={13} /> {application.status}</span>}
                  </div>
                </section>
                {notice && <p className="inline-notice" role="status">{notice}</p>}
                <div className="candidate-cards">
                  <button className="candidate-action-card" onClick={() => setCandidateTab("My Application")}><span className="candidate-action-icon"><Icon name="file" size={23} /></span><span className="candidate-action-copy"><strong>My Application</strong><small>View your application status and details.</small></span><span className="candidate-action-meta"><span className={`table-status${application?.status === "Approved" ? " table-status--approved" : application?.status === "Rejected" ? " table-status--rejected" : ""}`}>{application?.status || "Not found"}</span><span className="button button--primary candidate-small-button">View Details <Icon name="arrow" size={14} /></span></span></button>
                  <button className="candidate-action-card" onClick={() => setCandidateTab("Election Info")}><span className="candidate-action-icon"><Icon name="calendar" size={23} /></span><span className="candidate-action-copy"><strong>Election Information</strong><small>Check election date, time and other details.</small></span><span className="candidate-action-meta"><span className="table-status table-status--scheduled">{electionState === "live" ? "Live" : electionState === "ended" ? "Ended" : electionState === "cancelled" ? "Cancelled" : "Scheduled"}</span><span className="button button--primary candidate-small-button">View Info <Icon name="arrow" size={14} /></span></span></button>
                  <button className="candidate-action-card" onClick={() => setCandidateTab("Live Results")}><span className="candidate-action-icon"><Icon name="chart" size={23} /></span><span className="candidate-action-copy"><strong>Live Results</strong><small>Follow live voting trends and final results.</small></span><span className="candidate-action-meta"><span className={`table-status${electionState === "live" ? " table-status--live" : ""}`}>{electionState === "live" ? "Live" : electionState === "ended" ? "Final" : "Scheduled"}</span><span className="button button--primary candidate-small-button"><Icon name="chart" size={14} /> View Results</span></span></button>
                  <button className="candidate-action-card candidate-help-card" onClick={() => setCandidateTab("Help & Support")}><span className="candidate-action-icon"><Icon name="support" size={23} /></span><span className="candidate-action-copy"><strong>Help &amp; Support</strong><small>Contact the Election Committee.</small></span><span className="button button--primary candidate-small-button">Get help <Icon name="arrow" size={14} /></span></button>
                </div>
                <div className="candidate-notice-card"><span className="candidate-notice-icon"><Icon name="info" size={20} /></span><div><strong>Stay informed!</strong><small>Your participation strengthens our democratic process.</small></div><span className="candidate-notice-art" aria-hidden="true">📣</span></div>
              </>
            ) : (
              <section className="candidate-section">
                <button className="portal-back-link" onClick={() => setCandidateTab("My Profile")}><Icon name="back" size={17} /> Candidate Portal</button>
                <p className="eyebrow eyebrow--blue">CANDIDATE PORTAL</p>
                <h1>{candidateTab}</h1>
                {candidateTab === "My Application" && (application ? <section className="candidate-detail-card"><div className="candidate-detail-heading"><span className="candidate-action-icon"><Icon name="file" size={23} /></span><div><h2>Application status</h2><p>Your submitted candidate information.</p></div><span className={`table-status${application.status === "Approved" ? " table-status--approved" : application.status === "Rejected" ? " table-status--rejected" : ""}`}>{application.status}</span></div><dl><div><dt>Name</dt><dd>{application.name}</dd></div><div><dt>Student ID</dt><dd>{application.studentId}</dd></div><div><dt>Position</dt><dd>{application.position}</dd></div></dl><p className="manifesto-copy">{application.manifesto}</p>{notice && <p className="inline-notice" role="status">{notice}</p>}</section> : <section className="candidate-detail-card"><div className="candidate-detail-heading"><span className="candidate-action-icon"><Icon name="file" size={23} /></span><div><h2>No application found</h2><p>This browser has no saved candidate application.</p></div></div></section>)}
                {candidateTab === "Election Info" && <section className="candidate-detail-card"><div className="candidate-detail-heading"><span className="candidate-action-icon"><Icon name="calendar" size={23} /></span><div><h2>Election schedule</h2><p>Official date and voting hours.</p></div>{renderElectionState()}</div><dl><div><dt>Starts</dt><dd>{formatDate(schedule.start)}</dd></div><div><dt>Ends</dt><dd>{formatDate(schedule.end)}</dd></div><div><dt>Current status</dt><dd>{electionState === "live" ? "Voting is open" : electionState === "ended" ? "Voting has ended" : electionState === "cancelled" ? "Election was cancelled" : "Scheduled"}</dd></div></dl></section>}
                {candidateTab === "Live Results" && <><TrendPanel votes={votes} electionState={electionState} candidates={candidates} voteCounts={voteCounts} history={voteHistory} /><section className="candidate-detail-card candidate-results-list"><h2>Results by position</h2>{candidates.length ? candidates.map((item) => {
                  const positionVotes = candidates.filter((candidate) => candidate.position === item.position).reduce((total, candidate) => total + (voteCounts[candidate.id] || 0), 0);
                  const percentage = positionVotes ? ((voteCounts[item.id] || 0) / positionVotes * 100).toFixed(1) : "0.0";
                  return <div key={item.id}><span className="avatar avatar--violet">{item.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2)}</span><span><strong>{item.name}</strong><small>{item.position}</small></span><b>{(voteCounts[item.id] || 0).toLocaleString()} · {percentage}%</b></div>;
                }) : <p className="help-copy">No applications have been approved for the ballot yet.</p>}</section></>}
                {candidateTab === "Help & Support" && <section className="candidate-detail-card"><div className="candidate-detail-heading"><span className="candidate-action-icon"><Icon name="support" size={23} /></span><div><h2>Need help?</h2><p>Contact the Election Committee for candidate support.</p></div></div><p className="help-copy">No support contact is configured in this local demo. Please use the official contact details provided by your university election office.</p></section>}
              </section>
            )}
          </section>
        </main>
      )}

      {page === "vote" && (
        <main className="voter-portal">
          <section className="voter-hero">
            <div className="voter-hero-copy"><p className="eyebrow">YOUR VOICE MATTERS</p><h1>Welcome to<br />University <span>E-Voting</span> Portal</h1><p>Your Voice Matters. Vote for a Better University!</p></div>
            <div className="voter-schedule-card"><h2><Icon name="calendar" size={17} /> Election Schedule</h2><div><span>Starts</span><strong>{formatDate(schedule.start)}</strong></div><div><span>Ends</span><strong>{formatDate(schedule.end)}</strong></div></div>
          </section>
          <section className="voter-live-panel">
            <div className="voter-panel-heading"><span><Icon name="chart" size={18} /> Live Voting Trend</span><span className={`voter-live-indicator${electionState === "live" ? " is-live" : ""}`}><i /> {electionState === "live" ? "Live" : electionState === "ended" ? "Ended" : electionState === "cancelled" ? "Cancelled" : "Scheduled"}</span></div>
            <div className="voter-stats">
              <div className="turnout-ring" style={{ "--turnout": `${Math.min(100, votes / registeredVoters * 100)}%` }}><strong>{(votes / registeredVoters * 100).toFixed(1)}%</strong><small>Turnout Rate</small></div>
              <div className="voter-stat"><span className="voter-stat-icon voter-stat-blue"><Icon name="users" /></span><span>Registered (demo)</span><strong>{registeredVoters.toLocaleString()}</strong></div>
              <div className="voter-stat"><span className="voter-stat-icon voter-stat-green"><Icon name="check" /></span><span>Votes Cast</span><strong>{votes.toLocaleString()}</strong></div>
              <div className="voter-stat"><span className="voter-stat-icon voter-stat-orange"><Icon name="clock" /></span><span>Remaining (demo)</span><strong>{Math.max(0, registeredVoters - votes).toLocaleString()}</strong></div>
            </div>
          </section>
          <section className="ready-to-vote">
            <div className="ballot-illustration" aria-hidden="true"><span><Icon name="check" size={28} /></span><i /></div>
            <div className="ready-copy"><h2>{electionState === "live" ? "Ready to Vote?" : "Get Ready to Vote"}</h2><p>{electionState === "live" ? "Click below to cast your vote in the ongoing election." : electionState === "cancelled" ? "The election schedule has been cancelled by the NEC." : "The ballot will open automatically when the election starts."}</p></div>
            <button className="button button--primary vote-now-button" onClick={() => navigate("ballot")}> <Icon name="ballot" size={17} /> Vote Now <Icon name="arrow" size={15} /></button>
          </section>
          <section className="voter-features">
            <div><span className="feature-icon feature-secure"><Icon name="shield" size={22} /></span><strong>Local demo</strong><small>Ballots stay in this browser.</small></div>
            <div><span className="feature-icon feature-realtime"><Icon name="bolt" size={22} /></span><strong>Live Updates</strong><small>See locally recorded ballot activity.</small></div>
            <div><span className="feature-icon feature-help"><Icon name="support" size={22} /></span><strong>Need Help?</strong><small>Contact support for assistance.</small></div>
            <div><span className="feature-icon feature-info"><Icon name="info" size={22} /></span><strong>Election Info</strong><small>View key election details.</small></div>
          </section>
        </main>
      )}

      {page === "ballot" && (
        <main className="subpage">
          <div className="subpage-heading"><p className="eyebrow eyebrow--blue">VOTER PORTAL</p><h1>Your vote matters.</h1><p>Choose an approved candidate for each position. This local demo records totals in your browser.</p></div>
          {electionState !== "live" ? <section className="vote-unavailable"><span className="icon-tile"><Icon name={electionState === "ended" ? "check" : "clock"} size={22} /></span><h2>{electionState === "ended" ? "Voting has ended" : electionState === "cancelled" ? "Election cancelled" : "The polls aren’t open yet"}</h2><p>{electionState === "upcoming" ? `Voting opens ${formatDate(schedule.start)}. You can return here when the countdown ends.` : electionState === "cancelled" ? "The NEC will publish an updated election schedule." : "Thank you for participating in this election."}</p>{electionState === "upcoming" && <Countdown target={schedule.start} now={now} />}</section> : hasVoted ? <section className="vote-success"><span><Icon name="check" size={28} /></span><h2>Your vote has been recorded.</h2><p>This browser has already submitted its local demo ballot. Ballots are stored only on this device.</p><button className="button button--outline" onClick={() => navigate("home")}>Back to home</button></section> : votingPositions.length === 0 ? <section className="vote-unavailable"><span className="icon-tile"><Icon name="users" size={22} /></span><h2>No approved candidates yet</h2><p>The ballot will be available after the NEC approves candidate applications.</p></section> : <form className="form-card ballot-form" onSubmit={castVote}><div className="ballot-heading"><span className="live-pill"><i /> Voting is live</span><h2>Choose your candidates</h2><p>Choose one approved candidate for each available position. One ballot can be submitted from this browser.</p></div>{votingPositions.map((position) => <fieldset className="ballot-position" key={position}><legend>{position}</legend><div className="ballot-options">{candidates.filter((candidate) => candidate.position === position).map((candidate) => <label className={`ballot-option${String(voteChoices[position]) === String(candidate.id) ? " is-selected" : ""}`} key={candidate.id}><input type="radio" name={`candidate-${position}`} value={candidate.id} checked={String(voteChoices[position]) === String(candidate.id)} onChange={(event) => setVoteChoices((current) => ({ ...current, [position]: event.target.value }))} required /><span className="avatar avatar--violet">{candidate.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2)}</span><span className="candidate-info"><strong>{candidate.name}</strong><small>{candidate.position}</small></span><span className="radio-mark" /></label>)}</div></fieldset>)}{notice && <p className="inline-notice" role="status">{notice}</p>}<div className="form-footer"><span><Icon name="shield" size={16} /> Local demo only. Do not use for a real election.</span><button className="button button--primary" type="submit">Submit ballot <Icon name="arrow" size={17} /></button></div></form>}
        </main>
      )}

      {page === "admin" && (
        <main className="admin-layout">
          <aside className="admin-sidebar">
            <div className="admin-brand"><span className="admin-brand-mark"><Icon name="cap" size={25} /></span><span><strong>UNIVERSITY</strong><small>ELECTIONS NEC</small></span></div>
            <p className="sidebar-label">MANAGEMENT</p>
            {adminSections.map(([item, icon]) => <button key={item} className={`sidebar-link${adminTab === item ? " is-active" : ""}`} onClick={() => setAdminTab(item)}><Icon name={icon} size={17} />{item}</button>)}
          </aside>
          <section className="admin-main">
            <div className="admin-topbar"><div><p className="eyebrow eyebrow--blue">UNIVERSITY ELECTIONS</p><h1>{adminTab}</h1></div></div>
            {notice && <p className="inline-notice" role="status">{notice}</p>}
            {adminTab !== "Overview" && <TrendPanel votes={votes} electionState={electionState} candidates={candidates} voteCounts={voteCounts} history={voteHistory} compact />}
            {adminTab === "Overview" && <div className="admin-dashboard">
              <div className="admin-welcome"><div><span>NEC ADMIN · LOCAL DEMO</span><h2>Election overview</h2><p>Changes are saved only in this browser.</p></div><span className="welcome-icon"><Icon name="shield" size={25} /></span></div>
              <div className="stat-grid"><div className="stat-card"><span className="stat-icon stat-violet"><Icon name="users" /></span><span>Registered voters (demo)</span><strong>{registeredVoters.toLocaleString()}</strong><small>Sample electorate</small></div><div className="stat-card"><span className="stat-icon stat-green"><Icon name="check" /></span><span>Votes cast</span><strong>{votes.toLocaleString()}</strong><small>{(votes / registeredVoters * 100).toFixed(1)}% turnout</small></div><div className="stat-card"><span className="stat-icon stat-orange"><Icon name="file" /></span><span>Applications</span><strong>{applications.length}</strong><small>{applications.filter((item) => item.status === "Pending").length} awaiting review</small></div><div className="stat-card"><span className="stat-icon stat-blue"><Icon name="clock" /></span><span>Election status</span><strong className="stat-state">{electionState === "live" ? "Live now" : electionState === "ended" ? "Ended" : electionState === "cancelled" ? "Cancelled" : "Scheduled"}</strong><small>{electionState === "live" ? "Voting is open" : formatDate(schedule.start, { dateStyle: "medium" })}</small></div></div>
              <div className="admin-dashboard-grid"><section className="admin-card schedule-card"><div className="admin-card-heading"><div><h2>Election schedule</h2><p>Automatic start and close</p></div>{renderElectionState()}</div><div className="schedule-details"><div><span>Starts</span><strong>{formatDate(schedule.start)}</strong></div><div><span>Ends</span><strong>{formatDate(schedule.end)}</strong></div></div>{electionState === "upcoming" && <div className="schedule-countdown"><span>Time remaining to start</span><Countdown target={schedule.start} now={now} /></div>}{electionState === "live" && <p className="auto-note"><i /> Voting started automatically. It will close at the scheduled end time.</p>}{schedule.cancelled && <p className="auto-note cancelled-note">This election was cancelled.</p>}<button className="button button--danger" onClick={cancelElection} disabled={!canCancel}>{schedule.cancelled ? "Election cancelled" : "Cancel election"}{!canCancel && electionState === "upcoming" && <small>Available until 1 hour before start</small>}</button></section>
                <TrendPanel votes={votes} electionState={electionState} candidates={candidates} voteCounts={voteCounts} history={voteHistory} compact /></div>
              <section className="admin-card results-card"><div className="admin-card-heading"><div><h2>Overall results</h2><p>Local demo totals (not polling-station results)</p></div><button className="text-button" onClick={() => setAdminTab("Results & reports")}>View report <Icon name="arrow" size={15} /></button></div><div className="result-stats"><div><span className="result-emoji">♙</span><span>Registered (demo)</span><strong>{registeredVoters.toLocaleString()}</strong></div><div><span className="result-emoji result-green">✓</span><span>Ballots cast</span><strong>{votes.toLocaleString()}</strong></div><div><span className="result-emoji result-purple">◴</span><span>Turnout</span><strong>{(votes / registeredVoters * 100).toFixed(1)}%</strong></div><div><span className="result-emoji result-orange">◷</span><span>Remaining (demo)</span><strong>{Math.max(0, registeredVoters - votes).toLocaleString()}</strong></div></div></section>
            </div>}
            {adminTab === "Applications" && <section className="admin-card applications-admin"><div className="admin-card-heading"><div><h2>Candidate applications</h2><p>Review applicant details and approve eligible candidates.</p></div><span className="pending-count">{applications.filter((item) => item.status === "Pending").length} pending</span></div><div className="application-table-wrap"><table className="data-table"><thead><tr><th>Applicant</th><th>Student ID</th><th>Position</th><th>Status</th><th>Details</th><th>Review</th></tr></thead><tbody>{applications.map((item) => <React.Fragment key={item.id}><tr><td><strong>{item.name}</strong></td><td>{item.studentId}</td><td>{item.position}</td><td><span className={`table-status${item.status === "Approved" ? " table-status--approved" : item.status === "Rejected" ? " table-status--rejected" : ""}`}>{item.status}</span></td><td><button className="text-button" onClick={() => setExpandedApplicationId((current) => current === item.id ? null : item.id)}>{expandedApplicationId === item.id ? "Hide" : "View"} manifesto</button></td><td>{item.status === "Pending" ? <span className="review-actions"><button title="Approve application" aria-label={`Approve ${item.name}`} onClick={() => decideApplication(item.id, "Approved")}><Icon name="check" size={16} /></button><button title="Reject application" aria-label={`Reject ${item.name}`} onClick={() => decideApplication(item.id, "Rejected")}><Icon name="x" size={16} /></button></span> : <span className="reviewed-label">Reviewed</span>}</td></tr>{expandedApplicationId === item.id && <tr className="application-manifesto-row"><td colSpan="6"><strong>Manifesto</strong><p>{item.manifesto || "No manifesto was provided."}</p></td></tr>}</React.Fragment>)}</tbody></table></div>{applications.length === 0 && <p className="empty-table">No applications have been submitted yet.</p>}</section>}
            {adminTab === "Election settings" && <section className="admin-card settings-card"><div className="admin-card-heading"><div><h2>Election settings</h2><p>Set the exact date and time for automatic election start and close.</p></div><span className="icon-tile"><Icon name="clock" /></span></div><form className="settings-form" onSubmit={saveSchedule}><label>Election starts<input type="datetime-local" value={scheduleDraft.start} onChange={(event) => setScheduleDraft((current) => ({ ...current, start: event.target.value }))} required /></label><label>Election ends<input type="datetime-local" value={scheduleDraft.end} onChange={(event) => setScheduleDraft((current) => ({ ...current, end: event.target.value }))} required /></label><p className="settings-hint"><Icon name="shield" size={16} /> Applications close 24 hours before the election starts. Voting then opens and closes at the saved times. Cancellation is only available until one hour before voting starts.</p><button className="button button--primary" type="submit">Save election schedule</button></form></section>}
            {adminTab === "Results & reports" && <section className="admin-card report-card"><div className="admin-card-heading"><div><h2>Election results &amp; reports</h2><p>Local demo totals by position.</p></div><button className="button button--primary print-button" onClick={() => window.print()}><Icon name="print" size={16} /> Print report</button></div><div className="report-table-wrap"><table className="data-table"><thead><tr><th>Position</th><th>Candidate</th><th>Votes</th><th>Percentage</th></tr></thead><tbody>{positions.flatMap((position) => {
              const positionCandidates = candidates.filter((candidate) => candidate.position === position);
              const positionVotes = positionCandidates.reduce((total, candidate) => total + (voteCounts[candidate.id] || 0), 0);
              return positionCandidates.length ? positionCandidates.map((candidate) => <tr key={candidate.id}><td>{position}</td><td><strong>{candidate.name}</strong></td><td>{(voteCounts[candidate.id] || 0).toLocaleString()}</td><td>{positionVotes ? `${((voteCounts[candidate.id] || 0) / positionVotes * 100).toFixed(1)}%` : "—"}</td></tr>) : [<tr key={position}><td>{position}</td><td>No approved candidates</td><td>0</td><td>—</td></tr>];
            })}</tbody></table></div><p className="report-note">Polling-station breakdown is not available in this browser demo.</p></section>}
          </section>
        </main>
      )}
      </div>
      {page !== "home" && <footer className="simple-footer"><span>University E-Voting</span><span>Local demo · data stays in this browser.</span><span>© 2026</span></footer>}
    </div>
  );
}

export default App;
