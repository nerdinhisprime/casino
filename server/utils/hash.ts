import crypto from 'node:crypto';
import { promisify } from 'node:util';

const cryptAsync = promisify(crypto.scrypt);

export async function makeHashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await cryptAsync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;

  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = await cryptAsync(password, salt, 64);

  if (keyBuffer.length !== derivedKey.length) return false;

  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}
