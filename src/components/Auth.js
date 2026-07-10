import { useState } from "react";
import { supabase } from "../services/supabase";
import { Eye, EyeOff } from "lucide-react";

export function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [registered, setRegistered] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const errors = {};
    if (mode === "register" && !form.name.trim()) {
      errors.name = "Full name is required";
    }
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async () => {
    setErr("");
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email: form.email, password: form.password,
          options: { data: { name: form.name } }
        });
        if (error) throw error;
        setRegistered(true);
        setLoading(false); return;
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        onAuth(data.session);
      }
    } catch (e) {
      if (e.message.includes('missing') || e.message.includes('email') || e.message.includes('phone')) {
        setErr('Please enter your email and password.');
      } else if (e.message.includes('Invalid login credentials')) {
        setErr('Incorrect email or password. Please try again.');
      } else if (e.message.includes('User already registered')) {
        setErr('This email is already registered. Please sign in instead.');
      } else if (e.message.includes('Unable to validate email address')) {
        setErr('Please enter a valid email address.');
      } else {
        setErr('Something went wrong. Please try again.');
      }
    }
    setLoading(false);
  };

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setFieldErrors(e => ({ ...e, [k]: "" }));
  };

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-bg dark:bg-dark-bg">
        <div
          className="relative w-full max-w-[420px] rounded-lg p-5 text-center bg-bg-elevated dark:bg-dark-bg-elevated border border-border dark:border-dark-border"
          style={{ animation: "authCardIn 0.4s ease-out" }}
        >
          <div className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-4">Ipon</div>
          <div className="text-text-primary dark:text-dark-text-primary font-semibold text-base mb-2">Check your email</div>
          <div className="text-text-secondary dark:text-dark-text-secondary text-sm mb-6">
            We've sent a confirmation link to <span className="font-medium text-text-primary dark:text-dark-text-primary">{form.email}</span>. Please check your inbox and click the link to verify your account.
          </div>
          <button
            className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary text-sm font-medium hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors"
            onClick={() => { setRegistered(false); setMode("login"); setForm({ name: "", email: "", password: "" }); }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg dark:bg-dark-bg">
      <div
        className="relative w-full max-w-[420px] rounded-lg p-5 bg-bg-elevated dark:bg-dark-bg-elevated border border-border dark:border-dark-border"
        style={{ animation: "authCardIn 0.4s ease-out" }}
      >
        <div className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-1">Ipon</div>
        <div className="text-text-secondary dark:text-dark-text-secondary text-sm mb-5">{mode === "login" ? "Welcome back" : "Create your account"}</div>

        {mode === "register" && (
          <div className="mb-5">
            <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="auth-name">Full Name</label>
            <input
              id="auth-name"
              placeholder="Juan dela Cruz"
              value={form.name}
              onChange={e => set("name", e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary text-sm placeholder-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:border-accent-primary transition-colors"
            />
            {fieldErrors.name && <div className="text-danger text-xs mt-1">{fieldErrors.name}</div>}
          </div>
        )}
        <div className="mb-5">
          <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            placeholder="juan@email.com"
            value={form.email}
            onChange={e => set("email", e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary text-sm placeholder-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:border-accent-primary transition-colors"
          />
            {fieldErrors.email && <div className="text-danger text-xs mt-1">{fieldErrors.email}</div>}
          </div>
        <div className="mb-5">
          <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="auth-password">Password</label>
          <div className="relative">
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={e => set("password", e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              className="w-full px-3 py-2 pr-10 rounded-md border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary text-sm placeholder-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:border-accent-primary transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary dark:text-dark-text-tertiary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
            {fieldErrors.password && <div className="text-danger text-xs mt-1">{fieldErrors.password}</div>}
          </div>

        {err && (
          <div className="p-2.5 rounded-md text-xs mb-5 border bg-danger/15 text-danger border-danger">
            {err}
          </div>
        )}

        <button
          className="w-full px-3 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium transition-colors disabled:opacity-50"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        <div className="text-center mt-4 text-text-secondary dark:text-dark-text-secondary text-sm">
          {mode === "login" ? (
            <>No account? <button className="text-accent-primary dark:text-dark-accent-primary hover:underline" aria-label="Switch to register" onClick={() => { setMode("register"); setErr(""); setFieldErrors({}); }}>Register</button></>
          ) : (
            <>Have an account? <button className="text-accent-primary dark:text-dark-accent-primary hover:underline" aria-label="Switch to login" onClick={() => { setMode("login"); setErr(""); setFieldErrors({}); }}>Sign In</button></>
          )}
        </div>
      </div>
    </div>
  );
}
