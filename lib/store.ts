export type QRSession = {
  status: "pending" | "approved";
  expiresAt: number;
  userId?: string;
};

// Mga rehistradong user (demo lang, sa totoong system ay database ito)
export const USERS = [
  { id: "user_nexus_992", name: "Juan Dela Cruz", email: "juan.delacruz@company.ph", password: "nexus123" },
  { id: "user_admin_001", name: "Admin", email: "admin@company.ph", password: "admin123" },
];

const g = globalThis as unknown as {
  __qrSessions?: Map<string, QRSession>;
  __mobileTokens?: Map<string, string>;
};

// QR sessions (para sa PC)
export const qrSessions = (g.__qrSessions ??= new Map<string, QRSession>());
// Login tokens ng phone: token -> userId
export const mobileTokens = (g.__mobileTokens ??= new Map<string, string>());