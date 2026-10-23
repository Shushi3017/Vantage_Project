"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, Clock, RotateCw } from "lucide-react";

type Props = {
  active: boolean; // true lang kapag nakabukas ang QR tab
};

export default function QRLoginPanel({ active }: Props) {
  const router = useRouter();
  const [sid, setSid] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(45);
  const [qrSuccess, setQrSuccess] = useState(false);
  const [qrExpired, setQrExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin;

  // Humingi ng bago at isang-beses-lang na QR session sa server
  const createSession = useCallback(async () => {
    try {
      const res = await fetch("/api/qr", { method: "POST" });
      const data = await res.json();
      setSid(data.id);
      setSecondsLeft(data.expiresIn);
      setQrExpired(false);
      setQrSuccess(false);
      setErrorMessage("");
    } catch {
      setErrorMessage("Could not create a QR session. Please try again.");
    }
  }, []);

  // Gumawa ng session kapag binuksan ang QR tab
  useEffect(() => {
    if (!active || sid) return;

    const timeoutId = window.setTimeout(() => {
      void createSession();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [active, sid, createSession]);

  // Countdown
  useEffect(() => {
    if (!active || !sid || qrExpired || qrSuccess) return;
    const t = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setQrExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [active, sid, qrExpired, qrSuccess]);

  // Mag-poll sa server: "na-approve na ba ng phone?"
  useEffect(() => {
    if (!active || !sid || qrExpired || qrSuccess) return;
    const t = setInterval(async () => {
      try {
        const res = await fetch(`/api/qr?id=${sid}`);
        const data = await res.json();
        if (data.status === "approved") {
          setQrSuccess(true);
          setTimeout(() => router.push("/dashboard"), 1500);
        } else if (data.status === "expired") {
          setQrExpired(true);
        }
      } catch {
        /* i-ignore ang failed poll, subukan ulit sa susunod */
      }
    }, 1500);
    return () => clearInterval(t);
  }, [active, sid, qrExpired, qrSuccess, router]);

  return (
    <div className="w-1/2 pl-1 flex flex-col justify-between items-center text-center">
      <div className="w-full flex flex-col items-center">
        <div className="mb-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Scan the QR Code
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Open the Nexus mobile app to log in instantly.
          </p>
        </div>

        {/* QR Container Frame */}
        <div className="my-4 relative">
          <div className="p-4 bg-white border-2 border-yellow-400 rounded-2xl shadow-xl relative overflow-hidden flex items-center justify-center w-56 h-56">

            {/* TINANGGAL ang scanning beam: tinatakpan nito ang QR kaya hindi mabasa */}

            {qrSuccess ? (
              <div className="flex flex-col items-center justify-center text-yellow-500 animate-pulse">
                <ShieldCheck className="w-12 h-12 mb-1 text-yellow-400" />
                <span className="text-xs font-bold text-slate-900">Authorized!</span>
              </div>
            ) : (
              sid && (
                <QRCodeSVG
                  value={`${baseUrl}/scan?sid=${sid}`}
                  size={184}
                  level="L"
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              )
            )}

            {/* Expired overlay */}
            {qrExpired && !qrSuccess && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-yellow-400 flex items-center justify-center mb-2">
                  <RotateCw className="w-4 h-4" />
                </div>
                <p className="text-[11px] font-semibold text-slate-200 mb-2">QR code expired</p>
                <button
                  type="button"
                  onClick={createSession}
                  className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-[11px] font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Reload QR
                </button>
              </div>
            )}
          </div>

          {/* Pansamantalang debug: ipinapakita ang link na nasa QR */}
          {sid && (
            <p className="mt-2 text-[10px] text-slate-400 break-all max-w-56 mx-auto">
              {`${baseUrl}/scan?sid=${sid}`}
            </p>
          )}

          {/* Countdown */}
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-yellow-400" />
            <span>
              Expires in <strong className="text-slate-100 font-bold">{secondsLeft}</strong> seconds
            </span>
          </div>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-xs mt-2 font-medium">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}