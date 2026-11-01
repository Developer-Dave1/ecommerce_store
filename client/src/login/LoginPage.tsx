import { useState, type FormEvent } from "react";
import type { LoginPageProps } from "./loginTypes";
import { TitleImage } from "../layout/Layout";
import "./login.css";
import { isAdmin } from "../../../server/middleware/middleware";

const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password}),
      });

      if (response.ok) {
        const data = await response.json();
        onLoginSuccess(username, data.isAdmin);

      } else {
        setError("Login failed. Check your username and password.");
      }
    } catch {
      setError("Unable to connect. Please try again.");
    }
  }

  return (
    <div className="login-page">
      <TitleImage image="/src/assets/title-image.png" />
      <main className="login-page__main">
    <form className="login-form" onSubmit={handleSubmit} aria-labelledby="login-heading">
      <h2 id="login-heading">Welcome back</h2>
      <p className="login-form__intro">Log in to explore your essentials.</p>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        autoComplete="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        required
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      {error && <p className="login-form__error" role="alert">{error}</p>}
      <button type="submit">Log in</button>
    </form>
      </main>
    </div>
  );
}


export { LoginPage };
