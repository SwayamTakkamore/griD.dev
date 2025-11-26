import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

/**
 * Key Encryption Key (KEK) - In production, use AWS KMS, GCP KMS, or Azure Key Vault
 * For now, using environment variable (base64-encoded 32-byte key)
 */
const KEK = process.env.KEK 
  ? Buffer.from(process.env.KEK, 'base64') 
  : Buffer.from('0'.repeat(64), 'hex'); // UNSAFE fallback for dev

/**
 * Wrap (encrypt) a Content Encryption Key (CEK) using KEK
 */
export async function wrapKey(cek: Buffer): Promise<string> {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', KEK, iv);
  
  const encrypted = Buffer.concat([cipher.update(cek), cipher.final()]);
  const tag = cipher.getAuthTag();
  
  // Return as base64: iv:tag:encrypted
  const wrapped = Buffer.concat([iv, tag, encrypted]);
  return wrapped.toString('base64');
}

/**
 * Unwrap (decrypt) a CEK using KEK
 */
export async function unwrapKey(wrappedKeyBase64: string): Promise<Buffer> {
  const wrapped = Buffer.from(wrappedKeyBase64, 'base64');
  
  // Extract iv (12 bytes), tag (16 bytes), encrypted (rest)
  const iv = wrapped.slice(0, 12);
  const tag = wrapped.slice(12, 28);
  const encrypted = wrapped.slice(28);
  
  const decipher = createDecipheriv('aes-256-gcm', KEK, iv);
  decipher.setAuthTag(tag);
  
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted;
}

/**
 * Initialize KEK from environment or generate one (dev only)
 * In production, retrieve from KMS
 */
export function initializeKEK() {
  if (!process.env.KEK) {
    console.warn('⚠️  WARNING: KEK not set in environment. Using insecure fallback.');
    console.warn('⚠️  Generate a secure KEK: `openssl rand -base64 32`');
  } else {
    console.log('✅ KEK loaded from environment');
  }
}
