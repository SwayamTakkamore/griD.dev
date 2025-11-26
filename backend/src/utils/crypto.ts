import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

export function generateKey(): Buffer {
  return randomBytes(32); // 256-bit
}

export function encryptBuffer(buffer: Buffer) {
  const iv = randomBytes(12);
  const key = generateKey();
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { key, iv, tag, encrypted };
}

export function decryptBuffer(encrypted: Buffer, key: Buffer, iv: Buffer, tag: Buffer) {
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted;
}
