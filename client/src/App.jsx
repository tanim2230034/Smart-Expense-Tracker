import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [mode, setMode] = useState("login"); 
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }
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

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const url = `${API}/api/auth/${mode}`;
    const body =
      mode === "register"
        ? form
        : { email: form.email, password: form.password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || data.message || "Something went wrong");
        return;
      }

      if (mode === "register") {
        setMode("login");
        setMessage("Registered! Now log in.");
      } else {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      }
    } catch {
      setMessage("Cannot reach the server");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  if (token) {
    return (
      <div style={{ maxWidth: 360, margin: "40px auto" }}>
        <h1>Smart Expense Tracker</h1>
        <p>Welcome, {user ? user.name : "..."}!</p>
        <button onClick={logout}>Log out</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h1>Smart Expense Tracker</h1>
      <h2>{mode === "login" ? "Log in" : "Register"}</h2>

      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {mode === "login" ? "Log in" : "Register"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <button className="link" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "Need an account? Register" : "Have an account? Log in"}
      </button>
    </div>
  );
}