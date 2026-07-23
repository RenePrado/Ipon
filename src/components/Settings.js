import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { Lock, Eye, EyeOff, LogOut } from "lucide-react";

export function Settings({ session, userProfile, showToast, signOut, signingOut }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (userProfile?.name) {
      setForm(f => ({ ...f, name: userProfile.name }));
    }
  }, [userProfile]);

  const updateProfile = async () => {
    if (!session) return;
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name: form.name })
      .eq("id", session.user.id);

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Profile updated successfully");
    }
    setLoading(false);
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.newPassword) {
      newErrors.newPassword = "New password is required";
    }
    if (form.newPassword && form.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (form.newPassword && form.confirmPassword !== form.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: form.newPassword
    });

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Password updated successfully");
      setForm(f => ({ ...f, newPassword: "", confirmPassword: "" }));
    }
    setLoading(false);
  };

  const initials = (userProfile?.name || "U")
    .split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const email = session?.user?.email || "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* Profile Settings */}
      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 border border-border dark:border-dark-border h-full flex flex-col">
        <div className="text-text-secondary dark:text-dark-text-secondary text-sm font-medium uppercase tracking-wider mb-5">Profile Settings</div>

        {/* User profile header */}
        <div className="flex flex-col items-center mb-5">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-base font-semibold text-white mb-3"
            style={{ background: "var(--color-accent)" }}
          >
            {initials}
          </div>
          <div className="text-text-primary dark:text-dark-text-primary font-medium text-sm">{userProfile?.name || "User"}</div>
          <div className="text-text-secondary dark:text-dark-text-secondary text-xs mt-0.5">{email}</div>
        </div>

        <div className="border-t border-border dark:border-dark-border mb-5" />

        <div className="mb-5">
          <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="settings-name">Display Name</label>
          <input
            id="settings-name"
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Your name"
            className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary text-sm placeholder-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:border-accent-primary transition-colors"
          />
          {errors.name && <div className="text-danger text-xs mt-1">{errors.name}</div>}
        </div>

        <div className="mb-5">
          <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="settings-email">Email</label>
          <div className="relative">
            <input
              id="settings-email"
              type="text"
              value={email}
              readOnly
              className="w-full px-3 py-2 pr-10 rounded-md border border-border dark:border-dark-border bg-transparent text-text-secondary dark:text-dark-text-secondary text-sm cursor-not-allowed"
            />
            <Lock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary dark:text-dark-text-tertiary" />
          </div>
          <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mt-1">Email cannot be changed here</div>
        </div>

        <div className="mt-auto">
          <button
            className="w-full px-3 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium transition-colors disabled:opacity-50"
            onClick={updateProfile}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>

      {/* Change Password */}
      <form onSubmit={changePassword} className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 border border-border dark:border-dark-border h-full flex flex-col">
        <div className="text-text-secondary dark:text-dark-text-secondary text-sm font-medium uppercase tracking-wider mb-5">Change Password</div>

        <div className="mb-5">
          <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="settings-new-password">New Password</label>
          <div className="relative">
            <input
              id="settings-new-password"
              type={showNewPassword ? "text" : "password"}
              value={form.newPassword}
              onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
              placeholder="Enter new password (min 6 characters)"
              className="w-full px-3 py-2 pr-10 rounded-md border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary text-sm placeholder-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:border-accent-primary transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(s => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary dark:text-dark-text-tertiary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.newPassword && <div className="text-danger text-xs mt-1">{errors.newPassword}</div>}
        </div>

        <div className="mb-5">
          <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="settings-confirm-password">Confirm New Password</label>
          <div className="relative">
            <input
              id="settings-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
              placeholder="Re-enter new password"
              className="w-full px-3 py-2 pr-10 rounded-md border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary text-sm placeholder-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:border-accent-primary transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(s => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary dark:text-dark-text-tertiary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <div className="text-danger text-xs mt-1">{errors.confirmPassword}</div>}
        </div>

        <div className="mt-auto">
          <button
            type="submit"
            className="w-full px-3 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>

      {/* Sign Out - Mobile only */}
      <div className="lg:hidden bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 border border-border dark:border-dark-border h-full flex flex-col">
        <div className="text-text-secondary dark:text-dark-text-secondary text-sm font-medium uppercase tracking-wider mb-5">Account</div>

        <div className="flex-1 flex flex-col justify-center">
          <button
            className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border text-danger hover:bg-danger/10 dark:hover:bg-danger/10 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={signOut}
            disabled={signingOut}
          >
            <LogOut size={16} />
            {signingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
