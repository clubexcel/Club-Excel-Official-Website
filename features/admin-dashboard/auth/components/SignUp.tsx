"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { AlertCircle, Eye, EyeOff, Hexagon, Lock, Mail } from "lucide-react";

const SignUp = () => {
  const router = useRouter();
  const { status } = useSession();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [errors, setErrors] = React.useState({
    email: "",
    password: "",
    root: "",
  });

  React.useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({
      email: "",
      password: "",
      root: "",
    });

    let hasError = false;

    if (!email.trim()) {
      setErrors((prev) => ({
        ...prev,
        email: "Email is required.",
      }));
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
      hasError = true;
    }

    if (!password.trim()) {
      setErrors((prev) => ({
        ...prev,
        password: "Password is required.",
      }));
      hasError = true;
    } else if (password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters.",
      }));
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrors((prev) => ({
          ...prev,
          root: "Invalid email or password. Please try again.",
        }));
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);

      setErrors((prev) => ({
        ...prev,
        root: "Something went wrong. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-indigo-500 to-blue-500 opacity-50" />

          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
              <Hexagon className="h-6 w-6 fill-white/20 text-white" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white">
              Admin Portal
            </h2>

            <p className="mt-2 text-center text-sm text-neutral-400">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {errors.root && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {errors.root}
              </div>
            )}

            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Email Address
              </label>

              <div className="group relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-white" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    if (errors.email) {
                      setErrors((prev) => ({
                        ...prev,
                        email: "",
                      }));
                    }
                  }}
                  placeholder="admin@clubexcel.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-neutral-600 focus:border-white/20 focus:bg-white/10 focus:outline-none"
                />
              </div>

              {errors.email && (
                <p className="ml-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Password
              </label>

              <div className="group relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-white" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);

                    if (errors.password) {
                      setErrors((prev) => ({
                        ...prev,
                        password: "",
                      }));
                    }
                  }}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-sm text-white placeholder:text-neutral-600 focus:border-white/20 focus:bg-white/10 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="ml-1 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 font-semibold text-black transition-all hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-white/5 pt-6 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 transition-colors hover:text-white"
            >
              Back to website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
