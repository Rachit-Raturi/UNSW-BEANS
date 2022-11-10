import crypto from 'crypto';

export function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function hashToken(token: string) {
  const key = 'secret';
  const hashInput = token + key;
  return crypto.createHash('sha256').update(hashInput).digest('hex');
}
