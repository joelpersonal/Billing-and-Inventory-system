// JWT-like authentication utilities
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'billfinity-secret-key-2024';
const TOKEN_KEY = 'billfinity_token';
const REFRESH_TOKEN_KEY = 'billfinity_refresh_token';

// Simulate JWT token structure
export const createToken = (payload) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now, // issued at
    exp: now + (24 * 60 * 60), // expires in 24 hours
    iss: 'billfinity' // issuer
  };

  // Create token parts
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(tokenPayload));
  
  // Create signature (simplified)
  const signature = CryptoJS.HmacSHA256(
    `${encodedHeader}.${encodedPayload}`, 
    SECRET_KEY
  ).toString();

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const createRefreshToken = (userId) => {
  const payload = {
    userId,
    type: 'refresh',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  };

  return createToken(payload);
};

export const verifyToken = (token) => {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null;
    }

    // Verify signature (simplified)
    const expectedSignature = CryptoJS.HmacSHA256(
      `${parts[0]}.${parts[1]}`, 
      SECRET_KEY
    ).toString();

    if (parts[2] !== expectedSignature) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getStoredRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const storeTokens = (token, refreshToken) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const removeTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const isTokenExpired = (token) => {
  const payload = verifyToken(token);
  if (!payload) return true;
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
};

export const refreshAccessToken = (refreshToken) => {
  const payload = verifyToken(refreshToken);
  if (!payload || payload.type !== 'refresh') {
    return null;
  }

  // In a real app, this would make an API call to your backend
  // For demo purposes, we'll create a new token with the same user data
  const newTokenPayload = {
    userId: payload.userId,
    // You'd typically fetch fresh user data from your backend here
  };

  return createToken(newTokenPayload);
};