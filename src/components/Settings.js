import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

export function Settings({ session, userProfile, showToast }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});

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

  const changePassword = async () => {
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

  return (
    <div>
      <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-6 border border-border dark:border-dark-border max-w-[600px] mx-auto">
        <div className="text-text-primary dark:text-dark-text-primary font-semibold text-base mb-4">Profile Settings</div>
        
        <div className="mb-4">
          <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="settings-name">Display Name</label>
          <input
            id="settings-name"
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Your name"
            className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
          />
          {errors.name && <div className="text-danger text-xs mt-1">{errors.name}</div>}
        </div>

        <button 
          className="px-4 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium border border-transparent transition-colors" 
          onClick={updateProfile} 
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>

        <div className="border-t border-border dark:border-dark-border my-6" />

        <div className="text-text-primary dark:text-dark-text-primary font-semibold text-base mb-2">Change Password</div>
        <div className="text-text-tertiary dark:text-dark-text-tertiary text-xs mb-4">You must be signed in to change your password.</div>

        <div className="mb-4">
          <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="settings-new-password">New Password</label>
          <input
            id="settings-new-password"
            type="password"
            value={form.newPassword}
            onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
            placeholder="Enter new password (min 6 characters)"
            className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
          />
          {errors.newPassword && <div className="text-danger text-xs mt-1">{errors.newPassword}</div>}
        </div>

        <div className="mb-4">
          <label className="block text-text-secondary dark:text-dark-text-secondary text-sm mb-1.5" htmlFor="settings-confirm-password">Confirm New Password</label>
          <input
            id="settings-confirm-password"
            type="password"
            value={form.confirmPassword}
            onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
            placeholder="Re-enter new password"
            className="w-full px-3 py-2 rounded-md border border-border dark:border-dark-border bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
          />
          {errors.confirmPassword && <div className="text-danger text-xs mt-1">{errors.confirmPassword}</div>}
        </div>

        <button 
          className="px-4 py-2 rounded-md bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary text-sm font-medium border border-border dark:border-dark-border hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors duration-300" 
          onClick={changePassword} 
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
