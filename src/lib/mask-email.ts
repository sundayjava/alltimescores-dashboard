/**
 * Masks an email address for privacy
 * Examples:
 * - john.doe@example.com → j***e@example.com
 * - alice@gmail.com → a***e@gmail.com
 */
export function maskEmail(email: string): string {
  if (!email) return "";

  const [localPart, domain] = email.split("@");
  
  if (!localPart || !domain) return email;

  // Show first and last character, mask the middle
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }

  const firstChar = localPart[0];
  const lastChar = localPart[localPart.length - 1];
  const maskedPart = "*".repeat(Math.min(localPart.length - 2, 3)); // Max 3 asterisks

  return `${firstChar}${maskedPart}${lastChar}@${domain}`;
}