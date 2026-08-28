import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const SALT = "heydev-email-v1";
const DEMO_SECRET = "heydev-buildathon-aes-key";

function keyBuffer() {
  const secret = process.env.EMAIL_SECRET?.trim() || DEMO_SECRET;
  return scryptSync(secret, SALT, 32);
}

export function encryptEmail(email: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyBuffer(), iv);
  const encrypted = Buffer.concat([cipher.update(email, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

export function decryptEmail(payload: string) {
  const [ivB64, tagB64, dataB64] = payload.split(".");
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("Malformed ciphertext");
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    keyBuffer(),
    Buffer.from(ivB64, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return "••••";
  const shown = user.slice(0, 1);
  return `${shown}${"•".repeat(Math.max(user.length - 1, 3))}@${domain}`;
}
