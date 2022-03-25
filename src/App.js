import React, { useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import AuthContext from './shared/context/auth-context';

const App = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);

  // Set userId to the ID passed
  const login = useCallback((uid, token) => {
    setToken(token);
    setUserId(uid);
  }, [])

  // Clear the userId
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
  }, [])

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path='/:userId/places' exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path='/:userId/places' exact>
          <UserPlaces />
        </Route>
        <Route path='/Auth'>
          <Auth />
        </Route>
        <Redirect to='/Auth' />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout }}>
      <Router>
        <MainNavigation />
          <main>
              {routes}
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
