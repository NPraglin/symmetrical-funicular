import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  
  // Stores data across re-render cycles
  const activeHttpRequests = useRef([]);

  // configurable function to send request
  const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    // Loading State true
    setIsLoading(true);

    // Assigns an abort controller.. api supported in modern browsers, adds to active HTTP requests
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);

    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
        signal: httpAbortCtrl.signal // Links abort controller to request.. cancel connection reqs
      });
      // Await response from backend which should be created user DATA
      const responseData = await response.json();

      // Removes controller that was used in the request so it doesn't repeat
      activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl);
      // ok property exists on the response object.. If not okay, throw the default error from responseData
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setIsLoading(false);
      return responseData;
    } catch (err) {
      // Update state to error message
      setError(err.message);
      setIsLoading(false);
      throw err;
    }

  }, []);

  const clearError = () => {
    setError(null);
  };

  // returns a cleanup function before next time useEffect runs aka unmounts from the custom hook
  // just makes sure we never continue with requests that are making its way out
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);
  // return all three shorthand syntax
  return { isLoading, error, sendRequest, clearError }
};