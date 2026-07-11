import { useState } from "react";
import { supabase } from "../services/supabase";
import { Eye, EyeOff } from "lucide-react";

function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

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

  const signInWithGoogle = async () => {
    setErr("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (e) {
      setErr("Google sign-in failed. Please try again.");
      setLoading(false);
    }
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

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border dark:bg-dark-border" />
          <span className="text-xs text-text-tertiary dark:text-dark-text-tertiary">or</span>
          <div className="flex-1 h-px bg-border dark:bg-dark-border" />
        </div>

        <button
          className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm font-medium hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          onClick={signInWithGoogle}
          disabled={loading}
        >
          <GoogleIcon size={18} />
          Continue with Google
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
