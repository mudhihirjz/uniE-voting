import React, { useEffect, useMemo, useState } from "react";

const initialApplications = [
  { id: 1, name: "Amina Joseph", studentId: "UE/2024/0182", position: "Student President", status: "Pending" },
  { id: 2, name: "Brian Mwangi", studentId: "UE/2023/0097", position: "Dean of Students", status: "Pending" },
  { id: 3, name: "Neema Peter", studentId: "UE/2024/0241", position: "Treasurer", status: "Pending" },
];

const candidates = [
  { name: "Amina Joseph", position: "Student President", color: "violet", initials: "AJ", votes: 423 },
  { name: "Brian Mwangi", position: "Dean of Students", color: "blue", initials: "BM", votes: 318 },
  { name: "Neema Peter", position: "Treasurer", color: "gold", initials: "NP", votes: 241 },
];

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

function TrendChart({ votes }) {
  const points = useMemo(() => {
    const values = [16, 23, 30, 45, 54, 64, 69, 78, 82, 91].map((value, index) => value + Math.min(7, Math.floor(votes / 100) - 4) + (index % 3));
    return values.map((value, index) => `${18 + index * 36},${130 - value}`).join(" ");
  }, [votes]);
  return (
    <div className="chart-wrap">
      <div className="chart-y-labels"><span>800</span><span>600</span><span>400</span><span>200</span><span>0</span></div>
      <svg className="trend-chart" viewBox="0 0 360 142" role="img" aria-label="Upward trend of votes cast over time">
        <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#6559eb" stopOpacity=".24" /><stop offset="100%" stopColor="#6559eb" stopOpacity="0" /></linearGradient></defs>
        {[25, 52, 79, 106, 133].map((y) => <line key={y} x1="18" x2="342" y1={y} y2={y} className="chart-grid" />)}
        <polygon points={`18,133 ${points} 342,133`} fill="url(#chartFill)" />
        <polyline points={points} className="chart-line" />
        {points.split(" ").map((point) => {
          const [cx, cy] = point.split(",");
          return <circle key={point} cx={cx} cy={cy} r="3.3" className="chart-dot" />;
        })}
      </svg>
      <div className="chart-x-labels"><span>08:00</span><span>09:00</span><span>10:00</span><span>11:00</span><span>12:00</span></div>
    </div>
  );
}

function TrendPanel({ votes, compact = false }) {
  const candidateVotes = candidates.reduce((total, candidate) => total + candidate.votes, 0);
  return (
    <section className={`trend-panel${compact ? " trend-panel--compact" : ""}`}>
      <div className="panel-title-row">
        <div className="panel-title"><span className="icon-tile"><Icon name="chart" size={18} /></span><div><h2>Live voting trend</h2><p>Participation across campus</p></div></div>
        <span className="live-pill"><i /> Live</span>
      </div>
      <div className="trend-total"><strong>{votes.toLocaleString()}</strong><span>votes cast so far</span></div>
      <TrendChart votes={votes} />
      <div className="trend-positions">
        {candidates.map((candidate) => (
          <div className="trend-position" key={candidate.position}>
          <span>{candidate.position}</span><div className="progress-track"><i className={`progress-${candidate.color}`} style={{ width: `${candidate.votes / candidateVotes * 100}%` }} /></div><strong>{Math.round(candidate.votes / candidateVotes * 100)}%</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function Brand({ compact = false }) {
  return (
    <a className="brand" href="#home" aria-label="University E-Voting home">
      <span className="brand-mark"><Icon name="cap" size={30} /></span>
      {!compact && <span className="brand-text"><strong>UNIVERSITY</strong><strong>E-VOTING SYSTEM</strong><small>Your voice. Our university.</small></span>}
    </a>
  );
}

function App() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [applicationDeadline] = useState(() => Date.now() + 3 * 24 * 60 * 60 * 1000);
  const [applications, setApplications] = useState(initialApplications);
  const [application, setApplication] = useState(null);
  const [votes, setVotes] = useState(1320);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteChoice, setVoteChoice] = useState("");
  const [notice, setNotice] = useState("");
  const [adminTab, setAdminTab] = useState("Overview");
  const [scheduleDraft, setScheduleDraft] = useState(schedule);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setVotes((count) => count + 1), 7000);
    return () => window.clearInterval(timer);
  }, []);

  const appClosed = now >= applicationDeadline;
  const electionState = getElectionState(schedule, now);
  const startTime = new Date(schedule.start).getTime();
  const canCancel = electionState === "upcoming" && now < startTime - 60 * 60 * 1000;

  function navigate(nextPage) {
    setPage(nextPage);
    setMenuOpen(false);
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function logout() {
    setAdminTab("Overview");
    navigate("home");
  }

  function submitApplication(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const candidate = {
      id: Date.now(),
      name: formData.get("fullName").trim(),
      studentId: formData.get("studentId").trim(),
      position: formData.get("position"),
      status: "Pending",
      manifesto: formData.get("manifesto").trim(),
    };
    setApplications((items) => [candidate, ...items]);
    setApplication(candidate);
    navigate("candidate");
    setNotice("Maombi yako yamepokelewa. Utapata taarifa baada ya NEC kuyapitia.");
  }

  function decideApplication(id, status) {
    setApplications((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    setNotice(`Ombi lime${status === "Approved" ? "idhinishwa" : "kataliwa"}.`);
  }

  function saveSchedule(event) {
    event.preventDefault();
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
    setNotice("Ratiba ya uchaguzi imehifadhiwa.");
  }

  function cancelElection() {
    if (!canCancel) return;
    setSchedule((current) => ({ ...current, cancelled: true }));
    setNotice("Uchaguzi umeghairiwa.");
  }

  function castVote(event) {
    event.preventDefault();
    if (!voteChoice) return;
    setVotes((count) => count + 1);
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
        <Brand />
        <div className="header-right">
          {page !== "home" && renderElectionState()}
          {page !== "home" && <>
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

      {["application", "candidate", "vote"].includes(page) && <div className="role-live-trend"><TrendPanel votes={votes} compact /></div>}

      {page === "application" && (
        <main className="subpage">
          <div className="subpage-heading"><p className="eyebrow eyebrow--blue">CANDIDATE APPLICATION</p><h1>Stand for something.</h1><p>Tell your fellow students why you’re the right person to represent them.</p></div>
          {appClosed ? <div className="notice-card"><span className="notice-icon"><Icon name="clock" /></span><div><strong>Applications are closed</strong><p>The application period has ended. The candidate portal is now available.</p></div><button className="button button--primary" onClick={() => navigate("candidate")}>Candidate portal</button></div> : (
            <form className="form-card application-form" onSubmit={submitApplication}>
              <div className="form-card-heading"><span className="icon-tile"><Icon name="file" /></span><div><h2>Candidate application</h2><p>All fields marked * are required.</p></div><span className="deadline-chip"><Icon name="clock" size={15} /> Closes {formatDate(applicationDeadline, { dateStyle: "medium" })}</span></div>
              <div className="form-grid">
                <label>Full name *<input autoComplete="name" name="fullName" placeholder="e.g. Amina Joseph" required /></label>
                <label>Student ID / Registration no. *<input name="studentId" placeholder="e.g. UE/2024/0182" required /></label>
                <label className="full-field">Position you want to contest *<select name="position" defaultValue="" required><option value="" disabled>Select a position</option><option>Student President</option><option>Dean of Students</option><option>Treasurer</option><option>Academic Representative</option></select></label>
                <label className="full-field">Your manifesto *<textarea name="manifesto" rows="5" minLength="30" placeholder="Share your plans and priorities for students (at least 30 characters)..." required /></label>
              </div>
              <div className="form-footer"><span><Icon name="shield" size={16} /> Your application is reviewed by the NEC.</span><button className="button button--primary" type="submit"><Icon name="arrow" size={17} /> Submit application</button></div>
            </form>
          )}
          <div className="page-note"><Icon name="clock" size={17} /><span>After the deadline, this menu changes to the Candidate portal. Check here for your application status.</span></div>
        </main>
      )}

      {page === "candidate" && (
        <main className="subpage">
          <div className="subpage-heading"><p className="eyebrow eyebrow--blue">CANDIDATE PORTAL</p><h1>Your campaign starts here.</h1><p>Review your application status and keep your election information close.</p></div>
          <section className="candidate-portal-card">
            <div className="portal-banner"><span className="portal-trophy"><Icon name="trophy" size={25} /></span><div><span>APPLICATION PERIOD {appClosed ? "HAS ENDED" : "IS OPEN"}</span><strong>{appClosed ? "Candidate portal" : "Candidate information"}</strong></div></div>
            {application ? <div className="portal-details"><div className="portal-status"><span className={application.status === "Approved" ? "approved-dot" : application.status === "Rejected" ? "rejected-dot" : "pending-dot"} /><div><strong>{application.status === "Approved" ? "Application approved" : application.status === "Rejected" ? "Application not approved" : "Application under review"}</strong><small>{application.status === "Approved" ? "You are registered as a candidate." : "The NEC will update your status after reviewing your application."}</small></div></div><dl><div><dt>Name</dt><dd>{application.name}</dd></div><div><dt>Student ID</dt><dd>{application.studentId}</dd></div><div><dt>Position</dt><dd>{application.position}</dd></div><div><dt>Status</dt><dd><span className="table-status">{application.status}</span></dd></div></dl></div> : <div className="empty-candidate"><span className="empty-icon"><Icon name="users" size={24} /></span><h2>No application found</h2><p>{appClosed ? "The application period has ended and there is no application attached to this session." : "Submit your application before the deadline to see your candidate profile here."}</p>{!appClosed && <button className="button button--primary" onClick={() => navigate("application")}>Apply to be a candidate</button>}</div>}
            <div className="portal-footer"><Icon name="clock" size={17} /><span>Election day: <strong>{formatDate(schedule.start)}</strong></span></div>
          </section>
          {notice && <p className="inline-notice" role="status">{notice}</p>}
        </main>
      )}

      {page === "vote" && (
        <main className="subpage">
          <div className="subpage-heading"><p className="eyebrow eyebrow--blue">VOTER PORTAL</p><h1>Your vote matters.</h1><p>Make your choice for each position. Your ballot is private.</p></div>
          {electionState !== "live" ? <section className="vote-unavailable"><span className="icon-tile"><Icon name={electionState === "ended" ? "check" : "clock"} size={22} /></span><h2>{electionState === "ended" ? "Voting has ended" : electionState === "cancelled" ? "Election cancelled" : "The polls aren’t open yet"}</h2><p>{electionState === "upcoming" ? `Voting opens ${formatDate(schedule.start)}. You can return here when the countdown ends.` : electionState === "cancelled" ? "The NEC will publish an updated election schedule." : "Thank you for participating in this election."}</p>{electionState === "upcoming" && <Countdown target={schedule.start} now={now} />}</section> : hasVoted ? <section className="vote-success"><span><Icon name="check" size={28} /></span><h2>Your vote has been recorded.</h2><p>Thank you for making your voice heard. Your ballot has been submitted securely.</p><button className="button button--outline" onClick={() => navigate("home")}>Back to home</button></section> : <form className="form-card ballot-form" onSubmit={castVote}><div className="ballot-heading"><span className="live-pill"><i /> Voting is live</span><h2>Choose your Student President</h2><p>Select one candidate. You can only submit your ballot once.</p></div><div className="ballot-options">{candidates.map((candidate) => <label className={`ballot-option${voteChoice === candidate.name ? " is-selected" : ""}`} key={candidate.name}><input type="radio" name="candidate" value={candidate.name} checked={voteChoice === candidate.name} onChange={(event) => setVoteChoice(event.target.value)} required /><span className={`avatar avatar--${candidate.color}`}>{candidate.initials}</span><span className="candidate-info"><strong>{candidate.name}</strong><small>{candidate.position}</small></span><span className="radio-mark" /></label>)}</div><div className="form-footer"><span><Icon name="shield" size={16} /> Your selection is private.</span><button className="button button--primary" type="submit">Submit my vote <Icon name="arrow" size={17} /></button></div></form>}
        </main>
      )}

      {page === "admin" && (
        <main className="admin-layout">
          <aside className="admin-sidebar">
            <div className="admin-brand"><span className="admin-brand-mark"><Icon name="cap" size={25} /></span><span><strong>UNIVERSITY</strong><small>ELECTIONS NEC</small></span></div>
            <p className="sidebar-label">MANAGEMENT</p>
            {["Overview", "Applications", "Election settings", "Results & reports"].map((item) => <button key={item} className={`sidebar-link${adminTab === item ? " is-active" : ""}`} onClick={() => setAdminTab(item)}><Icon name={item === "Overview" ? "chart" : item === "Applications" ? "users" : item === "Election settings" ? "clock" : "file"} size={17} />{item}</button>)}
            <button className="sidebar-link sidebar-logout" onClick={logout}><Icon name="logout" size={17} />Logout</button>
          </aside>
          <section className="admin-main">
            <div className="admin-topbar"><div><p className="eyebrow eyebrow--blue">UNIVERSITY ELECTIONS</p><h1>{adminTab}</h1></div></div>
            {notice && <p className="inline-notice" role="status">{notice}</p>}
            {adminTab !== "Overview" && <TrendPanel votes={votes} compact />}
            {adminTab === "Overview" && <div className="admin-dashboard">
              <div className="admin-welcome"><div><span>WELCOME BACK, NEC ADMIN</span><h2>Election overview</h2><p>Monitor progress and manage election day.</p></div><span className="welcome-icon"><Icon name="shield" size={25} /></span></div>
              <div className="stat-grid"><div className="stat-card"><span className="stat-icon stat-violet"><Icon name="users" /></span><span>Total voters</span><strong>2,450</strong><small>Registered students</small></div><div className="stat-card"><span className="stat-icon stat-green"><Icon name="check" /></span><span>Votes cast</span><strong>{votes.toLocaleString()}</strong><small>{Math.round(votes / 2450 * 100)}% turnout</small></div><div className="stat-card"><span className="stat-icon stat-orange"><Icon name="file" /></span><span>Applications</span><strong>{applications.length}</strong><small>{applications.filter((item) => item.status === "Pending").length} awaiting review</small></div><div className="stat-card"><span className="stat-icon stat-blue"><Icon name="clock" /></span><span>Election status</span><strong className="stat-state">{electionState === "live" ? "Live now" : electionState === "ended" ? "Ended" : electionState === "cancelled" ? "Cancelled" : "Scheduled"}</strong><small>{electionState === "live" ? "Voting is open" : formatDate(schedule.start, { dateStyle: "medium" })}</small></div></div>
              <div className="admin-dashboard-grid"><section className="admin-card schedule-card"><div className="admin-card-heading"><div><h2>Election schedule</h2><p>Automatic start and close</p></div>{renderElectionState()}</div><div className="schedule-details"><div><span>Starts</span><strong>{formatDate(schedule.start)}</strong></div><div><span>Ends</span><strong>{formatDate(schedule.end)}</strong></div></div>{electionState === "upcoming" && <div className="schedule-countdown"><span>Time remaining to start</span><Countdown target={schedule.start} now={now} /></div>}{electionState === "live" && <p className="auto-note"><i /> Voting started automatically. It will close at the scheduled end time.</p>}{schedule.cancelled && <p className="auto-note cancelled-note">This election was cancelled.</p>}<button className="button button--danger" onClick={cancelElection} disabled={!canCancel}>{schedule.cancelled ? "Election cancelled" : "Cancel election"}{!canCancel && electionState === "upcoming" && <small>Available until 1 hour before start</small>}</button></section>
                <TrendPanel votes={votes} compact /></div>
              <section className="admin-card results-card"><div className="admin-card-heading"><div><h2>Overall results</h2><p>Live totals across polling stations</p></div><button className="text-button" onClick={() => setAdminTab("Results & reports")}>View report <Icon name="arrow" size={15} /></button></div><div className="result-stats"><div><span className="result-emoji">♙</span><span>Total voters</span><strong>2,450</strong></div><div><span className="result-emoji result-green">✓</span><span>Votes cast</span><strong>{votes.toLocaleString()}</strong></div><div><span className="result-emoji result-purple">◴</span><span>Turnout</span><strong>{(votes / 2450 * 100).toFixed(1)}%</strong></div><div><span className="result-emoji result-orange">◷</span><span>Pending</span><strong>{Math.max(0, 2450 - votes).toLocaleString()}</strong></div></div></section>
            </div>}
            {adminTab === "Applications" && <section className="admin-card applications-admin"><div className="admin-card-heading"><div><h2>Candidate applications</h2><p>Review applicant details and approve eligible candidates.</p></div><span className="pending-count">{applications.filter((item) => item.status === "Pending").length} pending</span></div><div className="application-table-wrap"><table className="data-table"><thead><tr><th>Applicant</th><th>Student ID</th><th>Position</th><th>Status</th><th>Review</th></tr></thead><tbody>{applications.map((item) => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{item.studentId}</td><td>{item.position}</td><td><span className={`table-status${item.status === "Approved" ? " table-status--approved" : item.status === "Rejected" ? " table-status--rejected" : ""}`}>{item.status}</span></td><td>{item.status === "Pending" ? <span className="review-actions"><button title="Approve application" aria-label={`Approve ${item.name}`} onClick={() => decideApplication(item.id, "Approved")}><Icon name="check" size={16} /></button><button title="Reject application" aria-label={`Reject ${item.name}`} onClick={() => decideApplication(item.id, "Rejected")}><Icon name="x" size={16} /></button></span> : <span className="reviewed-label">Reviewed</span>}</td></tr>)}</tbody></table></div>{applications.length === 0 && <p className="empty-table">No applications have been submitted yet.</p>}</section>}
            {adminTab === "Election settings" && <section className="admin-card settings-card"><div className="admin-card-heading"><div><h2>Election settings</h2><p>Set the exact date and time for automatic election start and close.</p></div><span className="icon-tile"><Icon name="clock" /></span></div><form className="settings-form" onSubmit={saveSchedule}><label>Election starts<input type="datetime-local" value={scheduleDraft.start} onChange={(event) => setScheduleDraft((current) => ({ ...current, start: event.target.value }))} required /></label><label>Election ends<input type="datetime-local" value={scheduleDraft.end} onChange={(event) => setScheduleDraft((current) => ({ ...current, end: event.target.value }))} required /></label><p className="settings-hint"><Icon name="shield" size={16} /> Election starts and ends automatically at the scheduled times. Cancellation is only available until one hour before it begins.</p><button className="button button--primary" type="submit">Save election schedule</button></form></section>}
            {adminTab === "Results & reports" && <section className="admin-card report-card"><div className="admin-card-heading"><div><h2>Election results & reports</h2><p>Live overall results and polling station turnout.</p></div><button className="button button--primary print-button" onClick={() => window.print()}><Icon name="print" size={16} /> Print report</button></div><div className="report-table-wrap"><table className="data-table"><thead><tr><th>Position</th><th>Leading candidate</th><th>Votes</th><th>Percentage</th></tr></thead><tbody>{candidates.map((candidate) => <tr key={candidate.position}><td>{candidate.position}</td><td><strong>{candidate.name}</strong></td><td>{candidate.votes.toLocaleString()}</td><td>{(candidate.votes / candidates.reduce((total, item) => total + item.votes, 0) * 100).toFixed(1)}%</td></tr>)}</tbody></table></div><div className="station-results"><h3><Icon name="pin" size={17} /> Results by polling station</h3>{[["Main Campus", "680", "55.2%"], ["Engineering Block", "420", "52.1%"], ["Science Faculty", "356", "53.0%"]].map(([station, total, turnout]) => <div key={station}><span>{station}</span><span>{total} votes</span><strong>{turnout}</strong></div>)}</div></section>}
          </section>
        </main>
      )}
      </div>
      {page !== "home" && <footer className="simple-footer"><span>University E-Voting</span><span>Your voice. Our university.</span>{page === "admin" ? <span>© 2026</span> : <button onClick={() => navigate("admin")}>NEC admin <Icon name="arrow" size={14} /></button>}</footer>}
    </div>
  );
}

export default App;
