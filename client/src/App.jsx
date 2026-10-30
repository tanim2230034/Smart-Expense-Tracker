import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

const RULES = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /\d/.test(p) },
];

export default function App() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Session expired");
        return res.json();
      })
      .then((data) => setUser(data.user || data))
      .catch(() => logout());
  }, [token]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function switchMode() {
    setMode(mode === "login" ? "register" : "login");
    setMessage({ text: "", type: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (
      mode === "register" &&
      !RULES.every(({ test }) => test(form.password))
    ) {
      setMessage({
        text: "Please meet all password requirements.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    const body =
      mode === "register"
        ? form
        : { email: form.email, password: form.password };

    try {
      const res = await fetch(`${API}/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({
          text: data.error || data.message || "Something went wrong",
          type: "error",
        });
        return;
      }

      if (mode === "register") {
        setMode("login");
        setMessage({
          text: "Account created! Please log in.",
          type: "success",
        });
      } else {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      }
    } catch {
      setMessage({
        text: "Cannot reach the server. If it was idle, wait a minute and retry.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  // ---------- Logged-in view ----------
  if (token) {
    const initial = user?.name ? user.name[0].toUpperCase() : "?";
    return (
      <>
        <header className="topbar">
          <div className="logo">
            <div className="logo-mark">$</div>
            Smart Expense Tracker
          </div>
          <div className="user-area">
            <div className="avatar">{initial}</div>
            <button className="btn secondary" onClick={logout}>
              Log out
            </button>
          </div>
        </header>
        <main className="container">
          <div className="card">
            <h1>Welcome, {user ? user.name : "..."}!</h1>
            <p>Your expenses will appear here soon.</p>
          </div>
        </main>
      </>
    );
  }

  // ---------- Logged-out view ----------
  const isLogin = mode === "login";
  const passwordOk = RULES.every((r) => r.test(form.password));
  const blockSubmit = loading || (!isLogin && !passwordOk);

  return (
    <div className="auth">
      <aside className="auth-brand">
        <div className="logo">
          <div className="logo-mark">$</div>
          Smart Expense Tracker
        </div>
        <div>
          <h2>Know where your money goes.</h2>
          <p>
            Track every expense, see your spending clearly, and stay on top of
            your budget.
          </p>
        </div>
        <small>© 2026 Smart Expense Tracker</small>
      </aside>

      <section className="auth-panel">
        <div className="auth-box">
          <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>
          <p className="subtitle">
            {isLogin
              ? "Log in to manage your expenses."
              : "It only takes a few seconds."}
          </p>

          {message.text && (
            <div className={`alert ${message.type}`}>{message.text}</div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="password-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {!isLogin && (
                <ul
                  className="password-rules"
                  aria-label="Password requirements"
                >
                  {RULES.map(({ label, test }) => {
                    const isMet = test(form.password);
                    return (
                      <li key={label} className={isMet ? "met" : ""}>
                        <span aria-hidden="true">{isMet ? "✓" : "○"}</span>{" "}
                        {label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <button className="btn" type="submit" disabled={blockSubmit}>
              {loading
                ? "Please wait..."
                : isLogin
                  ? "Log in"
                  : "Create account"}
            </button>
          </form>

          <p className="switch">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button className="link" onClick={switchMode}>
              {isLogin ? "Register" : "Log in"}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}
