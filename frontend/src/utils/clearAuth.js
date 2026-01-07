// Utility to clear authentication data
export const clearAuthData = () => {
  localStorage.removeItem('billfinity_token');
  localStorage.removeItem('billfinity_refresh_token');
  localStorage.removeItem('billfinity_user');
  sessionStorage.clear();
  console.log('Authentication data cleared');
};