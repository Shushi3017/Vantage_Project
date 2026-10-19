"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Lock, 
  QrCode, 
  Sun, 
  Moon, 
  Zap, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RotateCw, 
  FlaskConical, 
  ShieldCheck 
} from "lucide-react";
type Notice = {type: "success" | "error", message: string};
export default function LoginPage() {
  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("password"); // 'password' | 'qr'
  
  // Password Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<Notice | null>(null); // { type: 'success' | 'error', message: string }
  const [pwdStrength, setPwdStrength] = useState(0);

  // QR Auth State
  const [qrExpired, setQrExpired] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(45);
  const [qrToken, setQrToken] = useState("");
  const [qrSuccess, setQrSuccess] = useState(false);

  useEffect(() => {
    // Sync dark class on html tag for Tailwind dark mode
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const calculateStrength = (val: string) => {
    if (!val) return 0;
    let score = 0;
    if (val.length >= 6) score += 25;
    if (val.length >= 10) score += 25;
    if (/[A-Z]/.test(val)) score += 25;
    if (/[0-9!@#$%^&*]/.test(val)) score += 25;
    return score;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>  ) => {
    const val = e.target.value;
    setPassword(val);
    setPwdStrength(calculateStrength(val));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert(null);

    if (!email || !password) {
      setAlert({ type: "error", message: "Pare, pakilagay muna yung email tsaka password." });
      return;
    }

    setIsLoading(true);

    // Mock API Auth Request delay
    setTimeout(() => {
      setIsLoading(false);
      if (email.includes("@") && password.length >= 6) {
        setAlert({ type: "success", message: "Success! Access granted, redirecting..." });
      } else {
        setAlert({ type: "error", message: "Maling email o password. Pakisubukan ulit." });
      }
    }, 1200);
  };

  const generateNewQR = () => {
    const randomSession = "nexus_sess_" + Math.random().toString(36).substring(2, 9);
    setQrToken(randomSession);
    setSecondsLeft(45);
    setQrExpired(false);
    setQrSuccess(false);
  };

  useEffect(() => {
    if (activeTab !== "qr") return;
    if (!qrToken) generateNewQR();

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setQrExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTab, qrToken]);

  const simulateQRScan = () => {
    setQrSuccess(true);
    setTimeout(() => {
      setAlert({ type: "success", message: "QR Auth verified! Logging in..." });
      setActiveTab("password");
    }, 1000);
  };

  const getStrengthColor = () => {
    if (pwdStrength <= 25) return "bg-rose-500";
    if (pwdStrength <= 50) return "bg-amber-500";
    if (pwdStrength <= 75) return "bg-yellow-400";
    return "bg-emerald-500";
  };

  const getStrengthText = () => {
    if (pwdStrength <= 25) return "Mahina pa (Weak)";
    if (pwdStrength <= 50) return "Katamtaman (Moderate)";
    if (pwdStrength <= 75) return "Maganda na (Good)";
    return "Mataas / Matibay (Strong)";
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 font-sans ${theme === 'dark' ? 'bg-[#0c0e12] text-slate-100' : 'bg-amber-50 text-slate-800'}`}>
      
      {}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3 select-none">
          <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-yellow-500/20 ring-2 ring-yellow-400/30">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight leading-tight">
              NEXUS<span className="text-yellow-400">.</span>
            </span>
            <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">Internal Workspace</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl border border-slate-700/60 dark:border-slate-800 bg-white/80 dark:bg-[#141820] text-slate-700 dark:text-yellow-400 hover:border-yellow-400/50 flex items-center justify-center transition-all shadow-sm"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <a
            href="javascript:void(0)"
            onClick={() => setAlert({type: "success", message: "Question"})}
            className="hidden sm:inline-flex text-xs font-semibold text-slate-400 hover:text-yellow-400 transition-colors px-3 py-2"
          >
            Questions?
          </a>
        </div>
      </header>

      {}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[430px] bg-white dark:bg-[#141820] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-2xl shadow-black/20 p-6 sm:p-8 relative overflow-hidden transition-all">
          
          {}
          <div className="mb-6">
            <div className="relative p-1 bg-slate-100 dark:bg-[#0c0e12] rounded-xl flex items-center border border-slate-200 dark:border-slate-800/80">
              
              {/* Handcrafted Animated Highlight Background */}
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-yellow-400 rounded-lg transition-all duration-300 ease-out shadow-sm ${
                  activeTab === "password" ? "left-1" : "left-[calc(50%+2px)]"
                }`}
              />

              {/* Password Tab Button */}
              <button
                type="button"
                onClick={() => setActiveTab("password")}
                className={`relative z-10 w-1/2 py-2.5 text-xs font-bold transition-colors text-center flex items-center justify-center gap-2 rounded-lg select-none ${
                  activeTab === "password" ? "text-slate-950" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Password</span>
              </button>

              {/* QR Code Tab Button */}
              <button
                type="button"
                onClick={() => setActiveTab("qr")}
                className={`relative z-10 w-1/2 py-2.5 text-xs font-bold transition-colors text-center flex items-center justify-center gap-2 rounded-lg select-none ${
                  activeTab === "qr" ? "text-slate-950" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Code</span>
              </button>
            </div>
          </div>

          {}
          <div className="relative overflow-hidden min-h-[385px]">
            <div
              className="flex transition-transform duration-300 ease-in-out w-[200%]"
              style={{
                transform: activeTab === "password" ? "translateX(0%)" : "translateX(-50%)",
              }}
            >
              
              {/* PANEL 1: Standard Password Login */}
              <div className="w-1/2 pr-1 flex flex-col justify-between">
                <div>
                  <div className="mb-5">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Mag-login sa Account</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Ilagay ang iyong credentials para makapasok sa dashboard.</p>
                  </div>

                  {/* Feedback Alert Notice */}
                  {alert && (
                    <div
                      className={`mb-4 p-3 rounded-xl text-xs font-medium border flex items-center gap-2 ${
                        alert.type === "success"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      }`}
                    >
                      {alert.type === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <span>{alert.message}</span>
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {/* Email Input */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="juan.delacruz@company.ph"
                        required
                        className="w-full bg-slate-50 dark:bg-[#1a202c] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-500 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Password Input */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Password
                        </label>
                        <a
                          href="javascript:void(0)"
                          onClick={() => setAlert({type: "success", message: "Forget pass? Connect to admin."})}
                          className="text-xs font-semibold text-yellow-500 dark:text-yellow-400 hover:underline"
                        >
                          Forget                       </a>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={handlePasswordChange}
                          placeholder="••••••••••••"
                          required
                          className="w-full bg-slate-50 dark:bg-[#1a202c] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-500 text-xs rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-yellow-400 p-1"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Dynamic Password Strength Indicator */}
                      {password && (
                        <div className="mt-2">
                          <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                            <div
                              className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                              style={{ width: `${pwdStrength}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                            {getStrengthText()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Checkbox Options */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 dark:border-slate-800 text-yellow-500 focus:ring-yellow-400 dark:bg-[#1a202c]"
                        />
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">I-save ang login ko ng 30 days</span>
                      </label>
                    </div>

                    {/* Primary Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 bg-yellow-400 hover:bg-yellow-500 active:scale-[0.98] text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-yellow-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <span>Nag-a-authenticate...</span>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        </>
                      ) : (
                        <span>Mag-sign In</span>
                      )}
                    </button>
                  </form>

                  {/* SSO Divider */}
                  <div className="relative my-4 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                    </div>
                    <span className="relative bg-white dark:bg-[#141820] px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      o gamitin ang SSO
                    </span>
                  </div>

                  {/* Social Buttons */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setAlert({type: "success", message: "Google Auth integration coming soon."})}
                      className="py-2 px-3 bg-slate-50 dark:bg-[#1a202c] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                        <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"/>
                        <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
                      </svg>
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlert({type: "success", message: "GitHub Auth integration coming soon."})}
                      className="py-2 px-3 bg-slate-50 dark:bg-[#1a202c] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="font-bold">GH</span>
                      <span>GitHub</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* PANEL 2: QR Code Login */}
              <div className="w-1/2 pl-1 flex flex-col justify-between items-center text-center">
                <div className="w-full flex flex-col items-center">
                  <div className="mb-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">I-scan ang QR Code</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Buksan ang Nexus mobile app para maka-login kaagad.</p>
                  </div>

                  {/* QR Container Frame */}
                  <div className="my-4 relative">
                    <div className="p-3 bg-white border-2 border-yellow-400 rounded-2xl shadow-xl relative overflow-hidden flex items-center justify-center w-44 h-44">
                      
                      {/* Scanning Animated Beam Line */}
                      {!qrExpired && !qrSuccess && (
                        <div className="absolute left-2 right-2 h-0.5 bg-yellow-400 shadow-[0_0_12px_#facc15] animate-bounce z-10 pointer-events-none" />
                      )}

                      {/* Display QR Vector Code */}
                      {qrSuccess ? (
                        <div className="flex flex-col items-center justify-center text-yellow-500 animate-pulse">
                          <ShieldCheck className="w-12 h-12 mb-1 text-yellow-400" />
                          <span className="text-xs font-bold text-slate-900">Authorized!</span>
                        </div>
                      ) : (
                        <div className="w-36 h-36 bg-slate-950 p-2 rounded-lg flex items-center justify-center">
                          <svg className="w-full h-full text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="7" height="7" rx="1.5" />
                            <rect x="14" y="3" width="7" height="7" rx="1.5" />
                            <rect x="3" y="14" width="7" height="7" rx="1.5" />
                            <path d="M14 14h3v3h-3z" fill="currentColor" />
                            <path d="M18 18h3v3h-3z" fill="currentColor" />
                            <path d="M14 18h3v3h-3z" />
                            <path d="M18 14h3v3h-3z" />
                          </svg>
                        </div>
                      )}

                      {/* Expiration Overlay Screen */}
                      {qrExpired && !qrSuccess && (
                        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 text-yellow-400 flex items-center justify-center mb-2">
                            <RotateCw className="w-4 h-4" />
                          </div>
                          <p className="text-[11px] font-semibold text-slate-200 mb-2">Expired na ang QR</p>
                          <button
                            type="button"
                            onClick={generateNewQR}
                            className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-[11px] font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
                          >
                            Reload QR
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Countdown Status Text */}
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-yellow-400" />
                      <span>
                        Mag-e-expire sa <strong className="text-slate-100 font-bold">{secondsLeft}</strong> segundo
                      </span>
                    </div>
                  </div>

                  {/* Instruction Step Box */}
                  <div className="w-full bg-slate-50 dark:bg-[#0c0e12] border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-bold text-xs shrink-0">
                        1
                      </div>
                      <div className="text-[11px]">
                        <p className="text-slate-800 dark:text-slate-200 font-semibold">Gamitin ang Nexus App</p>
                        <p className="text-slate-400">Settings &gt; Scanner &gt; Authorize Login</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulation Action button for testing */}
                <div className="w-full mt-2">
                  <button
                    type="button"
                    onClick={simulateQRScan}
                    className="w-full py-1.5 px-2 bg-transparent hover:bg-slate-800/50 text-[10px] text-slate-500 rounded-lg border border-dashed border-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FlaskConical className="w-3 h-3 text-yellow-400" />
                    <span>Dev Test: Simulate QR Scan Success</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center text-xs text-slate-400">
            Wala ka pang account?{" "}
            <a
              href="javascript:void(0)"
              onClick={() => setAlert({type: "success", message: "Registration invite token."})}
              className="text-yellow-500 dark:text-yellow-400 font-bold hover:underline"
            >
              Mag-register dito
            </a>
          </div>

        </div>
      </main>

      {}
      <footer className="w-full max-w-6xl mx-auto px-6 py-4 text-center sm:flex sm:justify-between sm:items-center text-xs text-slate-500">
        <p>&copy; 2026 NEXUS Studio Workspace. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2 sm:mt-0">
          <a href="#" className="hover:text-yellow-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">System Status</a>
        </div>
      </footer>

    </div>
  );
}