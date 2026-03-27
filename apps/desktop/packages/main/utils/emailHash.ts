import crypto from "crypto"

/**
 * Hash email for Overwolf integration
 * Overwolf requires MD5 and SHA256 hashes of the email for user identification
 */
export function hashEmailForOverwolf(email: string): { md5: string; sha256: string } {
  const normalizedEmail = email.toLowerCase().trim()
  
  return {
    md5: crypto.createHash("md5").update(normalizedEmail).digest("hex"),
    sha256: crypto.createHash("sha256").update(normalizedEmail).digest("hex")
  }
}
