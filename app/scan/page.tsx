"use client";

import React, { useEffect, useState } from "react";

type Step = "checking" | "login" | "confirm" | "done" | "error";

export default function ScanPage() {
  const [step, setStep] = useState<Step>("checking");
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Pagbukas ng page: tingnan lang kung naka-login na ang phone. WALANG auto-approve.
  useEffect(() => {
    const token = localStorage.getItem("nexus_mobile_token");
    const savedName = localStorage.getItem("nexus_mobile_name") ?? "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(savedName);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStep(token ? "confirm" : "login");
  }, []);

  // Login ng phone
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    const res = await fetch("/api/mobile-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);

    if (!res.ok) {
      setMsg("Wrong email or password.");
      return;
    }
    const data = await res.json();
    localStorage.setItem("nexus_mobile_token", data.token);
    localStorage.setItem("nexus_mobile_name", data.name);
    setName(data.name);
    setStep("confirm"); // hindi pa pumapasok ang PC, hintayin ang Approve
  };

  // Dito lang pumapasok ang PC: kapag pinindot ang Approve
  const handleApprove = async () => {
    const sid = new URLSearchParams(window.location.search).get("sid");
    const token = localStorage.getItem("nexus_mobile_token");
    if (!sid || !token) {
      setStep("error");
      setMsg("No session found in this QR.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/qr", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sid, token }),
    });
    setLoading(false);

    if (res.ok) {
      setStep("done");
    } else if (res.status === 401) {
      // Luma o hindi kilala ang session ng phone, mag-login ulit
      localStorage.removeItem("nexus_mobile_token");
      localStorage.removeItem("nexus_mobile_name");
      setMsg("Session expired. Please log in again.");
      setStep("login");
    } else {
      setStep("error");
      setMsg("QR expired. Reload the QR on your computer.");
    }
  };

  // "Hindi ako ito": burahin ang login ng phone
  const handleLogout = () => {
    localStorage.removeItem("nexus_mobile_token");
    localStorage.removeItem("nexus_mobile_name");
    setName("");
    setMsg("");
    setStep("login");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0c0e12] text-slate-100 p-6">
      <div className="w-full max-w-sm bg-[#141820] border border-slate-800 rounded-2xl p-6 text-center">
        <h1 className="text-lg font-bold mb-1">NEXUS Mobile</h1>

        {step === "checking" && (
          <p className="text-xs text-slate-400 mt-4">Loading...</p>
        )}

        {step === "login" && (
          <form onSubmit={handleLogin} className="mt-4 space-y-3 text-left">
            <p className="text-xs text-slate-400 text-center">
              Log in on this phone first to continue.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-[#1a202c] border border-slate-800 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#1a202c] border border-slate-800 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold text-xs rounded-xl disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
            {msg && <p className="text-xs text-rose-400 text-center">{msg}</p>}
          </form>
        )}

        {step === "confirm" && (
          <div className="mt-4">
            <p className="text-xs text-slate-400">Log in to NEXUS on your computer as</p>
            <p className="text-base font-bold text-yellow-400 mt-1">{name || "your account"}</p>
            <button
              onClick={handleApprove}
              disabled={loading}
              className="w-full mt-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold text-xs rounded-xl disabled:opacity-70"
            >
              {loading ? "Approving..." : "Approve"}
            </button>
            <button
              onClick={handleLogout}
              className="mt-3 text-[11px] text-slate-500 hover:text-slate-300 underline"
            >
              Not you? Log out
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="mt-4">
            <p className="text-sm font-bold text-emerald-400">Computer logged in!</p>
            <p className="text-xs text-slate-400 mt-1">
              You can now use the dashboard on your computer.
            </p>
          </div>
        )}

        {step === "error" && <p className="text-xs text-rose-400 mt-4">{msg}</p>}
      </div>
    </main>
  );
}