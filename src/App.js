import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

// import Users from './user/pages/Users';
// import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
// import UserPlaces from './places/pages/UserPlaces';
// import UpdatePlace from './places/pages/UpdatePlace';
// import Auth from './user/pages/Auth';
import AuthContext from './shared/context/auth-context';
import { useAuth } from './shared/components/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const Home = React.lazy(() => import ('./home/pages/Home'));
const AllPlaces = React.lazy(() => import ('./places/pages/AllPlaces'));
const Users = React.lazy(() => import('./user/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const Auth = React.lazy(() => import('./user/pages/Auth'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));

// TODO re-wire users to a browse by user

const App = () => {

  // Object destructuring
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path='/:userId/places' exact>
          <UserPlaces />
        </Route>
        <Route path="/users/all" exact>
          <Users />
        </Route>
        <Route path="/places/all" exact>
          <AllPlaces />
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
          <Home />
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
              <Suspense 
                fallback={
                  <div className="center">
                    <LoadingSpinner />
                  </div>
                }>
                  {routes}
              </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
