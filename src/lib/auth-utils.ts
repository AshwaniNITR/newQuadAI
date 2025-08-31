// Helper function to parse token with expiry (for use in refresh endpoint)
export function parseRefreshTokenWithExpiry(storedToken: string): { 
  token: string; 
  expiresAt: number;
  isValid: boolean;
} {
  if (!storedToken || !storedToken.includes(':')) {
    return { token: '', expiresAt: 0, isValid: false };
  }

  const [token, expiry] = storedToken.split(':');
  const expiresAt = parseInt(expiry, 10);
  const isValid = !isNaN(expiresAt) && expiresAt > Date.now();

  return { token, expiresAt, isValid };
}