/**
 * Centralized API Configuration for DigitalVidyaSaarthi SuperAdmin
 * 
 * This file provides a centralized way to manage API URLs based on environment.
 * It automatically switches between development and production URLs based on the ENVIRONMENT setting.
 */

// Environment configuration
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'PROD'; // 'DEV' or 'PROD'

// Base URLs for different environments
const API_BASE_URLS = {
  DEV: {
    BASE_URL: 'http://localhost:4000',
    API_URL: 'http://localhost:4000/api/v1'
  },
  PROD: {
    BASE_URL: 'https://api.digitalvidyasaarthi.in',
    API_URL: 'https://api.digitalvidyasaarthi.in/api/v1'
  }
};

// Get current environment configuration
const getCurrentConfig = () => {
  return API_BASE_URLS[ENVIRONMENT] || API_BASE_URLS.DEV;
};

// Current configuration
const config = getCurrentConfig();

export const API_CONFIG = {
  // Base URLs
  BASE_URL: config.BASE_URL,
  API_URL: config.API_URL,
  
  // Environment info
  ENVIRONMENT,
  IS_DEVELOPMENT: ENVIRONMENT === 'DEV',
  IS_PRODUCTION: ENVIRONMENT === 'PROD',
  
  // Helper methods
  getFullUrl: (endpoint) => {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    // Ensure there's always a slash between API_URL and endpoint
    return `${config.API_URL}/${cleanEndpoint}`;
  },

  getBaseUrl: (endpoint) => {
    // For endpoints that don't need /api/v1
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${config.BASE_URL}/${cleanEndpoint}`;
  }
};

// Legacy support - for backward compatibility with existing code
export const BASE_URL = config.BASE_URL;
export const API_URL = config.API_URL;

// Default export
export default API_CONFIG;

// Console log for debugging (only in development)
if (API_CONFIG.IS_DEVELOPMENT) {
  console.log('🔧 SuperAdmin API Configuration:', {
    Environment: ENVIRONMENT,
    BaseURL: config.BASE_URL,
    ApiURL: config.API_URL
  });
}
