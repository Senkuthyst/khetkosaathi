import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Btn, Card, inputCls } from "@/components/kit";
import { useApp } from "@/lib/store";
import { LogIn, UserPlus, KeyRound, Mail, AlertCircle, CheckCircle2, Lock, User } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup" | "reset";
}

export function AuthModal({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) {
  const { lang, t, refreshProfile, reloadFarmFields } = useApp();
  const [mode, setMode] = useState<"login" | "signup" | "reset">(defaultMode);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setBusy(true);

    try {
      if (mode === "signup") {
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters long.");
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              preferred_language: lang,
            },
          },
        });

        if (error) throw error;

        // Check if user already exists (Supabase sometimes returns an empty identities array for existing users instead of error)
        if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
          setErrorMsg("An account with this email address already exists. Please sign in or reset your password.");
          return;
        }

        setSuccessMsg(
          data.session
            ? "Account created successfully! Welcome to Khetkosaathi."
            : "Sign-up successful! Please check your email to confirm your account."
        );
        await refreshProfile();
        await reloadFarmFields();
        setTimeout(() => onClose(), 1500);
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        setSuccessMsg("Logged in successfully!");
        await refreshProfile();
        await reloadFarmFields();
        setTimeout(() => onClose(), 1000);
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/`,
        });

        if (error) throw error;
        setSuccessMsg("Password reset email sent. Please check your inbox.");
      }
    } catch (err: any) {
      let msg = err.message || "An unexpected error occurred.";
      const lower = msg.toLowerCase();

      if (lower.includes("weak_password") || lower.includes("easy to guess") || lower.includes("pwned")) {
        msg = "Password is too weak or commonly used. Please choose a stronger password with at least 8 characters including letters, numbers, and symbols.";
      } else if (lower.includes("already registered") || lower.includes("user_already_exists")) {
        msg = "An account with this email is already registered. Please sign in or use 'Forgot password'.";
      } else if (lower.includes("invalid format") || lower.includes("validate email")) {
        msg = "Please enter a valid email address (e.g. name@example.com).";
      } else if (lower.includes("email signups are disabled") || lower.includes("signup is disabled")) {
        msg = "Email signups are currently disabled in the backend authentication settings.";
      }

      setErrorMsg(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <Card className="w-full max-w-md p-6 bg-card border-2 border-primary/20 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm font-bold"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2">
            {mode === "signup" ? <UserPlus className="h-6 w-6" /> : mode === "reset" ? <KeyRound className="h-6 w-6" /> : <LogIn className="h-6 w-6" />}
          </div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">
            {mode === "signup"
              ? "Create Farmer Account"
              : mode === "reset"
                ? "Reset Your Password"
                : "Sign In to Khetkosaathi"}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {mode === "signup"
              ? "Register to manage personalized plots and satellite alerts"
              : mode === "reset"
                ? "Enter your registered email to receive recovery instructions"
                : "Access your personalized agricultural intelligence center"}
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Full Name / पुरा नाम
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ram Bahadur Thapa"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`${inputCls} pl-9`}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Email Address / इमेल
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputCls} pl-9`}
              />
            </div>
          </div>

          {mode !== "reset" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-foreground">
                  Password / पासवर्ड
                </label>
                {mode === "signup" && (
                  <span className="text-[10px] text-muted-foreground">Min. 8 chars, strong</span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputCls} pl-9`}
                />
              </div>
            </div>
          )}

          {mode === "signup" && (
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Confirm Password / पासवर्ड पुष्टि गर्नुहोस्
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${inputCls} pl-9`}
                />
              </div>
            </div>
          )}

          <Btn type="submit" disabled={busy} className="w-full mt-2 font-bold py-2.5">
            {busy ? "Processing..." : mode === "signup" ? "Create Account" : mode === "reset" ? "Send Reset Link" : "Sign In"}
          </Btn>
        </form>

        {/* Footer Mode Switchers */}
        <div className="mt-5 pt-3 border-t border-border flex flex-wrap items-center justify-between text-xs text-muted-foreground">
          {mode === "login" ? (
            <>
              <button
                type="button"
                onClick={() => { setMode("reset"); setErrorMsg(null); setSuccessMsg(null); }}
                className="hover:underline font-semibold text-primary"
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={() => { setMode("signup"); setErrorMsg(null); setSuccessMsg(null); }}
                className="hover:underline font-bold text-primary"
              >
                Create Account
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => { setMode("login"); setErrorMsg(null); setSuccessMsg(null); }}
              className="hover:underline font-bold text-primary mx-auto"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
