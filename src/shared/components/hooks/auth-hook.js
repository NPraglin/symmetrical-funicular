import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
  // Token state for authentication
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  // Set userId to the ID passed
  // Pass in expiration date
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); // generates date object + 1hr
    setTokenExpirationDate(tokenExpirationDate); // Set state to variable above
    localStorage.setItem(
      'userData', 
      JSON.stringify({
        userId: uid, 
        token: token,
        expiration: tokenExpirationDate.toISOString()
      }));
  }, []);

  // Clear the userId store and token upon logout
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem('userData'); // remove token when logged out
  }, []);

  // Logout user after timeout of token
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date(); // gets time in ms and subtracts
      setTimeout(logout, remainingTime) // timeout for the proper logout after expiration
    } else {
      clearTimeout(logoutTimer) // if no token aka manually logged out
    }
  }, [token, logout, tokenExpirationDate])

  // Check for token in localStorage to auto login.. useEffect runs after render cycle!!!
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData')); // parse token data
    if (
      storedData && 
      storedData.token && 
      new Date(storedData.expiration) > new Date() // If expiration is greater, than we're good to go
      ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration)) // login via token if the expiration date is still in future
    };
  }, [login]);

  return { token, login, logout, userId };

}